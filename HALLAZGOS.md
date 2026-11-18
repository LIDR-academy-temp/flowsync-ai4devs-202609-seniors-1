# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- **0 filas cambian de valor almacenado**: la rama no añade ni toca migraciones (`git diff s10/start --name-status -- backend/database/migrations/` vacío) ni copia datos de SQLite a PostgreSQL, y `select count(*), count(due_date) from tasks` da 1/1 en los dos motores con `2026-01-01` guardado en ambos (`text` en SQLite, `date` en PostgreSQL); lo que cambia es la lectura: esa fila (1 de 1 con `due_date`) llega a la aplicación como `Date` y no como `string`. Rama: **no toca datos** (cambio de motor y configuración, se deshace revirtiendo la configuración, aunque lo escrito después en PostgreSQL no vuelve a SQLite).

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- **El vencimiento**: ninguna prueba crea una tarea con `dueDate` ni comprueba `isOverdue` (buscar `dueDate|due_date|isOverdue` en `backend/tests/` da 0; `assignee.spec.ts` llama a `GET /tasks/:id?today=` pero solo mira el responsable), así que con PostgreSQL una tarea vencida el 2026-01-01 consultada el 2026-11-17 sale `isOverdue: false` (con SQLite, `true`) y aun así la batería da 23/23 y el typecheck pasa.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Dudé de si el `isOverdue: true` del `PUT` probaba que funcionaba (no: usa el valor en memoria y solo el `GET` relee la base) y de si el diff vacío de `schema.ts` significaba que nada cambió (no: el tipo lo fija `schema_rules.ts`); no pude comprobar si los datos reales ya sufren el fallo (el volcado de producción no se abre), el efecto de la zona horaria por HTTP (solo en la REPL con `TZ=Europe/Madrid`: `2025-12-31T23:00:00.000Z`), las comprobaciones 3 y 4 del seguro de pruebas (base realmente conectada y servidor sin la base de desarrollo: solo se alcanzan pasando por el puerto 54411, donde solo escucha `db-test`, y forzarlas exigía conectarse al servidor de desarrollo o crear `flowsync_test` en él) ni con qué nombre exacto recoge esta rama el árbol de reversibilidad del curso, porque no tengo esa lección.
