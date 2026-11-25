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

---

---

---

---

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code v2.1.332 (WSL)

```
Este proyecto (FlowSync) tiene un requisito sin ni un solo test: «Cuándo una tarea está vencida», en
openspec/specs/tasks/spec.md. Quiero cubrirlo empezando por el contrato, y quiero verlo en rojo. Léete
ese Requirement y sus siete Scenarios; para saber cómo se pasa el día de referencia y qué rutas usar, mira
también en la misma spec el Requirement «El día de referencia lo pone quien mira» y los de crear una tarea,
cambiar su estado y poner su fecha. Mira cómo están hechos los tests de backend/tests/functional/
(aislamiento, cliente HTTP). No leas todavía la implementación y dime en pocas líneas qué vas a escribir.

Resultado que espero: un archivo de tests funcionales en backend/tests/functional/ con un test por
Scenario, que entren por HTTP como lo hace el cliente que consume este backend y comprueben lo que sale en
la respuesta, es decir, el campo isOverdue del cuerpo, no lo que devuelva un método interno. El día de
referencia se le pasa a la petición con el parámetro today, como dice la spec: nada de la fecha de hoy ni
de ningún reloj. Usa la misma forma de aislamiento que ya usan los tests de esa carpeta, sin inventar otra,
y no des por hecho ningún identificador: usa el que te devuelva la creación. Los correos de los usuarios de
prueba, en example.com.

Restricción importante: no toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni
el controlador, ni la documentación. Si crees que hace falta cambiar implementación para que algo pase,
para y dímelo; no lo hagas. Tampoco arregles lo que salga en rojo: quiero que se quede en rojo.

Sobre el proceso del proyecto: sigue con los commits por petición, pero no abras ningún PR ni lances el
revisor adversarial; el PR lo abro yo desde mi fork.

Al terminar, córrelo con make test-e2e y enséñame la salida entera, cuántos casos fallan y cuáles. Si
dudas de algo, pregúntame antes de decidir.
```

**Qué salió:** Lo lancé con el texto del borrador de mi guía de preparación, sin reescribirlo. Leyó la spec, los dos tests de tests/functional/tasks/ y frontend/src/lib/api.ts (cómo manda `today` el cliente); no abrió el backend. Propuso backend/tests/functional/tasks/overdue.spec.ts con siete tests, uno por Scenario, y antes de escribir nada me hizo dos preguntas (Scenario 4: tarea «creada hace semanas»; Scenario 5: comprobar con un GET posterior). No escribió ningún archivo todavía.

**Respuesta del agente (literal):**

```
He leído el Requirement y sus siete Scenarios, las secciones de la spec que me indicaste y los dos tests de `tests/functional/tasks/`. También he mirado `frontend/src/lib/api.ts` para saber cómo manda `today` el cliente real. Es el código que consume la API, no la implementación del backend. Del backend todavía no he abierto nada.

**Lo que voy a escribir:** `backend/tests/functional/tasks/overdue.spec.ts`, con un grupo `Tasks | vencimiento` y siete tests, uno por Scenario.

- **Aislamiento:** `group.each.setup(() => testUtils.db().withGlobalTransaction())`, como los otros dos ficheros.
- **Personas:** se crean con `User.create` y después hacen login por HTTP para tener el token, como en `assignee.spec.ts`. Los correos van en `example.com`.
- **Tareas:** todo por HTTP y con el `id` que devuelve `POST /api/v1/tasks`.
  - La fecha se pone con `PUT /api/v1/tasks/:id/due-date`, y `today` va en el cuerpo (`{ dueDate, today }`), como lo envía el cliente.
  - El estado se cambia con `PATCH /api/v1/tasks/:id/status`.
  - Para leer, `GET /api/v1/tasks/:id?today=...`.
- **Qué se comprueba:** siempre `body.data.isOverdue` de la respuesta, con un día de referencia fijo (por ejemplo `2026-08-20`) y fechas relativas a él: el día anterior, el mismo día y el siguiente.
- **Los siete casos:**
  1. Fecha del día anterior: `true`.
  2. Fecha igual al día de referencia: `false`.
  3. Fecha posterior: `false`.
  4. Tarea sin fecha: `false`.
  5. Tarea vencida que pasa a `done`: `false` en el GET siguiente, y su `dueDate` no ha cambiado.
  6. Tarea `done` con la fecha pasada: `false`.
  7. Tarea vencida a la que se aplaza la fecha: `false` en la respuesta del propio `PUT`.

**Dos dudas antes de escribir:**

1. **Scenario 4, «creada hace semanas»:** por HTTP no puedo fechar la creación hacia atrás. Mi propuesta es crearla ahora y consultarla con un `today` fijo y muy posterior (por ejemplo `2030-01-01`), sin leer ningún reloj. La otra opción es tocar `createdAt` directamente en el modelo, pero eso deja de ser entrar por HTTP. ¿Te vale la primera?
2. **Scenario 5:** según el cliente, el `PATCH /status` devuelve la forma de la lista, sin vencimiento. Por eso compruebo «deja de llegar vencida» con un `GET` posterior y no en la respuesta del `PATCH`. ¿Te parece bien así?

Cuando me lo confirmes, escribo el fichero, lo commiteo con `/commit` en la rama `tests-jmm` sin abrir PR, lanzo `make test-e2e` y te enseño la salida entera con los casos que fallen.
```

