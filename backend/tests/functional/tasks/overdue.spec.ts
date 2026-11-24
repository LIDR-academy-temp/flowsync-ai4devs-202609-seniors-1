import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Cuándo una tarea está vencida. Un test por cada scenario del requisito
 * «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`.
 *
 * Todo entra por HTTP, como lo haría un cliente de la API: la cuenta se da de
 * alta con `POST /auth/signup`, la tarea se crea con `POST /tasks` y se usa el
 * identificador que devuelve esa creación. La fecha se pone con
 * `PUT /tasks/:id/due-date`, el estado se cambia con `PATCH /tasks/:id/status` y
 * la tarea se lee con `GET /tasks/:id`. Lo que se comprueba es el `isOverdue`
 * que viaja en el cuerpo de la respuesta, no lo que devuelve un método del
 * modelo.
 *
 * El día de referencia va siempre en la petición (`today`) y es una fecha fija:
 * ningún test lee el reloj ni calcula «hoy».
 */
test.group('Tasks | cuándo una tarea está vencida', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // El día de quien mira, y sus vecinos. Fijos: el resultado no puede depender
  // del día en que se lancen los tests.
  const DIA_DE_REFERENCIA = '2026-08-20'
  const DIA_ANTERIOR = '2026-08-19'
  const DIA_POSTERIOR = '2026-08-21'
  const FECHA_YA_PASADA = '2026-07-01'

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  /** Da de alta una cuenta por la API y devuelve su token. */
  async function cuenta(client: any) {
    const alta = await client.post('/api/v1/auth/signup').json({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'secreto123',
      passwordConfirmation: 'secreto123',
    })
    alta.assertStatus(200)

    return alta.body().data.token as string
  }

  /** Crea una tarea por la API y devuelve el identificador que da la creación. */
  async function crearTarea(client: any, token: string) {
    const creada = await client
      .post('/api/v1/tasks')
      .headers(con(token))
      .json({ title: 'Revisar el informe' })
    creada.assertStatus(201)

    return creada.body().data.id as number
  }

  /** Pone (o cambia) la fecha de vencimiento mirando desde el día de referencia. */
  async function ponerFecha(client: any, token: string, id: number, dueDate: string | null) {
    const response = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .headers(con(token))
      .json({ dueDate, today: DIA_DE_REFERENCIA })
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

  /** La tarea suelta tal y como la recibe un cliente que mira desde `today`. */
  async function consultar(client: any, token: string, id: number, today = DIA_DE_REFERENCIA) {
    const response = await client.get(`/api/v1/tasks/${id}`).qs({ today }).headers(con(token))
    response.assertStatus(200)

    return response.body().data
  }

  test('fecha del día anterior: llega vencida', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, DIA_ANTERIOR)

    const tarea = await consultar(client, token, id)

    assert.notEqual(tarea.status, 'done')
    assert.isTrue(tarea.isOverdue)
  })

  test('vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, DIA_DE_REFERENCIA)

    const tarea = await consultar(client, token, id)

    assert.notEqual(tarea.status, 'done')
    // La regla pide que la fecha sea ANTERIOR: el mismo día no basta.
    assert.isFalse(tarea.isOverdue)
  })

  test('fecha futura: no llega vencida', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, DIA_POSTERIOR)

    const tarea = await consultar(client, token, id)

    assert.isFalse(tarea.isOverdue)
  })

  test('sin fecha no se vence nunca, por antigua que sea', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await crearTarea(client, token)

    // «Creada hace semanas» se expresa con el día de referencia, sin tocar el
    // reloj ni la base: mirada desde un día muy posterior a cualquier momento
    // en que se haya podido crear, la tarea es antigua.
    const tarea = await consultar(client, token, id, '2099-12-31')

    assert.equal(tarea.status, 'pending')
    assert.isNull(tarea.dueDate)
    assert.isFalse(tarea.isOverdue)
  })

  test('darla por hecha la deja de vencer y conserva su fecha', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await crearTarea(client, token)
    await ponerFecha(client, token, id, DIA_ANTERIOR)

    // Punto de partida: está vencida.
    const antes = await consultar(client, token, id)
    assert.isTrue(antes.isOverdue)

    await cambiarEstado(client, token, id, 'done')

    const despues = await consultar(client, token, id)
    assert.equal(despues.status, 'done')
    assert.isFalse(despues.isOverdue)
    // La fecha no se toca para dejar de vencer: es la misma que antes del cambio.
    assert.equal(despues.dueDate, antes.dueDate)
  })

  test('una tarea hecha con la fecha pasada no llega vencida', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await crearTarea(client, token)
    await cambiarEstado(client, token, id, 'done')

    // La respuesta de poner la fecha ya informa del vencimiento.
    const alPonerla = await ponerFecha(client, token, id, FECHA_YA_PASADA)
    assert.isFalse(alPonerla.body().data.isOverdue)

    const tarea = await consultar(client, token, id)
    assert.equal(tarea.status, 'done')
    assert.isNotNull(tarea.dueDate)
    assert.isFalse(tarea.isOverdue)
  })

  test('aplazar resuelve el vencimiento en la misma respuesta', async ({ client, assert }) => {
    const token = await cuenta(client)
    const id = await crearTarea(client, token)

    const vencida = await ponerFecha(client, token, id, DIA_ANTERIOR)
    assert.isTrue(vencida.body().data.isOverdue)

    const aplazada = await ponerFecha(client, token, id, DIA_POSTERIOR)

    // En la respuesta del propio cambio, sin tener que volver a consultarla.
    assert.equal(aplazada.body().data.id, id)
    assert.isFalse(aplazada.body().data.isOverdue)
    assert.notEqual(aplazada.body().data.dueDate, vencida.body().data.dueDate)
  })
})
