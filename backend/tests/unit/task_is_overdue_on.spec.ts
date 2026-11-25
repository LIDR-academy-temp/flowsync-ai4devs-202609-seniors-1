import { test } from '@japa/runner'
import Task, { type TaskStatus } from '#models/task'

/**
 * La regla `isOverdueOn` llamada directamente, sin servidor ni base de datos.
 *
 * Los cinco primeros casos son Scenarios del Requirement «Cuándo una tarea está
 * vencida» de `openspec/specs/tasks/spec.md`, con sus mismos nombres. El sexto no
 * sale de ningún requisito: sale de cómo llega el dato de verdad desde la base.
 */
const HOY = '2026-11-24'

function tarea(status: TaskStatus, dueDate: string | Date | null) {
  const task = new Task()
  task.status = status
  // El modelo declara `dueDate` como texto, pero nada en el camino desde la base
  // garantiza que llegue así: por eso el tipo se fuerza aquí.
  task.dueDate = dueDate as string | null
  return task
}

test.group('Task.isOverdueOn: cuándo una tarea está vencida', () => {
  test('Fecha del día anterior', ({ assert }) => {
    assert.isTrue(tarea('pending', '2026-11-23').isOverdueOn(HOY))
  })

  test('Vencer hoy todavía no es estar vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', HOY).isOverdueOn(HOY))
  })

  test('Fecha futura', ({ assert }) => {
    assert.isFalse(tarea('pending', '2026-11-25').isOverdueOn(HOY))
  })

  test('Sin fecha no se vence nunca', ({ assert }) => {
    assert.isFalse(tarea('pending', null).isOverdueOn(HOY))
  })

  test('Una tarea hecha con la fecha pasada', ({ assert }) => {
    assert.isFalse(tarea('done', '2026-11-23').isOverdueOn(HOY))
  })

  test('Da lo mismo recibir la fecha como texto AAAA-MM-DD o como Date', ({ assert }) => {
    // node-postgres convierte una columna `date` en un Date a medianoche local.
    const comoTexto = tarea('pending', '2026-11-23').isOverdueOn(HOY)
    const comoDate = tarea('pending', new Date(2026, 10, 23)).isOverdueOn(HOY)

    assert.equal(comoDate, comoTexto)
  })
})