---

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code v2.1.332 (WSL)

```
acepto y que escriba el fichero
```

**Qué salió:** Respondí a sus dos preguntas aceptando sus dos propuestas. Escribió backend/tests/functional/tasks/overdue.spec.ts (siete tests), invocó por su cuenta la skill /commit del proyecto y commiteó f5be4b5 (hoy 82186db, tras quitarle después la línea de coautoría) solo con ese archivo, y corrió make test-e2e: 47 casos, 44 pasan y 3 fallan (los tres nuevos). No tocó nada fuera de backend/tests/ ni abrió PR.

**Respuesta del agente (literal):**

````
He escrito el fichero, lo he commiteado y he pasado `make test-e2e`. De 47 casos, **fallan 3**, y los tres son de los siete nuevos. Antes de la salida, una cosa importante: el rojo que se ve es menos de lo que parece.

**Commit:** `f5be4b5 test(tasks): un test funcional por scenario de «Cuándo una tarea está vencida»`, en la rama `tests-jmm`. Solo entra `backend/tests/functional/tasks/overdue.spec.ts`. No he abierto PR ni lanzado el revisor. `backend/.env.example` y `prompts.md` ya tenían cambios que no son míos y los he dejado fuera del commit, sin tocar.

### Salida de `make test-e2e`
La copio sin los códigos de color de la terminal y sin la línea de un carácter suelto que queda al quitarlos. Lo demás va tal cual.

