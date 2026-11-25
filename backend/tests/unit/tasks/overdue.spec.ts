import Task, { type TaskStatus } from '#models/task'
import { test } from '@japa/runner'

/**
 * Bordes de la regla `Task.isOverdueOn`, llamada directamente: sin servidor y sin
 * base de datos. El día de referencia y las fechas son fijos.
 *
 * Los cinco primeros casos salen del requisito «Cuándo una tarea está vencida» de
 * `openspec/specs/tasks/spec.md`. El último no lo pide ningún requisito: comprueba
 * que la regla no dependa de la forma en que le llegue la fecha.
 */
test.group('Task | isOverdueOn', () => {
  const DIA_DE_REFERENCIA = '2026-08-20'
  const DIA_ANTERIOR = '2026-08-19'
  const DIA_POSTERIOR = '2026-08-21'

  /** Una tarea en memoria: no se guarda en ningún sitio. */
  function tarea(status: TaskStatus, dueDate: string | null) {
    const task = new Task()
    task.status = status
    task.dueDate = dueDate

    return task
  }

  /**
   * La fecha como objeto, tal y como la entrega el driver de PostgreSQL para una
   * columna `date`: un `Date` a medianoche local. El modelo la declara como
   * `string`, de ahí la conversión de tipo.
   */
  function comoObjeto(dia: string) {
    const [anyo, mes, diaDelMes] = dia.split('-').map(Number)

    return new Date(anyo, mes - 1, diaDelMes) as unknown as string
  }

  test('con fecha anterior y sin hacer, está vencida', ({ assert }) => {
    assert.isTrue(tarea('pending', DIA_ANTERIOR).isOverdueOn(DIA_DE_REFERENCIA), 'pending')
    assert.isTrue(tarea('in_progress', DIA_ANTERIOR).isOverdueOn(DIA_DE_REFERENCIA), 'in_progress')
  })

  test('con fecha igual al día de referencia, no está vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', DIA_DE_REFERENCIA).isOverdueOn(DIA_DE_REFERENCIA))
  })

  test('con fecha posterior, no está vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', DIA_POSTERIOR).isOverdueOn(DIA_DE_REFERENCIA))
  })

  test('sin fecha, no está vencida', ({ assert }) => {
    assert.isFalse(tarea('pending', null).isOverdueOn(DIA_DE_REFERENCIA))
  })

  test('hecha y con la fecha pasada, no está vencida', ({ assert }) => {
    assert.isFalse(tarea('done', DIA_ANTERIOR).isOverdueOn(DIA_DE_REFERENCIA))
  })

  test('responde igual reciba la fecha como texto o como objeto de fecha', ({ assert }) => {
    // Los tres lados del borde: con uno solo en el que se espere `false`, una regla
    // que nunca marcara nada pasaría.
    const casos = [
      { dia: DIA_ANTERIOR, vencida: true },
      { dia: DIA_DE_REFERENCIA, vencida: false },
      { dia: DIA_POSTERIOR, vencida: false },
    ]

    for (const { dia, vencida } of casos) {
      const conTexto = tarea('pending', dia).isOverdueOn(DIA_DE_REFERENCIA)
      const conObjeto = tarea('pending', comoObjeto(dia)).isOverdueOn(DIA_DE_REFERENCIA)

      assert.equal(conTexto, vencida, `${dia} como texto`)
      assert.equal(conObjeto, vencida, `${dia} como objeto de fecha`)
    }
  })
})
