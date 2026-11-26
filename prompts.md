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

Todos se lanzaron en la misma sesión de Claude Code (app de escritorio, Windows, con el repo dentro
de WSL). Los prompts 1 a 3 son de preparación y análisis; el ejercicio en sí empieza en el 4.
Donde pegué el enunciado del curso junto al prompt, se indica entre corchetes en vez de copiarlo
entero.

## Prompt 1

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
[pegado: el enunciado del ejercicio, desde «✍️ Ejercicio FlowSync» hasta el paso 5 «Crea tu rama»]

reliza la configuracion preguntame si algo no es claro
```

**Qué salió:** dejó el entorno listo en WSL (s11/start desde upstream, make setup, 40 tests en verde, make test-unit «NO TESTS EXECUTED», rama tests-rm); preguntó las iniciales y antes de cambiar los ajustes de Docker.

## Prompt 2

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
sale este error

[captura: Docker Desktop «An unexpected error occurred» — initializing Inference manager … dockerInference: El sistema no tiene acceso al archivo]
```

**Qué salió:** apartó las carpetas con sockets huérfanos de Docker y activó la integración WSL para Ubuntu; Docker volvió a arrancar.

## Prompt 3

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
[pegado: el enunciado de la tarea, desde «📋 La tarea» hasta «Qué te llevas según de dónde vengas»]

este es el  ejercicio no resulvas nada primero analizalo y dame indicaciones de como resolverlo
```

**Qué salió:** análisis y guía sin tocar nada; para hacerlo abrió task.ts y el transformer, que el prompt 4 luego pedía no abrir todavía.

## Prompt 4

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Herramienta: Claude Code · Modelo: Claude Opus 5.5

Modo solo lectura: no edites, no crees ni borres ningún archivo, y no hagas commits.

1. Lee el Requirement «Cuándo una tarea está vencida» de openspec/specs/tasks/spec.md
   y cópiame literalmente sus Scenarios, numerados.
2. Abre 2 o 3 archivos de backend/tests/functional/ y explícame:
   - cómo aíslan cada test (transacción global, truncado, factory…), con el fragmento exacto
   - cómo hacen las peticiones HTTP y cómo se autentican, si hace falta
   - cómo recuperan el id de un recurso recién creado
3. Dime qué hace exactamente `make test-e2e` (el target del Makefile y el comando que acaba lanzando).
4. Busca cómo se le pasa a una petición el "día de referencia" para calcular isOverdue
   (query param, cabecera…). Si no existe en ningún sitio, dímelo y no lo inventes.

No abras todavía backend/app/models/task.ts ni el transformer.
```

**Qué salió:** los 7 Scenarios literales, withGlobalTransaction, login + Bearer, id desde body().data.id, `today` en query (GET) y en cuerpo (PUT). Avisó de que ya había visto task.ts en el prompt 3.

## Prompt 5

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Herramienta: Claude Code · Modelo: Claude Opus 5.5

Modo solo lectura: no edites, no crees nada y no hagas commits. No abras
backend/app/models/task.ts ni el transformer de tareas.

Contexto que ya tengo (de una sesión anterior):
- Los tests funcionales aíslan con group.each.setup(() => testUtils.db().withGlobalTransaction()).
- Usuario con User.create, login por POST /api/v1/auth/login y token Bearer.
- El día de referencia es `today` (AAAA-MM-DD): query param en GET /api/v1/tasks/:id
  y campo del cuerpo en PUT /api/v1/tasks/:id/due-date. Si falta, la respuesta es 422.

