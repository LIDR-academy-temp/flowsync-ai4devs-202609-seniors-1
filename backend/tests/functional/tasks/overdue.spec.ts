import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * El vencimiento leído de vuelta de la base de datos.
 *
 * Hasta ahora ninguna prueba leía una tarea con fecha desde la base: la única
 * lectura con `isOverdue` que se probaba era la respuesta del `PUT`, donde
 * `dueDate` todavía es el texto que acaba de asignar el controlador. Con SQLite
 * eso daba igual, porque la columna `date` vuelve como texto `AAAA-MM-DD`; con
 * PostgreSQL el driver `pg` la devuelve como un `Date` de JavaScript, y
 * `Date < 'AAAA-MM-DD'` es siempre `false`. Estas pruebas leen con un `GET`
 * para que ese camino quede cubierto.
 */
test.group('Tasks | vencimiento leído de la base', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-11-18'

  async function tareaConFecha(client: any, dueDate: string) {
    await User.create({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
    })
    const login = await client
      .post('/api/v1/auth/login')
      .json({ email: 'ada@example.com', password: 'secreto123' })
    const token = login.body().data.token as string

    const creada = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${token}`)
      .json({ title: 'Revisar el informe' })
    creada.assertStatus(201)
    const id = creada.body().data.id as number

    const puesta = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .header('Authorization', `Bearer ${token}`)
      .json({ today: HOY, dueDate })
    puesta.assertStatus(200)

    const leida = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)
    leida.assertStatus(200)

    return leida.body().data
  }

  test('una tarea con fecha pasada sale vencida al leerla', async ({ client, assert }) => {
    const tarea = await tareaConFecha(client, '2026-01-15')

    // Primero la condición de vencida: es el fallo de negocio, y comprobarla
    // antes que el formato hace que la prueba lo señale a él y no a la fecha.
    assert.isTrue(tarea.isOverdue)
    assert.equal(tarea.dueDate, '2026-01-15')
  })

  test('una tarea con fecha futura no sale vencida al leerla', async ({ client, assert }) => {
    const tarea = await tareaConFecha(client, '2027-01-15')

    assert.equal(tarea.dueDate, '2027-01-15')
    assert.isFalse(tarea.isOverdue)
  })

  test('una tarea que vence hoy todavía no está vencida', async ({ client, assert }) => {
    const tarea = await tareaConFecha(client, HOY)

    assert.equal(tarea.dueDate, HOY)
    assert.isFalse(tarea.isOverdue)
  })
})
