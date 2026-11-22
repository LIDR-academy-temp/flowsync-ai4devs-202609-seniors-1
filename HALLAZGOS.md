# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte A a medias con estas tres líneas escritas vale más que lo contrario, porque
lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos casos nuevos fallaron y cuántos de los que ya había siguieron en verde

- Fallaron 5 de mis 13 casos nuevos (3 de los 7 funcionales y 2 de los 6 unitarios) y los 40 que ya había siguieron en verde: `Tests  48 passed, 5 failed (53)`.

## 2. Qué caso nuevo pasó y por qué

- Por HTTP solo pasan los casos que esperan false (vence hoy, fecha futura, sin fecha o hecha con fecha pasada) y fallan los tres que esperan true. Esto pasa porque due_date llega como un objeto Date desde el driver, y al comparar Date < '2026-08-20' siempre evalúa a false, así que por HTTP nunca sale nada como vencido. Ojo con el verde del caso «hecha con fecha pasada», porque es engañoso: el test unitario ya deja claro que isOverdueOn está ignorando el estado, pero este fallo con las fechas lo está tapando.

## 3. De qué dudé o qué no pude comprobar

- No pude comprobar «darla por hecha» ni «aplazar»: los casos 5 y 7 fallan en la comprobación previa, así que nunca llegan a lo que miden, y hasta que se arreglen las fechas no sé si esas dos reglas funcionan; «creada hace semanas» tampoco se puede reproducir por HTTP y lo sustituí por una tarea recién creada consultada con `today=2035-01-01`.
