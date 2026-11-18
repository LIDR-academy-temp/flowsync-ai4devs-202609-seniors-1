# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- En el cambio de motor no se migró ninguna fila: PostgreSQL arrancó vacío con las 4 migraciones originales (intactas), y las 9 tareas, 5 usuarios y 10 tokens que tiene ahora los escribí yo directamente ahí; para medir qué pasaría al traer datos, copié las 4 filas de mi SQLite de desarrollo (1 usuario, 2 tokens, 1 tarea) a una base PostgreSQL desechable creada con esas migraciones y comparé por id el valor de origen con el de destino devuelto al formato de origen (`o.due_date IS DISTINCT FROM d.due_date::text`, `o.created_at IS DISTINCT FROM to_char(d.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')` y, para los tokens, que SQLite guardaba como epoch en ms, `o.created_at IS DISTINCT FROM round(extract(epoch FROM d.created_at) * 1000)::bigint::text`), y me salieron 0 de 4 filas que cambian de valor y 4 de 4 que cambian de representación (`2026-11-18 19:01:57` pasa a `2026-11-18 19:01:57+00` y `1795028517360` a `2026-11-18 19:01:57.36+00`), con una muestra mínima y una copia que hice yo, no un script del proyecto; el árbol de reversibilidad no está en el repo, así que mi clasificación es provisional: el esquema se deshace revirtiendo código y configuración, pero los datos no, porque volver a SQLite exige una migración de datos con transformación (texto sin huso para unas columnas, epoch en ms para otras) y, si se reescriben con el formato en segundos que usaba la app en SQLite, se pierden los milisegundos de las 9 tareas y los 5 usuarios creados en PostgreSQL (todos los tienen), así que para volver sin pérdida hay que conservar el volumen de PostgreSQL.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- La batería original no leía nunca de la base una tarea con fecha: con PostgreSQL, una tarea con `dueDate` 2026-01-15 y `today=2026-11-18` respondía `isOverdue: true` en el `PUT` (donde `dueDate` aún es el texto que acaba de asignar el controlador) y `false` en el `GET`, aunque en PostgreSQL seguía guardado `2026-01-15`; la causa es que el driver `pg` convierte la columna `date` en un `Date` a medianoche del huso del proceso mientras `schema.ts` sigue diciendo `string` (lo fija `schema_rules.ts`, por eso su diff sale vacío y el typecheck pasa), y `Date < '2026-11-18'` es siempre `false`; con el proceso en `Europe/Madrid` el JSON además sale `2026-01-14T23:00:00.000Z`, que es el mismo instante escrito en UTC y no un día perdido en la base, pero quien lea el día de ese texto ve el 14; lo demuestra `tests/functional/tasks/overdue.spec.ts`: sin el arreglo fallan sus 3 pruebas (la de fecha pasada con `expected false to be true`) y con el arreglo, que hace que `pg` devuelva `date` como texto, pasan las 26.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No medí sobre datos reales (4 filas de mi SQLite y ni abrí `backups/`, porque la incidencia lo prohíbe), así que el 0 no dice nada de producción; el arreglo es un ajuste global del driver `pg` en `config/database.ts`, vive en la conexión y no en el esquema, afecta a cualquier columna `date` futura y, si alguien lo quita, el typecheck sigue en verde y solo lo caza la prueba nueva; y una tarea `done` con fecha pasada sale `isOverdue: true` aunque la spec dice que no, porque `isOverdueOn` no mira el estado (el código es el mismo que en `s10/start`, lo vi en PostgreSQL y no lo reproduje en SQLite), y la dejé sin tocar; además todo lo ejecuté en un Linux en la nube con Docker y Node 24, no en mi Mac.
