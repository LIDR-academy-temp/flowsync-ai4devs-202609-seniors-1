# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- La migración no toca datos, así que cae en la rama de cambio reversible sin pérdida: con `select due_date::text` en PostgreSQL y `select due_date` en SQLite, las 6 filas tienen el mismo valor almacenado. Sin embargo, al consultarlas desde la API, 5 de las 6 fechas cambian de formato y 3 de las 6 tareas dejan de aparecer como vencidas. Esto pasa porque el driver `pg` convierte las columnas `date` en objetos `Date` de JavaScript, y comparar un `Date` con un texto siempre da false.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Encontré que ninguna prueba estaba comprobando isOverdueOn. Revisé los 6 archivos de backend/tests/ buscando referencias a isOverdue, dueDate, due_date, done y today, pero no encontré ninguna prueba que cree tareas con fechas y compruebe si están vencidas. Por eso pasan las 23 pruebas en ambos motores, aunque en PostgreSQL ninguna tarea aparece como vencida. También falta probar el caso de una tarea completada con una fecha pasada, que en SQLite sí aparecía como vencida.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No pude comprobar qué pasaría con datos antiguos porque la base de datos SQLite original estaba vacía. Tampoco estoy seguro de cómo se interpretarían las fechas al pasar de datetime a timestamptz. Otra duda que me queda es si el desfase de un día se evita únicamente usando TZ=UTC en el .env, ya que al probar con TZ=Asia/Tokyo la API devuelve las fechas con un día menos.
