import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada Scenario del requisito
 * «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`.
 *
 * Todo entra por HTTP, igual que entra el cliente: la tarea se crea con
 * `POST /api/v1/tasks`, la fecha se pone con `PUT /api/v1/tasks/:id/due-date`
 * (la creación no la admite) y la condición se lee en `isOverdue` del cuerpo
 * de `GET /api/v1/tasks/:id`.
 *
 * El día de referencia es siempre una constante: ningún test depende del reloj.
 */
test.group('Tasks | vencimiento', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-03-10'
  const AYER = '2026-03-09'
  const MANANA = '2026-03-11'

  const bearer = (token: string) => `Bearer ${token}`

  async function sesion(client: any, email = 'ada@example.com') {
    await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })

    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })
    login.assertStatus(200)

    return login.body().data.token as string
  }

  /**
   * Prepara una tarea y, si se indica, le pone fecha. Solo comprueba los
   * status de la preparación: el vencimiento lo comprueba cada test.
   */
  async function crearTarea(client: any, token: string, dueDate?: string) {
    const creada = await client
      .post('/api/v1/tasks')
      .header('Authorization', bearer(token))
      .json({ title: 'Revisar el informe' })
    creada.assertStatus(201)

    const id = creada.body().data.id as number

    if (dueDate !== undefined) {
      const conFecha = await client
        .put(`/api/v1/tasks/${id}/due-date`)
        .header('Authorization', bearer(token))
        .json({ dueDate, today: HOY })
      conFecha.assertStatus(200)
    }

    return id
  }

  async function leer(client: any, token: string, id: number, today = HOY) {
    const res = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today })
      .header('Authorization', bearer(token))
    res.assertStatus(200)

    return res
  }

  async function marcarHecha(client: any, token: string, id: number) {
    const res = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .header('Authorization', bearer(token))
      .json({ status: 'done' })
    res.assertStatus(200)
  }

  test('Fecha del día anterior', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token, AYER)

    const res = await leer(client, token, id)

    assert.strictEqual(res.body().data.isOverdue, true)
  })

  test('Vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token, HOY)

    const res = await leer(client, token, id)

    assert.strictEqual(res.body().data.isOverdue, false)
  })

  test('Fecha futura', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token, MANANA)

    const res = await leer(client, token, id)

    assert.strictEqual(res.body().data.isOverdue, false)
  })

  test('Sin fecha no se vence nunca', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)

    // Un día de referencia muy posterior a la creación: la tarea es «antigua».
    const res = await leer(client, token, id, '2030-06-01')

    assert.strictEqual(res.body().data.isOverdue, false)
  })

  test('Darla por hecha la deja de vencer', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token, AYER)

    const antes = await leer(client, token, id)
    assert.strictEqual(antes.body().data.isOverdue, true)

    await marcarHecha(client, token, id)

    const despues = await leer(client, token, id)
    assert.strictEqual(despues.body().data.isOverdue, false)
    // Como en trash.spec.ts: se compara contra cómo llegaba antes, por el mismo
    // camino, y no contra un formato concreto de fecha.
    assert.equal(despues.body().data.dueDate, antes.body().data.dueDate)
  })

  test('Una tarea hecha con la fecha pasada', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token, AYER)
    await marcarHecha(client, token, id)

    const res = await leer(client, token, id)

    assert.strictEqual(res.body().data.isOverdue, false)
  })

  test('Aplazar resuelve el vencimiento', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token, AYER)

    const antes = await leer(client, token, id)
    assert.strictEqual(antes.body().data.isOverdue, true)

    const aplazada = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .header('Authorization', bearer(token))
      .json({ dueDate: MANANA, today: HOY })
    aplazada.assertStatus(200)

    assert.strictEqual(aplazada.body().data.isOverdue, false)
  })
})
