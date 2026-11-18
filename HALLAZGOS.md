# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 filas: la migración no toca datos. Las cuatro migraciones siguen intactas (`git diff` vacío) y solo crean tablas en bases vacías. `select count(*), count(*) filter (where due_date is not null) from tasks` da 0|0 en el SQLite de origen, en `db` y en `db-test`. Cae en la rama «no destruye». Lo que sí cambia es el tipo con el que el conector entrega `due_date` (texto → `Date`), que afectaría a cada fila con fecha; hoy no hay ninguna.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Una tarea leída de PostgreSQL nunca sale vencida. El driver `pg` entrega `due_date` como `Date`, e `isOverdueOn` compara `Date < "AAAA-MM-DD"`, que siempre da `false`. Lo comprobé con una tarea vencida ayer en `db-test`. Ningún test toca `dueDate` ni `isOverdue` (busqué en `backend/tests`), y el typecheck tampoco lo ve porque `schema_rules.ts` sigue declarando `string`.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Al principio di por hecho que un `schema.ts` sin diff significaba que no había cambiado nada, y solo la prueba con la tarea lo desmintió. No probé con un `TZ` distinto de UTC: `.env` fija `TZ=UTC`, y el driver crea el `Date` a medianoche local, así que en otro huso la fecha podría correrse un día. Tampoco lo comprobé por HTTP ni en el navegador, solo con el modelo en la REPL.
