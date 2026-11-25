import Task from '#models/task'
import { test } from '@japa/runner'

/**
 * La regla de `Task.isOverdueOn`, llamada directamente: sin servidor y sin base de
 * datos. Los cinco primeros son los bordes del requisito «Cuándo una tarea está
 * vencida» de `openspec/specs/tasks/spec.md`; el último no sale de ningún requisito,
 * sino de cómo llega el dato de verdad (ver su comentario).
 */
const HOY = '2026-08-20'

function tarea(dueDate: unknown, status: 'pending' | 'in_progress' | 'done' = 'pending') {
  const task = new Task()
  task.status = status
  // El tipo declarado es `string | null`; lo que llega en ejecución puede no serlo.
  task.dueDate = dueDate as string | null
  return task
}

test.group('Task.isOverdueOn', () => {
  test('fecha anterior al día de referencia y tarea sin hacer: vencida', ({ assert }) => {
    assert.isTrue(tarea('2026-08-19').isOverdueOn(HOY))
    assert.isTrue(tarea('2026-08-19', 'in_progress').isOverdueOn(HOY))
  })

  test('fecha igual al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea('2026-08-20').isOverdueOn(HOY))
  })

  test('fecha posterior al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea('2026-08-21').isOverdueOn(HOY))
  })

  test('sin fecha: no vencida', ({ assert }) => {
    assert.isFalse(tarea(null).isOverdueOn(HOY))
  })

  test('tarea hecha con la fecha pasada: no vencida', ({ assert }) => {
    assert.isFalse(tarea('2026-08-10', 'done').isOverdueOn(HOY))
  })

  /**
   * No lo pide ningún requisito de producto. `dueDate` está tipado como `string`,
   * pero la columna es de tipo `date` y el driver de PostgreSQL la entrega como
   * `Date` (medianoche UTC), que es lo que sale en la respuesta de la API. La regla
   * tiene que dar lo mismo con las dos representaciones del mismo día.
   */
  for (const [caso, fecha, esperado] of [
    ['anterior', '2026-08-19', true],
    ['igual', '2026-08-20', false],
    ['posterior', '2026-08-21', false],
  ] as const) {
    test(`la fecha ${caso} da lo mismo como texto que como objeto de fecha`, ({ assert }) => {
      const comoTexto = tarea(fecha).isOverdueOn(HOY)
      const comoObjeto = tarea(new Date(`${fecha}T00:00:00.000Z`)).isOverdueOn(HOY)

      assert.equal(comoTexto, esperado)
      assert.equal(comoObjeto, comoTexto)
    })
  }
})
