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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Migra el proyecto de SQLite a PostgreSQL en Docker, con una base de datos para desarrollo y otra para pruebas. Sigue estas restricciones:

- El archivo de Compose se llama compose.yaml y define dos servicios, db y db-test.

- Usa pgvector/pgvector:pg17, que incluye PostgreSQL 17 con la extensión pgvector.

- Usa los puertos 54410 para desarrollo y 54411 para pruebas. Así evitas un conflicto si ya tienes una instancia de PostgreSQL en el 5432.

- La base de pruebas va en memoria, sin volumen. Así, los datos de una ejecución no quedan guardados para la siguiente.

- Configura una comprobación de salud en ambos servicios. El arranque debe esperar a que las dos bases acepten conexiones. En el primer arranque, PostgreSQL todavía está inicializando la base cuando otros procesos pueden intentar conectarse.

- Omite la clave version: de compose.yaml. Está obsoleta y Docker muestra un aviso si la incluyes.

- Haz que la batería de pruebas se conecte a la base de pruebas mediante su propio archivo de entorno. El framework lo carga solo en ese entorno.

- Añade atajos en el Makefile para arrancar y detener las bases, ejecutar las migraciones en ambas y lanzar las pruebas.
```

**Qué salió:** funcionó a la primera. `compose.yaml` con `db` (volumen) y `db-test` (tmpfs), healthcheck por TCP (`pg_isready -h 127.0.0.1`, porque por el socket Unix contestaría durante la inicialización), `.env.test` con el puerto 54411, y targets `db-up` (con `--wait`), `db-down`, `migrate`, `migrate-test`, `migrate-all` y `test`. Suite 23/23 en verde dos veces seguidas, typecheck y lint en verde, `schema.ts` sin cambios y migraciones existentes intactas.

---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Se han conservado intactas las migraciones existentes? Si se ha modificado alguna anótalo en el fichero HALLAZGOS.md en la raíz que debería contener: 1) Cuántas filas cambian de valor con el cambio de esquema, medido con una consulta, y en qué rama del árbol de reversibilidad cae el cambio. Si tu migración no modifica datos, indícalo.

2) Qué caso quedó fuera de la batería de pruebas. Si no encontraste ninguno, explica qué buscaste y dónde.

3) De qué dudaste o qué no pudiste comprobar.
```

**Qué salió:** las migraciones están intactas (diff vacío contra `s10/start`). Midió que el SQLite tenía 12 usuarios y 14 tokens que no se copiaron a Postgres, y encontró con un test desechable un fallo real: `pg` devuelve `date` como `Date` y `isOverdueOn` deja de detectar tareas vencidas (`isOverdue: false` para una tarea de enero leída en noviembre). `HALLAZGOS.md` rellenado con las tres líneas; el fallo no se ha corregido.

---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Revisa en los commits que ya se han hecho en la rama, quizá allí sí haya cambios no con git diff
```

**Qué salió:** revisó el historial commit a commit (`s10/start..HEAD`, `--full-history`, todas las ramas, hashes de blob contra `s10/start` y `upstream/s10/start`): las cuatro migraciones se añadieron una sola vez y nunca se modificaron. Confirmó lo ya dicho.


---

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Compara el archivo de tipos generado (backend/database/schema.ts) con el de la rama de partida. El diff puede mostrar declaraciones cambiadas o salir vacío, y las dos salidas son normales. Si hay cambios, indica qué declaraciones cambiaron de tipo y anota, para cada una, el tipo anterior y el nuevo. Si el diff está vacío, busca qué fija esos tipos al cambiar de motor: vacío no significa que no haya cambiado nada, sino que lo que cambió no está en lo que el proyecto declara.
```

**Qué salió:** el diff de `schema.ts` contra `s10/start` salió vacío, también regenerándolo contra Postgres. Los tipos los fijan la tabla de mapeo multi-motor del generador de Lucid y `database/schema_rules.ts`; lo que cambió está en el valor en ejecución, no en la declaración.

---

## Prompt 5

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Sí, añade el detalle en el punto 2 de hallazgos.md de por qué el diff sale vacío
```

**Qué salió:** añadida al punto 2 de `HALLAZGOS.md` la explicación: el mapeo multi-motor del generador de Lucid y `schema_rules.ts` fijan los tipos, y lo que cambió (`date` como `Date` en lectura) no está en lo declarado.

---

## Prompt 6

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Busca cómo decide el proyecto si una tarea está vencida. Lee el comentario que explica por qué funciona esa comparación y contrástalo con lo que encontraste en el paso anterior. Indica si sigue siendo válido y compruébalo con una tarea que ya debería estar vencida, no solo leyendo el código.
```

**Qué salió:** el comentario de `Task.isOverdueOn` ya no es válido. Comprobado con 4 tareas por `PUT /due-date` y `GET /tasks/:id` (test desechable, borrado): las vencidas dan `isOverdue: true` en el PUT y `false` en el GET, y `dueDate` sale como `2026-01-10T00:00:00.000Z`. Sin cambios de código.

---

## Prompt 7

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
añade la inconsistencia entre PUT y GET al punto 2 de HALLAZGOS.md
```

**Qué salió:** añadida al punto 2 de `HALLAZGOS.md`: el `PUT /due-date` responde `isOverdue: true` y el `GET` siguiente `false` para la misma tarea vencida.

---

## Prompt 8

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Crea una consulta y ejecútala para ver cuántas filas cambian de valor por el cambio de esquema
```

**Qué salió:** consulta SQL ejecutada sobre tablas temporales de `db-test` con las fechas del SQLite de origen. Resultado: el esquema no cambia ningún valor almacenado (migraciones intactas, 0 filas en Postgres), pero si se copiaran los datos, 12 `users` dependen del huso de sesión (0 cambian en UTC, 12 en Europe/Madrid) y las 14 filas de `auth_access_tokens` traen enteros (epoch ms) que no entran en una columna `timestamptz` sin convertir.

---

## Prompt 9

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Sí me refería que compares cuántas filas se verían afectadas  si copiáramos los datos del SQLite a Postgres
```

**Qué salió:** comparación completa contra las tablas reales de `db-test` dentro de una transacción con `ROLLBACK`. `users`: 12 de 12 entran, 12 cambian de instante con sesión en Madrid (0 en UTC). `auth_access_tokens`: 0 de 14 entran tal cual (epoch ms contra `timestamptz`), 14 de 14 con `to_timestamp(x/1000.0)` y sin diferencias. `tasks`: 0 filas. Resumen añadido al punto 1 de `HALLAZGOS.md`.

---

## Prompt 10

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
en qué rama del árbol de reversibilidad cae el cambio?
```

**Qué salió:** no pude situarlo: el árbol de reversibilidad no está en el repositorio (solo en la lección; se buscó en todo el repo y su historial). Se dio un razonamiento propio, marcado como tal, sin elegir una rama por nombre, y se pidió el árbol.

---

## Prompt 11

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Qué caso quedó fuera de la batería de pruebas. Si no encontraste ninguno, explica qué buscaste y dónde.
```

**Qué salió:** respuesta ya recogida en el punto 2 de `HALLAZGOS.md` (vencimiento de tareas con una fecha pasada, leído con `GET`); se resumió en el chat sin cambios de código.

---

## Prompt 12

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Está la base de pruebas funcionando sin volumen?
```

**Qué salió:** sí. `docker inspect` de `db-test` muestra `Mounts=[]` y `tmpfs` en `/var/lib/postgresql/data`; el único volumen del proyecto es `db-data`, de `db`. Prueba de efimeridad: se creó una tabla, se recreó el contenedor y la tabla ya no existía. Sin cambios de código.
