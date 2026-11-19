# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 filas cambian de valor: las 4 migraciones están intactas (`git diff` sobre `database/migrations/` vacío) y solo crean/alteran tablas en una base PostgreSQL vacía, sin `UPDATE` ni conversión de columnas; los datos no se copiaron, así que las 2 `users`, 3 `auth_access_tokens` y 1 `tasks` que hay en `tmp/db.sqlite3` (contadas con `select count(*)`) siguen solo allí y la base nueva arranca vacía; caigo en la rama «la migración no toca datos», reversible porque SQLite sigue intacto y basta con volver a apuntar `config/database.ts` a él.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Ningún test toca `due_date` (`grep dueDate|due-date tests/` sin resultados; `assignee.spec.ts` dice expresamente que no prueba el vencimiento), y con `pg` sin parser una columna `date` llega como `Date` de JS (medido: `typeof` → `object`, `Wed Jan 01 2020 00:00:00 GMT-0600`, y `v < '2026-11-18'` → `false`), así que `isOverdueOn` habría devuelto siempre «no vencida» con las 23 pruebas en verde; lo evité con un `setTypeParser(DATE)` en `config/database.ts` y lo comprobé a mano con una tarea de 2020 (`isOverdue: true`).

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No pude comprobar el nombre exacto de la rama del árbol de reversibilidad (ese árbol está en la lección, no en el repo, así que «la migración no toca datos» es mi lectura) y dudé de si dejar los datos de SQLite sin copiar es un cambio de valores que debería contar (decidí que no: no hay conversión, pero se pierden 2 usuarios y 1 tarea de desarrollo); tampoco probé zonas horarias distintas a la mía (GMT-6) ni el rendimiento de la base de pruebas en memoria con más datos.
