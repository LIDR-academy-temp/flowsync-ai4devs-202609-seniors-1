import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada scenario del requisito del mismo
 * nombre de `openspec/specs/tasks/spec.md`, con el título del scenario.
 *
 * Todo entra por HTTP: también la cuenta y la tarea se crean con la API. El único uso
 * de la base de datos es la transacción global que aísla cada test.
 *
 * El día de referencia va siempre en la petición y las fechas son fijas: ningún
 * resultado depende del reloj de quien lanza la suite.
 *
 * `isOverdue` llega por dos respuestas: la de `PUT /tasks/:id/due-date` y la de
 * `GET /tasks/:id`. La primera sale de la tarea recién modificada y la segunda de la
 * tarea releída, así que donde el scenario lo permite se comprueban las dos.
 */
test.group('Tasks | vencimiento', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const AYER = '2026-08-19'
  const HOY = '2026-08-20'
  const MANANA = '2026-08-21'

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  /** Una cuenta nueva con una tarea recién creada: pendiente y sin fecha. */
  async function nuevaTarea(client: any) {
    const alta = await client.post('/api/v1/auth/signup').json({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
      passwordConfirmation: 'secreto123',
    })
    alta.assertStatus(200)
    const token = alta.body().data.token as string

    const creada = await client
      .post('/api/v1/tasks')
      .headers(con(token))
      .json({ title: 'Revisar el informe' })
    creada.assertStatus(201)

    return { token, id: creada.body().data.id as number }
  }

  async function consultar(client: any, token: string, id: number, today: string) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))
    response.assertStatus(200)
    assertIdentidad(response, id)
    return response.body().data
  }

  async function fijarFecha(
    client: any,
    token: string,
    id: number,
    dueDate: string,
    today: string
  ) {
    const response = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(con(token))
      .json({ dueDate, today })
    response.assertStatus(200)
    assertIdentidad(response, id)
    return response.body().data
  }

  async function cambiarEstado(client: any, token: string, id: number, status: string) {
    const response = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(con(token))
      .json({ status })
    response.assertStatus(200)
    response.assertBodyContains({ data: { id, status } })
  }

  /** La respuesta habla de la tarea pedida, no de otra. */
  function assertIdentidad(response: any, id: number) {
    response.assertBodyContains({ data: { id } })
  }

  test('Fecha del día anterior', async ({ client, assert }) => {
    const { token, id } = await nuevaTarea(client)

    const fijada = await fijarFecha(client, token, id, AYER, HOY)
    assert.strictEqual(fijada.isOverdue, true, 'isOverdue en la respuesta de PUT')

    const consultada = await consultar(client, token, id, HOY)
    assert.strictEqual(consultada.isOverdue, true, 'isOverdue en la respuesta de GET')
  })

  test('Vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const { token, id } = await nuevaTarea(client)

    const fijada = await fijarFecha(client, token, id, HOY, HOY)
    assert.strictEqual(fijada.isOverdue, false, 'isOverdue en la respuesta de PUT')

    const consultada = await consultar(client, token, id, HOY)
    assert.strictEqual(consultada.isOverdue, false, 'isOverdue en la respuesta de GET')
  })

  test('Fecha futura', async ({ client, assert }) => {
    const { token, id } = await nuevaTarea(client)

    const fijada = await fijarFecha(client, token, id, MANANA, HOY)
    assert.strictEqual(fijada.isOverdue, false, 'isOverdue en la respuesta de PUT')

    const consultada = await consultar(client, token, id, HOY)
    assert.strictEqual(consultada.isOverdue, false, 'isOverdue en la respuesta de GET')
  })

  test('Sin fecha no se vence nunca', async ({ client, assert }) => {
    const { token, id } = await nuevaTarea(client)

    // La API no deja elegir la fecha de creación, así que la antigüedad la pone el día
    // de referencia: uno fijo y tan lejano que la tarea lleva más que semanas creada.
    const consultada = await consultar(client, token, id, '2099-12-31')

    assert.strictEqual(consultada.status, 'pending')
    assert.isNull(consultada.dueDate)
    assert.strictEqual(consultada.isOverdue, false, 'isOverdue en la respuesta de GET')
  })

  test('Darla por hecha la deja de vencer', async ({ client, assert }) => {
    const { token, id } = await nuevaTarea(client)
    await fijarFecha(client, token, id, AYER, HOY)

    // «Deja de» exige que antes lo estuviera, leída por el mismo camino.
    const antes = await consultar(client, token, id, HOY)
    assert.strictEqual(antes.isOverdue, true, 'isOverdue en GET antes de darla por hecha')

    await cambiarEstado(client, token, id, 'done')

    const despues = await consultar(client, token, id, HOY)
    assert.strictEqual(despues.status, 'done')
    assert.strictEqual(despues.isOverdue, false, 'isOverdue en GET después de darla por hecha')
    assert.strictEqual(despues.dueDate, antes.dueDate)
  })

  test('Una tarea hecha con la fecha pasada', async ({ client, assert }) => {
    const { token, id } = await nuevaTarea(client)
    await cambiarEstado(client, token, id, 'done')

    const fijada = await fijarFecha(client, token, id, AYER, HOY)
    assert.strictEqual(fijada.status, 'done')
    assert.strictEqual(fijada.isOverdue, false, 'isOverdue en la respuesta de PUT')

    const consultada = await consultar(client, token, id, HOY)
    assert.strictEqual(consultada.status, 'done')
    assert.strictEqual(consultada.isOverdue, false, 'isOverdue en la respuesta de GET')
  })

  test('Aplazar resuelve el vencimiento', async ({ client, assert }) => {
    const { token, id } = await nuevaTarea(client)

    const vencida = await fijarFecha(client, token, id, AYER, HOY)
    assert.strictEqual(vencida.isOverdue, true, 'isOverdue antes de aplazar')

    // «En la misma respuesta de ese cambio»: sin ninguna consulta de por medio.
    const aplazada = await fijarFecha(client, token, id, MANANA, HOY)
    assert.strictEqual(aplazada.isOverdue, false, 'isOverdue en la respuesta que aplaza')
  })
})
