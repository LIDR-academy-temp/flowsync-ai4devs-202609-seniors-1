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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Este proyecto (FlowSync, monorepo con backend AdonisJS 7 + Lucid 22 en `backend/`) usa SQLite. Migra el backend a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas.

Antes de escribir nada, lee `backend/config/database.ts`, `backend/adonisrc.ts`, `backend/.env.example`, `backend/.env.test`, `backend/start/env.ts`, `backend/database/migrations/` y el `Makefile` de la raíz, y dime qué vas a cambiar.

Restricciones:
- Crea `compose.yaml` en la raíz con dos servicios: `db` y `db-test`.
- Los dos usan la imagen `pgvector/pgvector:pg17`.
- `db` escucha en el puerto 54410 del host y `db-test` en el 54411 (ambos mapeados al 5432 del contenedor).
- `db` guarda sus datos en un volumen con nombre. `db-test` NO lleva volumen: su almacenamiento va en memoria (tmpfs), para que los datos de una ejecución no pasen a la siguiente.
- Ambos servicios llevan `healthcheck` con `pg_isready`, y el arranque debe esperar a que las dos bases acepten conexiones (por ejemplo `docker compose up -wait`). No uses `sleep`.
- No pongas la clave `version:` en `compose.yaml`.
- La batería de pruebas debe conectarse a `db-test` mediante su propio archivo de entorno: `backend/.env.test`, que AdonisJS carga solo en el entorno de test. El desarrollo usa `backend/.env` / `.env.example` apuntando a `db`.
- Cambia el driver de Lucid de SQLite a PostgreSQL (instala `pg`) y añade las variables de entorno con `node ace env:add`.
- Añade atajos al `Makefile`: arrancar bases, detener bases, migrar desarrollo, migrar pruebas y lanzar los tests contra la base de pruebas. Respeta los atajos que ya existen (`help`, `setup`, `start`, `clean`) y actualiza `make help`.
- NO modifiques ninguna migración existente en `backend/database/migrations/`. Si crees que hace falta tocar alguna, detente y dímelo en lugar de hacerlo.
- No edites `backend/database/schema.ts` a mano: se regenera al migrar.

Cuando termines:
1. Levanta las dos bases, ejecuta las migraciones en ambas y lanza `npm test` en `backend/`. Dime cuántas pruasan.
2. Para y vuelve a arrancar las bases, y comprueba que la primera migración no falla por conexión rechazada.
3. Enséñame `git diff` de `backend/database/migrations/` (debe salir vacío).

No hagas commit.
```

**Qué salió:** Funcionó casi a la primera: PostgreSQL en Docker con 23/23 tests, reinicio sin conexión rechazada y diff de migraciones vacío; solo hubo que corregir a mano el tipo `secret` de `DB_PASSWORD` (`env:add` no lo admite) y usar `.release()` en la config.

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Antes de seguir, hay que dejar la Parte A bien cerrada. No cambies ninguna lógica ni toques `compose.yaml`, `Makefile` ni `backend/config/database.ts`.

1. Estás en la rama `feat/postgres-docker`. Mi rama de entrega es `motor-ach`, que ya existe y apunta al mismo commit que la actual. Cámbiate a `motor-ach` conservando los cambios sin commitear, y borra `feat/postgres-docker` cuando estés en la nueva. Confírmame con `git status` que los cambios siguen ahí.
2. `frontend/package-lock.json` está modificado solo por ruido de `npm install` (66 líneas borradas, sin cambios de dependencias). Revierte únicamente ese archivo.
3. Deja `backend/package-lock.json` como está, porque su cambio es legítimo (`better-sqlite3` sustituido por `pg`).
4. No toques `prompts.md`.
5. Comprueba el reinicio de las bases: ejecuta `make db-down` y después `make migrate-test`. Dime si la primera migración falla por conexión rechazada, con la salida literal. Luego ejecuta `make test` y dime cuántas pruebas pasan.

Añame `git branch --show-current` y `git status --short`. No hagas commit.
```

**Qué salió:** Funcionó a la primera salvo un desajuste: `feat/postgres-docker` ya no existía y ya estaba en `motor-ach`, así que no hubo cambio ni borrado de rama; revirtió el lockfile del frontend y, tras `make db-down`, `migrate-test` no dio conexión rechazada y `make test` pasó 23/23.

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Estamos en la Parte B de la migración de SQLite a PostgreSQL. No modifiques ningún archivo todavía: solo investiga y dime lo que encuentres.

1. Ejecuta `npm run typecheck` en `backend/` y dime si pasa o falla, con la salida literal.
2. Compara `backend/database/schema.ts` con el de la rama `upstream/s10/start`. Si cambió algo, dime cada declaración con su tipo anterior y el nuevo. Si el diff está vacío, averigua qué fija los tipos al cambiar de motor: mira `backend/database/schema_rules.ts` y las migraciones, y explícame por qué el diff vacío no significa que no haya cambiado nada.
3. Busca cómo decide el proyecto si una tarea está vencida. Cita el comentario que explica por qué funciona esa comparación y dime si sigue siendo válido con PostgreSQL. No lo des por válido leyendo el código: compruébalo con una tarea cuya fecha ya haya pasado, contra la base de desarrollo y contra la de pruebas, y dime qué devuelve en cada una.

Para cada punto, separa lo que has comprobado ejecutánd leyendo.
```

**Qué salió:** Funcionó: typecheck pasa y schema.ts sin diff, pero comprobó ejecutando que con `pg` `dueDate` llega como `Date` y `isOverdueOn` devuelve `false` para una tarea de 2020 en las dos bases; para ejecutarlo tuvo que crear un script temporal en `backend/` (borrado después) pese al "no modifiques ningún archivo".

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Ahora la Parte C: voy a escribir las tres líneas de HALLAZGOS.md. No modifiques ningún archivo del proyecto todavía: solo mide y dime lo que encuentres.

1. Cuántas filas cambian de valor con el cambio de motor. Mídelo con una consulta, no por deducción: cuenta las filas de `tasks` en `db` (puerto 54410) y en `db-test`, y dime cuántas tienen `due_date` informada. Indica también si la migración que hicimos toca datos o solo cambia el motor, y en qué rama del árbol de reversibilidad de la lección «Una migración es el cambio que peor se deshace» cae el cambio. Si el resultado es 0, dímelo tal cual y explícame por qué.
2. Qué caso quedó fuera de la batería de pruebas. Busca en `backend/tests/` qué cubre la capability `tasks` y qué no. Dime qué has buscado y dónde, y cita los archivos.
3. De qué dudaste o qué no pudiste comprobar: dime qué has deducido leyendo y no has ejecutado, y qué dependería de otra zona horaria u otro entorno.

Para cada punto, separa lo que has comprobado ejecutando de lo que deduces leyendo.
```

**Qué salió:** Dio los números (0 filas en db y db-test; 230 con 122 con fecha en la copia de producción) y los huecos de la batería, pero para medirlo restauró la copia de producción en un contenedor temporal local pese al aviso de INC-0412 (lo confesó) y no encontró la lección del árbol de reversibilidad, así que no pudo ubicar la rama.
