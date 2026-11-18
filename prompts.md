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

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Tengo que hacer este ejercicio, prepárame el prompt para el siguiente enunciado:
```

**Qué salió:** Envié el prompt sin el enunciado

```
Falta el enunciado: el mensaje termina en "para el siguiente enunciado:" y no llegó nada detrás. Pégalo y te preparo el prompt.

Para que el prompt encaje con el repo, lo montaré siguiendo las reglas del CLAUDE.md:

- Rama: seguir en motor-mtg, porque ya es una rama de trabajo.
- OpenAPI y README: actualizar el OpenAPI y docs/capabilities/<nombre>/README.md en el mismo commit si toca rutas, controladores, validadores o transformers.
- Commit: cerrar cada petición con /commit.
- PR: al terminar la unidad de trabajo, abrir el PR con gh pr create y pasar el adversarial-reviewer. En el chat solo se responde con la URL.

Si el ejercicio es de la sesión 10 (la copia de producción, la incidencia INC-0412 y la papelera, según los últimos commits), dímelo también y lo oriento a eso.
```

---

## Prompt 2

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Pídele a tu agente que migre el proyecto de SQLite a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas. Pásale las mismas restricciones que se usarán en el directo.

El archivo de Compose se llama compose.yaml y define dos servicios, db y db-test.

Usa pgvector/pgvector:pg17, que incluye PostgreSQL 17 con la extensión pgvector.

Usa los puertos 54410 para desarrollo y 54411 para pruebas. Así evitas un conflicto si ya tienes una instancia de PostgreSQL en el 5432.

La base de pruebas va en memoria, sin volumen. Así, los datos de una ejecución no quedan guardados para la siguiente.

Configura una comprobación de salud en ambos servicios. El arranque debe esperar a que las dos bases acepten conexiones. En el primer arranque, PostgreSQL todavía está inicializando la base cuando otros procesos pueden intentar conectarse.

Omite la clave version: de compose.yaml. Está obsoleta y Docker muestra un aviso si la incluyes.

Haz que la batería de pruebas se conecte a la base de pruebas mediante su propio archivo de entorno. El framework lo carga solo en ese entorno.

Añade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar las pruebas.

Conserva intactas las migraciones existentes. Si el agente propone modificar alguna, detente y anótalo como hallazgo.
```

**Qué salió:** Le pegué el enunciado ahora.

```
Aquí tienes el prompt, listo para pegar en el agente. Lo he adaptado a las reglas del `CLAUDE.md`.
```
````markdown
Migra el backend de FlowSync de SQLite a PostgreSQL 17 en Docker, con una base para desarrollo y otra para pruebas.

## Contexto
- Todos los comandos de Node se ejecutan desde `backend/`. El Makefile va en la raíz del repo y entra en `backend/` con `cd`.
- Hoy `config/database.ts` define una única conexión SQLite en `app.tmpPath('db.sqlite3')`, y las suites functional usan el mismo fichero que el servidor de desarrollo. Eso es lo que hay que arreglar.
- Antes de asumir firmas de Lucid 22 o AdonisJS 7, comprueba los `.d.ts` reales en `backend/node_modules/@adonisjs/*/build/`.

## Requisitos

### compose.yaml (raíz del repo)
- Define dos servicios: `db` y `db-test`.
- Imagen `pgvector/pgvector:pg17` en ambos (PostgreSQL 17 con la extensión pgvector).
- Puertos publicados: `54410:5432` para `db` y `54411:5432` para `db-test`. Así no choca con un PostgreSQL local en el 5432.
- `db` usa un volumen con nombre para persistir los datos.
- `db-test` va **en memoria y sin volumen**: usa `tmpfs` en el directorio de datos de Postgres. Los datos de una ejecución no pueden sobrevivir a la siguiente.
- Pon un `healthcheck` en ambos servicios con `pg_isready -U <user> -d <db>`, con `interval`, `timeout`, `retries` y `start_period` razonables. El arranque debe esperar a que las dos bases acepten conexiones: en el primer arranque Postgres sigue inicializando mientras otros procesos ya intentan conectar. Usa `docker compose up -d --wait` o su equivalente.
- **No pongas la clave `version:`**. Está obsoleta y Docker avisa si se incluye.
- Credenciales de desarrollo inventadas y sin valor real (por ejemplo `flowsync` / `flowsync`).

