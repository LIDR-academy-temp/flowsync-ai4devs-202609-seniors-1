# Hallazgos

Tests del requisito «Cuándo una tarea está vencida» (`openspec/specs/tasks/spec.md`) y de su regla,
`Task#isOverdueOn` (`backend/app/models/task.ts`). No se ha tocado ninguna línea de implementación.

Casos nuevos:

- `backend/tests/functional/tasks/overdue.spec.ts`: 7 casos funcionales por HTTP, uno por Scenario.
- `backend/tests/unit/task_is_overdue_on.spec.ts`: 6 casos unitarios, sin servidor ni base de datos.

## 1. Cuántos fallaron y cuántos siguieron en verde

| Suite | Comando | Pantalla | Nuevos | Fallan | Pasan | Ya existían | Siguen en verde |
|---|---|---|---|---|---|---|---|
| functional | `make test-e2e` | `Tests  45 passed, 2 failed (47)` | 7 | 2 | 5 | 40 | 40 |
| unit | `node ace test unit` | `Tests  4 passed, 2 failed (6)` | 6 | 2 | 4 | 0 (la suite no existía) | — |

En total: **13 casos nuevos, 4 fallan y 9 pasan. Los 40 que ya había siguen en verde.**

Los que fallan:

- funcional, *Fecha del día anterior* (`overdue.spec.ts:98`): `expected false to be true`
- funcional, *Darla por hecha la deja de vencer* (`overdue.spec.ts:159`): `expected false to be true`. Falla en la
  comprobación previa: la tarea ya no llega vencida antes de pasarla a `done`.
- unitario, *tarea ya hecha con la fecha pasada* (`task_is_overdue_on.spec.ts:43`): `expected true to be false`
- unitario, *texto u objeto de fecha* (`task_is_overdue_on.spec.ts:66`):
  `dueDate 2026-08-19 (pending) frente a 2026-08-20: expected false to equal true`

## 2. Cuál pasó y por qué

Lo que tienen en común los dos funcionales que fallan: los dos esperan `isOverdue: true` en una tarea
**leída de la base** (`GET /api/v1/tasks/:id`). Ninguna tarea leída de la base llega vencida. Los
funcionales que pasan esperan `false`, o leen el `true` de otra respuesta. Es decir, pasan porque la
respuesta es siempre `false`, no porque la regla funcione.

La causa está en el tipo de `dueDate`. `database/schema.ts` lo declara como `string`, pero el driver de
PostgreSQL devuelve las columnas `date` como objeto `Date` si nadie le registra otro parser, y en el
proyecto no hay ninguno. `isOverdueOn` hace `this.dueDate < referenceDay`, y comparar un `Date` con un
texto en JavaScript pasa los dos a número. El texto se convierte en `NaN`, así que la comparación da
`false` siempre. El unitario *texto u objeto de fecha* lo reproduce en aislamiento.

Lo confirma el caso funcional *Aplazar resuelve el vencimiento*. Su comprobación previa, `isOverdue:
true` en la respuesta del `PUT /due-date` con el día anterior, **pasa**. En ese `PUT` el controlador
asigna `dueDate` como texto en memoria y no lo vuelve a leer de la base, así que la regla compara texto
con texto y funciona. Es la misma tarea y el mismo día: vencida en la respuesta del `PUT` y no vencida
en el `GET`.

**El caso más interesante es el funcional *Una tarea hecha con la fecha pasada*: PASÓ, y su gemelo
unitario FALLÓ.** `isOverdueOn` no comprueba el estado `done`, que es la tercera condición de la regla.
El unitario lo destapa porque trabaja con texto. Por HTTP, el error del `Date` hace que nada llegue
vencido, y eso tapa también que falte la comprobación de `done`. Son dos fallos que se esconden el uno
al otro: arreglar solo el del `Date` haría que ese funcional se pusiera en rojo.

Por la misma razón, de los 5 funcionales verdes, los que esperan `false` (mismo día, fecha posterior,
sin fecha, hecha con la fecha pasada) **no prueban nada hoy**: con la API respondiendo siempre `false`,
pasarían con cualquier regla. Valdrán como red cuando se arregle el error del `Date`.

## 3. Dudas y lo que no pude comprobar

- **No vi el `Date` en la base.** Lo deduzco de dos cosas: que no hay parser registrado para el tipo
  `date` en `config/`, `start/`, `providers/` ni `app/`, y de la diferencia entre la respuesta del
  `PUT` y la del `GET`. No he mirado qué valor trae `dueDate` en un `GET` ni he consultado la base por
  el MCP.
- **El unitario del `Date` usa medianoche local** (`new Date('AAAA-MM-DDT00:00:00')`), imitando lo que
  hace el driver con una columna `date`. Con otro huso o con un `Date` en UTC, el día podría moverse, pero
  hoy da igual porque la comparación es `false` para cualquier `Date`.
- **«Creada hace semanas»**: la API no deja fijar la fecha de creación. El funcional *Sin fecha no se
  vence nunca* envejece `createdAt` escribiendo en el modelo y el resto lo lee por HTTP. Es la única
  escritura que no pasa por la API.
- **La tarea hecha y su fecha**: en *Una tarea hecha con la fecha pasada* se marca primero como `done`
  y después se le pone la fecha. Asumo que el orden no importa para la regla.
- **Node**: `ace` no arranca con el Node 22 del sistema (`ERR_UNKNOWN_FILE_EXTENSION` en
  `bin/console.ts`). Ejecuté las suites con Node 24 por nvm.