# Hallazgos

Requisito: «Cuándo una tarea está vencida» (`openspec/specs/tasks/spec.md`). Día de referencia
fijo en todos los tests: `2026-08-20`. Implementación sin tocar.

## 1. Cuántos casos nuevos fallaron y cuántos de los que ya había siguieron en verde

`make test-e2e`: **44 pasan y 3 fallan**. Los 3 rojos son casos nuevos (escenarios 1, 5 y 7 de
`backend/tests/functional/tasks/overdue.spec.ts`); los otros 4 nuevos pasan, así que los **40
preexistentes siguieron en verde** (44 − 4; la cifra sale de restar, la pantalla da el total).
`make test-unit`: **5 pasan y 3 fallan** (casos 5, 6b y 6c de
`backend/tests/unit/models/task_is_overdue_on.spec.ts`); los 8 son nuevos, porque `tests/unit/` no
existía.

## 2. Qué caso nuevo pasó y por qué

Por HTTP pasaron los escenarios 2 (vence hoy), 3 (fecha futura), 4 (sin fecha) y **6 (hecha con
fecha pasada)**. Lo que tienen en común los tres rojos (1, 5 y 7) es que **todos esperan
`isOverdue: true`** en una tarea leída de la base, y todos los verdes esperan `false`: por HTTP
`isOverdue` no sale `true` nunca. Por eso el 6 pasa sin que la regla mire el estado `done` (el 5 y
el 7 fallan ya en su comprobación previa de «está vencida»). La causa que respaldan la salida y el
código: la columna `due_date` es `date`, el driver `pg` la devuelve como objeto `Date` aunque el
modelo la declara `string` (la API la devuelve como `2026-08-19T00:00:00.000Z`), e `isOverdueOn`
la compara con `<` contra el texto de `today`, lo que da siempre `false`. La Parte B lo confirma
sin base de datos: con texto los casos 1 a 4 y 6a pasan, y con `Date` fallan 6b y 6c. El caso
unitario 5 falla por otra razón, que por HTTP queda tapada: `isOverdueOn` no comprueba
`status !== 'done'` (`backend/app/models/task.ts:74`).

## 3. De qué dudé o qué no pude comprobar

- No he comprobado qué pasará cuando se corrija la fecha. Lo que espero es una deducción: el 7
  pasaría a verde, y el 5 y el 6 a rojo por la falta de la condición de `done`.
- La cifra de 40 preexistentes en verde es una resta, no una línea de la salida.
- La conversión de `pg` depende del huso del proceso: desde mi consulta salió
  `2026-08-19T06:00:00.000Z` y desde la API `T00:00:00.000Z`. No comprobé si eso puede mover el
  día y cambiar `isOverdue` en otro huso.
- En el caso 6b construí el `Date` a medianoche local imitando a `pg`; no verifiqué que sea
  exactamente el mismo valor que entrega el driver en todos los entornos.
- No cubrí los escenarios del requisito vecino («El día de referencia lo pone quien mira»: `today`
  ausente o inválido) ni el formato `AAAA-MM-DD` de `dueDate`, que tampoco se cumple.
