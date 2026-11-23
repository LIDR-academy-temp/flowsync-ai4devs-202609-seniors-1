import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Cubre los scenarios de los requisitos «Cuándo una
 * tarea está vencida» y «El día de referencia lo pone quien mira» de
 * `openspec/specs/tasks/spec.md`.
 *
 * Todo entra por HTTP, como lo haría un cliente: se crea la tarea con
 * `POST /api/v1/tasks`, se le pone fecha con `PUT .../due-date`, se cambia el estado
 * con `PATCH .../status` y se lee con `GET /api/v1/tasks/:id`. Se comprueba solo lo
 * que viaja en el cuerpo (`data.isOverdue`). El día de referencia es siempre el
 * parámetro `today` de la petición: ningún test mira el reloj.
 */
test.group('Tasks | vencimiento', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  async function sesion(client: any, email = 'ada@example.com') {
    await User.create({ fullName: 'Ada Lovelace', email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })
    return login.body().data.token as string
  }

  /** Crea una tarea por la API y devuelve el identificador que la creación devolvió. */
  async function crear(client: any, token: string, dueDate?: string | null) {
    const creada = await client
      .post('/api/v1/tasks')
      .headers(con(token))
      .json({ title: 'Revisar el informe' })
    creada.assertStatus(201)
    const id = creada.body().data.id as number

    if (dueDate !== undefined) {
      const puesta = await client
        .put(`/api/v1/tasks/${id}/due-date`)
        .headers(con(token))
        .json({ dueDate, today: '2026-01-01' })
      puesta.assertStatus(200)
    }

    return id
  }

  const hecha = async (client: any, token: string, id: number) => {
    const response = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(con(token))
      .json({ status: 'done' })
    response.assertStatus(200)
  }

  /** La tarea suelta tal y como la lee quien mira con ese `today`. */
  async function leer(client: any, token: string, id: number, today: string) {
    const response = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today })
      .headers(con(token))
    response.assertStatus(200)
    return response.body().data
  }

  // --- Cuándo una tarea está vencida -------------------------------------

  test('fecha del día anterior: llega vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crear(client, token, '2026-08-12')

    const tarea = await leer(client, token, id, '2026-08-13')

    assert.isTrue(tarea.isOverdue)
  })

  test('vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crear(client, token, '2026-08-13')

    const tarea = await leer(client, token, id, '2026-08-13')

    assert.isFalse(tarea.isOverdue)
  })

  test('fecha futura: no llega vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crear(client, token, '2026-08-14')

    const tarea = await leer(client, token, id, '2026-08-13')

    assert.isFalse(tarea.isOverdue)
  })

  test('sin fecha no se vence nunca, por lejano que sea el día de referencia', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const id = await crear(client, token)

    const tarea = await leer(client, token, id, '2099-12-31')

    assert.isNull(tarea.dueDate)
    assert.isFalse(tarea.isOverdue)
  })

  test('darla por hecha la deja de vencer y conserva su fecha', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crear(client, token, '2026-08-12')
    assert.isTrue((await leer(client, token, id, '2026-08-13')).isOverdue)

    await hecha(client, token, id)

    const tarea = await leer(client, token, id, '2026-08-13')
    assert.isFalse(tarea.isOverdue)
    assert.equal(tarea.dueDate, '2026-08-12')
  })

  test('una tarea hecha con la fecha pasada no llega vencida', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crear(client, token, '2026-08-01')
    await hecha(client, token, id)

    const tarea = await leer(client, token, id, '2026-08-13')

    assert.isFalse(tarea.isOverdue)
  })

  test('aplazar resuelve el vencimiento en la misma respuesta del cambio', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const id = await crear(client, token, '2026-08-12')
    assert.isTrue((await leer(client, token, id, '2026-08-13')).isOverdue)

    const aplazada = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(con(token))
      .json({ dueDate: '2026-08-20', today: '2026-08-13' })

    aplazada.assertStatus(200)
    assert.equal(aplazada.body().data.dueDate, '2026-08-20')
    assert.isFalse(aplazada.body().data.isOverdue)
  })

  // --- El día de referencia lo pone quien mira ---------------------------

  test('dos días de referencia, dos lecturas, ambas correctas', async ({ client, assert }) => {
    const token = await sesion(client)
    const otro = await sesion(client, 'grace@example.com')
    const id = await crear(client, token, '2026-08-12')

    const [primera, segunda] = await Promise.all([
      leer(client, token, id, '2026-08-13'),
      leer(client, otro, id, '2026-08-12'),
    ])

    assert.isTrue(primera.isOverdue)
    assert.isFalse(segunda.isOverdue)
  })

  test('una tarea vence sola al cambiar el día de referencia, sin tocarla', async ({
    client,
    assert,
  }) => {
    const token = await sesion(client)
    const id = await crear(client, token, '2026-08-13')

    const antes = await leer(client, token, id, '2026-08-13')
    const despues = await leer(client, token, id, '2026-08-14')

    assert.isFalse(antes.isOverdue)
    assert.isTrue(despues.isOverdue)
    assert.equal(antes.dueDate, despues.dueDate)
    assert.equal(antes.status, despues.status)
  })

  test('sin today la respuesta es 422 sobre ese parámetro', async ({ client, assert }) => {
    const token = await sesion(client)
    const id = await crear(client, token, '2026-08-12')

    const response = await client.get(`/api/v1/tasks/${id}`).headers(con(token))

    response.assertStatus(422)
    response.assertBodyContains({ errors: [{ field: 'today' }] })
    assert.notProperty(response.body(), 'data')
  })

  const INVALIDOS = [
    ['mal formado', '13/08/2026'],
    ['imposible', '2026-02-31'],
    ['vacío', ''],
    ['no es una fecha', 'hoy'],
  ]

  for (const [descripcion, today] of INVALIDOS) {
    test(`un today ${descripcion} (${JSON.stringify(today)}) es 422 y no devuelve tarea`, async ({
      client,
      assert,
    }) => {
      const token = await sesion(client)
      const id = await crear(client, token, '2026-08-12')

      const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))

      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ field: 'today' }] })
      assert.notProperty(response.body(), 'data')
    })
  }
})
