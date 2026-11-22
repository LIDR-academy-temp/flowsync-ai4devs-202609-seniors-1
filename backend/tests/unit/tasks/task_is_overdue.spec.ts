import Task from '#models/task'
import { test } from '@japa/runner'

/**
 * Regla de «tarea vencida» (`openspec/specs/tasks/spec.md`, Requirement «Cuándo una tarea
 * está vencida»): vencida si, y solo si, tiene fecha de vencimiento, esa fecha es ANTERIOR
 * al día de referencia y su estado no es `done`.
 *
 * Unitarios puros: la tarea se construye en memoria con `new Task()` y no se guarda, así
 * que no hay servidor, ni base de datos, ni reloj. Todos los días son constantes fijas.
 */
test.group('Task | isOverdueOn', () => {
  const REFERENCIA = '2026-08-20'
  const ANTERIOR = '2026-08-19'
  const POSTERIOR = '2026-08-21'

  function tarea(status: string, dueDate: string | null): Task {
    const task = new Task()
    task.status = status as Task['status']
    task.dueDate = dueDate
    return task
  }

  test('con fecha anterior al día de referencia y sin hacer, está vencida', ({ assert }) => {
    assert.isTrue(tarea('pending', ANTERIOR).isOverdueOn(REFERENCIA))
  })

  test('con fecha exactamente igual al día de referencia, no está vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', REFERENCIA).isOverdueOn(REFERENCIA))
  })

  test('con fecha posterior al día de referencia, no está vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', POSTERIOR).isOverdueOn(REFERENCIA))
  })

  test('sin fecha de vencimiento, no está vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', null).isOverdueOn(REFERENCIA))
  })

  test('hecha (done) con la fecha pasada, no está vencida', ({ assert }) => {
    assert.isFalse(tarea('done', ANTERIOR).isOverdueOn(REFERENCIA))
  })

  test('da el mismo resultado si la fecha llega como texto o como Date del mismo día', ({
    assert,
  }) => {
    const comoTexto = tarea('pending', ANTERIOR).isOverdueOn(REFERENCIA)
    assert.isTrue(comoTexto)

    // El campo está tipado como string, pero el driver puede entregar un Date: cast explícito para simularlo.
    const comoDate = new Date(2026, 7, 19) as unknown as string
    const conDate = tarea('pending', comoDate).isOverdueOn(REFERENCIA)

    assert.equal(conDate, comoTexto)
  })
})
