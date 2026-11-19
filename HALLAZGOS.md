# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Las filas que cambian y la rama

Cuántas filas cambian de valor en tu cambio de esquema, medido con una consulta, y en qué rama del
árbol de reversibilidad cae. Si tu migración no toca datos, dilo tal cual: también es una respuesta.

-

## 2. Lo que la batería de pruebas no podía ver

Una cosa que la batería de pruebas no podía ver. Si no encontraste ninguna, escribe qué buscaste y dónde.

-

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

-

---

## Parte B: qué se ha perdido

Hecho con la batería en verde (`make test`: 23/23, contra `db-test` en 54411). Detalle completo en
[`docs/migration.md`](docs/migration.md#comprobaciones-tras-la-migración).

### 1. Comprobación de tipos

`(cd backend && npm run typecheck)` → **pasa** (exit 0). TypeScript solo ve lo que declara
`database/schema.ts`, que no ha cambiado; no puede ver que el driver ahora entrega otro tipo.

### 2. Diff de `backend/database/schema.ts` contra `s10/start`

**Vacío** (0 líneas); las migraciones tampoco cambian. Lo que fija los tipos es `database/schema_rules.ts`:
una regla de columna de tabla (la de mayor prioridad en el generador de Lucid) para `tasks.due_date`
(`string`, decorador `@column` plano) y `tasks.status`. Sin ella, un `date` de PostgreSQL se declararía
`DateTime` con `@column.date`. Como `@column` no transforma nada, el modelo recibe lo que devuelve el driver:
con `better-sqlite3` texto `'2020-01-01'`, con `pg` un `Date`. Lo que cambió es el valor en ejecución, no lo
declarado.

### 3. Cómo se decide si una tarea está vencida

`Task.isOverdueOn()` (`backend/app/models/task.ts`) hace `this.dueDate < referenceDay`. Su comentario («se
compara texto contra texto… no hay hora, ni huso») **ya no es verdad**: con un `Date` a la izquierda, `<`
compara número contra `NaN` y da **siempre `false`**.

Comprobado contra la API con una tarea que ya debería estar vencida (`dueDate = 2020-01-01`,
`today = 2026-11-19`, `pending`):

| Huso del proceso | Al guardar (`PUT .../due-date`) | Al releer (`GET /tasks/:id`) |
|---|---|---|
| UTC | `"2020-01-01"`, `isOverdue: true` | `"2020-01-01T00:00:00.000Z"`, **`isOverdue: false`** |
| Europe/Madrid | `"2020-01-01"`, `isOverdue: true` | **`"2019-12-31T23:00:00.000Z"`**, **`isOverdue: false`** |

En SQL, `due_date < date '2026-11-19'` da `t`. Se pierden dos cosas sin que falle nada: la condición de
vencida al leer de la base y el contrato de `dueDate` (de día `AAAA-MM-DD` a instante, con un día menos fuera
de UTC). Ninguna de las 23 pruebas cubre `due_date` ni `isOverdue`.
