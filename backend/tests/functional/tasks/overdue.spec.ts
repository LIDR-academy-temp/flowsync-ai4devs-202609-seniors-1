import User from '#models/user'
import Task from '#models/task'
import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada uno de los siete scenarios del
 * requisito «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`.
 *
 * La spec es la fuente de verdad: los tests no se adaptan a lo que haga hoy la
 * implementación. Los datos se preparan con `Task.create`, pero toda comprobación
 * es una petición HTTP y lee `isOverdue` de la respuesta. Los cambios de estado y
 * de fecha pasan por sus endpoints. Los ids son siempre los de la tarea creada.
 */
test.group('Tasks | vencimiento', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Día de referencia fijo: ningún test depende del reloj.
  const HOY = '2026-08-13'
  const AYER = '2026-08-12'
  const MANANA = '2026-08-14'

  async function sesion(client: any) {
    const user = await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })

    return { user, token: login.body().data.token as string }
  }

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  function tareaDe(
    user: User,
    datos: Partial<Pick<Task, 'status' | 'dueDate' | 'createdAt'>> = {}
  ): Promise<Task> {
    return Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
      ...datos,
    })
  }

  /**
   * El día de una fecha de vencimiento tal y como llegue: la spec no fija el
   * formato (texto `AAAA-MM-DD` o instante ISO), solo qué día es.
   */
  const dia = (valor: unknown) => String(valor).slice(0, 10)

  const consultar = (client: any, token: string, id: number, today: string) =>
    client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))

  test('flags a not-done task due the day before the reference day as overdue', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user, { dueDate: AYER })

    const response = await consultar(client, token, tarea.id, HOY)

    response.assertStatus(200)
    assert.equal(response.body().data.id, tarea.id)
    assert.equal(dia(response.body().data.dueDate), AYER)
    assert.isTrue(response.body().data.isOverdue)
  })

  test('does not flag a task due on the reference day itself', async ({ client, assert }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user, { dueDate: HOY })

    const response = await consultar(client, token, tarea.id, HOY)

    response.assertStatus(200)
    assert.equal(dia(response.body().data.dueDate), HOY)
    assert.isFalse(response.body().data.isOverdue)
  })

  test('does not flag a task due after the reference day', async ({ client, assert }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user, { dueDate: MANANA })

    const response = await consultar(client, token, tarea.id, HOY)

    response.assertStatus(200)
    assert.equal(dia(response.body().data.dueDate), MANANA)
    assert.isFalse(response.body().data.isOverdue)
  })

  test('never flags a task without a due date, however old it is', async ({ client, assert }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user, {
      dueDate: null,
      createdAt: DateTime.fromISO('2026-07-01T10:00:00Z'),
    })

    const response = await consultar(client, token, tarea.id, HOY)

    response.assertStatus(200)
    // Se comprueba que la tarea es de verdad antigua: si no, el test no probaría nada.
    assert.match(response.body().data.createdAt, /^2026-07-01/)
    assert.equal(response.body().data.status, 'pending')
    assert.isNull(response.body().data.dueDate)
    assert.isFalse(response.body().data.isOverdue)
  })

  test('stops flagging an overdue task as overdue once it is done, keeping its due date', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user, { dueDate: AYER })

    const antes = await consultar(client, token, tarea.id, HOY)
    antes.assertStatus(200)
    assert.isTrue(antes.body().data.isOverdue)

    const cambio = await client
      .patch(`/api/v1/tasks/${tarea.id}/status`)
      .headers(con(token))
      .json({ status: 'done' })
    cambio.assertStatus(200)
    assert.equal(cambio.body().data.status, 'done')

    const despues = await consultar(client, token, tarea.id, HOY)
    despues.assertStatus(200)
    assert.equal(despues.body().data.status, 'done')
    assert.isFalse(despues.body().data.isOverdue)
    assert.equal(dia(despues.body().data.dueDate), dia(antes.body().data.dueDate))
    assert.equal(dia(despues.body().data.dueDate), AYER)
  })

  test('does not flag a done task whose due date has passed', async ({ client, assert }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user, { status: 'done', dueDate: AYER })

    const response = await consultar(client, token, tarea.id, HOY)

    response.assertStatus(200)
    assert.equal(response.body().data.status, 'done')
    assert.equal(dia(response.body().data.dueDate), AYER)
    assert.isFalse(response.body().data.isOverdue)
  })

  test('postponing an overdue task clears the overdue flag in the same response', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client)
    const tarea = await tareaDe(user, { dueDate: AYER })
    const nueva = '2026-08-20'

    const antes = await consultar(client, token, tarea.id, HOY)
    antes.assertStatus(200)
    assert.isTrue(antes.body().data.isOverdue)

    const aplazada = await client
      .put(`/api/v1/tasks/${tarea.id}/due-date`)
      .headers(con(token))
      .json({ today: HOY, dueDate: nueva })

    aplazada.assertStatus(200)
    assert.equal(aplazada.body().data.id, tarea.id)
    assert.equal(dia(aplazada.body().data.dueDate), nueva)
    assert.isFalse(aplazada.body().data.isOverdue)

    // Y la lectura posterior coincide con lo que dijo el propio cambio.
    const despues = await consultar(client, token, tarea.id, HOY)
    assert.equal(dia(despues.body().data.dueDate), nueva)
    assert.isFalse(despues.body().data.isOverdue)
  })
})
