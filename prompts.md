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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Antes de una migración de SQLite a PostgreSQL necesito resolver unas dudas sobre este proyecto. **No modifiques nada:** no crees, edites ni borres archivos, no instales dependencias y no ejecutes migraciones ni comandos que escriban en la base. Puedes leer archivos y usar `git` en modo consulta (`git log`, `git ls-files`, `git check-ignore`…).

Responde a cada pregunta con:
- la respuesta corta;
- la evidencia: rutas de archivo y líneas, o la salida del comando que hayas usado;
- tu grado de certeza: confirmado / probable / no encontrado.

Si algo no está en el repositorio, dilo y no lo supongas.

### 1. Credenciales y nombres de las bases
- ¿Hay en algún sitio (README, docs, `.env.example`, comentarios, scripts, CI) valores previstos para el usuario, la contraseña y los nombres de las bases de PostgreSQL?
- ¿Qué variables de base de datos se definen hoy en `backend/.env`, `backend/.env.example` y `backend/start/env.ts`? Lista los nombres y si son obligatorias u opcionales. No me muestres valores secretos.
- ¿Hay alguna convención de nombres en el proyecto (nombre del paquete, del repo, de la app en `APP_NAME`) que encaje como nombre de base?

### 2. pgvector
- ¿Hay alguna referencia a vectores, embeddings, búsqueda semántica o similitud en el código, las migraciones, los modelos, las dependencias o la documentación? Busca, entre otros, `vector`, `embedding`, `pgvector`, `similarity`, `openai`, `cosine`.
- ¿Hay algún indicio (README, TODO, issues, ramas, `git log`) de que se vaya a usar pgvector pronto?
- Con eso, ¿hace falta activar la extensión ya o basta con que la imagen la incluya?

### 3. Datos actuales en SQLite
- ¿Dónde está el archivo de SQLite que usa el proyecto (ruta configurada en `config/database.ts`)? ¿Existe? ¿Qué tamaño tiene?
- ¿Cuántas filas hay en cada tabla? Consúltalo en solo lectura (por ejemplo, `sqlite3 -readonly`). Si no puedes, dime por qué.
- ¿Hay seeders o factories en `backend/database/` que permitan regenerar los datos desde cero?
- ¿El archivo de SQLite está en git o en `.gitignore`?

### 4. Archivos de entorno y git
- ¿Qué archivos `.env*` hay en `backend/` y en la raíz, y cuáles están versionados (`git ls-files`)?
- ¿Qué dicen los `.gitignore` sobre `.env`, `.env.test` y `.env.*`? Comprueba con `git check-ignore -v backend/.env.test` si se ignoraría.
- ¿Algún `.env*` versionado contiene secretos reales (claves, tokens, `APP_KEY`)? Dime solo qué archivo y qué variable, sin el valor.

### 5. Pruebas
- ¿Cómo prepara hoy la base la batería de pruebas? Revisa `backend/tests/bootstrap.ts` y la configuración de Japa: si migra al empezar, si trunca, si usa transacciones globales o si usa SQLite en memoria.
- ¿Algún test, migración o consulta usa algo propio de SQLite (`sqlite_master`, `PRAGMA`, `AUTOINCREMENT`, booleanos como 0/1, fechas como texto, `json_extract`…) que pueda fallar en PostgreSQL? Lista los casos con su ruta.

### 6. Entorno local
- ¿Existe un `Makefile` en la raíz o en `backend/`? Si existe, ¿qué objetivos tiene?
- ¿Qué devuelven `docker --version` y `docker compose version`?
- ¿Hay algo escuchando ya en los puertos 54410 o 54411?

### Resumen final
Termina con una tabla de cuatro columnas: punto, respuesta, certeza y decisión que propones. Añade aparte las preguntas que solo pueda responder yo.
```

**Qué salió:** funcionó a la primera sin tocar nada, aunque el agente leyó el dump de producción (filas por tabla y dominio de correo) antes de ver el aviso de INC-0412 de no abrirlo y lo confesó. Hallazgos: no hay credenciales previstas en el repo (solo la pista `flowsync` del dump), pgvector solo aparece en el README, SQLite tiene 0 filas de negocio y no hay seeders, `backend/.env.test` está versionado y ningún `.gitignore` ni el hook lo cubren, los tests usan transacción global sin migrar, `isOverdueOn` comparará `Date` con string en PG (probable, sin comprobar), y 54410/54411 están libres con el 5432 ocupado por otro contenedor.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
## Contexto
FlowSync es un monorepo en TypeScript 6:
- `backend/`: AdonisJS 7 (`@adonisjs/core` ^7.3.3), Lucid 22 (ahora sobre SQLite con `better-sqlite3`), VineJS 4 y @adonisjs/auth 10 con access tokens. API en `http://localhost:3333`.
- `frontend/`: React 19 + Vite 8. **Fuera del alcance de esta tarea:** no lo toques.

