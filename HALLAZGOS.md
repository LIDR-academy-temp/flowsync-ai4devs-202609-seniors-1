# Hallazgos

## 1. Cuántos casos nuevos fallaron y cuántos de los que ya había siguieron en verde

- `make test-e2e` dio `Tests 44 passed, 3 failed (47)`: de mlosis 7 casos funcionales fallaron 3 y pasaron 4, y los 40 que ya había siguieron todos en verde; `make test-unit` dio `Tests 6 passed, 2 failed (8)`.

## 2. Cuál de los casos nuevos pasó y por qué

- Pasaron justo los que esperan `isOverdue: false` (vence hoy, fecha futura, sin fecha y hecha con fecha pasada), y fallaron todos los que en algún momento esperan `true`: `dueDate` sale de Postgres como un `Date` (la respuesta trae `"2026-08-20T00:00:00.000Z"`) y `Date < 'AAAA-MM-DD'` da siempre `false`, así que la regla dice «no vencida» a todo y cualquier test que espere `false` pasa sin medir nada; el caso «hecha con la fecha pasada» es un verde falso, porque además falta el `status === 'done'` y solo el test unitario, sin base de datos, lo pone en rojo.

## 3. De qué dudé o qué no pude comprobar

- No pude comprobar el efecto del huso horario: `pg` crea el `Date` a medianoche local y aquí el proceso corre en UTC, así que en un huso positivo el `dueDate` del JSON podría salir con el día anterior y no lo he probado
