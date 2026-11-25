# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte A a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos casos nuevos fallaron y cuántos de los que ya había siguieron en verde

Con la cifra que te dio la pantalla.

- De mis 13 casos nuevos (7 funcionales por HTTP y 6 unitarios) fallan 5 y pasan 8; los 40 que ya había siguieron todos en verde: `make test` da `Tests 48 passed, 5 failed (53)`. Los rojos son 3 funcionales (fecha de ayer, darla por hecha, aplazar) y 2 unitarios (hecha con la fecha pasada, fecha como objeto igual que como texto).

## 2. Cuál de mis casos nuevos pasó y por qué

Si alguno pasó, y por qué crees que pasó.

- Pasaron, entre otros, los funcionales «vence hoy», «fecha futura», «sin fecha» y «hecha con la fecha pasada», y creo que pasan por casualidad y no porque la regla funcione: los cuatro esperan `false`, y los tres funcionales que fallan son los que necesitan un `true`; el unitario con la fecha como objeto confirma que con un `Date` la regla da siempre `false` (comparar un `Date` con texto no puede dar `true`), mientras que el mismo caso de «hecha» con texto sí falla (`isOverdueOn` no mira el estado), cosa que el funcional no detecta.

## 3. Mi duda

De qué dudaste, o qué no pudiste comprobar.

- Dudé de cómo probar «creada hace semanas» por HTTP (no se puede fechar la creación hacia atrás: usé `today=2030-01-01`) y de comprobar «darla por hecha» con un GET posterior (según el cliente, el PATCH de estado no devuelve el vencimiento); acepté un `as unknown as string` en el unitario para forzar un `Date`, y su bucle se para en la primera fecha, así que la fecha igual al día de referencia no llega a compararse; no comprobé en ejecución que por HTTP la fecha llegue como `Date` (lo deduzco del unitario y de que la columna es `date` y el tipo generado dice `string`), ni cómo se comportaría la regla arreglada, porque no toqué la implementación.