```
 Container flowsync-m11-db-test-1 Waiting 
 Container flowsync-m11-db-test-1 Healthy 
 Container flowsync-m11-db-1 Healthy 
🗃️  Migrando la base de desarrollo...
Already up to date
❯ Scanned "pg" database and found 3 tables
❯ Scanned table auth_access_tokens
❯ Scanned table users
❯ Scanned table tasks
❯ Creating schema classes for scanned tables
[ success ] Schema classes generated (101 ms)
🗃️  Migrando la base de pruebas...
Already up to date
❯ Scanned "pg" database and found 3 tables
❯ Scanned table auth_access_tokens
❯ Scanned table tasks
❯ Scanned table users
❯ Creating schema classes for scanned tables
[ success ] Schema classes generated (180 ms)
[ info ] loading hooks...
[ info ] generating indexes...
[ info ] codegen: created 5 file(s)
[ info ] booting application to run tests...
✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✔✖✔✔✔✖✔✖✔✔✔✔✔✔{"level":40,"time":1795635280500,"pid":7762,"hostname":"Trebol-2842","request_id":"ed5a10db-00b0-4607-80f9-fc68e3cfcd94","x-request-id":"ed5a10db-00b0-4607-80f9-fc68e3cfcd94","msg":"Row not found"}
{"level":40,"time":1795635280524,"pid":7762,"hostname":"Trebol-2842","request_id":"f1d3628f-c03c-42bf-ab7d-3fed8edcbb60","x-request-id":"f1d3628f-c03c-42bf-ab7d-3fed8edcbb60","msg":"Row not found"}
{"level":40,"time":1795635280605,"pid":7762,"hostname":"Trebol-2842","request_id":"2c56824c-0694-4b8e-8836-a2f4060d4c71","x-request-id":"2c56824c-0694-4b8e-8836-a2f4060d4c71","msg":"Row not found"}
✔✔{"level":40,"time":1795635281003,"pid":7762,"hostname":"Trebol-2842","request_id":"e717eaa7-1311-4e29-8522-9e05b1f933b8","x-request-id":"e717eaa7-1311-4e29-8522-9e05b1f933b8","msg":"Row not found"}
{"level":40,"time":1795635281018,"pid":7762,"hostname":"Trebol-2842","request_id":"004d7bfe-3b1a-44ab-a138-a4f7dec81314","x-request-id":"004d7bfe-3b1a-44ab-a138-a4f7dec81314","msg":"Row not found"}
{"level":40,"time":1795635281034,"pid":7762,"hostname":"Trebol-2842","request_id":"c412a363-96d4-47b1-9877-5e41398e6abd","x-request-id":"c412a363-96d4-47b1-9877-5e41398e6abd","msg":"Row not found"}
✔{"level":40,"time":1795635281216,"pid":7762,"hostname":"Trebol-2842","request_id":"86661ca2-e998-40ae-a21c-cf40719b66cc","x-request-id":"86661ca2-e998-40ae-a21c-cf40719b66cc","msg":"Row not found"}
{"level":40,"time":1795635281244,"pid":7762,"hostname":"Trebol-2842","request_id":"b402a0c0-4ef4-45e0-9ec3-aeb464c8b3e3","x-request-id":"b402a0c0-4ef4-45e0-9ec3-aeb464c8b3e3","msg":"Row not found"}
{"level":40,"time":1795635281260,"pid":7762,"hostname":"Trebol-2842","request_id":"dc5ae2c7-d626-459a-9fd0-57f6be17f45a","x-request-id":"dc5ae2c7-d626-459a-9fd0-57f6be17f45a","msg":"Row not found"}
✔{"level":40,"time":1795635281489,"pid":7762,"hostname":"Trebol-2842","request_id":"f13e163b-b54f-4084-a757-6d7a2e21f596","x-request-id":"f13e163b-b54f-4084-a757-6d7a2e21f596","msg":"Row not found"}
{"level":40,"time":1795635281509,"pid":7762,"hostname":"Trebol-2842","request_id":"5d673212-f9b2-4018-a029-dfa3b87792a8","x-request-id":"5d673212-f9b2-4018-a029-dfa3b87792a8","msg":"Row not found"}
{"level":40,"time":1795635281527,"pid":7762,"hostname":"Trebol-2842","request_id":"f92101af-47cd-4cfa-b520-f9df7b1680d3","x-request-id":"f92101af-47cd-4cfa-b520-f9df7b1680d3","msg":"Row not found"}
✔✔✔✔✔{"level":40,"time":1795635282391,"pid":7762,"hostname":"Trebol-2842","request_id":"e39d291e-11ea-451c-8a14-f64185d73e12","x-request-id":"e39d291e-11ea-451c-8a14-f64185d73e12","msg":"Row not found"}
✔{"level":40,"time":1795635282523,"pid":7762,"hostname":"Trebol-2842","request_id":"8ff8ea7e-3bea-4517-8370-595e6efe14cd","x-request-id":"8ff8ea7e-3bea-4517-8370-595e6efe14cd","msg":"Row not found"}
✔
 ERRORS 

❯ Tasks | vencimiento / fecha del día anterior: llega vencida

- Expected  - 1
+ Received  + 1

- true
+ false

ℹ AssertionError: expected false to equal true

 ⁃ at Assert.strictEqual (node_modules/@japa/assert/build/index.js:77:19)
 ⁃ at Object.executor (tests/functional/tasks/overdue.spec.ts:86:12)

   81 ┃      const token = await persona(client)
   82 ┃      const id = await tareaConFecha(client, token, AYER)
   83 ┃  
   84 ┃      const tarea = await consultar(client, token, id)
   85 ┃  
 ❯ 86 ┃      assert.strictEqual(tarea.isOverdue, true)
   87 ┃    })
   88 ┃  
   89 ┃    test('vencer hoy todavía no es estar vencida', async ({ client, assert }) => {
   90 ┃      const token = await persona(client)
   91 ┃      const id = await tareaConFecha(client, token, HOY)

 ⁃ at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
 ⁃ at async #wrapTestInTimeout (node_modules/@japa/core/build/index.js:680:4)
 ⁃ at async TestRunner.run (node_modules/@japa/core/build/index.js:710:4)
 ⁃ at async Test$1.exec (node_modules/@japa/core/build/index.js:918:3)
 ⁃ at async GroupRunner.run (node_modules/@japa/core/build/index.js:259:4)
 ⁃ at async Group$1.exec (node_modules/@japa/core/build/index.js:354:3)
 ⁃ at async SuiteRunner.run (node_modules/@japa/core/build/index.js:1100:4)
 ⁃ at async Suite$1.exec (node_modules/@japa/core/build/index.js:1175:3)
[1/3]─

❯ Tasks | vencimiento / darla por hecha la deja de vencer y no le toca la fecha

- Expected  - 1
+ Received  + 1

- true
+ false

ℹ AssertionError: expected false to equal true

 ⁃ at Assert.strictEqual (node_modules/@japa/assert/build/index.js:77:19)
 ⁃ at Object.executor (tests/functional/tasks/overdue.spec.ts:125:12)

   120 ┃    test('darla por hecha la deja de vencer y no le toca la fecha', async ({ client, assert }) => {
   121 ┃      const token = await persona(client)
   122 ┃      const id = await tareaConFecha(client, token, AYER)
   123 ┃  
   124 ┃      const antes = await consultar(client, token, id)
 ❯ 125 ┃      assert.strictEqual(antes.isOverdue, true)
   126 ┃  
   127 ┃      await cambiarEstado(client, token, id, 'done')
   128 ┃  
   129 ┃      const despues = await consultar(client, token, id)
   130 ┃      assert.equal(despues.status, 'done')

 ⁃ at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
 ⁃ at async #wrapTestInTimeout (node_modules/@japa/core/build/index.js:680:4)
 ⁃ at async TestRunner.run (node_modules/@japa/core/build/index.js:710:4)
 ⁃ at async Test$1.exec (node_modules/@japa/core/build/index.js:918:3)
 ⁃ at async GroupRunner.run (node_modules/@japa/core/build/index.js:259:4)
 ⁃ at async Group$1.exec (node_modules/@japa/core/build/index.js:354:3)
 ⁃ at async SuiteRunner.run (node_modules/@japa/core/build/index.js:1100:4)
 ⁃ at async Suite$1.exec (node_modules/@japa/core/build/index.js:1175:3)
[2/3]─

❯ Tasks | vencimiento / aplazar resuelve el vencimiento en la misma respuesta

- Expected  - 1
+ Received  + 1

- true
+ false

ℹ AssertionError: expected false to equal true

 ⁃ at Assert.strictEqual (node_modules/@japa/assert/build/index.js:77:19)
 ⁃ at Object.executor (tests/functional/tasks/overdue.spec.ts:152:12)

   147 ┃    })
   148 ┃  
   149 ┃    test('aplazar resuelve el vencimiento en la misma respuesta', async ({ client, assert }) => {
   150 ┃      const token = await persona(client)
   151 ┃      const id = await tareaConFecha(client, token, AYER)
 ❯ 152 ┃      assert.strictEqual((await consultar(client, token, id)).isOverdue, true)
   153 ┃  
   154 ┃      const response = await ponerFecha(client, token, id, MANANA)
   155 ┃  
   156 ┃      response.assertStatus(200)
   157 ┃      assert.strictEqual(response.body().data.isOverdue, false)

 ⁃ at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
 ⁃ at async #wrapTestInTimeout (node_modules/@japa/core/build/index.js:680:4)
 ⁃ at async TestRunner.run (node_modules/@japa/core/build/index.js:710:4)
 ⁃ at async Group$1.exec (node_modules/@japa/core/build/index.js:354:3)
 ⁃ at async SuiteRunner.run (node_modules/@japa/core/build/index.js:1100:4)
 ⁃ at async Suite$1.exec (node_modules/@japa/core/build/index.js:1175:3)
[3/3]─

 FAILED 

Tests  44 passed, 3 failed (47)
 Time  7s
make: *** [Makefile:124: test-e2e] Error 1
```

