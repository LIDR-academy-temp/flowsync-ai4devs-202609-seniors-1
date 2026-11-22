import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Requirement «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`: un test
 * por cada uno de sus 7 Scenarios, con el título del Scenario tal cual.
 *
 * Todo entra por HTTP, como el cliente real, y se asierta sobre el cuerpo de la respuesta
 * (`isOverdue`, booleano estricto). El estado se prepara por la API —crear, poner la fecha,
 * cambiar el estado— y el vencimiento se comprueba con una consulta aparte
 * (`GET /api/v1/tasks/:id?today=...`), salvo en «Aplazar resuelve el vencimiento», que pide
 * expresamente que sea «en la misma respuesta de ese cambio».
 *
 * El día de referencia va siempre en la petición y es una constante: ningún test depende
 * del reloj.
 */
test.group('Tasks | cuándo una tarea está vencida', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  /** El día de referencia de todos los tests. */
  const HOY = '2026-08-20'
  const AYER = '2026-08-19'
  const MANANA = '2026-08-21'

  async function persona(client: any, email: string, fullName: string) {
    const user = await User.create({ fullName, email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: login.body().data.token as string }
  }

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  /** La tarea se crea por HTTP y su id sale de la respuesta de creación. */
  async function crearTarea(client: any, token: string, title = 'Revisar el informe') {
    const response = await client.post('/api/v1/tasks').headers(con(token)).json({ title })
    response.assertStatus(201)
    return response.body().data.id as number
  }

  async function ponerFecha(client: any, token: string, id: number, dueDate: string | null) {
    const response = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(con(token))
      .json({ dueDate, today: HOY })
    response.assertStatus(200)
    return response
  }

  async function cambiarEstado(client: any, token: string, id: number, status: string) {
    const response = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(con(token))
      .json({ status })
    response.assertStatus(200)
    return response
  }

  /** La consulta del vencimiento: una lectura de la tarea, separada de la escritura previa. */
  async function consultar(client: any, token: string, id: number, today: string = HOY) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))
    response.assertStatus(200)
    return response.body().data
  }

  test('Fecha del día anterior', async ({ client, assert }) => {
    const { token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, AYER)

    const tarea = await consultar(client, token, id)

    assert.isTrue(tarea.isOverdue)
  })

  test('Vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const { token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, HOY)

    const tarea = await consultar(client, token, id)

    assert.isFalse(tarea.isOverdue)
  })

  test('Fecha futura', async ({ client, assert }) => {
    const { token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, MANANA)

    const tarea = await consultar(client, token, id)

    assert.isFalse(tarea.isOverdue)
  })

  test('Sin fecha no se vence nunca', async ({ client, assert }) => {
    const { token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    // «Creada hace semanas» no se puede reproducir por HTTP (la API no deja fijar la fecha
    // de creación). Lo más cercano: una tarea recién creada, pendiente y sin fecha, y un día
    // de referencia muy posterior a su creación.
    const id = await crearTarea(client, token)
    const MUY_POSTERIOR = '2035-01-01'

    const tarea = await consultar(client, token, id, MUY_POSTERIOR)

    assert.isNull(tarea.dueDate)
    assert.equal(tarea.status, 'pending')
    assert.isFalse(tarea.isOverdue)
  })

  test('Darla por hecha la deja de vencer', async ({ client, assert }) => {
    const { token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, AYER)

    // Antes del cambio SÍ llegaba vencida: si no, el test no mediría nada.
    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue)
    assert.isNotNull(antes.dueDate)

    await cambiarEstado(client, token, id, 'done')

    const despues = await consultar(client, token, id)
    assert.isFalse(despues.isOverdue)
    // La fecha es exactamente la misma, sin transformar.
    assert.strictEqual(despues.dueDate, antes.dueDate)
  })

  test('Una tarea hecha con la fecha pasada', async ({ client, assert }) => {
    const { token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, AYER)
    await cambiarEstado(client, token, id, 'done')

    const tarea = await consultar(client, token, id)

    assert.equal(tarea.status, 'done')
    assert.isNotNull(tarea.dueDate)
    assert.isFalse(tarea.isOverdue)
  })

  test('Aplazar resuelve el vencimiento', async ({ client, assert }) => {
    const { token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, AYER)

    // Antes de aplazar SÍ está vencida.
    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue)

    // La aserción va sobre la respuesta del propio cambio, no sobre una consulta posterior.
    const response = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(con(token))
      .json({ dueDate: MANANA, today: HOY })

    response.assertStatus(200)
    assert.isFalse(response.body().data.isOverdue)
  })
})
