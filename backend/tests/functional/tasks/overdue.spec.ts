import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada scenario del requisito
 * «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`.
 *
 * Todo entra por HTTP como lo hace el cliente (`frontend/src/lib/api.ts`): la
 * tarea se crea con `POST /api/v1/tasks`, la fecha se pone con
 * `PUT /api/v1/tasks/:id/due-date` (con `today` en el cuerpo), el estado se
 * cambia con `PATCH /api/v1/tasks/:id/status` y se lee con
 * `GET /api/v1/tasks/:id?today=...`. Lo que se comprueba es siempre el campo
 * `isOverdue` del cuerpo de la respuesta.
 *
 * El día de referencia es siempre uno fijo que se pasa en `today`, como manda
 * el requisito «El día de referencia lo pone quien mira»: ningún test depende
 * de la fecha en que se ejecute.
 */
test.group('Tasks | vencimiento', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-08-20'
  const AYER = '2026-08-19'
  const MANANA = '2026-08-21'

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  async function persona(client: any) {
    const email = 'ada@example.com'
    await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })
    login.assertStatus(200)

    return login.body().data.token as string
  }

  /** Crea una tarea por la API y devuelve el identificador que ella misma asigna. */
  async function crear(client: any, token: string) {
    const response = await client
      .post('/api/v1/tasks')
      .headers(con(token))
      .json({ title: 'Revisar el informe' })
    response.assertStatus(201)

    return response.body().data.id as number
  }

  function ponerFecha(client: any, token: string, id: number, dueDate: string | null) {
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

  async function consultar(client: any, token: string, id: number, today: string = HOY) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))
    response.assertStatus(200)

    return response.body().data
  }

  /** Una tarea pendiente con la fecha dada, ya puesta por la API. */
  async function tareaConFecha(client: any, token: string, dueDate: string) {
    const id = await crear(client, token)
    const response = await ponerFecha(client, token, id, dueDate)
    response.assertStatus(200)

    return id
  }

  test('fecha del día anterior: llega vencida', async ({ client, assert }) => {
    const token = await persona(client)
    const id = await tareaConFecha(client, token, AYER)

    const tarea = await consultar(client, token, id)

    assert.strictEqual(tarea.isOverdue, true)
  })

  test('vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const token = await persona(client)
    const id = await tareaConFecha(client, token, HOY)

    const tarea = await consultar(client, token, id)

    assert.strictEqual(tarea.isOverdue, false)
  })

  test('fecha futura: no llega vencida', async ({ client, assert }) => {
    const token = await persona(client)
    const id = await tareaConFecha(client, token, MANANA)

    const tarea = await consultar(client, token, id)

    assert.strictEqual(tarea.isOverdue, false)
  })

  test('sin fecha no se vence nunca, por antigua que sea', async ({ client, assert }) => {
    const token = await persona(client)
    const id = await crear(client, token)

    // La tarea se crea ahora y se consulta con un día de referencia muy
    // posterior: para quien mira, lleva semanas creada y sigue pendiente.
    const tarea = await consultar(client, token, id, '2030-01-01')

    assert.isNull(tarea.dueDate)
    assert.equal(tarea.status, 'pending')
    assert.strictEqual(tarea.isOverdue, false)
  })

  test('darla por hecha la deja de vencer y no le toca la fecha', async ({ client, assert }) => {
    const token = await persona(client)
    const id = await tareaConFecha(client, token, AYER)

    const antes = await consultar(client, token, id)
    assert.strictEqual(antes.isOverdue, true)

    await cambiarEstado(client, token, id, 'done')

    const despues = await consultar(client, token, id)
    assert.equal(despues.status, 'done')
    assert.strictEqual(despues.isOverdue, false)
    assert.equal(despues.dueDate, antes.dueDate)
  })

  test('una tarea hecha con la fecha pasada no llega vencida', async ({ client, assert }) => {
    const token = await persona(client)
    const id = await crear(client, token)
    await cambiarEstado(client, token, id, 'done')
    const response = await ponerFecha(client, token, id, AYER)
    response.assertStatus(200)

    const tarea = await consultar(client, token, id)

    assert.equal(tarea.status, 'done')
    assert.isNotNull(tarea.dueDate)
    assert.strictEqual(tarea.isOverdue, false)
  })

  test('aplazar resuelve el vencimiento en la misma respuesta', async ({ client, assert }) => {
    const token = await persona(client)
    const id = await tareaConFecha(client, token, AYER)
    assert.strictEqual((await consultar(client, token, id)).isOverdue, true)

    const response = await ponerFecha(client, token, id, MANANA)

    response.assertStatus(200)
    assert.strictEqual(response.body().data.isOverdue, false)
  })
})
