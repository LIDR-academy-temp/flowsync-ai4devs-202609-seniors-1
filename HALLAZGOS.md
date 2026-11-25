# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos casos nuevos fallaron y cuántos de los que ya había siguieron en verde

- Escribí 16 casos nuevos y fallaron 11: de los 7 funcionales (`backend/tests/functional/tasks/overdue.spec.ts`, uno por Scenario de «Cuándo una tarea está vencida») fallaron 6, y de los 9 unitarios (`backend/tests/unit/task_is_overdue_on.spec.ts`, los bordes de `isOverdueOn` con la fecha como texto y como objeto de fecha) fallaron 5. Los 40 casos que ya existían siguieron todos en verde, y la pantalla dio literalmente `Tests  41 passed, 6 failed (47)` en `make test-e2e` y `Tests  4 passed, 5 failed (9)` en `make test-unit`.

## 2. Cuál de mis casos nuevos pasó y por qué

- Pasaron 5 de los 16: «Sin fecha no se vence nunca» en las dos suites y, en la unitaria, los tres bordes con la fecha como **texto** (anterior, igual, posterior). Lo que tienen en común los que fallaron es que ninguno recibe un texto: o la fecha llega como `Date` desde la base (los 6 funcionales y 4 de los unitarios), o el caso exige tener en cuenta el estado `done`. Los que pasaron o no dependen de la fecha («sin fecha», siempre `false` sin poder pedir un `true`) o usan texto, que es la única forma con la que la regla funciona: comprobado con una sonda temporal, `dueDate` llega de la base como `Date` (`typeof` = `object`) aunque el modelo lo declare `string`, y `Date < '2026-08-20'` da `false`, así que `isOverdue` sale siempre `false`. Por eso una suite unitaria escrita solo con fechas en texto habría salido toda en verde, y lo mismo las versiones originales, sin contraste, de «vencer hoy», «fecha futura» y «hecha con fecha pasada» en la funcional (probado: 3 de 3 pasaban contra esta implementación rota).

## 3. De qué dudé o qué no pude comprobar

- No pude arreglar la regla, porque no se podía tocar la implementación, así que lo que pedí («se comporte igual con texto y con objeto de fecha») queda como 5 tests en rojo y no como código; solo lo comprobé en una copia fuera del repo: con la fecha leída por componentes locales (`getFullYear()/getMonth()/getDate()`) y la comprobación de `done`, que no existe (`isOverdueOn` solo mira dos de las tres condiciones de la spec, un segundo fallo que el primero tapaba), dieron verde los 7 funcionales de `overdue.spec.ts` y los 9 unitarios en UTC, Los Ángeles, Zúrich, Tokio y Kiritimati (+14), y la suite funcional completa (47/47) en UTC, mientras que `toISOString()` fallaba «vencer hoy» en Zúrich y Tokio. Dudas que quedan: construyo el objeto de fecha a medianoche local porque así parece que lo hace el driver (lo respalda que la corrección por componentes locales pase en todos los husos, pero no leí el driver), no he identificado ningún tercer fallo, pero no escribí los Scenarios de otros requisitos de la spec (el `422` sin `today`, que la lista no lleve el vencimiento) y ahí podría haber otro tapado, el cuerpo sigue devolviendo `dueDate` como `2026-08-19T00:00:00.000Z` y no como día (no es de ningún Scenario y no lo cubro), `make test-unit` depende de `migrate` aunque los tests no necesitan base de datos (comprobado con `DB_PORT=1`), y los contrastes que añadí y expresar «creada hace semanas» con un `today` lejano (`2099-12-31`) son decisiones mías, no de la spec.
