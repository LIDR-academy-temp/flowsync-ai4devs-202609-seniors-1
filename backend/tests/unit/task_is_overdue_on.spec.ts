import Task from '#models/task'
import { test } from '@japa/runner'

/**
 * Los bordes de la regla de vencimiento, llamando a `Task#isOverdueOn`
 * directamente. La tarea se construye en memoria: sin `save`, sin base de
 * datos y sin servidor.
 *
 * El día de referencia es un literal fijo; ningún caso depende del reloj.
 */
test.group('Task | isOverdueOn', () => {
  const HOY = '2026-03-10'
  const AYER = '2026-03-09'
  const MANANA = '2026-03-11'

  function tarea(datos: { dueDate: unknown; status?: Task['status'] }) {
    const task = new Task()
    task.status = datos.status ?? 'pending'
    // `as any`: el caso 6 asigna un `Date`, que el tipo declarado (`string | null`)
    // no admite, aunque es lo que el driver `pg` entrega para una columna `date`.
    task.dueDate = datos.dueDate as any
    return task
  }

  test('1. fecha anterior al día de referencia, sin hacer → vencida', ({ assert }) => {
    assert.strictEqual(tarea({ dueDate: AYER }).isOverdueOn(HOY), true)
  })

  test('2. fecha igual al día de referencia → no vencida', ({ assert }) => {
    assert.strictEqual(tarea({ dueDate: HOY }).isOverdueOn(HOY), false)
  })

  test('3. fecha posterior → no vencida', ({ assert }) => {
    assert.strictEqual(tarea({ dueDate: MANANA }).isOverdueOn(HOY), false)
  })

  test('4. sin fecha → no vencida', ({ assert }) => {
    assert.strictEqual(tarea({ dueDate: null }).isOverdueOn(HOY), false)
  })

  test('5. hecha y con la fecha pasada → no vencida', ({ assert }) => {
    assert.strictEqual(tarea({ dueDate: AYER, status: 'done' }).isOverdueOn(HOY), false)
  })

  test('6a. fecha anterior llegando como texto → vencida', ({ assert }) => {
    assert.strictEqual(tarea({ dueDate: '2026-03-09' }).isOverdueOn(HOY), true)
  })

  test('6b. fecha anterior llegando como Date, como la entrega pg → vencida', ({ assert }) => {
    // Medianoche UTC fija del 2026-03-09, para no depender del huso de la máquina.
    const deLaBase = new Date(Date.UTC(2026, 2, 9))
    assert.strictEqual(tarea({ dueDate: deLaBase }).isOverdueOn(HOY), true)
  })
})