Mirando SOLO start/routes.ts y app/validators/, respóndeme:
1. ¿POST /api/v1/tasks acepta dueDate en el cuerpo? ¿Y status?
2. ¿Qué ruta cambia el estado de una tarea a `done`? ¿Qué cuerpo espera? ¿Pide `today`?
3. ¿Qué rutas de tareas aceptan `today`? Lista ruta, método y si va en query o en cuerpo.
4. ¿Hay alguna forma de crear por HTTP una tarea con fecha pasada, o el validador lo impide?
Cita archivo:línea en cada respuesta.
```

**Qué salió:** la creación solo acepta title; PATCH /:id/status { status } sin today; fecha pasada solo en dos pasos (POST + PUT /due-date), el validador no lo impide.

## Prompt 6

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Herramienta: Claude Code · Modelo: Claude Opus 5.5

Crea backend/tests/functional/tasks/overdue.spec.ts con 7 tests, uno por Scenario
de «Cuándo una tarea está vencida» (openspec/specs/tasks/spec.md:390), cada uno titulado
con el nombre del Scenario. No añadas Scenarios de otros Requirements.

Forma (igual que tasks/assignee.spec.ts):
- group.each.setup(() => testUtils.db().withGlobalTransaction())
- usuario con User.create, login por POST /api/v1/auth/login, cabecera Bearer
- constantes fijas: const HOY = '2026-03-10', AYER = '2026-03-09', MANANA = '2026-03-11'.
  Nada de Date.now(), new Date() sin argumentos ni DateTime.now().
- se comprueba siempre con assert.strictEqual(res.body().data.isOverdue, true|false)

Helper de preparación (no comprueba isOverdue, solo los status):
  crearTarea(token, dueDate?) →
    POST /api/v1/tasks { title }  → assertStatus(201), id = body().data.id
    si hay dueDate: PUT /api/v1/tasks/:id/due-date { dueDate, today: HOY } → assertStatus(200)
    devuelve id

Lectura: GET /api/v1/tasks/:id con .qs({ today: HOY })

Scenarios:
1. Fecha AYER → GET → true
2. Fecha HOY → GET → false
3. Fecha MANANA → GET → false
4. Sin fecha → GET con today '2030-06-01' (muy posterior a la creación) → false
5. Fecha AYER → GET → true; PATCH /api/v1/tasks/:id/status { status: 'done' } → 200;
   GET → isOverdue false Y dueDate igual a AYER. No compruebes nada en la respuesta del PATCH.
6. Fecha AYER, PATCH a done → GET → false
7. Fecha AYER → GET → true; PUT /due-date { dueDate: MANANA, today: HOY } →
   comprueba isOverdue === false EN LA RESPUESTA DE ESE PUT

Reglas:
- Solo puedes crear o editar archivos dentro de backend/tests/.
- No arregles la implementación aunque los tests fallen: que fallen es el objetivo.
- Si algún paso responde con un status inesperado (422, 404…), no lo rodees usando el modelo:
  PARA y cuéntamelo.

No ejecutes nada todavía. Enséñame el archivo.
```

**Qué salió:** creó overdue.spec.ts con los 7 tests sin ejecutarlo; añadió por su cuenta un assertStatus(200) en el login.

## Prompt 7

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Herramienta: Claude Code · Modelo: Claude Opus 5.5

Antes de ejecutar: dime cómo comprueban dueDate en sus respuestas los tests que ya existen
(archivo:línea) y si el Scenario 5 lo compara en el mismo formato. Si no coincide, ajústalo
a esa forma (solo en overdue.spec.ts) y enséñame el cambio.

Después ejecuta `make test-e2e` y guarda la salida completa (stdout y stderr) en
backend/tests/output/test-e2e-parte-a.txt. No arregles nada aunque falle.

Dame:
1. La línea de resumen literal del runner (tests pasados / fallados / total).
2. Una tabla de los 7 tests nuevos: PASA o FALLA y, si falla, DÓNDE falla:
   (a) en un assertStatus de la preparación, (b) en isOverdue, (c) en dueDate.
   Con el valor esperado y el recibido, copiados de la salida.
