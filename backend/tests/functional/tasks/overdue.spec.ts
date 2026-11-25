import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Requisito «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`:
 * un test por cada uno de sus siete scenarios, con el mismo nombre.
 *
 * Todo se hace por HTTP y se comprueba sobre el `isOverdue` que viaja en el
 * cuerpo de la respuesta. El día de referencia va en cada petición y todas las
 * fechas son fijas: el resultado no depende de cuándo se ejecute la suite.
 */
test.group('Tasks | vencimiento', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const DIA_DE_REFERENCIA = '2026-08-20'
  const DIA_ANTERIOR = '2026-08-19'
  const DIA_POSTERIOR = '2026-08-21'

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  /** Una cuenta con una tarea pendiente y sin fecha. */
  async function tareaNueva(client: any) {
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

  /** Cambia la fecha y devuelve la tarea tal y como llega en esa respuesta. */
  async function ponerFecha(client: any, token: string, id: number, dueDate: string) {
    const response = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(con(token))
      .json({ dueDate, today: DIA_DE_REFERENCIA })
    response.assertStatus(200)

    return response.body().data
  }

  async function darPorHecha(client: any, token: string, id: number) {
    const response = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(con(token))
      .json({ status: 'done' })
    response.assertStatus(200)
  }

  async function consultar(client: any, token: string, id: number) {
    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: DIA_DE_REFERENCIA })
      .headers(con(token))
    response.assertStatus(200)

    return response.body().data
  }

  test('Fecha del día anterior', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)
    await ponerFecha(client, token, id, DIA_ANTERIOR)

    const tarea = await consultar(client, token, id)

    assert.isTrue(tarea.isOverdue)
  })

  test('Vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)
    await ponerFecha(client, token, id, DIA_DE_REFERENCIA)

    const tarea = await consultar(client, token, id)

    assert.isFalse(tarea.isOverdue)
  })

  test('Fecha futura', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)
    await ponerFecha(client, token, id, DIA_POSTERIOR)

    const tarea = await consultar(client, token, id)

    assert.isFalse(tarea.isOverdue)
  })

  test('Sin fecha no se vence nunca', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)
    // La API no deja elegir cuándo se creó una tarea, así que la antigüedad se
    // fija en la base: siete semanas antes del día de referencia.
    await db.from('tasks').where('id', id).update({ created_at: '2026-07-01T12:00:00Z' })

    const tarea = await consultar(client, token, id)

    assert.match(tarea.createdAt, /^2026-07-01/, 'precondición: creada hace semanas')
    assert.equal(tarea.status, 'pending', 'precondición: todavía pendiente')
    assert.isNull(tarea.dueDate, 'precondición: sin fecha de vencimiento')
    assert.isFalse(tarea.isOverdue)
  })

  test('Darla por hecha la deja de vencer', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)
    await ponerFecha(client, token, id, DIA_ANTERIOR)

    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue, 'precondición: la tarea está vencida antes del cambio')

    await darPorHecha(client, token, id)
    const despues = await consultar(client, token, id)

    assert.isFalse(despues.isOverdue)
    assert.isNotNull(despues.dueDate)
    assert.equal(despues.dueDate, antes.dueDate)
  })

  test('Una tarea hecha con la fecha pasada', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)
    await ponerFecha(client, token, id, DIA_ANTERIOR)
    await darPorHecha(client, token, id)

    const tarea = await consultar(client, token, id)

    assert.equal(tarea.status, 'done', 'precondición: la tarea está hecha')
    assert.isFalse(tarea.isOverdue)
  })

  test('Aplazar resuelve el vencimiento', async ({ client, assert }) => {
    const { token, id } = await tareaNueva(client)
    await ponerFecha(client, token, id, DIA_ANTERIOR)

    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue, 'precondición: la tarea está vencida antes de aplazarla')

    // Lo que se comprueba es la respuesta del propio cambio, sin volver a consultar.
    const aplazada = await ponerFecha(client, token, id, DIA_POSTERIOR)

    assert.isFalse(aplazada.isOverdue)
    assert.notEqual(aplazada.dueDate, antes.dueDate)
  })
})
