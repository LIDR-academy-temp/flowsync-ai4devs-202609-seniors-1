import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Un test por cada scenario del requisito «Cuándo una tarea está vencida» de
 * `openspec/specs/tasks/spec.md`. Todo entra por HTTP y lo que se comprueba es
 * el `isOverdue` del cuerpo de la respuesta.
 *
 * El día de referencia es fijo y viaja en cada petición: ningún test lee el
 * reloj. La víspera cae en el mes anterior a propósito, para que comparar solo
 * el número del día no baste.
 */
test.group('Tasks | vencimiento', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const DIA_DE_REFERENCIA = '2026-09-01'
  const VISPERA = '2026-08-31'
  const DIA_SIGUIENTE = '2026-09-02'

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  async function sesion(client: any) {
    const response = await client.post('/api/v1/auth/signup').json({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
      passwordConfirmation: 'secreto123',
    })
    response.assertStatus(200)

    return response.body().data.token as string
  }

  async function crearTarea(client: any, token: string) {
    const response = await client
      .post('/api/v1/tasks')
      .headers(con(token))
      .json({ title: 'Revisar el informe' })
    response.assertStatus(201)

    return response.body().data.id as number
  }

  async function fijarFecha(
    client: any,
    token: string,
    id: number,
    dueDate: string,
    today: string = DIA_DE_REFERENCIA
  ) {
    const response = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(con(token))
      .json({ dueDate, today })
    response.assertStatus(200)

    return response.body().data
  }

  async function cambiarEstado(client: any, token: string, id: number, status: string) {
    const response = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(con(token))
      .json({ status })
    response.assertStatus(200)
  }

  async function consultar(
    client: any,
    token: string,
    id: number,
    today: string = DIA_DE_REFERENCIA
  ) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))
    response.assertStatus(200)

    return response.body().data
  }

  test('Fecha del día anterior', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)
    await fijarFecha(client, token, id, VISPERA)

    const tarea = await consultar(client, token, id)

    assert.isTrue(tarea.isOverdue)
  })

  test('Vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)
    await fijarFecha(client, token, id, DIA_DE_REFERENCIA)

    const tarea = await consultar(client, token, id)

    assert.isFalse(tarea.isOverdue)
  })

  test('Fecha futura', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)
    await fijarFecha(client, token, id, DIA_SIGUIENTE)

    const tarea = await consultar(client, token, id)

    assert.isFalse(tarea.isOverdue)
  })

  test('Sin fecha no se vence nunca', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)

    // «Creada hace semanas» no se puede fabricar por HTTP: la fecha de creación la pone
    // el servidor. Se mira desde un día de referencia muy posterior, que es lo único de
    // la antigüedad que un cliente puede mover.
    const tarea = await consultar(client, token, id, '2099-12-31')

    assert.equal(tarea.status, 'pending')
    assert.isNull(tarea.dueDate)
    assert.isFalse(tarea.isOverdue)
  })

  test('Darla por hecha la deja de vencer', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)
    await fijarFecha(client, token, id, VISPERA)
    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue)

    await cambiarEstado(client, token, id, 'done')

    const despues = await consultar(client, token, id)
    assert.equal(despues.status, 'done')
    assert.isFalse(despues.isOverdue)
    assert.equal(despues.dueDate, antes.dueDate)
  })

  test('Una tarea hecha con la fecha pasada', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)
    await cambiarEstado(client, token, id, 'done')
    await fijarFecha(client, token, id, VISPERA)

    const tarea = await consultar(client, token, id)

    assert.equal(tarea.status, 'done')
    assert.isFalse(tarea.isOverdue)
  })

  test('Aplazar resuelve el vencimiento', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crearTarea(client, token)
    await fijarFecha(client, token, id, VISPERA)
    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue)

    const aplazada = await fijarFecha(client, token, id, DIA_SIGUIENTE)

    assert.isFalse(aplazada.isOverdue)
  })
})
