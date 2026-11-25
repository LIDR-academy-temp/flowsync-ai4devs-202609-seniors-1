import Task from '#models/task'
import { test } from '@japa/runner'

/**
 * `Task.isOverdueOn()` aislada: sin HTTP, sin PostgreSQL y sin reloj. Las instancias
 * se construyen en memoria y nunca se guardan. La regla es la del requisito «Cuándo
 * una tarea está vencida» de `openspec/specs/tasks/spec.md`: vencida si, y solo si,
 * tiene fecha, esa fecha es anterior al día de referencia y el estado no es `done`.
 */
test.group('Task.isOverdueOn', () => {
  // Fechas fijas: ningún caso depende de cuándo se ejecute.
  const REFERENCE_DAY = '2026-08-13'
  const DAY_BEFORE = '2026-08-12'
  const DAY_AFTER = '2026-08-14'

  function taskWith(status: Task['status'], dueDate: unknown): Task {
    const task = new Task()
    task.status = status
    // `unknown` a propósito: el modelo declara `string | null`, pero el caso 6
    // necesita darle un `Date`, que es lo que entrega el driver de PostgreSQL.
    task.dueDate = dueDate as string | null
    return task
  }

  test('returns true for a pending task due before the reference day', ({ assert }) => {
    assert.isTrue(taskWith('pending', DAY_BEFORE).isOverdueOn(REFERENCE_DAY))
  })

  test('returns false for a pending task due exactly on the reference day', ({ assert }) => {
    assert.isFalse(taskWith('pending', REFERENCE_DAY).isOverdueOn(REFERENCE_DAY))
  })

  test('returns false for a pending task due after the reference day', ({ assert }) => {
    assert.isFalse(taskWith('pending', DAY_AFTER).isOverdueOn(REFERENCE_DAY))
  })

  test('returns false for a pending task without a due date', ({ assert }) => {
    assert.isFalse(taskWith('pending', null).isOverdueOn(REFERENCE_DAY))
  })

  test('returns false for a done task whose due date is before the reference day', ({ assert }) => {
    assert.isFalse(taskWith('done', DAY_BEFORE).isOverdueOn(REFERENCE_DAY))
  })

  test('gives the same result whether the due date is a string or a Date of the same day', ({
    assert,
  }) => {
    // El mismo día, 2026-08-12, en las dos representaciones. El `Date` es la
    // medianoche UTC de ese día para que el caso no dependa del huso de la máquina.
    const asString = taskWith('pending', '2026-08-12').isOverdueOn(REFERENCE_DAY)
    const asDate = taskWith('pending', new Date('2026-08-12T00:00:00.000Z')).isOverdueOn(
      REFERENCE_DAY
    )

    assert.equal(asDate, asString)
    // Y el resultado correcto para ese día es «vencida»: igualdad solo no basta.
    assert.isTrue(asString)
    assert.isTrue(asDate)
  })
})
