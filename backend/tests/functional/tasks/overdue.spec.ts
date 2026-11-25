import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada scenario del requisito
 * «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`.
 *
 * Los tests son de caja negra: solo miran lo que entra y sale por la API.
 * Toda la preparación se hace por los endpoints del contrato (signup, crear,
 * fijar fecha, cambiar estado), y lo que se comprueba es el campo `isOverdue`
 * del cuerpo de la respuesta.
 *
 * El día de referencia viaja siempre en la petición, en el parámetro `today`
 * (requisito «El día de referencia lo pone quien mira»). Ningún test depende
 * del reloj ni de la fecha actual: todas las fechas son literales fijados
 * aquí, y la comparación se hace siempre contra el `today` enviado.
 *
 * Ningún identificador se escribe a mano: el de cada tarea se toma de la
 * respuesta que la crea.
 */
test.group('Tasks | vencimiento', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // Día de referencia fijo de todos los scenarios.
  const HOY = '2026-08-13'
  const AYER = '2026-08-12'
  const MANANA = '2026-08-14'
  const HACE_UN_MES = '2026-07-13'

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  /** Registra una cuenta por la API y devuelve su token. */
  async function cuenta(client: any) {
    const response = await client.post('/api/v1/auth/signup').json({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
      passwordConfirmation: 'secreto123',
    })
    response.assertStatus(200)
    return response.body().data.token as string
  }

  /** Crea una tarea por la API y devuelve el id que trae la respuesta. */
  async function crearTarea(client: any, token: string) {
    const response = await client
      .post('/api/v1/tasks')
      .headers(con(token))
      .json({ title: 'Revisar el informe' })
    response.assertStatus(201)
    return response.body().data.id
  }

  function fijarFecha(client: any, token: string, id: unknown, dueDate: string | null) {
    return client
      .put(`/api/v1/tasks/${id}/due-date`)
      .qs({ today: HOY })
      .headers(con(token))
      .json({ dueDate })
  }

  async function cambiarEstado(client: any, token: string, id: unknown, status: string) {
    const response = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .headers(con(token))
      .json({ status })
    response.assertStatus(200)
  }

  async function consultar(client: any, token: string, id: unknown, today: string = HOY) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))
    response.assertStatus(200)
    return response.body().data
  }

  /** Tarea en el estado pedido y con la fecha pedida, montada solo por la API. */
  async function tarea(
    client: any,
    token: string,
    { dueDate, status }: { dueDate: string | null; status?: string }
  ) {
    const id = await crearTarea(client, token)
    if (dueDate !== null) {
      const response = await fijarFecha(client, token, id, dueDate)
      response.assertStatus(200)
    }
    if (status) await cambiarEstado(client, token, id, status)
    return id
  }

  test('una tarea no hecha con fecha del día anterior llega vencida', async ({
    client,
    assert,
  }) => {
    const token = await cuenta(client)

    for (const status of ['pending', 'in_progress']) {
      const id = await tarea(client, token, { dueDate: AYER, status })

      const leida = await consultar(client, token, id)

      assert.strictEqual(leida.isOverdue, true, `estado ${status}`)
    }
  })

  test('vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await tarea(client, token, { dueDate: HOY })

    const leida = await consultar(client, token, id)

    assert.strictEqual(leida.isOverdue, false)
  })

  test('una tarea con fecha futura no llega vencida', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await tarea(client, token, { dueDate: MANANA })

    const leida = await consultar(client, token, id)

    assert.strictEqual(leida.isOverdue, false)
  })

  test('una tarea sin fecha no se vence nunca, por antigua que sea', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await tarea(client, token, { dueDate: null })

    // «Creada hace semanas»: se mira con un día de referencia muy posterior
    // a cualquier fecha de creación posible, sin tocar el reloj.
    const leida = await consultar(client, token, id, '2099-12-31')

    assert.strictEqual(leida.isOverdue, false)
  })

  test('darla por hecha la deja de vencer', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await tarea(client, token, { dueDate: AYER })

    const antes = await consultar(client, token, id)
    assert.strictEqual(antes.isOverdue, true)

    await cambiarEstado(client, token, id, 'done')

    const despues = await consultar(client, token, id)
    assert.strictEqual(despues.isOverdue, false)
  })

  test('una tarea hecha con la fecha ya pasada no llega vencida', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await tarea(client, token, { dueDate: HACE_UN_MES, status: 'done' })

    const leida = await consultar(client, token, id)

    assert.strictEqual(leida.isOverdue, false)
  })

  test('aplazar resuelve el vencimiento en la misma respuesta del cambio', async ({
    client,
    assert,
  }) => {
    const token = await cuenta(client)
    const id = await tarea(client, token, { dueDate: AYER })

    const antes = await consultar(client, token, id)
    assert.strictEqual(antes.isOverdue, true)

    const response = await fijarFecha(client, token, id, MANANA)

    response.assertStatus(200)
    assert.strictEqual(response.body().data.isOverdue, false)
  })
})