### Backend
- Instala el driver `pg` y cambia la conexión de `config/database.ts` a PostgreSQL, leyendo `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_DATABASE` del entorno.
- Añade las variables nuevas con `node ace env:add`, para que queden en `.env`, `.env.example` y el schema de `start/env.ts`.
- `.env` apunta al puerto 54410.
- `.env.test` apunta a la base de pruebas, puerto 54411, y mantiene `SESSION_DRIVER=memory`. AdonisJS lo carga solo en el entorno de test, así que no hay que tocar la configuración para elegirlo.
- Quita las referencias a SQLite que queden: la ruta `tmp/db.sqlite3`, el paquete `better-sqlite3` si ya no se usa, y lo que corresponda en `.gitignore`.
- Después de migrar, `database/schema.ts` se regenera solo. No lo edites a mano. Commitea el diff de `.adonisjs/` y de `database/schema.ts` si cambian.

### Makefile (raíz)
Atajos con estos nombres u otros equivalentes y claros:
- `db-up`: arranca `db` y `db-test` y espera a que estén sanas.
- `db-down`: detiene ambas.
- `migrate`: ejecuta `node ace migration:run` contra desarrollo y contra pruebas. Para pruebas usa `NODE_ENV=test`, de modo que cargue `.env.test`.
- `test`: lanza `npm test` (`node ace test`) contra la base de pruebas.

## Restricción crítica: migraciones intactas
**No modifiques ninguna migración existente en `backend/database/migrations/`.**
- Si, al migrar a Postgres, alguna migración falla o tú crees que habría que tocarla, **detente**, no la edites y anótalo como hallazgo en `HALLAZGOS.md`.
- El hallazgo debe incluir la migración afectada, el error y el cambio que propondrías. Después avísame.

## Verificación (antes de dar la tarea por hecha)
1. `make db-up` deja ambas bases en estado `healthy`.
2. `make migrate` aplica las migraciones en las dos bases sin errores.
3. `make test` pasa. Hoy solo existen los tests functional de `auth`.
4. Comprueba que la base de pruebas es efímera: reinicia `db-test` y confirma que está vacía.
5. `npm run typecheck` y `npm run lint` pasan en `backend/`.

## Reglas del repo
- Sigue en la rama actual (`motor-mtg`). No crees otra rama.
- Al cerrar la petición, usa `/commit`.
- El hook `datos-que-no-salen.sh` revisa cada commit. Si bloquea, no lo saltes ni reescribas el comando para esquivarlo: sustituye el dato por uno inventado o saca el fichero del índice, y reintenta. Ojo con `.env.test`: puede contar como fichero `.env`. Commitea el registro `docs/seguridad/registro-de-bloqueos.md` con el cambio.
- Si el cambio toca rutas, controladores, validadores o transformers, deja al día el OpenAPI y el README de la capability. En principio esta migración no debería tocarlos.
- Documenta cómo levantar el entorno (`make db-up`, `make migrate`, `make test`) en el `CLAUDE.md`, sustituyendo las referencias a SQLite, y en el README si procede.
````
```
Las restricciones del directo (`compose.yaml`, puertos, tmpfs, healthcheck, sin `version:`, `.env.test`, Makefile y migraciones intactas) están todas recogidas.

Añadí por mi cuenta la verificación de que la base de pruebas es efímera y la actualización del `CLAUDE.md`. Quítalas si no las quieres.
```

---

## Prompt 3

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
¿Para el prompt que has generado que modelo me recomiendas?
```

**Qué salió:** Voy un poco pez con los modelos de Claude, me quedo con la recomendación

```
Te recomiendo **Sonnet 5.5** (`claude-sonnet-5-5`), con un esfuerzo medio.

- **La tarea es mecánica y está muy acotada.** Hay que escribir un `compose.yaml`, cambiar la conexión de Lucid, crear unos `.env` y un Makefile. El prompt ya especifica puertos, imágenes, healthchecks y restricciones, así que no hace falta razonamiento arquitectónico profundo.
- **Es una tarea con muchos pasos pequeños y comprobables.** Levantar Docker, migrar, correr los tests y reiniciar `db-test` para ver que queda vacía. Sonnet cumple bien este tipo de bucle de ejecutar, comprobar y corregir, a menor coste y más rápido.
- **El punto delicado no depende del modelo.** Es la regla de no tocar las migraciones y anotar el hallazgo. Un modelo más potente no la cumple mejor, porque la instrucción ya es explícita. Lo que conviene es vigilar que, si una migración falla en Postgres, el agente pare y no la "arregle".

