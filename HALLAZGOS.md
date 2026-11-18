# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 filas cambian de valor: `SELECT count(*) FROM tasks` da 0 en `db` (54410) y en `db-test` (54411), y las 4 migraciones solo hacen createTable/alterTable (sin UPDATE), así que el cambio de motor no toca datos; se deshace con `git revert` y bajando los contenedores, y la rama exacta del árbol de reversibilidad está pendiente de confirmar con la lección.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Las tareas vencidas: en `backend/tests/` solo hay `tasks/assignee.spec.ts` (3 pruebas del responsable) y 4 archivos de `auth/`, ninguno toca `due_date` ni `isOverdueOn`, y con PostgreSQL `isOverdueOn` devuelve siempre `false` (el driver `pg` entrega la columna `date` como `Date`, no como texto, y `Date < '2020-01-01'` da `false`) mientras `typecheck`, el diff de `schema.ts` (vacío) y las 23 pruebas siguen en verde.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No pude comprobar si el fallo depende de la zona horaria (solo probé con TZ=UTC y una fecha), ni cuántas tareas reales afecta, porque el agente restauró la copia de producción en un contenedor temporal contra INC-0412 sin preguntarme y descarté usar esas cifras.
