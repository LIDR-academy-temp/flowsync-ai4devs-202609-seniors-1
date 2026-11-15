# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 filas cambian de valor, medido con `select count(*) as tareas, count(*) filter (where due_date is not null) as con_fecha from tasks` en la base de desarrollo (`0 | 0`, parte vacía): mi cambio no incluye ninguna migración nueva y las cuatro originales no se tocaron; cae en la primera rama (reversible con otra migración, sin datos que perder), pero lo que sí se perdió, que el driver entregaba la fecha como texto, no es dato ni esquema y ningún `down()` lo recupera.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Una prueba de que `isOverdue` funciona con una fecha de vencimiento real: busqué `isOverdue`, `dueDate`, `due_date` y `vencid` en `backend/tests` y no hay ninguna coincidencia, así que ninguno de los cinco archivos de test (los de `auth` y `assignee.spec.ts`) crea ni lee fechas de vencimiento, y por eso los 23 pasan aunque con PostgreSQL toda tarea vencida salga como no vencida.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Que la hipótesis del fallo (el driver `pg` devuelve un `Date`) la formuló el agente en la parte A antes de ejecutar nada y mi medición fue después; que no comparé la aplicación de extremo a extremo con SQLite, solo el comportamiento del driver por separado; y que solo probé la aplicación con `TZ=UTC`, mientras que el desplazamiento al día anterior con otra zona lo vi únicamente en una comprobación aparte del driver.
