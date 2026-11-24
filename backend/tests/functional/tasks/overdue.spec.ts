import User from '#models/user'
import Task from '#models/task'
import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada scenario del requisito
 * «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`:
 *
 *   vencida  ⇔  tiene fecha  ∧  fecha < día de referencia  ∧  estado ≠ done
 *
 * Todo pasa por la API: la tarea se crea con `POST /api/v1/tasks` (y su id es el
 * que devuelve esa respuesta), la fecha se fija con `PUT /:id/due-date`, el
 * estado con `PATCH /:id/status`, y la condición se lee en `isOverdue` de
 * `GET /:id`. El día de referencia es siempre una constante enviada en `today`:
 * ningún test depende del reloj del sistema.
 */
test.group('Tasks | cuándo una tarea está vencida', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // El día desde el que se mira, fijo. Las fechas de cada scenario se escriben
  // relativas a él para que la frontera (ayer / hoy / mañana) se lea en el test.
  const HOY = '2026-08-20'
  const AYER = '2026-08-19'
  const MANANA = '2026-08-21'
  const HACE_UN_MES = '2026-07-20'

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  async function sesion(client: any) {
    const email = 'ada@example.com'
    await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })
    login.assertStatus(200)

    return login.body().data.token as string
  }

  /** Crea una tarea por la API y devuelve el id que trae la respuesta. */
  async function crearTarea(client: any, token: string) {
    const creada = await client
      .post('/api/v1/tasks')
      .headers(con(token))
      .json({ title: 'Revisar el informe' })
    creada.assertStatus(201)

    return creada.body().data.id as number
  }

  function fijarFecha(client: any, token: string, id: number, dueDate: string | null) {
    return client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(con(token))
      .json({ dueDate, today: HOY })
  }

  async function cambiarEstado(client: any, token: string, id: number, status: string) {
    const response = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(con(token))
      .json({ status })
    response.assertStatus(200)
  }

  async function consultar(client: any, token: string, id: number, today = HOY) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))
    response.assertStatus(200)

    return response.body().data
  }

  /** Crea una tarea con la fecha dada (o sin ella) y devuelve su id. */
  async function tareaConFecha(client: any, token: string, dueDate: string | null) {
    const id = await crearTarea(client, token)
    if (dueDate !== null) {
      const response = await fijarFecha(client, token, id, dueDate)
      response.assertStatus(200)
    }

    return id
  }

  test('fecha del día anterior: la tarea llega vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await tareaConFecha(client, token, AYER)

    const tarea = await consultar(client, token, id)

    assert.notEqual(tarea.status, 'done')
    assert.isTrue(tarea.isOverdue)
  })

  test('vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await tareaConFecha(client, token, HOY)

    const tarea = await consultar(client, token, id)

    assert.notEqual(tarea.status, 'done')
    assert.isFalse(tarea.isOverdue)
  })

  test('fecha futura: la tarea no llega vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await tareaConFecha(client, token, MANANA)

    const tarea = await consultar(client, token, id)

    assert.isFalse(tarea.isOverdue)
  })

  test('sin fecha no se vence nunca, por antigua que sea', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await tareaConFecha(client, token, null)

    // «Creada hace semanas»: la API no deja fijar la fecha de creación, así que se
    // retrasa en la base, a un día fijo y no calculado desde el reloj.
    const enLaBase = await Task.findOrFail(id)
    enLaBase.createdAt = DateTime.fromISO(HACE_UN_MES)
    await enLaBase.save()

    const tarea = await consultar(client, token, id)

    assert.equal(tarea.status, 'pending')
    assert.isNull(tarea.dueDate)
    assert.isFalse(tarea.isOverdue)
  })

  test('darla por hecha la deja de vencer y conserva la fecha', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await tareaConFecha(client, token, AYER)

    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue)

    await cambiarEstado(client, token, id, 'done')

    const despues = await consultar(client, token, id)
    assert.equal(despues.status, 'done')
    assert.isFalse(despues.isOverdue)
    assert.equal(despues.dueDate, antes.dueDate)
  })

  test('una tarea hecha con la fecha pasada no llega vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await tareaConFecha(client, token, HACE_UN_MES)
    await cambiarEstado(client, token, id, 'done')

    const tarea = await consultar(client, token, id)

    assert.equal(tarea.status, 'done')
    assert.isFalse(tarea.isOverdue)
  })

  test('aplazar resuelve el vencimiento en la misma respuesta', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await tareaConFecha(client, token, AYER)

    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue)

    const aplazada = await fijarFecha(client, token, id, MANANA)

    // En la respuesta del propio cambio, sin necesidad de volver a consultar.
    aplazada.assertStatus(200)
    assert.equal(aplazada.body().data.id, id)
    assert.isFalse(aplazada.body().data.isOverdue)
  })
})
