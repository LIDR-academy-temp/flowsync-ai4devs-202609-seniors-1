# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla.

- 5 de 13 de los nuevos fallaron. 40 de los 40 que había siguen pasando. En pantalla: `make test` → `48 passed, 5 failed (53)`; `make test-e2e` → `44 passed, 3 failed (47)` (3 de 7 nuevos en rojo); `make test-unit` → `4 passed, 2 failed (6)`, cuando antes daba `NO TESTS EXECUTED`.

## 2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó. 

Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.

- Pasaron 8. Funcionales (4): «Vencer hoy», «Fecha futura», «Sin fecha» y «Hecha con la fecha pasada», todos esperan `false`, y los 3 rojos esperan `true`: por `GET` la fecha llega como `Date`, `Date < string` es siempre `false`, así que los que tienen fecha pasan sin demostrar nada («Sin fecha» sale antes, por la comprobación de `null`); unitarios (4): anterior, igual, posterior y sin fecha pasan porque reciben la fecha como texto o nula, mientras que «Hecha» falla porque la regla no mira el estado, un segundo defecto que en el funcional queda tapado por el primero.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No comprobé que un `PUT` con fecha pasada sobre una tarea hecha responda `isOverdue: true` (lo deduzco del código, ningún test lo recorre) ni que arreglar solo la fecha ponga en rojo «Hecha con la fecha pasada» y «Darla por hecha»; como objeto de fecha solo probé `Date` (no `DateTime` de Luxon) y el caso se detiene en la fecha anterior; el agente había leído `task.ts` antes de escribir los tests; y el `GET` devuelve `dueDate` con hora (`2026-08-19T00:00:00.000Z`) y el `PUT` sin ella, algo que ningún test nuevo compara con un formato.
