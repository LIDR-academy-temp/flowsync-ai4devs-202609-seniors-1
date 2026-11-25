import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Un test por cada Scenario del Requirement «Cuándo una tarea está vencida» de
 * `openspec/specs/tasks/spec.md`. Todo entra por HTTP y se comprueba `isOverdue` en el
 * cuerpo de la respuesta. El día de referencia es siempre el `today` de la petición.
 */
test.group('Tasks | cuándo una tarea está vencida', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-08-20'
  const AYER = '2026-08-19'
  const MANANA = '2026-08-21'

  async function persona(client: any) {
    const email = 'ada.lovelace@example.com'
    await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })
    const token = login.body().data.token as string
    return { id: (await User.findByOrFail('email', email)).id, token }
  }

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  function tarea(
    assigneeId: number,
    datos: Partial<Pick<Task, 'status' | 'dueDate'>> = {}
  ): Promise<Task> {
    return Task.create({ title: 'Revisar el informe', status: 'pending', assigneeId, ...datos })
  }

  async function consultar(client: any, token: string, id: number, today: string) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))
    response.assertStatus(200)
    return response.body().data
  }

  test('fecha del día anterior: llega vencida', async ({ client, assert }) => {
    const ada = await persona(client)
    const t = await tarea(ada.id, { dueDate: AYER as any })

    assert.isTrue((await consultar(client, ada.token, t.id, HOY)).isOverdue)
  })

  test('vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const ada = await persona(client)
    const t = await tarea(ada.id, { dueDate: HOY as any })

    assert.isFalse((await consultar(client, ada.token, t.id, HOY)).isOverdue)
  })

  test('fecha futura: no llega vencida', async ({ client, assert }) => {
    const ada = await persona(client)
    const t = await tarea(ada.id, { dueDate: MANANA as any })

    assert.isFalse((await consultar(client, ada.token, t.id, HOY)).isOverdue)
  })

  test('sin fecha no se vence nunca, por antigua que sea', async ({ client, assert }) => {
    const ada = await persona(client)
    const t = await tarea(ada.id)

    assert.isFalse((await consultar(client, ada.token, t.id, HOY)).isOverdue)
    assert.isFalse((await consultar(client, ada.token, t.id, '2030-01-01')).isOverdue)
  })

  test('darla por hecha la deja de vencer y conserva su fecha', async ({ client, assert }) => {
    const ada = await persona(client)
    const t = await tarea(ada.id, { dueDate: AYER as any })

    const antes = await consultar(client, ada.token, t.id, HOY)
    assert.isTrue(antes.isOverdue)

    const cambio = await client
      .patch(`/api/v1/tasks/${t.id}/status`)
      .json({ status: 'done' })
      .headers(con(ada.token))
    cambio.assertStatus(200)

    const despues = await consultar(client, ada.token, t.id, HOY)
    assert.isFalse(despues.isOverdue)
    assert.equal(despues.dueDate, antes.dueDate)
  })

  test('una tarea hecha con la fecha pasada no llega vencida', async ({ client, assert }) => {
    const ada = await persona(client)
    const t = await tarea(ada.id, { status: 'done', dueDate: AYER as any })

    assert.isFalse((await consultar(client, ada.token, t.id, HOY)).isOverdue)
  })

  test('aplazar resuelve el vencimiento en la misma respuesta', async ({ client, assert }) => {
    const ada = await persona(client)
    const t = await tarea(ada.id, { dueDate: AYER as any })
    assert.isTrue((await consultar(client, ada.token, t.id, HOY)).isOverdue)

    const response = await client
      .put(`/api/v1/tasks/${t.id}/due-date`)
      .json({ today: HOY, dueDate: MANANA })
      .headers(con(ada.token))

    response.assertStatus(200)
    assert.isFalse(response.body().data.isOverdue)
  })
})
