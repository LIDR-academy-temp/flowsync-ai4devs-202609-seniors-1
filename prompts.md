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

**Modelo:** Opus 5.5 x Extra
**Herramienta:** Claude Code

```
Migrate the project from SQLite to PostgreSQL in Docker, with a DDBB for development and another one for tests.
Follow these restrictions:

* Compose file is named `compose.yaml` and defines two services: `db` and `db-test`
* Use `pgvector/pgvector:pg17`, which includes PostgreSQL 17 with the pgvector extension
* Use ports 54410 for development and 54411 for tests. This way we avoid a conflict if there's already a PostgreSQL instance at 5432
* The tests DDBB is in memory, no volume. This way an execution's data are not store for the next one
* Setup a health check for both services. Start must await that both DDBBs accept connections. On the first start, PostgreSQL may still be initializing the DDBB when other processes already try to connect
* Skip the `version:` key from `compose.yaml`. It's obsolete and Docker shows a warning if you include it
* Make the tests battery to connect to the testing DDBB through its own env file. The framework loads it just in that environment
* Add shortcuts in the Makefile to start and stop the DDBBs, execute the migrations in both and run the tests


We want to keep the current migrations intact
```

**Qué salió:** Funcionó a la primera: compose.yaml con db (volumen) y db-test (tmpfs, sin volumen anónimo), healthcheck por TCP, conexión pg por DB_* con .env.test apuntando al 54411, y make db-up/db-down/migrate/test; 23/23 en verde contra db-test, typecheck en verde, migraciones y schema.ts sin cambios; hubo que añadir DB_* al workflow de CI y `openapi:check` ya fallaba en local antes del cambio.

## Prompt 2

**Modelo:** Opus 5.5 x Extra
**Herramienta:** Claude Code

```
i just ran a DDBB migration in another session
i see no changes in backend/database/schema.ts

why?

(modify nothing; this session will be merely read only)
```

**Qué salió:** `schema.ts` sí se regeneró (su fecha coincide con la migración de `db-test`), pero salió idéntico al versionado: no había migración nueva, solo se aplicaron las cuatro de siempre a las bases PostgreSQL vacías. No se tocó nada.

## Prompt 3

**Modelo:** Opus 5.5 x Extra
**Herramienta:** Claude Code

```
ok, so no diff is the same as empty diff, right? no changes

what fixes these types to the engine change?
```

**Qué salió:** Sí, sin diff es fichero idéntico. Fijan los tipos el mapeo de Lucid (`mappings.js`, que lleva los tipos de cada motor a los mismos tipos internos), sus reglas por nombre de columna (`created_at`, `updated_at`, `password`) y las de `schema_rules.ts` (`status`, `due_date: string`); la nulabilidad sale de las migraciones. Concluí que no hacía falta cambiar nada y que la única diferencia en ejecución era el formato de fecha del dialecto: incompleto, lo desmintió el prompt siguiente.

## Prompt 4

**Modelo:** Opus 5.5 x Extra
**Herramienta:** Claude Code

```
aha... keep this last answer as "answer 2" for later

find out how the project decides if a task is due. Bring up the comment that explains why that comparison works; then i need to compare that with what we just found. I need to know if it's still valid. I'd like to check with a task that should be due, not just checking the code
```

**Qué salió:** `Task.isOverdueOn` compara `dueDate < referenceDay` como texto. Probado con el modelo real en `db-test` dentro de una transacción con rollback: una tarea que venció ayer da `true` en memoria y `false` leída de PostgreSQL, para cualquier día, porque el driver `pg` devuelve `date` como `Date` y `Date < "AAAA-MM-DD"` compara contra `NaN`; `GET /tasks/:id` nunca la marca vencida y devuelve `dueDate` como timestamp. De paso: el comentario promete tres condiciones y el código no mira el estado. El primer intento por la REPL no ejecutó nada (las líneas corrieron antes de que arrancara la app); se repitió en un solo bloque, sin dejar restos.

## Prompt 5

**Modelo:** Opus 5.5 x Extra
**Herramienta:** Claude Code

```
so the questions was "is the comment that decides if a task is due still valid?" keep it short
```

**Qué salió:** No: el comentario da por hecho texto ISO y en PostgreSQL llega un `Date`, así que la comparación siempre da `false`; y las «tres condiciones» nunca fueron ciertas.
