import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada Scenario del requisito «Cuándo una
 * tarea está vencida» de `openspec/specs/tasks/spec.md`, entrando por HTTP y leyendo
 * `isOverdue` del cuerpo de la respuesta, como lo lee el cliente.
 *
 * El día de referencia se pasa en cada petición (`today`); ningún test mira el reloj.
 * Los identificadores son los que devuelve la creación.
 */
test.group('Tasks | cuándo está vencida', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function sesion(client: any) {
    await User.create({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'secreto123' })
    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })

    return { Authorization: `Bearer ${login.body().data.token as string}` }
  }

  /** Crea una tarea por la API y, si se pide, le fija fecha y estado por la API. */
  async function crear(
    client: any,
    headers: Record<string, string>,
    { dueDate, status }: { dueDate?: string; status?: string } = {}
  ) {
    const creada = await client.post('/api/v1/tasks').headers(headers).json({ title: 'Revisar' })
    creada.assertStatus(201)
    const id = creada.body().data.id as number

    if (dueDate) {
      const r = await client
        .put(`/api/v1/tasks/${id}/due-date`)
        .headers(headers)
        .json({ today: '2000-01-01', dueDate })
      r.assertStatus(200)
    }
    if (status) {
      const r = await client.patch(`/api/v1/tasks/${id}/status`).headers(headers).json({ status })
      r.assertStatus(200)
    }

    return id
  }

  async function consultar(client: any, headers: Record<string, string>, id: number, today: string) {
    const response = await client.get(`/api/v1/tasks/${id}`).headers(headers).qs({ today })
    response.assertStatus(200)
    return response.body().data
  }

  test('Fecha del día anterior | llega vencida', async ({ client, assert }) => {
    const headers = await sesion(client)
    const id = await crear(client, headers, { dueDate: '2026-08-19' })

    const tarea = await consultar(client, headers, id, '2026-08-20')
    assert.isTrue(tarea.isOverdue)
  })

  test('Vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const headers = await sesion(client)
    const id = await crear(client, headers, { dueDate: '2026-08-20' })

    const tarea = await consultar(client, headers, id, '2026-08-20')

    assert.isFalse(tarea.isOverdue)
  })

  test('Fecha futura | no llega vencida', async ({ client, assert }) => {
    const headers = await sesion(client)
    const id = await crear(client, headers, { dueDate: '2026-08-21' })

    const tarea = await consultar(client, headers, id, '2026-08-20')

    assert.isFalse(tarea.isOverdue)
  })

  test('Sin fecha no se vence nunca, por antigua que sea', async ({ client, assert }) => {
    const headers = await sesion(client)
    const id = await crear(client, headers)
    // Creada hace semanas: se envejece la fila creada, no se toca nada más.
    await db.from('tasks').where('id', id).update({ created_at: '2026-06-01T10:00:00Z' })

    const tarea = await consultar(client, headers, id, '2026-08-20')

    assert.isNull(tarea.dueDate)
    assert.equal(tarea.status, 'pending')
    assert.isFalse(tarea.isOverdue)
  })

  test('Darla por hecha la deja de vencer y conserva su fecha', async ({ client, assert }) => {
    const headers = await sesion(client)
    const id = await crear(client, headers, { dueDate: '2026-08-10' })

    const antes = await consultar(client, headers, id, '2026-08-20')
    assert.isTrue(antes.isOverdue)

    const cambio = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(headers)
      .json({ status: 'done' })
    cambio.assertStatus(200)

    const despues = await consultar(client, headers, id, '2026-08-20')
    assert.isFalse(despues.isOverdue)
    assert.equal(despues.dueDate, antes.dueDate)
  })

  test('Una tarea hecha con la fecha pasada no llega vencida', async ({ client, assert }) => {
    const headers = await sesion(client)
    const id = await crear(client, headers, { dueDate: '2026-08-10', status: 'done' })

    const tarea = await consultar(client, headers, id, '2026-08-20')

    assert.equal(tarea.status, 'done')
    assert.isFalse(tarea.isOverdue)
  })

  test('Aplazar resuelve el vencimiento en la misma respuesta', async ({ client, assert }) => {
    const headers = await sesion(client)
    const id = await crear(client, headers, { dueDate: '2026-08-10' })
    assert.isTrue((await consultar(client, headers, id, '2026-08-20')).isOverdue)

    const aplazada = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(headers)
      .json({ today: '2026-08-20', dueDate: '2026-08-25' })

    aplazada.assertStatus(200)
    assert.equal(aplazada.body().data.dueDate, '2026-08-25')
    assert.isFalse(aplazada.body().data.isOverdue)
  })
})
