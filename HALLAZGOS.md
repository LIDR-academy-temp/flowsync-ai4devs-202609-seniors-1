# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- La migración no modifica ninguna fila: mediante COUNT(*) comprobé que SQLite conserva 2 usuarios, 1 tarea y 6 tokens que no se han trasladado a PostgreSQL, por lo que el cambio pertenece a la rama reversible sin destrucción de datos originales.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Aunque las 23 pruebas pasan, ninguna comprueba el vencimiento de las tareas: verifiqué mediante la API y el REPL que dueDate llega como Date en lugar de string, provocando que una tarea vencida devuelva isOverdue: false y que su detalle falle en el frontend.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Dudé de que un typecheck sin errores y un diff vacío de schema.ts garantizaran el mismo comportamiento tras cambiar de motor, hasta que comprobé mediante el REPL que el tipo real de dueDate no coincidía con el declarado.