Las versiones son muy recientes y varias APIs han cambiado, sobre todo en AdonisJS 7 y Lucid 22. No te fíes de lo que recuerdes ni de ejemplos de AdonisJS 5/6: comprueba las firmas en los `.d.ts` de `node_modules` antes de escribir configuración.

## Objetivo
Migra el backend de SQLite a PostgreSQL en Docker, con una base para desarrollo y otra para pruebas.

## Prohibiciones (no negociables)
1. **No toques las migraciones** de `backend/database/migrations/` (4 ficheros): no las edites, renombres, borres ni reordenes, y no crees otras nuevas. Si alguna falla en PostgreSQL o crees que hay que cambiarla, **detente**, no la toques y explícame qué migración es, qué falla y por qué.
2. **No abras, leas, restaures ni copies `backups/produccion-2026-10-02.dump`** ni ningún otro fichero de `backups/`, ni siquiera con `pg_restore -l`. Lo prohíbe `docs/incidencias/INC-0412-tareas-que-no-salen.md:20`. Todos los datos que necesites para comprobar algo son inventados.
3. No toques `frontend/` ni el contenedor Postgres de otro proyecto que está en el 5432.
4. No corrijas el código de la aplicación (modelos, controladores, validadores) aunque veas un fallo. Repórtalo como hallazgo.

## Estado actual (ya verificado, no hace falta volver a investigarlo)
- `config/database.ts` usa `client: 'better-sqlite3'` y `useNullAsDefault`, con el fichero en `tmp/db.sqlite3`. Hay una plantilla comentada (líneas 55-69) con `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_DATABASE`.
- `start/env.ts` no declara ninguna variable de base de datos.
- `backend/.env.test` está versionado y solo contiene `SESSION_DRIVER`.
- No hay datos en SQLite que conservar, ni seeders ni factories.
- Los tests usan `testUtils.db().withGlobalTransaction()` por grupo, y `tests/bootstrap.ts` no migra. Es decir, alguien tiene que migrar la base de pruebas antes de lanzar la suite.
- En la raíz ya hay un `Makefile` con estos objetivos: `help` (el de por defecto), `setup` (= `install` + `env` + `migrate`), `install`, `env`, `migrate`, `start` y `clean`. `clean` borra `backend/tmp/db.sqlite3*`.
- Los puertos 54410 y 54411 están libres; el 5432 está ocupado por otro proyecto.

## Antes de cambiar nada
Preséntame un plan breve: los archivos que vas a crear o modificar y cómo quedarán los objetivos del Makefile. Revisa también `.github/workflows/`: si algún workflow arranca la app, al volverse obligatorias las variables `DB_*` puede romperse. Dime cuál y qué propones, sin cambiarlo todavía. Espera mi visto bueno.

## Requisitos

### `compose.yaml` (en la raíz)
- Dos servicios, `db` y `db-test`, los dos con la imagen `pgvector/pgvector:pg17`. Sin la clave `version:`.
- Puertos publicados solo en localhost: `127.0.0.1:54410:5432` para `db` y `127.0.0.1:54411:5432` para `db-test`.
- `db`: usuario `flowsync`, contraseña `flowsync`, base `flowsync`, y los datos en un volumen con nombre.
- `db-test`: usuario `flowsync`, contraseña `flowsync`, base `flowsync_test`. Sin volumen: el directorio de datos de PostgreSQL va en `tmpfs`, para que ninguna ejecución herede datos de la anterior.
- Healthcheck en los dos servicios con `pg_isready -U <usuario> -d <base>` (usa `$$` si interpolas variables del contenedor). Ponle un `start_period` razonable, porque en el primer arranque PostgreSQL tarda en inicializar la base.
- No actives la extensión pgvector (nada de `CREATE EXTENSION`): basta con que venga en la imagen.

