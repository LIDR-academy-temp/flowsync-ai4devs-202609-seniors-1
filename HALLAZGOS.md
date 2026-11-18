# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- 0 filas cambian de valor: `select count(*) from tasks where due_date is not null` (y los recuentos de users, tasks y auth_access_tokens) da 0 en el SQLite de partida y en db, y ninguna migración modifica datos. Rama: no toca datos, porque es un cambio de motor sin transformar datos que se deshace volviendo a s10/start mientras db no tenga datos; lo que cambia no es el valor guardado sino cómo se lee: pg devuelve due_date como Date.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- isOverdue es siempre false al releer una tarea: con una vencida, el PUT devuelve true y el GET false, porque pg entrega un Date y task.ts:52-56 lo compara con un string (NaN → false); typecheck no lo ve porque schema_rules.ts:27-33 fija string, y ningún test relee la tarea tras fijar la fecha (grep "due|overdue|vencid" en tests/ sale vacío).

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No pude situar el cambio en el árbol de reversibilidad con lo que hay en el repo, y no comprobé el frontend (dueDate como instante, isOverdue siempre falso), el desfase de un día con TZ distinta de UTC más allá de un script, ni el cambio de openapi.yml, porque openapi:check ya fallaba antes con Invalid URL.
