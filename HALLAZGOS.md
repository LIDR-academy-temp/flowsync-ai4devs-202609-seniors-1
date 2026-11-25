# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- **0 filas cambian de valor**: la migración no toca datos ni esquema (`git diff fc41849 -- backend/database/migrations` vacío, ninguna migración nueva ni editada), y `select count(*)` da 0 tareas y 0 usuarios tanto en `db` (:54410) como en `db-test` (:54411), así que además no había datos que perder; el árbol de reversibilidad no aplica a este cambio porque no hay migración de datos que clasificar (el cambio de motor se deshace volviendo a SQLite y reinstalando `better-sqlite3`, pero los datos de SQLite no se copiaron a Postgres).

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- **Sí había un caso fuera de la batería**: ninguna cubre el vencimiento de tareas, y con Postgres `tasks.due_date` (`date`) llega como `Date` de JavaScript y no como texto (SQLite lo daba como texto), así que `isOverdueOn` compara `Date < string`, da siempre `false` y una tarea con vencimiento 2026-01-10 vista desde 2026-11-25 sale `isOverdue: false` en `GET /tasks/:id` (el `PUT` sí dice `true` porque no relee la fila) y `dueDate` sale como `"2026-01-10T00:00:00.000Z"`; `typecheck` y el diff vacío de `schema.ts` no lo ven porque `schema_rules.ts` fija el tipo `string` pero no lo que entrega la db.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- **Dudé y no pude comprobar tres cosas**: (a) no regeneré `database/schema.ts` contra Postgres para compararlo con un fichero fresco, solo contra el commiteado, que no cambia; (b) el README habla de un «árbol de reversibilidad» que no encontré; (c) solo probé el tipo `date`, y no revisé otros tipos que Postgres convierta distinto de SQLite (`timestamp`, `bigint`) más allá de que hoy no hay columnas `bigint`.
