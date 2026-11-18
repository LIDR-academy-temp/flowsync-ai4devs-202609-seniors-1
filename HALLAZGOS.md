# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 de 230 tareas (y 0 de 14 usuarios) cambian de valor, medido con consulta sobre el dump de producción: la migración no toca datos y cae en la rama «no puede destruir datos», que se deshace con `git revert` y `make db-down`.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- La batería no podía ver que `pg` devuelve las columnas `date` como `Date` de JavaScript, y no como el texto que devolvía SQLite. `schema_rules.ts` sigue declarando `due_date: string`, así que `typecheck` y los 23 tests siguen en verde. En ejecución `Task.isOverdueOn` compara un `Date` con un texto y da `false` siempre, de modo que con Postgres ninguna tarea figura como vencida. Lo comprobé leyendo una fecha `2026-11-18` desde `db-test`: con `TZ=UTC` sale `2026-11-18T00:00:00.000Z` y con `TZ=Pacific/Auckland` sale `2026-11-17T11:00:00.000Z`.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No pude comprobar que `Task.isOverdueOn` falle en la aplicación real, solo en el driver. Lo medí con `pg` directamente y no levanté la API para ver `dueDate` en una respuesta ni `isOverdue` en una tarea vencida.
