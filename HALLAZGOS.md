# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Mi migración no toca datos.

Lo medido:

Migraciones nuevas: ninguna (git diff --diff-filter=A s10/start -- backend/database/migrations → 0). El cambio de motor solo cambia configuración (compose.yaml, config/database.ts, DB_*) y vuelve a ejecutar las mismas 4 migraciones sobre bases vacías.
SQLite de origen (backend/tmp/db.sqlite3, leída en solo lectura): users 0, auth_access_tokens 0, tasks 0. No había nada que copiar, y no se copió nada.
PostgreSQL de desarrollo: 1 usuario y 1 tarea. No vienen de ninguna migración de datos: los creé yo en la auditoría del punto anterior.
Rama: la de «no toca datos», es decir, reversible sin pérdida. Deshacerlo es revertir el commit 70366d9 y hacer make db-down: la SQLite sigue intacta en disco y ninguna fila cambió. No sé cómo nombra las ramas el árbol de la lección, así que ajusta la etiqueta a la del curso.

Matiz que vale anotar: los valores guardados no cambian (la tabla guarda 2026-08-19 como date), pero sí cambia lo que la aplicación lee: el driver lo devuelve como Date. Es un cambio de valor que ninguna consulta de conteo detecta.

-

## 2. Lo que la batería de pruebas no podía ver

Que una tarea leída de la base salga como vencida.

Dónde busqué: backend/tests/functional/. Para tasks solo existe assignee.spec.ts, y buscar dueDate, isOverdue o due-date en backend/tests da 0 resultados.
Qué pasa sin ese test: con PostgreSQL, isOverdueOn compara un Date con un texto y devuelve false siempre. Una tarea con fecha 2026-08-19, consultada con today=2026-08-20 o 2030-01-01, sale isOverdue: false. Además dueDate llega como "2026-08-19T00:00:00.000Z" en vez de "2026-08-19".
Por qué las pruebas no podían verlo:
No hay ningún test de esa capability.
Si lo hubiera y solo comprobara la respuesta del PUT, también pasaría, porque esa respuesta usa el texto recién asignado en memoria.
El typecheck tampoco lo ve, porque schema_rules.ts fija dueDate como string.
Una pista sin comprobar, para la línea 3 (duda): INC-0412 habla de tareas que no salen en ningún filtro. La batería crea todas sus tareas por la API, así que el validador solo deja pasar los tres estados válidos. Una fila de producción con otro valor en status (la columna es texto sin CHECK) no saldría en ningún filtro, y las pruebas nunca podrían generarla. Comprobarlo exige mirar el volcado, y eso no lo hice ni debería hacerlo yo. Haría falta restaurarlo en una base aislada tuya y contar los status que no estén entre los tres válidos.

-

## 3. Tu duda

No pude comprobar los ejercicios en la WEB para ver lo que habia creado ya que no me permitio ingresar.

-