Estas credenciales son de juguete, solo para local, y los puertos solo escuchan en 127.0.0.1. Por eso pueden ir versionadas en `compose.yaml`.

### Backend
- `config/database.ts`: conexión PostgreSQL (`client: 'pg'`) como conexión por defecto, leyendo las variables `DB_*`. Quita la conexión SQLite y `useNullAsDefault`.
- `start/env.ts`: declara `DB_HOST`, `DB_PORT` (número), `DB_USER`, `DB_PASSWORD` y `DB_DATABASE`, siguiendo el estilo de las variables que ya hay.
- `backend/.env.example`: añade las cinco variables con los valores de desarrollo (`127.0.0.1`, `54410`, `flowsync`, `flowsync`, `flowsync`). Haz lo mismo en mi `backend/.env` local, que no está versionado.
- `backend/.env.test`: añade solo lo que cambia respecto a `.env`, es decir, `DB_PORT=54411` y `DB_DATABASE=flowsync_test`. No pongas ahí ninguna contraseña. Conserva `SESSION_DRIVER`.
- Dependencias: instala `pg`. Propón en el plan quitar `better-sqlite3` si nada más lo usa.

### Makefile (amplía el existente sin romperlo)
- `db-up`: `docker compose up -d --wait`, para que espere a que las dos bases estén sanas.
- `db-down`: `docker compose down`, sin `-v`, para conservar el volumen de desarrollo.
- `migrate`: pasa a migrar las dos bases. Desde `backend/`, ejecuta `node ace migration:run` y después `NODE_ENV=test node ace migration:run`. Que dependa de `db-up`, y comprueba que `setup` sigue funcionando.
- `test`: depende de `db-up`, migra `db-test` (es idempotente y la base vive en memoria) y lanza `node ace test` desde `backend/`.
- Añade los objetivos nuevos a `help`.
- `clean`: ya no tiene sentido que borre el fichero SQLite. Propón en el plan qué hacer con él, pero no le añadas `docker compose down -v` sin preguntarme.

## Riesgo conocido: `due_date`
`tasks.due_date` es de tipo `date`. Con SQLite llegaba como texto, pero el driver `pg` lo devuelve como `Date` de JS. `app/models/task.ts:45-55` compara `this.dueDate < referenceDay` contando con que los dos son texto (lo dice un comentario), y `database/schema_rules.ts:27-33` fuerza el tipo `string`, así que `typecheck` no lo detectaría. Si es así, `isOverdue` devolvería siempre `false` sin dar ningún error.

Cuando la migración esté hecha, compruébalo con datos inventados:
1. Crea en `db` un usuario y una tarea con `due_date` en el pasado, mediante la API o con `node ace repl`.
2. Mira qué devuelve `isOverdue`.
3. Borra esos datos.

No corrijas el modelo, ni las reglas, ni la migración: anota el resultado como hallazgo en `HALLAZGOS.md`, en la raíz. Créalo si no existe.

## Verificación
Ejecuta y enséñame la salida de:
1. `make db-up`, y `docker compose ps` con los dos servicios como `healthy`.
2. `make migrate`, aplicado sin errores en las dos bases.
3. `make test`, con la suite completa en verde. Si algo falla, analízalo antes de cambiar nada.
4. Una prueba de que los tests usan el 54411 y no el 54410. Por ejemplo, ejecuta `make test` con `db` parada y comprueba que pasa igual.
5. `make db-down` y `make db-up`, y comprueba que `db` conserva su tabla `adonis_schema` y que `db-test` vuelve vacía.
6. La comprobación de `due_date` descrita arriba.
7. `git status`: ninguna migración, nada de `backups/` y nada de `frontend/` deben aparecer como modificados.

