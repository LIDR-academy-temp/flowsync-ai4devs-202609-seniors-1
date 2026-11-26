import Task from '#models/task'
import type { TaskStatus } from '#models/task'
import { test } from '@japa/runner'

/**
 * Los bordes de `Task.isOverdueOn`, llamada directamente sobre una tarea en
 * memoria: sin servidor y sin base de datos. El día de referencia es fijo.
 */
test.group('Task | isOverdueOn', () => {
  const DIA_DE_REFERENCIA = '2026-09-01'
  const VISPERA = '2026-08-31'
  const DIA_SIGUIENTE = '2026-09-02'

  function tarea(dueDate: string | Date | null, status: TaskStatus = 'pending') {
    const task = new Task()
    task.status = status
    // El tipo generado dice `string`, pero la API devuelve la fecha como un instante:
    // en ejecución la columna puede llegar como `Date`.
    task.dueDate = dueDate as string | null
    return task
  }

  test('fecha anterior al día de referencia y sin hacer: vencida', ({ assert }) => {
    assert.isTrue(tarea(VISPERA).isOverdueOn(DIA_DE_REFERENCIA))
  })

  test('fecha exactamente igual al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea(DIA_DE_REFERENCIA).isOverdueOn(DIA_DE_REFERENCIA))
  })

  test('fecha posterior al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea(DIA_SIGUIENTE).isOverdueOn(DIA_DE_REFERENCIA))
  })

  test('sin fecha: no vencida', ({ assert }) => {
    assert.isFalse(tarea(null).isOverdueOn(DIA_DE_REFERENCIA))
  })

  test('ya hecha y con la fecha pasada: no vencida', ({ assert }) => {
    assert.isFalse(tarea(VISPERA, 'done').isOverdueOn(DIA_DE_REFERENCIA))
  })

  test('da lo mismo con la fecha como texto que como objeto de fecha', ({ assert }) => {
    for (const dia of [VISPERA, DIA_DE_REFERENCIA, DIA_SIGUIENTE]) {
      const comoTexto = tarea(dia).isOverdueOn(DIA_DE_REFERENCIA)
      const comoFecha = tarea(new Date(`${dia}T00:00:00.000Z`)).isOverdueOn(DIA_DE_REFERENCIA)

      assert.equal(comoFecha, comoTexto, `con fecha ${dia}`)
    }
  })
})
