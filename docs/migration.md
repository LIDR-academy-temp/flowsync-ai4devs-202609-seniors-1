# Migración de SQLite a PostgreSQL en Docker

Fecha: 2026-11-19. Rama: `motor-afm`.

## Qué se ha hecho

1. **`compose.yaml`** en la raíz, sin clave `version:` (obsoleta), con dos servicios sobre
   `pgvector/pgvector:pg17` (PostgreSQL 17 + extensión `vector`):
   - `db` — desarrollo, `54410:5432`, base `flowsync_dev`, datos en el volumen con nombre `db-data`.
   - `db-test` — pruebas, `54411:5432`, base `flowsync_test`, datos en `tmpfs` (memoria, **sin volumen**):
     cada recreación del contenedor arranca vacía.
   - Ambos con **healthcheck** `pg_isready -h 127.0.0.1 -d <base>`. El `-h 127.0.0.1` fuerza TCP: durante el
     primer arranque la imagen ejecuta `initdb` con un servidor temporal que solo escucha por socket Unix y
     **no acepta conexiones**; sin ese flag el healthcheck podría dar `healthy` antes de tiempo.
   - Los atajos levantan con `docker compose up -d --wait`, que bloquea hasta que los dos servicios están
     `healthy`. Así ninguna migración ni batería se conecta a una base que aún no acepta conexiones.
2. **Driver**: `npm install pg` y `npm uninstall better-sqlite3` en `backend/`.
3. **`backend/config/database.ts`**: una única conexión `pg` que lee `DB_HOST`, `DB_PORT`, `DB_USER`,
   `DB_PASSWORD`, `DB_DATABASE`. Se mantiene `schemaGeneration` con `database/schema_rules.js`.
4. **`backend/start/env.ts`**: validación de las cinco variables `DB_*` al arrancar.
5. **Ficheros de entorno**:
   - `backend/.env` / `.env.example` → `db` (54410, `flowsync_dev`).
   - `backend/.env.test` → `db-test` (54411, `flowsync_test`). El framework lo carga **solo** cuando
     `NODE_ENV=test` (lo fija `bin/test.ts`, y `make db-migrate-test` lo pasa a mano) y sus valores
     prevalecen sobre `.env`. Así la batería de pruebas y la migración de pruebas cargan el framework
     completo pero contra la otra base.
6. **`Makefile`**: atajos `db-up`, `db-down`, `db-migrate` (las dos), `db-reset-test` y `test`. Detalle en
   [`restar_commands.md`](restar_commands.md). `clean` ya no borra el fichero SQLite y no toca las bases.

## Verificación

- `docker compose ps`: `db` y `db-test` `Up (healthy)` en 54410 y 54411.
- `make db-down && make test` desde cero: `db-test` arranca vacía, se migra (4 migraciones) y la batería
  pasa: **23/23**. `db` conserva sus 4 migraciones tras el ciclo (volumen).
- `npm run typecheck`: **verde**.
- `git diff backend/database/`: **vacío**. Ni migraciones ni `schema.ts` cambian (ver hallazgo 1: vacío no
  significa que nada haya cambiado).

## A tener en cuenta

- **Todo dentro de WSL** en Windows: Docker, Node (≥ 24, vía nvm en shell interactiva) y `make`.
- **`docker-credential-desktop.exe`**: si `~/.docker/config.json` en WSL tiene `"credsStore": "desktop.exe"`
  (resto de Docker Desktop) y Docker corre nativo en WSL, el primer `pull` falla con
  `error getting credentials`. Se resolvió descargando con un config vacío
  (`DOCKER_CONFIG=<dir con {}> docker compose pull`) sin tocar la config del usuario; la solución definitiva
  es quitar esa clave del config.
- **Datos de SQLite no se trasladan**: `backend/tmp/db.sqlite3` queda huérfano; la base de desarrollo
  PostgreSQL arranca vacía.
- `.unsigned()` en las FK de las migraciones es un no-op en PostgreSQL (no hay enteros sin signo). Sin efecto
  práctico: los ids son `serial`.
- `table.timestamp(...)` en PostgreSQL crea `timestamp with time zone`; en SQLite era texto.
- Docs que siguen mencionando SQLite y quedan desactualizadas: `CLAUDE.md`, `docs/architecture.md`,
  `docs/capabilities/tasks/README.md`, comentario de `tests/functional/auth/signup.spec.ts`.

## Comprobaciones tras la migración

Hechas con la batería en verde (`make test`: 23/23).

### 1. Comprobación de tipos

`(cd backend && npm run typecheck)` → **pasa** (exit 0, sin errores).

Qué enseña: TypeScript solo ve lo que declara `database/schema.ts`, y ese fichero no ha cambiado. El
typecheck no puede detectar que el valor real que llega del driver ya no es del tipo declarado.

### 2. Diff de `backend/database/schema.ts` contra la rama de partida

`git diff s10/start -- backend/database/schema.ts` → **vacío** (0 líneas). Las migraciones tampoco cambian.

Qué fija los tipos para que no cambien al cambiar de motor:

- El generador de Lucid (`@adonisjs/lucid/build/src/orm/schema_generator/builder.js`) busca la regla de cada
  columna en este orden: 1) columna de una tabla concreta, 2) tipo en una tabla concreta, 3) columna global,
  4) clave primaria, 5) tipo global.
- `database/schema_rules.ts` declara reglas de **columna de tabla** (la de mayor prioridad) para
  `tasks.status` (`'pending' | 'in_progress' | 'done'`) y `tasks.due_date` (`string`). Ganan a cualquier
  mapeo del motor: sin la regla, un `date` de PostgreSQL se declararía `DateTime` (luxon) con
  `@column.date` (`rules.js`, `INTERNAL_TYPES.DATE`).
