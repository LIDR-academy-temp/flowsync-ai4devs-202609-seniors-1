# Hallazgos

## 1. Cuántos casos nuevos fallaron y cuántos de los que había siguieron en verde

- Parte A (`make test-e2e`): «Tests  44 passed, 3 failed (47)». De mis 7 tests nuevos fallan 3
  (Fecha del día anterior, Darla por hecha la deja de vencer, Aplazar resuelve el vencimiento) y
  los 40 que ya existían siguen en verde. Parte B (`node ace test unit`): «Tests  5 passed,
  2 failed (7)»: fallan «hecha y con la fecha pasada» y «fecha anterior llegando como Date».

## 2. Cuál de mis casos nuevos pasó y por qué

- Por HTTP pasaron 4 de 7 (vencer hoy, fecha futura, sin fecha y hecha con fecha pasada), y los
  cuatro esperan `false`; los tres que fallan esperan `true` y leen la tarea de la base. Creo que
  pasan porque `isOverdue` sale siempre `false` por HTTP: `dueDate` está declarado `string`, pero
  `pg` lo devuelve como `Date` (lo comprobé con una consulta) y `Date < '2026-03-10'` nunca es
  cierto. El más engañoso es «hecha con la fecha pasada»: pasa por HTTP, pero en el test unitario
  falla (`false → true`) porque la regla no mira el estado. Es un verde falso: un fallo tapa al otro.

## 3. De qué dudé o qué no pude comprobar

- Los Scenarios 5 y 7 fallan en su comprobación previa («antes está vencida»), así que su
  afirmación final («deja de estar vencida» tras el PATCH o el PUT) no llegó a medirse. En el caso
  unitario del `Date` usé medianoche UTC y `as any`, que no es el mismo instante que entrega `pg`
  en mi máquina (medianoche de America/Bogota). Además, leí `task.ts` antes de escribir los tests
  funcionales, así que no puedo asegurar que el contrato saliera solo de la spec.
