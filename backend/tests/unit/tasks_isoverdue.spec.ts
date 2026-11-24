import Task, { type TaskStatus } from '#models/task'
import { test } from '@japa/runner'

/**
 * La regla de vencimiento, en unitario. Requisito «Cuándo una tarea está
 * vencida» de `openspec/specs/tasks/spec.md`: una tarea está vencida si, y solo
 * si, tiene fecha, esa fecha es ANTERIOR al día de referencia y su estado no es
 * `done`.
 *
 * Se prueba `Task#isOverdueOn` sobre un modelo en memoria: sin servidor y sin
 * base de datos (la tarea nunca se guarda). El día de referencia se le pasa
 * siempre como argumento y es fijo; ningún test lee el reloj.
 *
 * Cada regla lleva al menos un segundo caso elegido para que una implementación
 * equivocada no pueda pasar los dos a la vez: por ejemplo, comparar solo el día
 * del mes acierta con «19 frente a 20», pero falla con «31 de julio frente a 1
 * de agosto».
 */

/** Una tarea en memoria con la fecha y el estado del caso. No toca la base. */
function tarea(dueDate: string | Date | null, status: TaskStatus = 'pending') {
  const task = new Task()
  task.title = 'Revisar el informe'
  task.status = status
  // El esquema declara `dueDate` como texto, pero el caso «objeto de fecha»
  // necesita poder meter un `Date`: es lo que podría llegar desde otra capa.
  task.dueDate = dueDate as string | null
  return task
}

/**
 * Un `Date` del mismo día del calendario que `dia` (`AAAA-MM-DD`), a medianoche
 * local: es como el driver de PostgreSQL entrega una columna `date`.
 */
function comoFecha(dia: string) {
  const [anio, mes, d] = dia.split('-').map(Number)
  return new Date(anio, mes - 1, d)
}

test.group('Task#isOverdueOn | fecha anterior y tarea sin hacer', () => {
  test('vence: { dueDate } mirada desde { today }, en { status }')
    .with([
      // El día justo anterior.
      { dueDate: '2026-08-19', today: '2026-08-20', status: 'pending' },
      // Mismo borde con el otro estado «sin hacer».
      { dueDate: '2026-08-19', today: '2026-08-20', status: 'in_progress' },
      // Cambio de mes: el día del mes (31) es MAYOR que el de referencia (1).
      { dueDate: '2026-07-31', today: '2026-08-01', status: 'pending' },
      // Cambio de año: mes y día mayores que los de referencia.
      { dueDate: '2025-12-31', today: '2026-01-01', status: 'in_progress' },
    ] as { dueDate: string; today: string; status: TaskStatus }[])
    .run(({ assert }, caso) => {
      assert.isTrue(tarea(caso.dueDate, caso.status).isOverdueOn(caso.today))
    })
})

test.group('Task#isOverdueOn | fecha igual al día de referencia', () => {
  test('no vence: { dueDate } mirada desde el mismo día, en { status }')
    .with([
      { dueDate: '2026-08-20', today: '2026-08-20', status: 'pending' },
      // Otro día y otro estado: el «<» tiene que ser estricto siempre, no solo
      // en una fecha concreta.
      { dueDate: '2026-12-31', today: '2026-12-31', status: 'in_progress' },
    ] as { dueDate: string; today: string; status: TaskStatus }[])
    .run(({ assert }, caso) => {
      assert.isFalse(tarea(caso.dueDate, caso.status).isOverdueOn(caso.today))
    })
})

test.group('Task#isOverdueOn | fecha posterior', () => {
  test('no vence: { dueDate } mirada desde { today }')
    .with([
      // El día justo posterior.
      { dueDate: '2026-08-21', today: '2026-08-20' },
      // Cambio de mes: el día del mes (1) es MENOR que el de referencia (31).
      { dueDate: '2026-09-01', today: '2026-08-31' },
      // Cambio de año: mes y día menores que los de referencia.
      { dueDate: '2027-01-01', today: '2026-12-31' },
    ])
    .run(({ assert }, caso) => {
      assert.isFalse(tarea(caso.dueDate).isOverdueOn(caso.today))
    })
})

test.group('Task#isOverdueOn | sin fecha', () => {
  test('no vence nunca: sin fecha, en { status }, mirada desde { today }')
    .with([
      { today: '2026-08-20', status: 'pending' },
      // Por antigua que sea: mirada desde muy lejos y con el otro estado abierto.
      { today: '2099-12-31', status: 'in_progress' },
    ] as { today: string; status: TaskStatus }[])
    .run(({ assert }, caso) => {
      assert.isFalse(tarea(null, caso.status).isOverdueOn(caso.today))
    })
})

test.group('Task#isOverdueOn | tarea ya hecha con la fecha pasada', () => {
  test('no vence: hecha, con { dueDate } mirada desde { today }')
    .with([
      // El día justo anterior: la misma fecha que SÍ vence sin hacer.
      { dueDate: '2026-08-19', today: '2026-08-20' },
      // Muy pasada.
      { dueDate: '2020-01-01', today: '2026-08-20' },
    ])
    .run(({ assert }, caso) => {
      assert.isFalse(tarea(caso.dueDate, 'done').isOverdueOn(caso.today))
    })

  test('lo que la saca de vencida es el estado, no la fecha', ({ assert }) => {
    // Misma fecha y mismo día de referencia; solo cambia el estado.
    assert.isTrue(tarea('2026-08-19', 'in_progress').isOverdueOn('2026-08-20'))
    assert.isFalse(tarea('2026-08-19', 'done').isOverdueOn('2026-08-20'))
  })
})

/**
 * Fuera de la spec: la regla no debe depender de cómo llegue la fecha. Como
 * texto `AAAA-MM-DD` o como objeto `Date` del mismo día, la respuesta tiene que
 * ser la misma, y la correcta.
 */
test.group('Task#isOverdueOn | fecha como texto o como objeto de fecha', () => {
  test('{ dueDate } desde { today } da { esperado } con texto y con Date')
    .with([
      { dueDate: '2026-08-19', today: '2026-08-20', esperado: true },
      { dueDate: '2026-07-31', today: '2026-08-01', esperado: true },
      { dueDate: '2026-08-20', today: '2026-08-20', esperado: false },
      { dueDate: '2026-08-21', today: '2026-08-20', esperado: false },
    ])
    .run(({ assert }, caso) => {
      const conTexto = tarea(caso.dueDate).isOverdueOn(caso.today)
      const conFecha = tarea(comoFecha(caso.dueDate)).isOverdueOn(caso.today)

      assert.equal(conTexto, caso.esperado, 'con la fecha como texto')
      assert.equal(conFecha, caso.esperado, 'con la fecha como objeto Date')
    })
})