## Entrega
Un resumen corto con:
- los archivos creados o modificados;
- los objetivos del Makefile;
- los hallazgos (`due_date` y cualquier otro);
- lo que haya quedado pendiente de decidir, como el workflow de CI, `clean` y `better-sqlite3`.
```

**Qué salió:** se paró en el plan como pedía, sin tocar nada, y verificó en `node_modules` que Lucid 22 acepta `client: 'pg'` y `schemaGeneration`, y que `.env.test` tiene prioridad sobre `.env`. Detectó que `.github/workflows/openapi.yml` se rompería con `DB_*` obligatorias (propone variables de mentira en su `env:`) y que la verificación 4 no prueba nada si `test` depende de `db-up`, porque eso vuelve a levantar `db` (propone un `db-test-up`). Dejó abiertas cinco decisiones: ese `db-test-up`, `clean`, quitar `better-sqlite3`, dónde va el hallazgo en `HALLAZGOS.md` y la documentación que sigue hablando de SQLite.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Visto bueno al plan, incluido el cambio en `.github/workflows/openapi.yml`. Limítate a la migración: lo que se compruebe después lo haré yo aparte. Mis respuestas:

1. **Opción (a).** Crea `db-test-up` (`docker compose up -d --wait db-test`) y haz que `test` dependa de él. `db-up` sigue levantando las dos bases y `migrate` sigue dependiendo de `db-up`. Para la verificación 4: `docker compose stop db`, después `make test`, y enséñame `docker compose ps` para ver que `db` sigue parada.

2. **`clean`:** de acuerdo. Quita la línea de `db.sqlite3*`, no añadas nada de Docker y deja el fichero donde está.

3. **`better-sqlite3`:** sí, desinstálalo. Antes, comprueba que nada más en `backend/` lo use.

4. **`HALLAZGOS.md`: no lo toques.** Tampoco hagas la comprobación de `due_date` (el paso 6 de la verificación ni la sección «Riesgo conocido»). Eso lo haré yo después.

5. **Documentación: no la actualices.** Ni `CLAUDE.md`, ni `docs/`, ni el comentario de `signup.spec.ts`. Basta con que la dejes listada como pendiente en el resumen final.

Más indicaciones:
- **No toques `backend/database/schema_rules.ts` y no edites a mano `backend/database/schema.ts`.** Si `schema.ts` se regenera solo al migrar, deja el resultado tal cual y no lo «arregles». En el resumen, dime solo si cambió o no.
- **No hagas commit.** Antes de empezar, dime en qué rama estás (`git branch --show-current`) y deja todos los cambios sin commitear.
- Al terminar, enséñame `git diff --stat` y `git diff --exit-code -- backend/database/migrations/`; este último tiene que salir sin diferencias.
- Siguen en pie las prohibiciones: nada de `backups/`, nada de `frontend/` y ninguna migración modificada.

Adelante.
```

**Qué salió:** migración hecha a la primera y sin commit: `compose.yaml` nuevo, `pg` en lugar de `better-sqlite3`, `DB_*` en `env.ts`, `.env.example`, `.env` y `.env.test`, Makefile con `db-up`, `db-test-up`, `db-down`, `migrate` (las dos bases) y `test`, y `DB_*` de mentira en `openapi.yml`. `make test` pasa 23/23 también con `db` parada, `db` conserva su volumen tras `db-down`/`db-up` y `db-test` vuelve vacía, migraciones sin diff y `schema.ts` sin cambios. Hallazgo nuevo: `openapi:check` (y hasta `node ace list`) ya fallaba en `HEAD` con «Invalid command exported from "openapi_check.js" file. Invalid URL», así que el cambio del workflow quedó sin poder comprobarse. `setup` solo se probó en seco (`make -n`) para no lanzar `npm install` en `frontend/`.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
La migración a PostgreSQL ya está hecha. Ahora quiero averiguar qué se ha perdido con el cambio de motor. **Es una investigación, no un arreglo:**
- No modifiques ningún fichero versionado: código, tests, migraciones, `schema.ts`, `schema_rules.ts`, Makefile ni configuración.
- No escribas en `HALLAZGOS.md`.
- Sigue prohibido abrir `backups/` o cualquier cosa de su interior.
- Si necesitas un script auxiliar, ponlo en `backend/tmp/` (está ignorado por git) y bórralo al terminar.
- Los únicos datos que puedes crear son datos inventados en `db` (desarrollo, puerto 54410). Bórralos al terminar.
- Al final, `git status` tiene que salir igual que al empezar. Enséñamelo al principio y al final.

Para cada paso, dame el comando que ejecutaste, la salida relevante, tu conclusión y tu grado de certeza (confirmado / probable / no comprobado).

### Paso 1. Comprobación de tipos
Ejecuta `(cd backend && npm run typecheck)` y dime si pasa o falla. Si pasa, explica qué significa que pase a pesar del cambio de motor: qué está viendo y qué no está viendo el compilador.

