import Task, { type TaskStatus } from '#models/task'
import { test } from '@japa/runner'

/**
 * La regla de «vencida» (`Task#isOverdueOn`) sola, sin servidor y sin base de
 * datos: la tarea se construye en memoria y nunca se guarda.
 *
 * Los bordes salen del requisito «Cuándo una tarea está vencida» de
 * `openspec/specs/tasks/spec.md`. El último grupo no sale de ninguna spec: mira
 * cómo llega de verdad la fecha a la regla, que puede ser texto o un objeto de
 * fecha según quién la haya leído.
 *
 * El día de referencia es siempre un argumento fijo; nada de la fecha de hoy.
 */
test.group('Task | isOverdueOn', () => {
  const HOY = '2026-08-20'
  const AYER = '2026-08-19'
  const MANANA = '2026-08-21'

  function tarea(dueDate: string | null, status: TaskStatus = 'pending') {
    const task = new Task()
    task.dueDate = dueDate
    task.status = status
    return task
  }

  test('fecha anterior al día de referencia y sin hacer: vencida', ({ assert }) => {
    assert.isTrue(tarea(AYER).isOverdueOn(HOY))
  })

  test('fecha igual al día de referencia: todavía no vencida', ({ assert }) => {
    assert.isFalse(tarea(HOY).isOverdueOn(HOY))
  })

  test('fecha posterior al día de referencia: no vencida', ({ assert }) => {
    assert.isFalse(tarea(MANANA).isOverdueOn(HOY))
  })

  test('sin fecha: no vencida', ({ assert }) => {
    assert.isFalse(tarea(null).isOverdueOn(HOY))
  })

  test('hecha con la fecha pasada: no vencida', ({ assert }) => {
    assert.isFalse(tarea(AYER, 'done').isOverdueOn(HOY))
  })

  test('la fecha como objeto da lo mismo que la fecha como texto', ({ assert }) => {
    for (const dia of [AYER, HOY]) {
      const comoTexto = tarea(dia).isOverdueOn(HOY)

      // El tipo generado dice `string | null`, pero lo que entregue la base
      // puede ser un objeto `Date`. El forzado es la única forma de hacer
      // llegar ese objeto a la regla sin tocarla, y es justo lo que se prueba.
      const comoObjeto = tarea(new Date(`${dia}T00:00:00Z`) as unknown as string).isOverdueOn(HOY)

      assert.equal(comoObjeto, comoTexto, `con dueDate ${dia}`)
    }
  })
})