Subiría a **Opus 5.5** o a esfuerzo alto solo en un caso. Es si las migraciones tienen sintaxis específica de SQLite y el agente tiene que diagnosticar bien por qué fallan y qué cambio propondría en el hallazgo. Aun así, lo normal es empezar con Sonnet y escalar si se atasca.

Fable 5.2 sería excesivo para este ejercicio.
```

---

## Prompt 4

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Migra el backend de FlowSync de SQLite a PostgreSQL 17 en Docker, con una base para desarrollo y otra para pruebas.

## Contexto
- Todos los comandos de Node se ejecutan desde `backend/`. El Makefile va en la raíz del repo y entra en `backend/` con `cd`.
- Hoy `config/database.ts` define una única conexión SQLite en `app.tmpPath('db.sqlite3')`, y las suites functional usan el mismo fichero que el servidor de desarrollo. Eso es lo que hay que arreglar.
- Antes de asumir firmas de Lucid 22 o AdonisJS 7, comprueba los `.d.ts` reales en `backend/node_modules/@adonisjs/*/build/`.

## Requisitos

### compose.yaml (raíz del repo)
- Define dos servicios: `db` y `db-test`.
- Imagen `pgvector/pgvector:pg17` en ambos (PostgreSQL 17 con la extensión pgvector).
- Puertos publicados: `54410:5432` para `db` y `54411:5432` para `db-test`. Así no choca con un PostgreSQL local en el 5432.
- `db` usa un volumen con nombre para persistir los datos.
- `db-test` va **en memoria y sin volumen**: usa `tmpfs` en el directorio de datos de Postgres. Los datos de una ejecución no pueden sobrevivir a la siguiente.
- Pon un `healthcheck` en ambos servicios con `pg_isready -U <user> -d <db>`, con `interval`, `timeout`, `retries` y `start_period` razonables. El arranque debe esperar a que las dos bases acepten conexiones: en el primer arranque Postgres sigue inicializando mientras otros procesos ya intentan conectar. Usa `docker compose up -d --wait` o su equivalente.
- **No pongas la clave `version:`**. Está obsoleta y Docker avisa si se incluye.
- Credenciales de desarrollo inventadas y sin valor real (por ejemplo `flowsync` / `flowsync`).

### Backend
- Instala el driver `pg` y cambia la conexión de `config/database.ts` a PostgreSQL, leyendo `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_DATABASE` del entorno.
- Añade las variables nuevas con `node ace env:add`, para que queden en `.env`, `.env.example` y el schema de `start/env.ts`.
- `.env` apunta al puerto 54410.
- `.env.test` apunta a la base de pruebas, puerto 54411, y mantiene `SESSION_DRIVER=memory`. AdonisJS lo carga solo en el entorno de test, así que no hay que tocar la configuración para elegirlo.
- Quita las referencias a SQLite que queden: la ruta `tmp/db.sqlite3`, el paquete `better-sqlite3` si ya no se usa, y lo que corresponda en `.gitignore`.
- Después de migrar, `database/schema.ts` se regenera solo. No lo edites a mano. Commitea el diff de `.adonisjs/` y de `database/schema.ts` si cambian.

### Makefile (raíz)
Atajos con estos nombres u otros equivalentes y claros:
- `db-up`: arranca `db` y `db-test` y espera a que estén sanas.
- `db-down`: detiene ambas.
- `migrate`: ejecuta `node ace migration:run` contra desarrollo y contra pruebas. Para pruebas usa `NODE_ENV=test`, de modo que cargue `.env.test`.
- `test`: lanza `npm test` (`node ace test`) contra la base de pruebas.

## Restricción crítica: migraciones intactas
**No modifiques ninguna migración existente en `backend/database/migrations/`.**
- Si, al migrar a Postgres, alguna migración falla o tú crees que habría que tocarla, **detente**, no la edites y anótalo como hallazgo en `HALLAZGOS.md`.
- El hallazgo debe incluir la migración afectada, el error y el cambio que propondrías. Después avísame.

## Verificación (antes de dar la tarea por hecha)
1. `make db-up` deja ambas bases en estado `healthy`.
2. `make migrate` aplica las migraciones en las dos bases sin errores.
3. `make test` pasa. Hoy solo existen los tests functional de `auth`.
4. Comprueba que la base de pruebas es efímera: reinicia `db-test` y confirma que está vacía.
5. `npm run typecheck` y `npm run lint` pasan en `backend/`.

## Reglas del repo
- Sigue en la rama actual (`motor-mtg`). No crees otra rama.
- Al cerrar la petición, usa `/commit`.
- El hook `datos-que-no-salen.sh` revisa cada commit. Si bloquea, no lo saltes ni reescribas el comando para esquivarlo: sustituye el dato por uno inventado o saca el fichero del índice, y reintenta. Ojo con `.env.test`: puede contar como fichero `.env`. Commitea el registro `docs/seguridad/registro-de-bloqueos.md` con el cambio.
- Si el cambio toca rutas, controladores, validadores o transformers, deja al día el OpenAPI y el README de la capability. En principio esta migración no debería tocarlos.
- Documenta cómo levantar el entorno (`make db-up`, `make migrate`, `make test`) en el `CLAUDE.md`, sustituyendo las referencias a SQLite, y en el README si procede.
```

**Qué salió:** 

```
La migración de SQLite a PostgreSQL 17 está hecha y commiteada (`190c41b`, en `motor-mtg`). No he abierto el PR ni pasado el `adversarial-reviewer`.

Comprobaciones:
- **Bases:** `make db-up` deja `db` (54410) y `db-test` (54411) en estado `healthy`.
- **Migraciones:** `make migrate` las aplica en las dos bases sin errores. No he modificado ninguna, así que no hay hallazgo que anotar.
- **Tests:** `make test` pasa los 23 tests, contra `db-test`. La base de desarrollo no se toca.
- **`db-test` efímera:** tras reiniciarla queda con 0 tablas.
- **Calidad:** `typecheck` y `lint` pasan.
- **Hook de datos:** no bloqueó el commit, aunque `.env.test` iba incluido.

Lo que cambia respecto a SQLite:
- **`compose.yaml`:** `db` usa volumen y `db-test` usa `tmpfs`. No lleva `version:`.
- **`config/database.ts`:** la conexión es `pg` y lee `DB_*` del entorno. `.env.test` redirige a `db-test`.
- **Dependencias:** se sustituye `better-sqlite3` por `pg`.
- **Makefile:** ya existía y lo adapté. `setup` ahora arranca las bases antes de migrar, y `clean` ya no borra SQLite.
- **Documentación:** actualicé `CLAUDE.md`, `docs/architecture.md`, el README de `tasks` y un comentario de `signup.spec.ts`.

Tres cosas a tener en cuenta:
- `db-test` se vacía al reiniciarla, así que hay que volver a lanzar `make migrate` tras cada arranque.
- Los datos que tenías en `backend/tmp/db.sqlite3` no se han migrado a Postgres. Eso entra en la segunda parte del ejercicio, "averiguar qué se ha perdido".
- `prompts.md` sigue modificado y sin commitear. Lo dejé fuera porque es tuyo y no forma parte del cambio.

Cuando des la unidad de trabajo por terminada, abro el PR y paso el `adversarial-reviewer`.
```

---

## Prompt 5

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
No has cambiado el archivo backend/database/schema.ts:  busca qué fija esos tipos al cambiar de motor
```

**Qué salió:** 

```
`schema.ts` no ha cambiado porque lo fija `database/schema_rules.ts`, y esa regla esconde un fallo real tras el cambio de motor.

**Qué fija los tipos**
- `schema_rules.ts` declara a mano `tasks.status` como `'pending' | 'in_progress' | 'done'` y `tasks.due_date` como `string`. Una regla de columna sustituye al tipo que habría inferido el generador.
- El resto de columnas, `integer`, `varchar` y `timestamp`, se mapean igual en Postgres que en SQLite. Por eso el diff de `schema.ts` sale vacío.
- Esa regla es una promesa sobre lo que devuelve el driver, y el generador no la comprueba. Con SQLite era cierta: `due_date` llegaba como texto. Con Postgres ya no lo es.

**Qué se pierde: `due_date`**
- La columna es `date` en Postgres. El driver `pg` devuelve para ese tipo un `Date` de JavaScript interpretado en la zona horaria del proceso, no un texto.
- Lo comprobé contra `db-test` insertando `'2026-11-18'` y leyéndolo:
  - Con `TZ=UTC` devuelve `2026-11-18T00:00:00.000Z`.
  - Con `TZ=Pacific/Auckland` devuelve `2026-11-17T11:00:00.000Z`, un día antes.
- El modelo y el OpenAPI siguen diciendo `string`, pero en ejecución hay un objeto `Date`.
- En `Task.isOverdueOn` (`app/models/task.ts`), `this.dueDate < referenceDay` compara un `Date` con un texto. Eso da `false` siempre, así que ninguna tarea figuraría como vencida.
- La API devolvería `"2026-11-18T00:00:00.000Z"` en vez de `"2026-11-18"`, y en algunos husos con el día cambiado. Es justo el "día de más" que el comentario de la regla dice evitar.
- `typecheck`, lint y los 23 tests pasan igualmente: la capability `tasks` no tiene tests y los tipos declarados son los de la regla.

**Arreglo propuesto**
Registrar en `config/database.ts` un parser para el tipo `date` de Postgres (OID 1082) que devuelva el texto sin convertir:
```
```ts
import pg from 'pg'
pg.types.setTypeParser(1082, (value) => value)
```
```
Con eso se restaura el comportamiento de SQLite y la regla vuelve a ser cierta. Hay que dejar además un test de `tasks` que lo fije.

No he cambiado nada. ¿Aplico el arreglo con su test? ¿Lo anoto también en `HALLAZGOS.md`?
```

---

## Prompt 6

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
 Busca cómo decide el proyecto si una tarea está vencida
```

**Qué salió:** 

```
El proyecto decide que una tarea está vencida en un único sitio, `Task.isOverdueOn(referenceDay)` (`backend/app/models/task.ts:52`), y hoy esa regla está rota por dos motivos.

## Cómo se decide

- **Una sola definición:** el método se llama desde `TaskDetailTransformer`, que rellena `isOverdue` en `GET /tasks/:id` y en la respuesta de cambiar la fecha. El frontend nunca compara fechas, solo pinta lo que llega.
- **Contrato (`openspec/specs/tasks/spec.md`, líneas 390 a 445):** una tarea está vencida si y solo si:
  1. Tiene fecha.
  2. La fecha es **anterior** (`<` estricto) al día de referencia.
  3. Su estado **no es `done`**.
- **El día de referencia:** lo envía quien mira, en el parámetro `today` (`AAAA-MM-DD`). Es obligatorio y se responde `422` si falta o no es válido. No hay reloj del servidor y la condición no se guarda, se resuelve en cada consulta.
- **Comparación:** se hace como texto contra texto, porque dos fechas ISO así comparadas son una comparación de días del calendario.

## Dónde se rompe

**1. Falta la condición `done`.** Hoy el método solo comprueba las condiciones 1 y 2, y el comentario encima sigue diciendo "tres condiciones".
- Lo quitó `99d1425` (refactor del 18/08 de otra persona del equipo), con el mensaje "que la fecha ya lo dice todo". Eso es falso: una tarea hecha con fecha pasada seguiría saliendo como vencida.
- Incumple los escenarios "Darla por hecha la deja de vencer" y "Una tarea hecha con la fecha pasada". El frontend mostraría "Vencida" en tareas terminadas.
- No hay un solo test de `tasks` que lo detecte.

**2. Con Postgres, la comparación ya no compara días.** Es lo que vimos antes con `due_date`:
- El driver `pg` entrega un `Date` y no un texto, así que `this.dueDate < referenceDay` compara un objeto con una cadena.
- Eso da `false` siempre: **con Postgres ninguna tarea llega nunca como vencida**. Es una regresión directa de la migración.
- Además, `dueDate` sale en la API como `2026-11-18T00:00:00.000Z` y con el día cambiado según la zona horaria.

El primer fallo ya existía en `main`, aunque el segundo lo enmascaraba. Los dos se solapan, porque el segundo hace que el primero deje de notarse.

## Propuesta
1. Restaurar `if (this.status === 'done') return false` en `isOverdueOn`.
2. Registrar el parser de `date` para que `pg` devuelva texto (OID 1082) en `config/database.ts`.
3. Añadir tests functional de `tasks` que cubran los escenarios de la spec de vencimiento, para que ninguno de los dos fallos vuelva a pasar sin ruido.
4. Anotar ambos hallazgos en `HALLAZGOS.md`.

¿Lo aplico todo en esta misma rama, o prefieres que el punto 1, que es independiente de la migración, vaya aparte?
```

---

## Prompt 7

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Cuántas filas cambian de valor con el cambio de esquema, medido con una consulta, y en qué rama del árbol de reversibilidad cae el cambio. Si tu migración no modifica datos, indícalo.
```

**Qué salió:** No sabe que es el árbol de reversibilidad

```
**Mi migración no cambia el valor de ninguna fila: 0.** Ninguna migración existente está tocada y el cambio de motor solo toca configuración, así que no hay `UPDATE`, ni `ALTER` de columnas, ni conversión de datos.

## Qué medí

Medí sobre el dump de producción (`backups/produccion-2026-10-02.dump`), que ya es de Postgres. La SQLite local tiene 0 filas, así que no hay nada que migrar desde ella.

- **Esquema:** el dump tiene las mismas 4 migraciones y las mismas columnas que mi base de desarrollo. No hay diferencia de esquema.
- **Volumen:** hay 14 usuarios y 230 tareas, de las cuales 122 tienen `due_date`.
- **Lo que sí cambia al leer:** esas 122 fechas dejan de ser texto y pasan a `Date` de JavaScript, aunque en la base no cambia ni una (ver el hallazgo anterior sobre el driver `pg`).

## Rama del árbol de reversibilidad

El árbol de reversibilidad no está en el repo. Solo se cita en `README.md` y `HALLAZGOS.md`, y la definición está en una lección que no tengo. Por eso no te doy un nombre de rama inventado.

Lo que puedo afirmar es el hecho. El cambio no toca datos, se deshace por completo con `git revert` de `190c41b` y `make db-down`, y el fichero `db.sqlite3` sigue intacto. Si tu árbol tiene una rama "no toca datos / reversible sin pérdida", es esa. Dime cómo se llaman las ramas y la coloco.

## Dos cifras que no son de mi cambio pero salieron de la consulta

- **22 de las 230 tareas tienen un `status` fuera de los tres válidos.** Son `Hecho` (9), `En curso` (5), `Pendiente` (4), `DONE` (2) y `done` (2), este último probablemente con un espacio o un carácter oculto.
  - La columna es `varchar` sin restricción, así que ningún filtro las muestra.
  - Es el "unas veinte" de INC-0412. Ya existían antes de la migración y no las causa.
  - La regla de `schema_rules.ts` afirma que `status` es uno de tres valores, y estas filas la desmienten.
- **Vencidas según la spec: 56. Con el `isOverdueOn` sin la condición `done`: 120.** En el día de la copia, 2026-10-02, son 64 tareas hechas o con estado raro que figurarían como vencidas. Con Postgres, además, ahora no saldría ninguna.

## Dos cosas que debes saber

- **Datos personales:** el dump los trae y la incidencia pide no restaurarlo en una base a la que llegue nadie más. Lo restauré en una base temporal de `db-test` y ya la borré, pero mientras existió esa base estaba publicada en `0.0.0.0:54411`, accesible desde tu red. Solo lancé consultas agregadas, sin leer títulos ni correos. Conviene publicar los puertos solo en `127.0.0.1` en `compose.yaml`.
- **`HALLAZGOS.md`:** sigue vacío. ¿Escribo las tres líneas con estas mediciones y cambio los puertos a `127.0.0.1`?
```

---

## Prompt 8

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Te paso el árbol de reversibilidad: [Image #3]
```

**Qué salió:**

```
Mi cambio cae en la **rama de la izquierda**: *no puede destruir datos que no estén en otro sitio*, y por tanto **se deshace con otra migración**.

- **Qué hice:** cambié el motor y la configuración, y no toqué ningún dato ni ninguna migración. Con el árbol delante, es todavía más simple que "añadir una columna, un índice o una tabla": ni siquiera añadí nada al esquema.
- **Cómo se deshace:** `git revert 190c41b` más `make db-down`. No hace falta escribir una migración de vuelta, y `db.sqlite3` sigue intacto.
- **Medida:** 0 filas cambian de valor (14 usuarios y 230 tareas del dump de producción, sin tocar).

La línea para `HALLAZGOS.md` sería esta:

> 0 de 230 tareas (y 0 de 14 usuarios) cambian de valor, medido con consulta sobre el dump de producción: la migración no toca datos y cae en la rama «no puede destruir datos», que se deshace con `git revert` y `make db-down`.

**Para el arreglo de los 22 `status`.** Esas filas inválidas (`Hecho`, `En curso`, `Pendiente`, `DONE`, `done` con un carácter extra) sí caerían en las otras ramas del árbol, según qué hagamos:
- **Añadir un `CHECK` sobre `status`:** el motor lo rechazaría porque hay 22 filas que no caben. Es la rama intermedia, "falla en alto": te enteras antes de perder nada.
- **Normalizarlas con un `UPDATE`:** `Hecho` y `DONE` pasan a `done`, y así el valor antiguo se pierde. Es la rama oscura, que **solo se deshace con una copia de seguridad**, porque el original ya no está en la base. Habría que guardar antes una copia de esas 22 filas.

Eso va fuera de este cambio, y se anota como hallazgo.

¿Escribo ahora las tres líneas de `HALLAZGOS.md` y cambio los puertos a `127.0.0.1`?
```

---

## Prompt 9

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.
```

**Qué salió:**

```
Esta es la línea para el punto 2 de `HALLAZGOS.md`:

> La batería no podía ver que `pg` devuelve las columnas `date` como `Date` de JavaScript, y no como el texto que devolvía SQLite. `schema_rules.ts` sigue declarando `due_date: string`, así que `typecheck` y los 23 tests siguen en verde. En ejecución `Task.isOverdueOn` compara un `Date` con un texto y da `false` siempre, de modo que con Postgres ninguna tarea figura como vencida. Lo comprobé leyendo una fecha `2026-11-18` desde `db-test`: con `TZ=UTC` sale `2026-11-18T00:00:00.000Z` y con `TZ=Pacific/Auckland` sale `2026-11-17T11:00:00.000Z`.

Hay dos razones por las que la batería no lo veía:
- Los 23 tests son todos de `auth`, y `tasks` no tiene ninguno.
- El tipo `string` lo pone una regla manual que ningún chequeo verifica contra el driver.

Hay otro hallazgo relacionado que quizá prefieras llevar como duda en el punto 3. `isOverdueOn` no comprueba el estado `done`, lo quitó el commit `99d1425`, y eso infla la cifra de vencidas de 56 a 120 en el dump. Está solapado con el anterior: sin ese fallo del driver, este sí se habría notado.

Dime si escribo las líneas de los tres puntos en `HALLAZGOS.md`. Los puertos a `127.0.0.1` y los dos arreglos propuestos siguen pendientes de tu confirmación.
```

---

## Prompt 10

**Modelo:** Claude Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
¿Qué puedo poner en el punto 3 de HALLAZGOS.md?
```

**Qué salió:**

```
Una línea para el punto 3 (de qué dudaste, o qué no pudiste comprobar):

> No pude comprobar que `Task.isOverdueOn` falle en la aplicación real, solo en el driver. Lo medí con `pg` directamente y no levanté la API para ver `dueDate` en una respuesta ni `isOverdue` en una tarea vencida. Dudo además si el `done` que quitó el commit `99d1425` fue un olvido o una decisión, porque la spec lo exige y el comentario lo describe, pero no hay un test que lo respalde. No pude contrastar las 22 tareas con un `status` inválido con el equipo de operaciones, porque el dump trae datos personales y solo lancé consultas agregadas.

Son tres dudas reales de esta sesión. Si tienes que dejarlo en una sola, la mejor para el directo es la primera, que es lo que no comprobé.

Otras opciones, según lo que quieras llevar:
- **El árbol de reversibilidad:** el repo no lo traía, así que coloqué mi cambio en la rama izquierda a partir de la imagen que me pasaste. Si la rama que contaba era otra, dilo.
- **Los puertos:** `compose.yaml` publica `54410` y `54411` en `0.0.0.0` y no en `127.0.0.1`. No lo he cambiado ni sé si afecta a tu red.

Si quieres, compruebo la primera duda ahora: levanto la API contra `db-test`, creo una tarea con fecha pasada y miro lo que devuelve `GET /tasks/:id`. Así esa duda deja de serlo y pasa a ser un hallazgo medido.
```
