import Task, { type TaskStatus } from '#models/task'
import { test } from '@japa/runner'

/**
 * `Task.isOverdueOn`, la única definición de «vencida» del sistema, probada sola: sin
 * servidor y sin base de datos. La tarea se construye en memoria con `new Task()` y
 * nunca se guarda.
 *
 * La regla (requisito «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`):
 * vencida si y solo si hay fecha, esa fecha es **anterior** al día de referencia y la
 * tarea no está hecha.
 *
 * El último grupo de casos existe por lo que pasa en ejecución: aunque el modelo declara
 * `dueDate` como `string`, el driver `pg` devuelve las columnas `date` como un `Date` de
 * JavaScript. Una tarea leída de la base llega así al método, y el resultado tiene que
 * ser el mismo que con el texto.
 *
 * Estos tests describen la spec, no la implementación actual: si esta no la cumple, el
 * test falla y se queda fallando.
 */
test.group('Task.isOverdueOn', () => {
  // Día de referencia fijo: nada aquí depende del reloj del sistema.
  const HOY = '2026-08-20'

  function tarea(status: TaskStatus, dueDate: string | null): Task {
    const task = new Task()
    task.status = status
    task.dueDate = dueDate
    return task
  }

  /**
   * La misma tarea con la fecha como la entrega `pg`: un `Date` a medianoche local del
   * día guardado. El tipo declarado dice `string`; el cast reproduce lo que el
   * compilador no ve.
   */
  function tareaConDate(status: TaskStatus, dia: string): Task {
    const [anio, mes, d] = dia.split('-').map(Number)
    const task = new Task()
    task.status = status
    task.dueDate = new Date(anio, mes - 1, d) as unknown as string
    return task
  }

  test('1 | fecha anterior al día de referencia y no hecha: vencida', ({ assert }) => {
    assert.isTrue(tarea('pending', '2026-08-19').isOverdueOn(HOY))
    assert.isTrue(tarea('in_progress', '2026-08-19').isOverdueOn(HOY))
  })

  test('2 | fecha igual al día de referencia: todavía no vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', HOY).isOverdueOn(HOY))
  })

  test('3 | fecha posterior al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', '2026-08-21').isOverdueOn(HOY))
  })

  test('4 | sin fecha de vencimiento: no vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', null).isOverdueOn(HOY))
  })

  test('5 | hecha con fecha anterior al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea('done', '2026-08-19').isOverdueOn(HOY))
  })

  test('6a | fecha como string: una fecha anterior se lee como vencida', ({ assert }) => {
    assert.isTrue(tarea('pending', '2026-08-19').isOverdueOn(HOY))
  })

  test('6b | fecha como Date: una fecha anterior se lee como vencida', ({ assert }) => {
    assert.isTrue(tareaConDate('pending', '2026-08-19').isOverdueOn(HOY))
  })

  test('6c | string y Date del mismo día dan el mismo resultado', ({ assert }) => {
    for (const dia of ['2026-08-19', HOY, '2026-08-21']) {
      assert.equal(
        tareaConDate('pending', dia).isOverdueOn(HOY),
        tarea('pending', dia).isOverdueOn(HOY),
        `día ${dia}`
      )
    }
  })
})