### Qué falla y qué significa
Todas las fechas se fijan con `today=2026-08-20`.

| Scenario | Resultado |
|---|---|
| Fecha del día anterior | ✖ con fecha `2026-08-19` llega `isOverdue: false` |
| Vencer hoy todavía no es estar vencida | ✔ |
| Fecha futura | ✔ |
| Sin fecha no se vence nunca | ✔ |
| Darla por hecha la deja de vencer | ✖ |
| Una tarea hecha con la fecha pasada | ✔ |
| Aplazar resuelve el vencimiento | ✖ |

- **Solo el primer caso es un fallo real.** Los otros dos rojos caen en su primera comprobación, que pide que la tarea con fecha de ayer llegue vencida, y no llegan a evaluar lo suyo: dejar de vencer al pasar a `done` y dejar de vencer al aplazar. Cuando el primer caso pase, esos dos podrán seguir en rojo por motivos propios.
- **Los cuatro en verde no prueban gran cosa todavía.** Todos esperan `false`, así que pasarían igual si el backend devolviera siempre `false`. Que sean `false` de verdad o por casualidad no se sabrá hasta que el primer caso se ponga en verde.
- **El campo existe.** Las comprobaciones de `false` son estrictas y han pasado, así que `isOverdue` llega como booleano y no falta en el cuerpo.

