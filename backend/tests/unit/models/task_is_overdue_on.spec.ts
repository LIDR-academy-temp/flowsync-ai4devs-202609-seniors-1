import Task from '#models/task'
import { test } from '@japa/runner'

/**
 * `Task#isOverdueOn`: si una tarea está vencida vista desde un día de referencia.
 *
 * Unitario puro: la tarea se construye en memoria con `new Task()` y nunca se
 * guarda ni se consulta, así que no toca la API ni la base de datos.
 *
 * La regla de la que salen los casos es la de `openspec/specs/tasks/spec.md`
 * («Cuándo una tarea está vencida»): vencida si, y solo si, tiene fecha, esa
 * fecha es ANTERIOR al día de referencia y su estado no es `done`.
 *
 * Las fechas son literales fijos: ningún caso depende del reloj.
 *
 * Una fecha puede llegar como texto `AAAA-MM-DD` o como objeto `Date`, tanto la
 * de vencimiento como la de referencia. Cada caso se ejecuta con todas las
 * combinaciones, y todas deben dar el mismo resultado.
 */

const HOY = '2026-08-13'
const AYER = '2026-08-12'
const MANANA = '2026-08-14'
const HACE_UN_MES = '2026-07-13'

type Forma = 'texto' | 'Date'

/** El mismo día del calendario, como texto o como `Date` (medianoche UTC). */
function comoForma(dia: string, forma: Forma): any {
  return forma === 'texto' ? dia : new Date(`${dia}T00:00:00.000Z`)
}

function tarea(dueDate: string | null, status: string, forma: Forma): Task {
  const task = new Task()
  task.title = 'Revisar el informe'
  task.status = status
  task.dueDate = dueDate === null ? null : comoForma(dueDate, forma)
  return task
}

const FORMAS: Forma[] = ['texto', 'Date']

/** Todas las combinaciones de forma para (fecha de vencimiento, día de referencia). */
const COMBINACIONES = FORMAS.flatMap((formaVencimiento) =>
  FORMAS.map((formaReferencia) => ({ formaVencimiento, formaReferencia }))
)

const CASOS = [
  {
    nombre: 'fecha anterior al día de referencia y tarea pendiente: vencida',
    dueDate: AYER,
    status: 'pending',
    esperado: true,
  },
  {
    nombre: 'fecha anterior al día de referencia y tarea en curso: vencida',
    dueDate: AYER,
    status: 'in_progress',
    esperado: true,
  },
  {
    nombre: 'fecha exactamente igual al día de referencia: no vencida',
    dueDate: HOY,
    status: 'pending',
    esperado: false,
  },
  {
    nombre: 'fecha posterior al día de referencia: no vencida',
    dueDate: MANANA,
    status: 'pending',
    esperado: false,
  },
  {
    nombre: 'sin fecha: no vencida',
    dueDate: null,
    status: 'pending',
    esperado: false,
  },
  {
    nombre: 'tarea ya hecha con la fecha pasada: no vencida',
    dueDate: HACE_UN_MES,
    status: 'done',
    esperado: false,
  },
]

test.group('Task | isOverdueOn', () => {
  for (const caso of CASOS) {
    test(caso.nombre)
      .with(COMBINACIONES)
      .run(({ assert }, { formaVencimiento, formaReferencia }) => {
        const task = tarea(caso.dueDate, caso.status, formaVencimiento)

        assert.strictEqual(
          task.isOverdueOn(comoForma(HOY, formaReferencia)),
          caso.esperado,
          `vencimiento como ${formaVencimiento}, referencia como ${formaReferencia}`
        )
      })
  }

  test('texto y Date dan la misma respuesta para cada caso', ({ assert }) => {
    for (const caso of CASOS) {
      const respuestas = COMBINACIONES.map(({ formaVencimiento, formaReferencia }) =>
        tarea(caso.dueDate, caso.status, formaVencimiento).isOverdueOn(
          comoForma(HOY, formaReferencia)
        )
      )

      assert.lengthOf(new Set(respuestas), 1, caso.nombre)
    }
  })
})
