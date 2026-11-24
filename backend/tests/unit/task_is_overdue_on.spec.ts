import Task from '#models/task'
import type { TaskStatus } from '#models/task'
import { test } from '@japa/runner'

/**
 * `Task.isOverdueOn(referenceDay: string): boolean`, probado en aislamiento: se
 * construye la instancia en memoria con `new Task()` y no se guarda nunca, así
 * que ni se levanta el servidor HTTP ni se toca la base.
 *
 * La regla es la del requisito «Cuándo una tarea está vencida» de
 * `openspec/specs/tasks/spec.md`: vencida ⇔ tiene fecha ∧ fecha < día de
 * referencia ∧ estado ≠ done. El día de referencia es siempre una constante:
 * nada depende del reloj del sistema.
 */
test.group('Task.isOverdueOn', () => {
  const HOY = '2026-08-20'
  const AYER = '2026-08-19'
  const MANANA = '2026-08-21'
  const HACE_UN_MES = '2026-07-20'

  /** Una tarea solo en memoria, con la fecha y el estado indicados. */
  function tarea(dueDate: string | null, status: TaskStatus = 'pending'): Task {
    const task = new Task()
    task.title = 'Revisar el informe'
    task.status = status
    task.dueDate = dueDate
    return task
  }

  test('fecha anterior al día de referencia y tarea pendiente: vencida', ({ assert }) => {
    assert.isTrue(tarea(AYER, 'pending').isOverdueOn(HOY))
  })

  test('fecha igual al día de referencia: todavía no vencida', ({ assert }) => {
    assert.isFalse(tarea(HOY).isOverdueOn(HOY))
  })

  test('fecha posterior al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea(MANANA).isOverdueOn(HOY))
  })

  test('sin fecha de vencimiento: no vencida', ({ assert }) => {
    assert.isFalse(tarea(null).isOverdueOn(HOY))
  })

  test('tarea completada con la fecha pasada: no vencida', ({ assert }) => {
    assert.isFalse(tarea(HACE_UN_MES, 'done').isOverdueOn(HOY))
  })

  test('el día de referencia como texto o como Date da el mismo resultado', ({ assert }) => {
    // El mismo día del calendario en las dos formas. `new Date('AAAA-MM-DD')` es
    // la medianoche UTC de ese día: un instante fijo, no el reloj del sistema.
    const comoTexto = HOY
    const comoDate = new Date(HOY)

    // La firma declara `string`; el cast es lo que permite comprobar qué pasa si
    // alguien le pasa un Date sin convertirlo (desde JS, o tras un `any`).
    const conDate = (task: Task) => task.isOverdueOn(comoDate as unknown as string)

    const casos = [
      tarea(AYER, 'pending'),
      tarea(HOY, 'pending'),
      tarea(MANANA, 'pending'),
      tarea(null, 'pending'),
      tarea(HACE_UN_MES, 'done'),
    ]

    for (const task of casos) {
      assert.equal(
        conDate(task),
        task.isOverdueOn(comoTexto),
        `dueDate=${task.dueDate} status=${task.status}`
      )
    }
  })
})
