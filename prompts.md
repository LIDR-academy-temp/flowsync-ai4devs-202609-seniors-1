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
- `Modelo`, `Tiempo` (de ejecución, a la derecha del modelo) y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5 · **Tiempo:** ~1 min
**Herramienta:** Claude Code

```
analiza la estructura el fichero prompts.md ya que vamos a guardar en ese fichero los prompts que generemos añadiendo a las mismas el tiempo de ejecucion a la derecha donde ahora aparece el modelo. Incluye este prompt como el primero
```

**Qué salió:** funcionó y añade los nuevos prompts respetando la estructura del fichero.


## Prompt 2

**Modelo:** Opus 5.5 · **Tiempo:** ~4 min
**Herramienta:** Claude Code

```
1. Toma el contexo de este proyecto. Lee el Requirement entero y sus Scenarios.
   Analiza la documentacion en @docs\adr y @docs\prd.
2. Escribe un archivo de tests funcionales entrando por HTTP.
Restricciones:
- No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador. Si alguna linea es tocada, descartamos el test y lo notificamos
- Los tests deben comprobar lo que sale en la respuesta y no lo que devuelve un método interno. El campo se llama isOverdue y viaja en el cuerpo.
- El día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj.
- Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otra.
- No des por hecho ningún identificador: usa el que te devuelva la creación.
```

**Qué salió:** creó `backend/tests/functional/tasks/overdue.spec.ts`, 7 tests (uno por Scenario de «Cuándo una tarea está vencida»); sin ejecutar.  
Tests:
1. Fecha del día anterior: isOverdue sale true.
2. Vence el mismo día de referencia: false.
3. Fecha futura: false.
4. Sin fecha, creada hace semanas y pendiente: false, y dueDate nulo.
5. Vencida que pasa a done: primero se comprueba que está vencida; después sale false y la dueDate es la misma.
6. done con la fecha pasada: false.
7. Aplazar: isOverdue sale false ya en la respuesta del propio PUT.

Cómo cumple las restricciones:
- Solo backend/tests/: es el único fichero que he tocado. Los cambios de git status fuera de tests (.adonisjs/ y copia-produccion.sh) ya estaban al empezar la sesión.
- Respuesta HTTP: cada test comprueba isOverdue en el cuerpo. La tarea se crea con POST, la fecha se pone con PUT /due-date, el estado se cambia con PATCH /status y se lee con GET /tasks/:id.
- Día de referencia: es fijo (2026-08-20) y va como today en la petición: en la query del GET y en el body del PUT. Ningún test usa la fecha de hoy ni un reloj.
- Aislamiento: testUtils.db().withGlobalTransaction(), igual que trash.spec.ts y assignee.spec.ts.
- Identificadores: todos salen de la respuesta de la creación.

Ojo con el test 4: la API no deja fijar la fecha de creación. Para que la tarea sea «de hace semanas», el test cambia createdAt directamente en la base (sigue dentro de tests/). El isOverdue se sigue leyendo por HTTP. Si prefieres no tocar la base desde el test, se puede quitar ese paso: la regla no mira createdAt.

## Prompt 3

**Modelo:** Opus 5.5 · **Tiempo:** ~5 min
**Herramienta:** Claude Code

```
La regla vive en isOverdueOn, en backend/app/models/task.ts. 
Crea backend/tests/unit/, que hoy no existe, y escribe ahí sus bordes, sin servidor y sin base de datos:
- Fecha anterior al día de referencia, y la tarea sin hacer.
- Fecha exactamente igual al día de referencia.
- Fecha posterior.
- Sin fecha.
- Tarea ya hecha, con la fecha pasada.
Analiza y mira los diferentes casos y añade uno más en el que la regla se comporte igual venga la fecha como texto o como objeto de fecha.
No toques nada de implementación, en caso de detectar un cambio en la implementación, detente y notificalo.
```

**Qué salió:** creó `backend/tests/unit/task_is_overdue_on.spec.ts`, 6 tests; 4 verdes, 2 rojos que destapan fallos de `isOverdueOn` (no mira `done`; con `Date` nunca vence).
La suite unit falla: 4 tests pasan y 2 fallan. Los dos fallos son de la implementación de isOverdueOn, no del test. No he tocado app/; git status no muestra cambios de implementación.

Lo ejecuté con node ace test unit y Node 24 por nvm, porque el Node 22 del sistema no arranca ace.

Los 4 que pasan:
- Fecha anterior al día de referencia, tarea sin hacer: vencida.
- Fecha igual al día de referencia: no vencida.
- Fecha posterior: no vencida.
- Sin fecha: no vencida.

Los 2 que fallan:
1. Tarea hecha con la fecha pasada sale vencida. isOverdueOn no comprueba que el estado no sea done, y la spec exige tres condiciones a la vez.
   - Línea task_is_overdue_on.spec.ts:43: expected true to be false.
   - Probablemente también fallen los tests 5 y 6 de overdue.spec.ts (los de una tarea hecha). No lo he comprobado.
2. Con la fecha como objeto Date, la tarea nunca sale vencida. El método compara la fecha con el texto del día de referencia usando <. Un Date comparado así con un texto siempre da false.
   - Línea :66: dueDate 2026-08-19 (pending) frente a 2026-08-20: expected false to equal true.
   - Importa fuera del test: el esquema declara dueDate como texto, pero el driver de PostgreSQL devuelve las columnas date como Date si no se le configura otra cosa, y en el código no hay nada que lo haga. Si es así, las tareas leídas de la base nunca saldrían vencidas. No lo he comprobado contra la base.