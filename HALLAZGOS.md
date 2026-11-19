# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

-

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

-

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

-

---

## Parte A: cambio de motor

Migración de SQLite a PostgreSQL en Docker hecha en `motor-afm` (commit `6f2f6bc`). **Ninguna migración
existente tocada.** Detalle en [`docs/migration.md`](docs/migration.md) y atajos en
[`docs/restar_commands.md`](docs/restar_commands.md).

### Qué se ha hecho

- **`compose.yaml`**, sin clave `version:`, imagen `pgvector/pgvector:pg17`:
  - `db`: desarrollo, puerto 54410, datos en el volumen `db-data`.
  - `db-test`: pruebas, puerto 54411, en memoria (`tmpfs`), sin volumen.
  - Las dos con healthcheck `pg_isready -h 127.0.0.1`. Los atajos arrancan con `docker compose up --wait`,
    así que nada se conecta hasta que ambas aceptan conexiones.
- **Driver**: `pg` sustituye a `better-sqlite3`. `config/database.ts` usa una única conexión `pg` que lee
  `DB_*`, validadas al arrancar en `start/env.ts`.
- **`backend/.env.test`** apunta la batería y su migración a `db-test`. El framework solo lo carga cuando
  `NODE_ENV=test`.
- **Makefile**: `db-up`, `db-down`, `db-migrate` (migra las dos bases), `db-reset-test` y `test`. `setup`
  ahora levanta las bases antes de migrar.

### Comprobado

- Las dos bases arrancan `healthy`.
- Tras `make db-down && make test`, `db-test` empieza vacía, se migra y pasan **23/23**. `db` conserva sus
  datos.
- `npm run typecheck` en verde y `backend/database/schema.ts` sin cambios.

### Incidencias por el camino

- La descarga de la imagen fallaba por `"credsStore": "desktop.exe"` en `~/.docker/config.json` de WSL. Se
  descargó con una configuración vacía temporal (`DOCKER_CONFIG`), sin tocar la del usuario; lo definitivo es
  quitar esa clave.
- Un `.git/index.lock` vacío y sin ningún git en marcha bloqueaba el commit; se borró.
- Siguen mencionando SQLite: `CLAUDE.md`, `docs/architecture.md`, `docs/capabilities/tasks/README.md` y un
  comentario de `tests/functional/auth/signup.spec.ts`.

---

## Parte B: qué se ha perdido

Hecho con la batería en verde (`make test`: 23/23, contra `db-test` en 54411). Detalle completo en
[`docs/migration.md`](docs/migration.md#comprobaciones-tras-la-migración).

### 1. Comprobación de tipos

`(cd backend && npm run typecheck)` → **pasa** (exit 0). TypeScript solo ve lo que declara
`database/schema.ts`, que no ha cambiado; no puede ver que el driver ahora entrega otro tipo.

### 2. Diff de `backend/database/schema.ts` contra `s10/start`

**Vacío** (0 líneas); las migraciones tampoco cambian. Lo que fija los tipos es `database/schema_rules.ts`:
una regla de columna de tabla (la de mayor prioridad en el generador de Lucid) para `tasks.due_date`
(`string`, decorador `@column` plano) y `tasks.status`. Sin ella, un `date` de PostgreSQL se declararía
`DateTime` con `@column.date`. Como `@column` no transforma nada, el modelo recibe lo que devuelve el driver:
con `better-sqlite3` texto `'2020-01-01'`, con `pg` un `Date`. Lo que cambió es el valor en ejecución, no lo
declarado.

### 3. Cómo se decide si una tarea está vencida

`Task.isOverdueOn()` (`backend/app/models/task.ts`) hace `this.dueDate < referenceDay`. Su comentario («se
compara texto contra texto… no hay hora, ni huso») **ya no es verdad**: con un `Date` a la izquierda, `<`
compara número contra `NaN` y da **siempre `false`**.

Comprobado contra la API con una tarea que ya debería estar vencida (`dueDate = 2020-01-01`,
`today = 2026-11-19`, `pending`):

| Huso del proceso | Al guardar (`PUT .../due-date`) | Al releer (`GET /tasks/:id`) |
|---|---|---|
| UTC | `"2020-01-01"`, `isOverdue: true` | `"2020-01-01T00:00:00.000Z"`, **`isOverdue: false`** |
| Europe/Madrid | `"2020-01-01"`, `isOverdue: true` | **`"2019-12-31T23:00:00.000Z"`**, **`isOverdue: false`** |

En SQL, `due_date < date '2026-11-19'` da `t`. Se pierden dos cosas sin que falle nada: la condición de
vencida al leer de la base y el contrato de `dueDate` (de día `AAAA-MM-DD` a instante, con un día menos fuera
de UTC). Ninguna de las 23 pruebas cubre `due_date` ni `isOverdue`.