No he leído la implementación, así que no sé por qué la tarea vencida llega como `false`. No he cambiado nada para arreglarlo, como pediste. Las líneas `"Row not found"` son avisos de las pruebas de papelera que esperan un 404, no errores.
````

---

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code v2.1.332 (WSL)

```
Los tests funcionales ya están commiteados y en rojo. Ahora quiero bajar la regla, y solo la regla, a
tests unitarios. La regla vive en isOverdueOn, en backend/app/models/task.ts: léela y dime en pocas
líneas qué firma tiene y cómo recibe el día de referencia y la fecha de la tarea, antes de escribir.
Crea backend/tests/unit/ (hoy no existe; la suite unit apunta a tests/unit/**/*.spec.ts) y escribe ahí
sus bordes, sin servidor y sin base de datos: fecha anterior al día de referencia y tarea sin hacer;
fecha exactamente igual al día de referencia; fecha posterior; sin fecha; y tarea ya hecha con la fecha
pasada.

Añade un caso más que no sale de ninguna spec: que la regla se comporte igual si recibe la fecha como
texto o como objeto de fecha. Existe porque hay que preguntarse cómo llega el dato de verdad a la regla,
y eso no lo pide ningún requisito de producto. El día de referencia es un argumento: nada de la fecha de
hoy.

Restricción importante: sigue sin tocar implementación, ni siquiera un arreglo pequeño en isOverdueOn. Si
algún caso no se puede escribir sin cambiarla, dímelo en vez de cambiarla. No abras ningún PR ni lances el
revisor adversarial.

Haz el commit solo del archivo de tests nuevo: prompts.md y backend/.env.example tienen cambios que no
son tuyos, déjalos fuera.

Al terminar, corre make test-unit y enséñame la salida entera: cuántos casos nuevos fallan, cuáles, y
cuáles pasan. Si dudas de algo, pregúntame antes de decidir.
```

**Qué salió:** Lo lancé con el texto del borrador de la parte B de mi guía. Leyó isOverdueOn (backend/app/models/task.ts:74) y antes de escribir me resumió la firma (isOverdueOn(referenceDay: string); la fecha sale de this.dueDate) y dos sorpresas: la regla no mira el estado y un objeto de fecha choca con los tipos. Me preguntó qué lado va como objeto y si aceptaba un `as unknown as string` en el test. No escribió nada todavía.

**Respuesta del agente (literal):**

```
Antes de escribir te resumo qué he visto en `isOverdueOn` (`backend/app/models/task.ts:74`). Hay dos cosas que no esperaba.

**Firma:** `isOverdueOn(referenceDay: string): boolean`. Es un método de instancia de `Task`.
- **Día de referencia:** llega como argumento, tipado como texto `AAAA-MM-DD`.
- **Fecha de la tarea:** no llega por argumento. La lee de `this.dueDate`, que `database/schema.ts` tipa como `string | null` por una regla en `schema_rules.ts`.
- **Cómo decide:** compara texto contra texto (`this.dueDate < referenceDay`) y devuelve `false` si no hay fecha.

Para los tests unitarios basta con `new Task()` y asignarle `dueDate` y `status`, sin guardarla: ni servidor ni base de datos.

**Lo que no esperaba:**
1. **La regla no mira el estado.** No hay ninguna comprobación de `done`, así que el caso «tarea hecha con la fecha pasada» saldrá en rojo. Lo escribo igual y lo dejo en rojo, sin tocar la regla.
2. **Pasarle una fecha como objeto choca con los tipos.** Ni `referenceDay` ni `dueDate` admiten un `Date`. Para ese caso tendría que forzarlo en el test con `as unknown as string`; la implementación no cambia.

**Lo que necesito que decidas:**
- **Qué lado va como objeto.** Mi propuesta es `dueDate`, porque es el dato que viene de la base. El día de referencia llega del parámetro `today`, que siempre es texto. ¿Te vale solo `dueDate`, o quieres también el día de referencia como objeto?
- **El forzado de tipo.** ¿Aceptas ese `as unknown as string` en el test?

Cuando me contestes, escribo `backend/tests/unit/task_overdue.spec.ts`, lanzo `make test-unit` y commiteo solo ese fichero.
```

