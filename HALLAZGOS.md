# Hallazgos

## 1. Cuántos fallaron y cuántos de los que había siguieron pasando

- De mis 13 casos nuevos fallaron 5 (3 de 7 funcionales, 2 de 6 unitarios) y pasaron 8; los 40 que ya había siguieron en verde (`make test-e2e`: 44 de 47; `make test-unit`: 4 de 6).

## 2. Qué caso pasó y por qué

- Pasó «hecha con la fecha pasada» por HTTP, pero por accidente: los casos que fallan por HTTP son los que esperan `isOverdue: true`, porque la comparación de `isOverdueOn` da siempre `false` cuando `dueDate` llega como `Date` en vez de texto, y eso tapa que la regla no mira `status` (el unitario de ese caso falla con `true`).

## 3. Duda

- No comprobé en ejecución que la base devuelva `dueDate` como `Date` (lo deduzco de que falle el caso del objeto `Date`), y mis tests de «darla por hecha» y «aplazar» fallan en la precondición, así que no sé si el `PATCH` y el `PUT` (con `today` en el cuerpo) cumplen la spec.