### Paso 2. `schema.ts` frente a la rama de partida
1. Localiza la referencia de la rama de partida (`s10/start`, `origin/s10/start` o la que exista) y ejecuta `git diff <ref> -- backend/database/schema.ts`.
2. **Si hay cambios:** lista cada declaración que haya cambiado de tipo, con el tipo anterior y el nuevo.
3. **Si el diff sale vacío:** averigua qué fija esos tipos al cambiar de motor.
   - Revisa `backend/database/schema_rules.ts` y cómo lo usa la generación (`schemaGeneration` en `config/database.ts`).
   - Para cada columna que tenga el tipo forzado, compara el tipo que declara `schema.ts` con el tipo que devuelve el driver `pg` en tiempo de ejecución. Compruébalo leyendo una fila real con `typeof` o `instanceof`, no solo leyendo el código.
   - Revisa también los otros tipos que suelen cambiar entre SQLite y `pg`: `date` y `timestamp` (y el papel de `TZ`), `count`/`sum`/`bigint` (que `pg` devuelve como string), los booleanos y JSON. Busca en `backend/app/` cualquier sitio donde el código dependa de esos tipos.

### Paso 3. Cómo decide el proyecto si una tarea está vencida
1. Localiza el código que decide si una tarea está vencida (`app/models/task.ts:45-55` y todo lo que lo use: serializadores, controladores, respuestas de la API).
2. Cita el comentario que explica por qué funciona la comparación y contrástalo con lo que encontraste en el paso 2. ¿Sigue siendo válido?
3. **Compruébalo con una tarea que ya debería estar vencida**, no solo leyendo el código:
   - Crea en `db` un usuario y una tarea inventados con `due_date` en el pasado. Hazlo, si se puede, por la API (`http://localhost:3333`). Si la validación no deja crear fechas pasadas, inserta la fila por SQL y léela a través de la aplicación.
   - Enséñame qué valor y qué tipo tiene `dueDate` en tiempo de ejecución, y qué devuelve la lógica de «vencida».
   - Como control, haz lo mismo con una tarea con fecha futura y otra sin fecha.
   - Borra los datos al terminar.
4. Busca si algún test de la suite cubre este caso. Si no lo cubre, explica por qué la suite sigue en verde.

### Datos para la parte C (no escribas nada en `HALLAZGOS.md`)
1. **Filas que cambian de valor con el cambio de esquema:**
   - Mídelo con consultas SQL sobre `db` y `db-test`, y enséñame las consultas y los recuentos, aunque salga cero.
   - Dime si alguna migración modifica datos.
   - Busca en el repo (README, docs, lecciones) qué es el «árbol de reversibilidad» y dime en qué rama cae este cambio y por qué, citando dónde lo encontraste.
2. **Casos que quedan fuera de la batería de pruebas:** lista cuáles encontraste, o qué buscaste y dónde si no encontraste ninguno.
3. **Lo que no has podido comprobar o te ha dejado dudas.**

Termina con un resumen de una línea por paso. No redactes las tres líneas de `HALLAZGOS.md`; esas las escribo yo.
```

**Qué salió:** investigación completa sin tocar ficheros versionados (`git status` igual al empezar y al terminar; datos de prueba y script borrados). `typecheck` en verde y `schema.ts` sin diff frente a `s10/start`, porque `schema_rules.ts` fija `dueDate` como `string`, pero en ejecución `pg` lo devuelve como `Date` (`instanceof Date` = true, y con `TZ` distinto de UTC se corre un día). Comprobado por la API: una tarea vencida da `isOverdue: true` en el `PUT` (string en memoria) y `false` en el `GET` (releída de la base), y `dueDate` sale como `"2026-11-01T00:00:00.000Z"` en vez de `AAAA-MM-DD`, que rompe el contrato OpenAPI; ningún test cubre el vencimiento. Hallazgo extra: un `fullName` de más de 255 caracteres da 500 en PG (SQLite no aplicaba la longitud de `varchar`). Cambian 0 filas de valor y ninguna migración toca datos; el «árbol de reversibilidad» no está definido en el repo. Usó el servidor de desarrollo que ya estaba corriendo y dejó un fichero temporal en `/tmp`, borrado en el mismo comando.
