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


---

## Prompt 1

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Escribe los tests funcionales del requisito «Cuándo una tarea está vencida» de openspec/specs/tasks/spec.md (el Requirement completo, sus 7 Scenarios). Es un ejercicio de tests primero: los tests se entregan EN ROJO si la implementación no cumple la spec. NO arregles nada.

Alcance y restricciones (obligatorias):
- Crea UN solo archivo: backend/tests/functional/tasks/overdue.spec.ts. No toques nada fuera de backend/tests/ (ni modelo, ni controladores, ni transformers, ni config, ni la spec, ni docs).
- UN test por Scenario (7 tests), con el título del Scenario tal cual aparece en la spec, para que cada test sea trazable a su caso.
- Entra por HTTP, como el cliente real (client.get / client.put / client.patch / client.post). No llames a isOverdueOn ni a ningún método interno, y no asertes sobre el modelo: asierta lo que dice el cuerpo de la respuesta (el campo isOverdue, en booleano estricto: assert.isTrue / assert.isFalse, no truthy/falsy).
- El día de referencia va siempre en la petición (parámetro `today`, formato AAAA-MM-DD) con una constante fija, p. ej. '2026-08-20'. Prohibido usar el reloj: ni DateTime.now(), ni new Date(), ni Date.now(), ni nada que dependa del día en que se corra.
- Sigue el patrón de aislamiento que YA usan los tests de backend/tests/functional/ (mira trash.spec.ts): group.each.setup(() => testUtils.db().withGlobalTransaction()), el helper de persona con login real, cabecera Bearer. No inventes un patrón nuevo.
- No asumas ningún id: la tarea se crea por HTTP (POST /api/v1/tasks) y su id sale de la respuesta de creación.
- Los correos de los usuarios de prueba, siempre @example.com (un hook del proyecto bloquea cualquier otro dominio).
- Prepara el estado por la API: crea la tarea, ponle la fecha con PUT /api/v1/tasks/:id/due-date y cámbiale el estado con PATCH /api/v1/tasks/:id/status cuando el caso lo pida.
- La comprobación del vencimiento debe ser una CONSULTA de la tarea (GET /api/v1/tasks/:id?today=...), separada de la escritura que preparó el estado: no asertes sobre la respuesta de la petición de preparación. La única excepción es el Scenario «Aplazar resuelve el vencimiento», que pide expresamente que sea «en la misma respuesta de ese cambio»: ahí se asierta sobre la respuesta del PUT.
- En el Scenario «Darla por hecha la deja de vencer», comprueba primero que antes del cambio la tarea SÍ llegaba vencida (si no, el test pasaría sin medir nada), después pásala a done, vuelve a consultarla, y comprueba que ya no llega vencida y que su fecha de vencimiento es EXACTAMENTE la misma (mismo valor, sin transformar) que antes del cambio.
- Si algún Scenario no se puede reproducir literalmente por HTTP (por ejemplo «creada hace semanas»), reprodúcelo con lo más cercano que sí se pueda y dilo en tu informe final, sin inventar atajos por el modelo.

Qué NO hacer:
- No modifiques un test para que pase. Si uno falla, déjalo fallar: ese rojo es el entregable.
- No corrijas ni propongas correcciones de la implementación, y no investigues el porqué más allá de lo que te muestre la salida.
- No hagas commit, no hagas push, no crees ramas ni abras PR: quédate en la rama actual (tests-jsg). El commit lo hago yo.

