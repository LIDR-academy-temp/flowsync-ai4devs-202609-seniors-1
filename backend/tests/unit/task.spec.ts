import Task from '#models/task'
import { test } from '@japa/runner'

/**
 * `Task.isOverdueOn` sin base de datos ni HTTP: la instancia se construye en memoria.
 */
test.group('Task | isOverdueOn', () => {
  const HOY = '2026-08-20'

  function tarea(datos: { status: string; dueDate: unknown }): Task {
    const task = new Task()
    task.status = datos.status as any
    task.dueDate = datos.dueDate as any
    return task
  }

  test('fecha anterior y sin hacer: vencida', ({ assert }) => {
    // Scenario: Fecha del día anterior
    assert.isTrue(tarea({ status: 'pending', dueDate: '2026-08-19' }).isOverdueOn(HOY))
  })

  test('fecha igual al día de referencia: no vencida', ({ assert }) => {
    // Scenario: Vencer hoy todavía no es estar vencida
    assert.isFalse(tarea({ status: 'pending', dueDate: '2026-08-20' }).isOverdueOn(HOY))
  })

  test('fecha posterior: no vencida', ({ assert }) => {
    // Scenario: Fecha futura
    assert.isFalse(tarea({ status: 'pending', dueDate: '2026-08-21' }).isOverdueOn(HOY))
  })

  test('sin fecha: no vencida', ({ assert }) => {
    // Scenario: Sin fecha no se vence nunca
    assert.isFalse(tarea({ status: 'pending', dueDate: null }).isOverdueOn(HOY))
  })

  test('tarea hecha con la fecha pasada: no vencida', ({ assert }) => {
    // Scenario: Una tarea hecha con la fecha pasada
    assert.isFalse(tarea({ status: 'done', dueDate: '2026-08-19' }).isOverdueOn(HOY))
  })

  test('dueDate como texto o como Date del mismo día da lo mismo', ({ assert }) => {
    // no sale de la spec
    // Date.UTC fija el instante sin reloj ni zona de la máquina (mes 7 = agosto).
    const comoDate = new Date(Date.UTC(2026, 7, 19))
    const comoTexto = tarea({ status: 'pending', dueDate: '2026-08-19' }).isOverdueOn(HOY)
    const conDate = tarea({ status: 'pending', dueDate: comoDate }).isOverdueOn(HOY)

    assert.isTrue(comoTexto)
    assert.equal(conDate, comoTexto)
  })
})
