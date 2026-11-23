import Task from '#models/task'
import { test } from '@japa/runner'

/**
 * Cuándo una tarea está vencida: los bordes de la regla de
 * `openspec/specs/tasks/spec.md`, sin servidor y sin base de datos. La tarea se
 * construye en memoria con `new Task()` y se le pregunta por un día de referencia
 * que pone el propio test; ningún reloj interviene.
 */
test.group('Task | isOverdueOn', () => {
  const REFERENCIA = '2026-08-13'

  function tarea(dueDate: string | null, status: 'pending' | 'in_progress' | 'done' = 'pending') {
    const task = new Task()
    task.dueDate = dueDate as any
    task.status = status
    return task
  }

  test('fecha anterior al día de referencia y sin hacer: vencida', ({ assert }) => {
    assert.isTrue(tarea('2026-08-12').isOverdueOn(REFERENCIA))
    assert.isTrue(tarea('2026-08-12', 'in_progress').isOverdueOn(REFERENCIA))
  })

  test('fecha exactamente igual al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea(REFERENCIA).isOverdueOn(REFERENCIA))
  })

  test('fecha posterior al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea('2026-08-14').isOverdueOn(REFERENCIA))
  })

  test('sin fecha: no vencida, por lejano que sea el día de referencia', ({ assert }) => {
    assert.isFalse(tarea(null).isOverdueOn(REFERENCIA))
    assert.isFalse(tarea(null).isOverdueOn('2099-12-31'))
  })

  test('tarea hecha con la fecha pasada: no vencida', ({ assert }) => {
    assert.isFalse(tarea('2026-08-01', 'done').isOverdueOn(REFERENCIA))
  })

  test('se comporta igual reciba la fecha como texto o como objeto fecha', ({ assert }) => {
    // Lo que la base entrega no es siempre un texto `AAAA-MM-DD`: una columna de
    // tipo fecha puede llegar como `Date`. La regla no puede depender de ello.
    const comoObjeto = (dia: string, status: 'pending' | 'done' = 'pending') => {
      const task = new Task()
      task.dueDate = new Date(`${dia}T00:00:00.000Z`) as any
      task.status = status
      return task
    }

    const casos: Array<[string, string, 'pending' | 'done']> = [
      ['2026-08-12', REFERENCIA, 'pending'], // anterior
      [REFERENCIA, REFERENCIA, 'pending'], // el mismo día
      ['2026-08-14', REFERENCIA, 'pending'], // posterior
      ['2026-08-12', REFERENCIA, 'done'], // hecha
    ]

    for (const [dia, referencia, status] of casos) {
      assert.equal(
        comoObjeto(dia, status).isOverdueOn(referencia),
        tarea(dia, status).isOverdueOn(referencia),
        `${dia} vs ${referencia} (${status}): el objeto fecha y el texto deben coincidir`
      )
    }
  })
})
