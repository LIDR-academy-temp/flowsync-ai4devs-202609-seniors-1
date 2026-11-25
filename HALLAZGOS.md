# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla
| Grupo | Fichero | Pasan | Fallan |
|---|---|---|---|
| Nuevos | `tests/functional/tasks/overdue.spec.ts` | 4 | 3 |
| Nuevos | `tests/unit/tasks/is_overdue_on.spec.ts` | 6 | 2 |
| Existentes | `assignee`, `trash`, `initials`, `login`, `session`, `signup` | 40 | 0 |


## 2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó

### Unitarios (`is_overdue_on.spec.ts`): 6 de 8

| Caso | Por qué pasa |
|---|---|
| Fecha anterior y tarea sin hacer: vencida | `'2026-08-19' < '2026-08-20'` es `true`. |
| Fecha igual al día de referencia: no vencida | El `<` es estricto, así que vencer hoy no cuenta como vencida. |
| Fecha posterior: no vencida | `'2026-08-21' < '2026-08-20'` es `false`. |
| Sin fecha: no vencida | `dueDate === null` devuelve `false` de entrada. |
| Fecha igual, como texto y como `Date` | Con `Date` la comparación da `false`, que es lo esperado. |
| Fecha posterior, como texto y como `Date` | Igual: da `false`, que es lo esperado. |

### Funcionales (`overdue.spec.ts`): 4 de 7

| Caso | Por qué pasa |
|---|---|
| Vencer hoy no es estar vencida | Misma regla del `<` estricto, ahora por HTTP. |
| Fecha futura: no llega vencida | `false` es lo esperado. |
| Sin fecha no se vence nunca | `dueDate` es `null`, así que devuelve `false` aunque la fila sea antigua. |
| Tarea hecha con la fecha pasada | Pasa de rebote: el test espera `false` y la API lo da, pero por una razón equivocada. Probablemente es el mismo defecto que rompe el caso unitario de «tarea hecha», así que no prueba la regla. |


## 3. De qué dudaste

De si los test que ya estaban realmente comprobaban lo que se esperaba