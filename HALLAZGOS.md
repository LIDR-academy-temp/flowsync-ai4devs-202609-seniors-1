# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- Cero filas cambian de valor: las cuatro migraciones están intactas (`git diff s10/start -- backend/database/migrations` vacío) y no hay ninguna nueva, así que el cambio de esquema no toca datos (consulta sobre el SQLite de origen: `select count(*) from tasks where due_date is not null` = 0, porque `tasks` tiene 0 filas); lo que sí cambia es el tipo con el que se lee `due_date` (cadena → objeto `Date`), sin cambiar un solo byte almacenado, y lo que no se ha movido son las 12 filas de `users` y las 14 de `auth_access_tokens` del SQLite, que siguen en `tmp/db.sqlite3` mientras Postgres arrancó con 0; midiendo una copia de esas 26 filas contra las tablas reales de Postgres (consulta dentro de una transacción con `ROLLBACK`, FK y duplicados sin problemas), entran 12 de 12 de `users` pero su texto de fecha sin huso cambia de instante en 12 de 12 si la sesión no está en UTC (0 en UTC), y 0 de 14 de `auth_access_tokens` entran tal cual porque sus fechas son enteros en milisegundos (`column "created_at" is of type timestamp with time zone but expression is of type bigint`), aunque con `to_timestamp(x/1000.0)` entran 14 de 14 y el viaje de ida y vuelta no cambia ninguna, así que una migración de datos tocaría 14 filas siempre y 26 con un huso distinto de UTC.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- El vencimiento de las tareas: creé una tarea con `dueDate` 2026-01-10 y la leí con `today=2026-11-18` y `GET /tasks/:id` devolvió `isOverdue: false` y `dueDate: "2026-01-10T00:00:00.000Z"` (debía ser `true` y `"2026-01-10"`), porque `pg` entrega las columnas `date` como `Date` y `isOverdueOn` compara `Date < string`, que es siempre falso; la suite (23/23 en verde) no lo ve porque `tasks` solo tiene 3 de sus 124 scenarios cubiertos y ninguno es de vencimiento, y el typecheck tampoco, porque `schema_rules.ts` declara `due_date: string` y solo fija el tipo, no el valor en ejecución; el diff de `database/schema.ts` contra `s10/start` sale vacío (también regenerado contra Postgres) porque la tabla de mapeo del generador de Lucid lleva `datetime` (SQLite) y `timestamp with time zone` (Postgres) al mismo `DateTime`, `integer` a `number` y `varchar` a `string`, y porque `schema_rules.ts` fija `status` y `due_date`, así que lo que cambió con el motor (`date` pasa de texto a `Date` en lectura) no está en lo que el proyecto declara, y además el fallo depende del endpoint: con una tarea de ayer y otra de hace diez meses, `PUT /tasks/:id/due-date` responde `isOverdue: true` (el modelo aún guarda la cadena recién asignada) y el `GET /tasks/:id` siguiente responde `false`, así que la misma tarea sale vencida justo al fijarle la fecha y deja de salirlo al releerla.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No pude mapear mi caso a una rama concreta del árbol de reversibilidad porque ese árbol no está en el repositorio (solo se nombra en la lección) y escribí «no toca datos» sin poder contrastarlo con sus nombres; tampoco comprobé si el desfase del día depende del huso (el `Date` se construye a medianoche en la zona del proceso y aquí `TZ=UTC` lo esconde), si la pantalla del frontend muestra mal la fecha, ni si el encargo quería copiar los datos del SQLite a Postgres, y no he corregido el fallo de vencimiento porque la tarea era cambiar el motor y medir lo perdido.
