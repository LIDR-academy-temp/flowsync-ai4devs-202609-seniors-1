# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

- La migración no modifica ningún dato guardado (base nueva, migraciones existentes intactas, `schema.ts` sin cambios), pero cambia cómo se lee: `count(*) filter (where due_date is not null)` da 1 y esa fila cambia de valor al leerse (guardada como `2026-11-01` de tipo `date`, la API devuelve `2026-11-01T00:00:00.000Z`), y con `today=2026-11-18` la consulta SQL (`due_date < date '2026-11-18'`) cuenta 1 vencida y la API dice `isOverdue: false`; cae en la rama 1 del árbol (reversible, no se pierde ningún dato), con la salvedad de que no migré datos reales de SQLite.

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

- Ninguna de las 23 pruebas toca fechas (`tests/functional/tasks` solo cubre el responsable, no `dueDate` ni `isOverdue`), y `isOverdueOn` compara `this.dueDate < referenceDay` suponiendo texto; con PostgreSQL el driver `pg` devuelve el `date` como `Date`, así que al releer la tarea `isOverdue` sale `false` aunque venza antes de `today`, mientras `typecheck` pasa y el diff de `schema.ts` sale vacío, porque `schema_rules.ts` declara `due_date` como `string` sin convertir nada al ejecutar.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No comprobé el arreglo (leer `date` como texto en la conexión o convertir al leer), ni el frontend con el nuevo formato de `dueDate`, ni una tarea `done` con fecha pasada (el comentario habla de «no está hecha» y `isOverdueOn` no parece comprobarlo, pero no lo ejecuté), ni el desfase de un día fuera de UTC en el servidor (en un shell con zona CET salió `2026-11-17T23:00:00Z`, pero `.env` fija `TZ=UTC`); tampoco sé si cuenta como «rama 1» un cambio que no pierde datos pero sí comportamiento, y el arranque desde cero lo probé una vez sin fallo, no varias.