- Esa regla pone `@column` **plano**, sin `prepare`/`consume`. Lucid entrega al modelo lo que devuelve el
  driver sin transformarlo: con `better-sqlite3` era el texto `'2020-01-01'`; con `pg` es un `Date` (el
  parser por defecto del OID 1082).
- El resto de columnas no cambian porque el generador las mapea igual en los dos motores (`timestamp` →
  `DateTime`, `increments` → `number`, `string`/`text` → `string`).

Conclusión: el diff vacío no significa que nada haya cambiado. Lo que cambió es el **valor en tiempo de
ejecución** de `dueDate`, y eso depende de la conexión, no del esquema declarado.

### 3. Cómo se decide si una tarea está vencida

`Task.isOverdueOn(referenceDay)` en `backend/app/models/task.ts` (lo usa `TaskDetailTransformer`):
`this.dueDate < referenceDay`. El comentario dice:

> Se compara texto contra texto porque dos fechas ISO comparadas así **son** la comparación de días del
> calendario: no hay hora, ni huso, ni instante intermedio donde se cuele un día de más.

**Ya no es verdad.** Con `pg`, `dueDate` es un `Date`: `Date < string` convierte la fecha a número y el
texto a `NaN`, así que la comparación da **siempre `false`**. Y como el valor es un instante, el huso del
proceso vuelve a entrar en juego.

Comprobado contra la API de desarrollo con una tarea que ya debería estar vencida (`dueDate = 2020-01-01`,
`today = 2026-11-19`, estado `pending`):

| Huso del proceso | Paso | `dueDate` en la respuesta | `isOverdue` |
|---|---|---|---|
| UTC (`.env`) | `PUT /tasks/:id/due-date` (valor en memoria, texto) | `"2020-01-01"` | `true` |
| UTC (`.env`) | `GET /tasks/:id?today=2026-11-19` (leído de BD) | `"2020-01-01T00:00:00.000Z"` | **`false`** |
| `Europe/Madrid` | `PUT /tasks/:id/due-date` | `"2020-01-01"` | `true` |
| `Europe/Madrid` | `GET /tasks/:id?today=2026-11-19` | **`"2019-12-31T23:00:00.000Z"`** | **`false`** |
| — | SQL `due_date < date '2026-11-19'` | `2020-01-01` | `t` |

Se rompen dos cosas: `isOverdue` (una tarea vencida nunca sale vencida al leerla) y el contrato de
`dueDate`, que pasa de día `AAAA-MM-DD` a instante ISO, con **un día menos** si el proceso no corre en UTC.
Los usuarios y tareas creados para la prueba se borraron después.

## Hallazgos

### 1. `due_date` deja de ser texto: la condición de vencida se rompe sin que nada falle

**Ninguna migración existente se ha tocado.** Tampoco se propone tocarlas: el problema no está en la
migración sino en lo que colgaba de la conexión.

- La migración `1786644500000_add_due_date_to_tasks_table.ts` crea `table.date('due_date')`.
- En SQLite `date` no existe: se guardaba y se leía el texto `AAAA-MM-DD` tal cual.
- En PostgreSQL es un `date` real, y el driver `pg` lo **parsea a `Date` de JavaScript** (OID 1082) al leer.
- `database/schema_rules.ts` fija `dueDate: string` en el esquema generado → `schema.ts` no cambia y el
  typecheck sigue en verde, pero en tiempo de ejecución el valor es un `Date`.
- `Task.isOverdueOn()` (`backend/app/models/task.ts`) hace `this.dueDate < referenceDay` y su comentario
  dice que compara «texto contra texto». Con un `Date` a la izquierda, `<` convierte la fecha a número y el
  string a `NaN` → **siempre `false`**. El comentario **ya no es verdad**.

Comprobado con una tarea vencida de verdad (`dueDate = 2020-01-01`, `today = 2026-11-19`) contra la API de
desarrollo:

| Paso | `dueDate` en la respuesta | `isOverdue` |
|---|---|---|
| `PUT /tasks/:id/due-date` (valor en memoria, string) | `"2020-01-01"` | `true` |
| `GET /tasks/:id?today=2026-11-19` (leído de BD, `Date`) | `"2020-01-01T00:00:00.000Z"` | **`false`** |
| SQL `due_date < date '2026-11-19'` | `2020-01-01` | `t` |

Además cambia el contrato: `dueDate` sale como instante ISO en vez de día. Con `TZ=UTC` coincide el día; con
otro huso en el proceso Node, el `Date` se construye a medianoche local y puede serializarse con **un día
menos**.

La batería (23 tests) no lo ve: no hay ningún test de `due_date` ni de `isOverdue`.

**Propuesta (no aplicada, pendiente de decisión)**: no tocar la migración; devolver el comportamiento de
texto en la conexión registrando el parser del tipo `date` para que `pg` devuelva el string crudo, p. ej. en
`config/database.ts`:

```ts
import pg from 'pg'
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value)
```

y añadir un test functional que cree una tarea vencida, la **relea** con `GET` y compruebe `isOverdue: true`
y `dueDate: "AAAA-MM-DD"`.

### 2. Datos que cambian de valor

No se migran datos (la base PostgreSQL arranca vacía), así que ninguna fila cambia de valor en este cambio.
El cambio es reversible por configuración (volver a `better-sqlite3` en `config/database.ts`), pero lo que se
escriba en PostgreSQL no vuelve a SQLite sin un volcado aparte.
