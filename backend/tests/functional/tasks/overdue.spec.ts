import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada uno de los siete scenarios del
 * requisito «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`:
 *
 *   1  fecha del día anterior                 5  darla por hecha la deja de vencer
 *   2  vencer hoy todavía no es estar vencida 6  una tarea hecha con la fecha pasada
 *   3  fecha futura                           7  aplazar resuelve el vencimiento
 *   4  sin fecha no se vence nunca
 *
 * Todo con fechas fijas y con el día de referencia enviado de forma explícita en cada
 * petición: ningún test depende del reloj del sistema, así que no envejecen.
 *
 * La única lectura que informa del vencimiento es `GET /api/v1/tasks/:id`. Las
 * escrituras (`PATCH .../status`, `PUT .../due-date`) se usan para provocar el cambio
 * y se vuelve a leer por ese camino.
 *
 * No se asserta el formato de la fecha (`AAAA-MM-DD`): es otro requisito («La fecha es un
 * día, no un instante») y mezclarlo aquí taparía lo que sí se prueba, que es `isOverdue`.
 * Cuando hace falta comparar fechas se compara contra lo que devolvió la propia API.
 *
 * Estos tests describen lo que dice la spec, no lo que hace hoy la implementación: si
 * esta no la cumple, el test falla y se queda fallando.
 */
test.group('Tasks | cuándo está vencida', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-08-20'

  async function persona(client: any, email: string, fullName: string) {
    const user = await User.create({ fullName, email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: login.body().data.token as string }
  }

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  function tareaDe(
    user: User,
    datos: Partial<Pick<Task, 'title' | 'status' | 'dueDate' | 'createdAt'>> = {}
  ): Promise<Task> {
    return Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
      ...datos,
    })
  }

  /** La tarea suelta vista desde el día `today`, que se envía siempre. */
  async function leer(client: any, token: string, id: number, today: string) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))
    response.assertStatus(200)
    return response.body().data
  }

  test('1 | fecha del día anterior: llega vencida', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const tarea = await tareaDe(user, { status: 'pending', dueDate: '2026-08-19' })

    const vista = await leer(client, token, tarea.id, HOY)

    assert.isTrue(vista.isOverdue)
  })

  test('2 | vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const tarea = await tareaDe(user, { status: 'pending', dueDate: HOY })

    const vista = await leer(client, token, tarea.id, HOY)

    assert.isFalse(vista.isOverdue)
  })

  test('3 | fecha futura: no llega vencida', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const tarea = await tareaDe(user, { status: 'in_progress', dueDate: '2026-08-21' })

    const vista = await leer(client, token, tarea.id, HOY)

    assert.isFalse(vista.isOverdue)
  })

  test('4 | sin fecha no se vence nunca, por antigua que sea', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const tarea = await tareaDe(user, {
      status: 'pending',
      dueDate: null,
      createdAt: DateTime.fromISO('2026-07-01T00:00:00Z'),
    })

    const vista = await leer(client, token, tarea.id, HOY)

    assert.isNull(vista.dueDate)
    assert.isFalse(vista.isOverdue)
  })

  test('5 | darla por hecha la deja de vencer y no toca la fecha', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const tarea = await tareaDe(user, { status: 'pending', dueDate: '2026-08-19' })

    // Punto de partida: está vencida. Sin esto el test podría pasar sin probar nada.
    const antes = await leer(client, token, tarea.id, HOY)
    assert.isTrue(antes.isOverdue)

    const cambio = await client
      .patch(`/api/v1/tasks/${tarea.id}/status`)
      .headers(con(token))
      .json({ status: 'done' })
    cambio.assertStatus(200)

    // `PATCH .../status` no informa del vencimiento: se vuelve a leer la tarea.
    const despues = await leer(client, token, tarea.id, HOY)
    assert.equal(despues.status, 'done')
    assert.isFalse(despues.isOverdue)
    assert.equal(despues.dueDate, antes.dueDate)
  })

  test('6 | una tarea hecha con la fecha pasada no llega vencida', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const tarea = await tareaDe(user, { status: 'done', dueDate: '2026-08-01' })

    const vista = await leer(client, token, tarea.id, HOY)

    assert.equal(vista.status, 'done')
    assert.isFalse(vista.isOverdue)
  })

  test('7 | aplazar una tarea vencida la deja de mostrar vencida en la misma respuesta', async ({
    client,
    assert,
  }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const tarea = await tareaDe(user, { status: 'pending', dueDate: '2026-08-19' })

    // Punto de partida: está vencida.
    const antes = await leer(client, token, tarea.id, HOY)
    assert.isTrue(antes.isOverdue)

    // Aquí `today` va en el cuerpo, no en el query string.
    const aplazada = await client
      .put(`/api/v1/tasks/${tarea.id}/due-date`)
      .headers(con(token))
      .json({ dueDate: '2026-08-25', today: HOY })

    aplazada.assertStatus(200)
    // En la respuesta del propio cambio, sin necesidad de volver a preguntar.
    assert.match(aplazada.body().data.dueDate, /^2026-08-25/)
    assert.isFalse(aplazada.body().data.isOverdue)

    // Y la lectura posterior lo confirma.
    const despues = await leer(client, token, tarea.id, HOY)
    assert.match(despues.dueDate, /^2026-08-25/)
    assert.isFalse(despues.isOverdue)
  })
})