Verificación: cuando termines, ejecuta `make test-e2e` una vez y dame, literal, las líneas finales del resumen (cuántos tests, cuántos pasan, cuántos fallan) y, por cada uno de tus 7 tests, si pasó o falló y el mensaje de la aserción que falló. Termina con un `git status --short` y un `git diff --stat` para que se vea que no hay nada fuera de backend/tests/ (los archivos de backend/.adonisjs/ se regeneran solos al correr los tests: no los toques ni los cuentes).
```

**Qué salió:**
Funcionó a la primera: 7 tests en `backend/tests/functional/tasks/overdue.spec.ts`, uno por Scenario y sin tocar nada fuera de `backend/tests/`. `make test-e2e` dio 44 en verde y 3 en rojo (casos 1, 5 y 7); los 40 que ya había siguen en verde. Los casos 5 y 7 fallan en la comprobación previa («antes del cambio, ¿llegaba vencida?»). «Creada hace semanas» no se puede reproducir por HTTP, y el agente lo sustituyó por una tarea recién creada consultada con un día de referencia muy posterior.

---

## Prompt 2

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Escribe los tests UNITARIOS de la regla de «tarea vencida»: el método isOverdueOn de backend/app/models/task.ts. Es la parte B de un ejercicio de tests primero: los tests se entregan EN ROJO si la implementación no cumple la spec (openspec/specs/tasks/spec.md, Requirement «Cuándo una tarea está vencida»: vencida si y solo si tiene fecha de vencimiento, esa fecha es ANTERIOR al día de referencia, y su estado no es done). NO arregles nada.

Alcance y restricciones (obligatorias):
- Crea el directorio backend/tests/unit/ (hoy no existe) y UN solo archivo dentro: backend/tests/unit/tasks/task_is_overdue.spec.ts. La suite `unit` de backend/adonisrc.ts ya recoge tests/unit/**/*.spec.ts. No toques nada fuera de backend/tests/ (ni el modelo, ni la config, ni adonisrc, ni la spec, ni los tests funcionales ya escritos).
- Sin servidor y sin base de datos: no uses client HTTP, ni Task.create, ni factories que guarden, ni testUtils.db(), ni ninguna llamada que abra una conexión. Construye la tarea en memoria (new Task()) asignándole dueDate y status, sin guardarla, y llama a isOverdueOn(diaDeReferencia). Recuerda que esta suite tiene timeout de 2 s.
- Un test por caso, con título descriptivo en castellano:
  1. Fecha anterior al día de referencia y tarea sin hacer (pending): vencida (true).
  2. Fecha exactamente igual al día de referencia: NO vencida (false).
  3. Fecha posterior al día de referencia: NO vencida (false).
  4. Sin fecha (dueDate null): NO vencida (false).
  5. Tarea ya hecha (status 'done') con la fecha pasada: NO vencida (false).
  6. Caso extra que no sale de la spec: la regla da el MISMO resultado reciba la fecha como texto ('AAAA-MM-DD') o como objeto Date del mismo día de calendario. Usa una fecha anterior al día de referencia y una tarea sin hacer. Comprueba (a) que con el texto el resultado es true y (b) que con el objeto Date el resultado es igual al del texto. Para el objeto Date, constrúyelo con componentes explícitos, p. ej. new Date(2026, 7, 19) (medianoche local de ese día), nunca con nada que dependa del reloj. El campo dueDate está tipado como string | null: para darle un Date usa un cast explícito (as unknown as string) con un comentario de una línea que explique por qué se hace.
- Días de referencia y fechas siempre como constantes fijas (p. ej. referencia '2026-08-20'). Prohibido el reloj: ni Date.now(), ni new Date() sin argumentos, ni DateTime.now().
- Asierta con booleano estricto (assert.isTrue / assert.isFalse).

Qué NO hacer:
- No modifiques un test para que pase. Si uno falla, déjalo fallar: ese rojo es el entregable.
- No corrijas ni propongas correcciones de la implementación, y no investigues el porqué más allá de lo que te muestre la salida.
- No hagas commit, no hagas push, no crees ramas ni abras PR: quédate en la rama actual (tests-jsg). El commit lo hago yo.

Verificación: ejecuta `make test-unit` una vez y dame, literal, las líneas finales del resumen y, por cada uno de tus 6 tests, si pasó o falló y el mensaje de la aserción que falló (para ver los pasados, ejecuta además `cd backend && NODE_ENV=test node ace test unit --reporter=spec`). Dime también en qué zona horaria corrió (la salida de `date +%Z`) y cuántos tests dio entonces `make test` en total. Termina con `git status --short` y `git diff --stat -- . ':!backend/.adonisjs'` para que se vea que lo único nuevo está en backend/tests/.
```

**Qué salió:**
Funcionó a la primera: 6 tests unitarios en `backend/tests/unit/tasks/task_is_overdue.spec.ts`, en memoria (`new Task()`), sin base de datos, sin servidor y sin reloj, y sin tocar nada fuera de `backend/tests/`. `make test-unit` dio 4 en verde y 2 en rojo («hecha con la fecha pasada» y «mismo resultado con texto o con Date»); `make test` en total, 48 en verde y 5 en rojo (los 3 de la parte A y estos 2), con los 40 anteriores intactos.


---

## Prompt 3

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
El caso «hecha con la fecha pasada» pasa como funcional por HTTP y falla como unitario. ¿Por qué las dos capas no coinciden? ¿Qué dice eso del verde del test funcional?
```

**Qué salió:**
La diferencia es que, según el agente (hipótesis que no comprobó en ejecución), pg entrega la columna date como objeto Date y no como texto, de modo que this.dueDate < referenceDay compara un Date con un texto y da false siempre; yo lo comprobé después con una consulta directa a pg (llega como Date y `Date < '2026-08-20'` da false).

