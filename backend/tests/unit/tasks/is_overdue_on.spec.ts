import { createRequire } from 'node:module'
import Task, { type TaskStatus } from '#models/task'
import { test } from '@japa/runner'

/**
 * `Task.isOverdueOn`, invocado directamente: sin servidor y sin ninguna consulta. La
 * regla es el requisito «Cuándo una tarea está vencida» de `openspec/specs/tasks/spec.md`.
 *
 * Los cinco primeros casos usan la fecha como texto `AAAA-MM-DD`, que es el tipo que
 * declara el modelo. El sexto la compara con la representación que tiene de verdad al
 * leerla de PostgreSQL.
 */

// `pg` no trae tipos, y por eso no se importa con `import`. Cargarlo no abre conexión.
const pg = createRequire(import.meta.url)('pg')

/** El parser con el que `pg` convierte una columna `date` al leerla. */
const fechaLeidaDePostgres = pg.types.getTypeParser(pg.types.builtins.DATE) as (
  valor: string
) => unknown

test.group('Task | isOverdueOn', () => {
  const AYER = '2026-08-19'
  const HOY = '2026-08-20'
  const MANANA = '2026-08-21'

  /** Una tarea en memoria; nunca se guarda. */
  function tarea(dueDate: unknown, status: TaskStatus = 'pending') {
    const task = new Task()
    task.status = status
    // Conversión deliberada: el tipo dice `string | null`, pero la base entrega un `Date`.
    task.dueDate = dueDate as string | null
    return task
  }

  test('fecha anterior al día de referencia y sin hacer: vencida', ({ assert }) => {
    assert.strictEqual(tarea(AYER).isOverdueOn(HOY), true)
  })

  test('fecha igual al día de referencia: no vencida', ({ assert }) => {
    assert.strictEqual(tarea(HOY).isOverdueOn(HOY), false)
  })

  test('fecha posterior al día de referencia: no vencida', ({ assert }) => {
    assert.strictEqual(tarea(MANANA).isOverdueOn(HOY), false)
  })

  test('sin fecha: no vencida', ({ assert }) => {
    assert.strictEqual(tarea(null).isOverdueOn(HOY), false)
  })

  test('hecha y con la fecha pasada: no vencida', ({ assert }) => {
    assert.strictEqual(tarea(AYER, 'done').isOverdueOn(HOY), false)
  })

  test('la regla es la misma con la fecha como texto o como objeto de fecha', ({ assert }) => {
    // Si `pg` dejara de entregar un `Date`, este caso compararía texto con texto.
    assert.instanceOf(fechaLeidaDePostgres(AYER), Date)

    // Los tres días y no solo uno: si todo diera `false`, igual y posterior acertarían
    // por casualidad. Y contra el valor esperado, porque dos lecturas pueden coincidir
    // en la respuesta equivocada.
    const esperado = { anterior: true, igual: false, posterior: false }
    const resultados = (representar: (dia: string) => unknown) => ({
      anterior: tarea(representar(AYER)).isOverdueOn(HOY),
      igual: tarea(representar(HOY)).isOverdueOn(HOY),
      posterior: tarea(representar(MANANA)).isOverdueOn(HOY),
    })

    const comoTexto = resultados((dia) => dia)
    const comoFecha = resultados(fechaLeidaDePostgres)

    assert.deepEqual(comoTexto, esperado, 'fecha como texto')
    assert.deepEqual(comoFecha, esperado, 'fecha como objeto Date')
    assert.deepEqual(comoFecha, comoTexto, 'las dos representaciones coinciden')
  })
})