---

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code v2.1.332 (WSL)

```
Solo dueDate va como objeto de fecha, porque es el dato que viene de la base. El día de referencia sigue
siendo texto, que es como llega en today. Sí, acepto el as unknown as string, pero solo en ese caso y con
un comentario que diga por qué hace falta.

Para ese caso, compara el resultado con el de la misma fecha escrita como texto, en un par de fechas
(una anterior y una igual al día de referencia), con fechas fijas y sin llamar al reloj. Escribe el caso
de la tarea hecha con la fecha pasada tal como lo pide la spec, y déjalo en rojo si falla: no toques
isOverdueOn.

Escribe backend/tests/unit/task_overdue.spec.ts, corre make test-unit, enséñame la salida entera y haz
el commit solo de ese archivo.
```

**Qué salió:** Respondí que solo dueDate va como objeto de fecha y que acepto el forzado, comentado. Escribió backend/tests/unit/task_overdue.spec.ts (6 casos), commiteó 36ac1ce (hoy 8920346, tras quitarle después la línea de coautoría) solo con ese archivo y corrió make test-unit: 4 pasan y 2 fallan (hecha con la fecha pasada; fecha como objeto igual que como texto). No tocó implementación ni abrió PR.

**Respuesta del agente (literal):**

````
He escrito los tests unitarios, los he pasado con `make test-unit` y los he commiteado. De los 6 casos nuevos, **fallan 2 y pasan 4**. No he tocado `isOverdueOn`.

**Commit:** `36ac1ce test(tasks): tests unitarios de los bordes de Task#isOverdueOn`. Solo entra `backend/tests/unit/task_overdue.spec.ts`; `prompts.md` y `backend/.env.example` siguen fuera del commit.

### Salida de `make test-unit`
Sin los códigos de color de la terminal y sin la línea de un carácter suelto que queda al quitarlos. Lo demás va tal cual.

