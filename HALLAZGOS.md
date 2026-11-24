# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde

- **Funcionales:** fallaron 3 de mis 7 casos nuevos y los 40 que ya había siguieron en verde (`44 passed, 3 failed (47)`); **unitarios:** fallaron 5 de 18 y no había ninguno previo, porque al principio `make test-unit` respondía `NO TESTS EXECUTED` sin dar error.

- **Funcionales:** fallaron 3 de mis 7 casos nuevos y los 40 que ya había siguieron en verde (`44 passed, 3 failed (47)`, salida completa de `make test-e2e`); **unitarios:** fallaron 5 de 18 y no había ninguno previo, porque al principio `make test-unit` respondía `NO TESTS EXECUTED` sin dar error.

## 2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó

- Pasaron «vencer hoy», «fecha futura», «sin fecha» y «aplazar», y 13 unitarios: los que esperan `false` leyendo con `GET` o con un `Date` pasan por casualidad, porque `dueDate` llega de la base como `Date` y compararlo con `<` contra un texto da siempre `false`; los que sí fallaron esperan `true` en esa lectura o usan `done`, y «aplazar» es el único verde funcional con valor, porque mira el `PUT`, donde la fecha es texto en memoria.

## 3. De qué dudaste o no pudiste comprobar

- No comprobé directamente que `dueDate` llegue de la base como `Date` (lo deduje porque el test unitario con `Date` reproduce el síntoma), ni que pasar a `done` quite el vencimiento, porque «Darla por hecha» falla antes, en la comprobación previa; tampoco pude probar por HTTP el `<` estricto, porque el `GET` devuelve `false` siempre.
