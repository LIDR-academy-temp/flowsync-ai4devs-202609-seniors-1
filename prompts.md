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

**Modelo:** Fable 5.2 x High
**Herramienta:** Claude Code

```
Read this file: openspec/specs/tasks/spec.md
Find "Requirement: Cuándo una tarea está vencida" and its scenarios
Then create a functional tests file. Tests must entry via HTTP, same as an app that consumes this backend would do. One test per scenario

Five constraints:

1. Touch no line outside `backend/tests`. Not the model, not the transformer neither the controller. 
2. The tests verify what comes out as response, not what an internal method returns. Field is called `isOverdue` and travels in the body.
3. Reference date is passed to the request as param. No today date nor any clock.
4. Stick to the isolation already used in the `backend/tests/functional/` tests without making up a new one.
5. Don't take any identifier for granted: use the one that returns the creation
```

**Qué salió:** Creó `backend/tests/functional/tasks/overdue.spec.ts` con 7 tests (uno por scenario) sin tocar implementación; la primera pasada dio 6 rojos porque añadió por su cuenta comprobaciones del formato de `dueDate` (llega como `2026-09-01T00:00:00.000Z`, que es de otro requisito) y tapaban el `isOverdue`; al quitarlas, `make test-e2e` da 44 en verde y 3 en rojo (47): fallan los tres casos que esperan `isOverdue: true` y pasan los cuatro que esperan `false`, y los 40 que ya había siguen en verde.

## Prompt 2

**Modelo:** Fable 5.2 x High
**Herramienta:** Claude Code

```
The rule lives in `isOverdueOn`, in `backend/app/modes/task.ts`
Create `backend/tests/unit/` and write the borders in there, no server, no data base:

* Date prior to the reference day, with the task not yet completed
* Date exactly the same as the reference day
* Date after the reference day
* No date
* Task already completed, with a past date.


Add one more case that doesn't come from the spec: the rule behaves the same no matter if it gets the date as plain text or as a Date object
```

**Qué salió:** Creó `backend/tests/unit/task_overdue.spec.ts` con 6 tests sobre `isOverdueOn` sin tocar implementación (la ruta del prompt decía `modes`, era `models`); `make test-unit` da 4 en verde y 2 en rojo (6): falla «ya hecha con la fecha pasada» (devuelve `true`) y el caso texto/objeto de fecha (con `Date` la víspera da `false` y con texto `true`), y el caso «fecha anterior sin hacer» pasa aquí aunque su equivalente por HTTP falla.

## Prompt 3

**Modelo:** Fable 5.2 x High
**Herramienta:** Claude Code

```
Create HALLAZGOS.md at the root with the three lines and their answers:

1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla

De los 7 casos nuevos (backend/tests/functional/tasks/overdue.spec.ts) fallaron 3 y pasaron 4. Los 40 que ya había siguieron todos en verde. La cifra de `make test-e2e` fue: "Tests  44 passed, 3 failed (47)", es decir, 40 anteriores + 4 nuevos en verde y 3 nuevos en rojo.

Los tres que fallaron: "Fecha del día anterior", "Darla por hecha la deja de vencer" y "Aplazar resuelve el vencimiento".

2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó. Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.

Pasaron 4 de los 7: "Vencer hoy todavía no es estar vencida", "Fecha futura", "Sin fecha no se vence nunca" y "Una tarea hecha con la fecha pasada".

Los tres que fallaron tienen en común que en algún punto esperan isOverdue: true; los cuatro que pasaron solo esperan false. De ahí deduje que el backend devuelve isOverdue: false siempre, y que esos cuatro pasaron por coincidencia: un campo fijo a false los pondría igual de verdes.

Después lo confirmé sin tocar la implementación. isOverdueOn (backend/app/models/task.ts) compara this.dueDate < referenceDay pensando que son dos textos, pero la columna es de tipo date y el driver de PostgreSQL la entrega como un objeto Date. Con una consulta de solo lectura a la base de pruebas vi que un Date comparado con el texto '2026-09-01' da false, mientras que la misma comparación texto contra texto da true. Por eso nunca sale true.

Hay un segundo fallo tapado por el primero: el método no mira el estado de la tarea, aunque su comentario dice que una tarea hecha no vence. "Una tarea hecha con la fecha pasada" pasa hoy sin que nada compruebe esa regla; sospecho que se pondrá rojo en cuanto se arregle la comparación.

Un test que solo comprueba la ausencia de algo no distingue "la regla funciona" de "la función no hace nada". Los dos casos que primero afirman true y luego false ("Darla por hecha…" y "Aplazar…") son los que de verdad ejercen la regla.

3. De qué dudaste, o qué no pudiste comprobar.

No pude comprobar tres cosas:

1. Que "Una tarea hecha con la fecha pasada" se pondrá rojo cuando se arregle la comparación de fechas. Lo deduzco leyendo isOverdueOn, que no mira el estado, pero confirmarlo exigía cambiar la implementación y eso estaba fuera de los límites del ejercicio.

2. Que las reglas de los cuatro casos verdes funcionen. Como isOverdue sale siempre false, que pasen no demuestra nada: no sé, por ejemplo, si el límite de "vencer hoy todavía no es estar vencida" está bien puesto hasta que el campo pueda devolver true.

3. El scenario de la tarea sin fecha "creada hace semanas". La fecha de creación la pone el servidor y por HTTP no se puede fabricar; el test solo mueve el día de referencia a una fecha muy posterior, que no es exactamente lo mismo.

También me costó ver el segundo fallo: al principio di por bueno que el caso de la tarea hecha pasara "porque está hecha", cuando en realidad pasa porque todo devuelve false. Y la causa de fondo no la dieron los tests, que solo decían "esperaba true, llegó false": hubo que leer el modelo y consultar la base de pruebas.
```

**Qué salió:** Creó `HALLAZGOS.md` en la raíz con las tres respuestas tal cual se le dieron, y avisó de que dos frases no cuadran con lo hecho en la sesión: la «consulta de solo lectura a la base de pruebas» no se lanzó aquí, y lo que la línea 3 da por no comprobado (la tarea hecha con fecha pasada) ya lo deja en rojo el test unitario de la parte B, que el fichero no menciona.