```
🐘 Levantando PostgreSQL (db y db-test)...
 Container flowsync-m11-db-test-1 Running 
 Container flowsync-m11-db-1 Running 
 Container flowsync-m11-db-1 Waiting 
 Container flowsync-m11-db-test-1 Waiting 
 Container flowsync-m11-db-test-1 Healthy 
 Container flowsync-m11-db-1 Healthy 
🗃️  Migrando la base de desarrollo...
Already up to date
❯ Scanned "pg" database and found 3 tables
❯ Scanned table auth_access_tokens
❯ Scanned table tasks
❯ Scanned table users
❯ Creating schema classes for scanned tables
[ success ] Schema classes generated (113 ms)
🗃️  Migrando la base de pruebas...
Already up to date
❯ Scanned "pg" database and found 3 tables
❯ Scanned table auth_access_tokens
❯ Scanned table tasks
❯ Scanned table users
❯ Creating schema classes for scanned tables
[ success ] Schema classes generated (83 ms)
[ info ] loading hooks...
[ info ] generating indexes...
[ info ] codegen: created 5 file(s)
[ info ] booting application to run tests...
✔✔✔✔✖✖
 ERRORS 

❯ Task | isOverdueOn / hecha con la fecha pasada: no vencida

- Expected  - 1
+ Received  + 1

- false
+ true

ℹ AssertionError: expected true to be false

 ⁃ at Assert.isFalse (node_modules/@japa/assert/build/index.js:125:19)
 ⁃ at Object.executor (tests/unit/task_overdue.spec.ts:44:12)

   39 ┃    test('sin fecha: no vencida', ({ assert }) => {
   40 ┃      assert.isFalse(tarea(null).isOverdueOn(HOY))
   41 ┃    })
   42 ┃  
   43 ┃    test('hecha con la fecha pasada: no vencida', ({ assert }) => {
 ❯ 44 ┃      assert.isFalse(tarea(AYER, 'done').isOverdueOn(HOY))
   45 ┃    })
   46 ┃  
   47 ┃    test('la fecha como objeto da lo mismo que la fecha como texto', ({ assert }) => {
   48 ┃      for (const dia of [AYER, HOY]) {
   49 ┃        const comoTexto = tarea(dia).isOverdueOn(HOY)

 ⁃ at #runTest (node_modules/@japa/core/build/index.js:634:121)
 ⁃ at #wrapRegressionTest (node_modules/@japa/core/build/index.js:670:118)
 ⁃ at #wrapTestInTimeout (node_modules/@japa/core/build/index.js:680:102)
 ⁃ at #wrapTestInRetries (node_modules/@japa/core/build/index.js:686:66)
 ⁃ at TestRunner.run (node_modules/@japa/core/build/index.js:710:33)
 ⁃ at async Test$1.exec (node_modules/@japa/core/build/index.js:918:3)
 ⁃ at async GroupRunner.run (node_modules/@japa/core/build/index.js:259:4)
 ⁃ at async Group$1.exec (node_modules/@japa/core/build/index.js:354:3)
[1/2]─

❯ Task | isOverdueOn / la fecha como objeto da lo mismo que la fecha como texto

- Expected  - 1
+ Received  + 1

- true
+ false

ℹ AssertionError: con dueDate 2026-08-19: expected false to equal true

 ⁃ at Assert.equal (node_modules/@japa/assert/build/index.js:69:19)
 ⁃ at Object.executor (tests/unit/task_overdue.spec.ts:56:14)

   50 ┃  
   51 ┃        // El tipo generado dice `string | null`, pero lo que entregue la base
   52 ┃        // puede ser un objeto `Date`. El forzado es la única forma de hacer
   53 ┃        // llegar ese objeto a la regla sin tocarla, y es justo lo que se prueba.
   54 ┃        const comoObjeto = tarea(new Date(`${dia}T00:00:00Z`) as unknown as string).isOverdueOn(HOY)
   55 ┃  
 ❯ 56 ┃        assert.equal(comoObjeto, comoTexto, `con dueDate ${dia}`)
   57 ┃      }
   58 ┃    })
   59 ┃  })
   60 ┃  

 ⁃ at #runTest (node_modules/@japa/core/build/index.js:634:121)
 ⁃ at #wrapRegressionTest (node_modules/@japa/core/build/index.js:670:118)
 ⁃ at #wrapTestInTimeout (node_modules/@japa/core/build/index.js:680:102)
 ⁃ at #wrapTestInRetries (node_modules/@japa/core/build/index.js:686:66)
 ⁃ at TestRunner.run (node_modules/@japa/core/build/index.js:710:33)
 ⁃ at async Test$1.exec (node_modules/@japa/core/build/index.js:918:3)
 ⁃ at async GroupRunner.run (node_modules/@japa/core/build/index.js:259:4)
 ⁃ at async Group$1.exec (node_modules/@japa/core/build/index.js:354:3)
[2/2]─

 FAILED 

Tests  4 passed, 2 failed (6)
 Time  10ms
make: *** [Makefile:121: test-unit] Error 1
```

### Qué pasa y qué falla
Todos los casos usan `HOY = 2026-08-20` como día de referencia.

| Caso | Resultado |
|---|---|
| Fecha anterior y sin hacer: vencida | ✔ |
| Fecha igual al día de referencia: no vencida | ✔ |
| Fecha posterior: no vencida | ✔ |
| Sin fecha: no vencida | ✔ |
| Hecha con la fecha pasada: no vencida | ✖ devuelve `true` |
| Fecha como objeto igual que como texto | ✖ con `2026-08-19`, el objeto da `false` y el texto `true` |

1. **Tarea hecha con la fecha pasada:** es lo que vimos al leerla. La regla no mira el estado, así que una tarea `done` con fecha de ayer sale vencida.
2. **Fecha como objeto:** el bucle se para en la primera fecha. Con `2026-08-19` como texto la tarea sale vencida y como objeto no, así que la fecha igual al día de referencia no llega a compararse.
   - **Por qué:** comparar un objeto fecha con un texto mediante `<` convierte los dos lados en número. `"2026-08-20"` se vuelve `NaN`, y cualquier comparación con `NaN` es falsa, así que con un objeto la regla nunca da vencida.
   - **Sin comprobar:** si la base entrega `due_date` como objeto y no como texto, esto explicaría por qué en los funcionales la tarea de ayer llega con `isOverdue: false`. No lo he mirado.
````