3. Cuántos tests que ya existían había y cuántos siguen en verde.
4. git status y git diff --stat.
```

**Qué salió:** el Scenario 5 pasó a comparar dueDate antes/después como trash.spec.ts; «Tests  44 passed, 3 failed (47)»: fallan 1, 5 y 7 en isOverdue (true → false), 5 y 7 en su comprobación previa; los 40 existentes en verde.

## Prompt 8

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Herramienta: Claude Code · Modelo: Claude Opus 5.5

Parte B. Ahora sí puedes leer backend/app/models/task.ts, pero SOLO para responderme esto
antes de escribir nada:
1. La firma exacta de isOverdueOn: qué parámetros recibe y de qué tipo.
2. Cómo está declarada la columna dueDate (decorador, tipo TypeScript) y, por tanto,
   de qué tipo llega dueDate cuando la tarea sale de la base de datos (DateTime de Luxon,
   Date de JS o string).
3. ¿adonisrc.ts declara una suite `unit`? ¿Con qué patrón de archivos?
No me expliques si la regla está bien o mal. Solo los tipos.

Después crea backend/tests/unit/task_is_overdue_on.spec.ts con estos casos,
construyendo la tarea en memoria (sin save, sin base de datos, sin servidor):
1. dueDate anterior al día de referencia, tarea sin hacer → true
2. dueDate igual al día de referencia → false
3. dueDate posterior → false
4. sin dueDate → false
5. status done y dueDate anterior → false
6. caso 1 repetido dos veces: una con dueDate como texto ('2026-03-09') y otra
   con el tipo que devuelve la base de datos según el punto 2. Las dos deben dar true.

Reglas:
- Día de referencia fijo: '2026-03-10' (o el tipo que pida la firma, construido a partir de ese literal).
- Ningún reloj: ni now(), ni new Date() sin argumentos. Si construyes fechas, fija la zona horaria
  (p. ej. DateTime.fromISO('2026-03-09', { zone: 'utc' })) y dime qué zona elegiste y por qué.
- assert.strictEqual con true/false.
- Solo dentro de backend/tests/. Si la suite `unit` no existe en adonisrc.ts, PARA y dímelo:
  no toques la configuración.
- No arregles la implementación.

Ejecuta `cd backend && node ace test unit`, guarda la salida completa en
backend/tests/output/test-unit-parte-b.txt y dame la tabla: caso, PASA/FALLA, esperado → recibido.
```

**Qué salió:** dueDate declarado `string | null` pero pg lo entrega como `Date` (comprobado con una consulta); «Tests  5 passed, 2 failed (7)»: fallan el caso 5 (done → true) y el 6b (Date → false).

## Prompt 9

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Herramienta: Claude Code · Modelo: Claude Opus 5.5

1. Descarta los cambios generados: git checkout -- backend/.adonisjs
2. Busca en backend/tests/functional/tasks/overdue.spec.ts y backend/tests/unit/
   cualquier now(), Date.now(), DateTime.now() o new Date() sin argumentos. Enséñame el resultado.
3. git add backend/tests HALLAZGOS.md prompts.md y enséñame git diff --cached --stat contra s11/start:
   solo pueden aparecer backend/tests/, HALLAZGOS.md y prompts.md.
4. Si todo está bien, commitea en tests-rm con el mensaje
   "test: cubre «Cuándo una tarea está vencida» (rojo)". No hagas push.
```

**Qué salió:** sin reloj; commit 9d24dc4 solo con backend/tests/ porque HALLAZGOS.md y prompts.md seguían siendo la plantilla.

## Prompt 10

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Herramienta: Claude Code · Modelo: Claude Opus 5.5

Añade HALLAZGOS.md y prompts.md y enséñame git diff --cached --stat.
Solo pueden aparecer esos dos archivos. Si es así, commitea en tests-rm con el mensaje
"docs: hallazgos y prompts del ejercicio de vencimiento". No hagas push.
Después enséñame git log --oneline s11/start..HEAD y git diff --stat s11/start.
```

**Qué salió:** no funcionó: los dos archivos no tenían cambios y no había nada que commitear; paró y lo dijo.

## Prompt 11

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
rellena prompts.md tú y dame el borrador de HALLAZGOS
```

**Qué salió:** rellenó este archivo con los prompts literales y dio un borrador de HALLAZGOS.md en el chat para reescribirlo a mano.

## Prompt 12

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
escribe el borrador en HALLAZGOS.md y commitea
```

**Qué salió:** escribió el borrador tal cual en HALLAZGOS.md (sin reescribirlo yo) y lo commiteó junto a este archivo, sin push.
