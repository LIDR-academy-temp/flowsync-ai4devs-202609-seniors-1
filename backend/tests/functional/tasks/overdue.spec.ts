import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada scenario del requisito
 * «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`, con el
 * mismo nombre que el scenario.
 *
 * Todo entra por donde entra el cliente: por HTTP, y leyendo `isOverdue` y
 * `dueDate` tal cual llegan en el cuerpo. La regla llamada a pelo
 * (`isOverdueOn`) ya está en `tests/unit/`; aquí lo que se prueba es lo que
 * recibe quien consulta.
 *
 * Dos sitios devuelven la condición de vencida: `GET /api/v1/tasks/:id` y la
 * respuesta de `PUT /api/v1/tasks/:id/due-date`. Los dos la resuelven contra el
 * `today` que manda quien pide, nunca contra el reloj del servidor. Donde el
 * scenario dice «se consulta», se comprueban los dos: son lecturas distintas
 * del mismo dato, y que solo una acierte no le sirve al cliente.
 *
 * `PATCH /api/v1/tasks/:id/status` responde con la forma de la lista, sin fecha
 * ni condición de vencida, así que después de cambiar el estado el vencimiento
 * se lee con `GET`.
 */
test.group('Tasks | vencimiento', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // El día de quien mira. Fijo y explícito: la spec no admite reloj del servidor.
  const HOY = '2026-08-20'
  const AYER = '2026-08-19'
  const MANANA = '2026-08-21'

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  /**
   * Deja creada una cuenta con una tarea a su nombre, creada por la API, y
   * devuelve lo necesario para seguir hablando con la API sobre ella.
   */
  async function tareaNueva(client: any) {
    const email = 'ada@example.com'
    await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })

    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })
    const token = login.body().data.token as string

    const creada = await client
      .post('/api/v1/tasks')
      .headers(con(token))
      .json({ title: 'Revisar el informe' })

    creada.assertStatus(201)

    return { token, id: creada.body().data.id as number }
  }

  /** `PUT /due-date` con el día de referencia; devuelve la tarea de la respuesta. */
  async function fijarFecha(client: any, token: string, id: number, dueDate: string | null) {
    const response = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(con(token))
      .json({ dueDate, today: HOY })

    response.assertStatus(200)
    return response.body().data
  }

  /** `PATCH /status`; devuelve la tarea de la respuesta. */
  async function cambiarEstado(client: any, token: string, id: number, status: string) {
    const response = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(con(token))
      .json({ status })

    response.assertStatus(200)
    return response.body().data
  }

  /** `GET /tasks/:id` con el día de referencia; devuelve la tarea. */
  async function consultar(client: any, token: string, id: number) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today: HOY }).headers(con(token))

    response.assertStatus(200)
    return response.body().data
  }

  test('Fecha del día anterior', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)

    const alFijar = await fijarFecha(client, token, id, AYER)
    const alConsultar = await consultar(client, token, id)

    for (const tarea of [alFijar, alConsultar]) {
      assert.equal(tarea.status, 'pending')
      assert.isTrue(tarea.isOverdue)
    }
  })

  test('Vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)

    const alFijar = await fijarFecha(client, token, id, HOY)
    const alConsultar = await consultar(client, token, id)

    for (const tarea of [alFijar, alConsultar]) {
      assert.equal(tarea.status, 'pending')
      // `isFalse` y no `notOk`: un `undefined` (el campo no llega) no es «no vencida».
      assert.isFalse(tarea.isOverdue)
    }
  })

  test('Fecha futura', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)

    const alFijar = await fijarFecha(client, token, id, MANANA)
    const alConsultar = await consultar(client, token, id)

    for (const tarea of [alFijar, alConsultar]) {
      assert.isFalse(tarea.isOverdue)
    }
  })

  test('Sin fecha no se vence nunca', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)

    // «Creada hace semanas»: la API no deja elegir cuándo nace una tarea, así
    // que se envejece a mano. Seis semanas antes del día de referencia.
    await db.from('tasks').where('id', id).update({ created_at: '2026-07-09T09:00:00.000Z' })

    const tarea = await consultar(client, token, id)

    assert.equal(tarea.status, 'pending')
    assert.isNull(tarea.dueDate)
    assert.isFalse(tarea.isOverdue)
  })

  test('Darla por hecha la deja de vencer', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)

    // Una tarea vencida, tal y como la lee el cliente antes del cambio.
    await fijarFecha(client, token, id, AYER)
    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue)
    assert.equal(antes.dueDate, AYER)

    await cambiarEstado(client, token, id, 'done')

    const despues = await consultar(client, token, id)
    assert.equal(despues.status, 'done')
    assert.isFalse(despues.isOverdue)
    // Dejar de vencer es por el estado, no porque la fecha se haya tocado: la
    // fecha tiene que seguir siendo exactamente la que se fijó.
    assert.equal(despues.dueDate, AYER)
    assert.equal(despues.dueDate, antes.dueDate)
  })

  test('Una tarea hecha con la fecha pasada', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)

    // Primero hecha y después con la fecha pasada: así también la respuesta del
    // `PUT` es una tarea en `done` con la fecha ya pasada, y tiene que llegar
    // sin marca de vencida igual que en la consulta.
    await cambiarEstado(client, token, id, 'done')
    const alFijar = await fijarFecha(client, token, id, AYER)
    const alConsultar = await consultar(client, token, id)

    for (const tarea of [alFijar, alConsultar]) {
      assert.equal(tarea.status, 'done')
      assert.isFalse(tarea.isOverdue)
    }
  })

  test('Aplazar resuelve el vencimiento', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)

    const vencida = await fijarFecha(client, token, id, AYER)
    assert.isTrue(vencida.isOverdue)

    // Lo que cuenta es la respuesta de este mismo cambio, no una consulta
    // posterior: quien aplaza no debería tener que volver a pedir la tarea para
    // ver que ya no está vencida.
    const aplazada = await fijarFecha(client, token, id, MANANA)

    assert.equal(aplazada.dueDate, MANANA)
    assert.isFalse(aplazada.isOverdue)
  })
})
