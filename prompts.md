# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Lee el Requirement «Cuándo una tarea está vencida» de openspec/specs/tasks/spec.md, con todos sus Scenarios, y el Requirement «El día de referencia lo pone quien mira».

Escribe un único archivo de tests funcionales, backend/tests/functional/tasks/overdue.spec.ts, con un test por cada Scenario del primer Requirement. Cada test entra por HTTP, como lo haría el cliente de la interfaz, y comprueba el campo isOverdue del cuerpo de la respuesta.

Restricciones:
- No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador, ni la spec. No arregles nada: si un test falla, se queda en rojo.
- Comprueba lo que sale en la respuesta, no lo que devuelve un método interno.
- El día de referencia se pasa a la petición con el parámetro today, como constante en el propio test. Nada de new Date(), DateTime.now() ni ningún reloj.
- Sigue la forma de aislamiento de backend/tests/functional/tasks/trash.spec.ts (testUtils.db().withGlobalTransaction(), login para sacar nventes otra.
- No des por hecho ningún identificador: usa el que te devuelva la creación o el modelo.

Corre make test-e2e y enséñame la salida entera, sin resumirla.
```

**Qué salió:** Escribió overdue.spec.ts (7 tests, uno por Scenario) y make test-e2e dio 44 pasan / 3 fallan: los tres esperan isOverdue=true para una tarea no hecha con fecha del día anterior y reciben false; no tocó nada fuera de backend/tests/ y resumió/recortó la salida pese a pedir «entera».

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Crea backend/tests/unit/ (hoy no existe) y dentro un archivo task.spec.ts que pruebe directamente Task.isOverdueOn de backend/app/models/task.ts, sin base de datos ni HTTP. Usa el día de referencia '2026-08-20' como constante.

Casos, uno por test:
1. Fecha anterior al día de referencia y tarea sin hacer (pending).
2. Fecha exactamente igual al día de referencia.
3. Fecha posterior.
4. Sin fecha (dueDate null).
5. Tarea ya hecha (status done) con la fecha pasada.
6. La regla se comporta igual reciba dueDate como texto ('2026-08-19') o como objeto Date que represente ese mismo día. Construye el Date sin usar el reloj ni depender de la zona horaria de la máquina.

Restricciones:
- No toques nada fuera de backend/tests/. No arregles la implementación: si un test falla, se queda en rojo.
- Nada de new Date() sin argumentos, DateTime.now() ni ningún reloj.
- Pon un comentario de una línea en cada test con el Scenario de spec.md al que corresponde, o «no sale de la spec» en el 6.

Corre make test-éñame la salida completa, sin resumirla ni recortarla.
```

**Qué salió:** Creó tests/unit/task.spec.ts (6 tests) y corrió make test-unit por el comando cortado del prompt: 4 pasan y 2 fallan (hecha con fecha pasada devuelve true porque isOverdueOn ignora status; Date frente a texto da distinto), sin tocar nada fuera de backend/tests/.
