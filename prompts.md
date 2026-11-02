# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
DELETE /api/v1/tasks/:id ya borra la tarea y responde 204 sin cuerpo, y el cambio está commiteado en feat/delete-task (f699fc3). Estaba en s8/start, así que creé esa rama desde ahí. Los tests functional (28), lint y typecheck pasan.

- Endpoint: es TasksController.destroy, con la ruta router.delete(':id', ...) junto a las demás de tasks. Usa Task.findOrFail, así que un id que no existe da 404, y también una segunda llamada sobre la misma tarea.
- Permisos: igual que el cambio de estado, cualquier cuenta con sesión puede borrar cualquier tarea. Sin token da 401.
- OpenAPI: el documento servido en /api.json ya incluye la operación con 204, 401 y 404. Aparece el 204 con un content: application/json vacío, un detalle cosmético del decorador.
- Registro Tuyau: regeneré .adonisjs/ arrancando el dev server, como indica CLAUDE.md, y está en el commit.
- README: actualicé docs/capabilities/tasks/README.md con la fila nueva y los códigos.
- Tests: añadí backend/tests/functional/tasks/delete.spec.ts con 5 casos (204, tarea ajena, 404, segundo borrado y 401), aislados con transacción global.

Lo que conviene revisar:
- Spec: openspec/specs/tasks/spec.md no tiene ningún requisito de borrado, así que esto queda fuera de la fuente de verdad. Lo dejé dicho en el README y en el test, pero no toqué la spec. Si quieres que el borrado sea un requisito, hay que añadirlo con el flujo de OpenSpec.
- openapi:check: npm run openapi:check falla con Invalid URL al cargar el comando. No lo investigué ni lo toqué.

No he abierto el PR ni lanzado el adversarial-reviewer, porque CLAUDE.md los reserva para cuando termine la unidad de trabajo. Dime cuándo la das por cerrada.

---

## Prompt 2

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
DELETE /api/v1/tasks/:id ya existe: borra la tarea y responde 204 sin cuerpo. Está commiteado en feat/tasks-delete-endpoint (a71cfa8). Los 29 tests functional pasan y lint y typecheck están limpios.

Qué hace:
- La ruta está en backend/start/routes.ts, en el mismo grupo tasks y con la misma autenticación que las demás.
- La lógica es TasksController.destroy. Si el id no existe responde 404, y sin token responde 401. Cualquier cuenta con sesión puede borrar cualquier tarea, como ya pasa con el cambio de estado.
- Añadí backend/tests/functional/tasks/delete.spec.ts con 6 tests: el 204 sin cuerpo, borrar la tarea de otra cuenta, que solo se borre esa tarea, el 404 por id inexistente y por borrado repetido, y el 401.
- Actualicé docs/api/openapi.json (solo suma la operación delete) y la tabla de endpoints del README de la capability.

Lo que conviene que sepas:
- Rama: feat/delete-task ya existía, con un commit de un intento anterior de este mismo endpoint. No la toqué y trabajé en una rama nueva desde s8/start.
- Comandos de OpenAPI rotos: npm run openapi:generate y openapi:check fallan con Invalid command exported from "openapi_check.js". Invalid URL. Ocurre también en el árbol limpio, así que no viene de mi cambio. Generé el documento con un script temporal que usa las mismas funciones del repo y lo borré después. Habría que arreglar el comando aparte.
- .adonisjs/ sin diff: git status no mostró cambios en backend/.adonisjs/, aunque list:routes sí registra la ruta (tasks.tasks.destroy). No he comprobado si esa carpeta se regenera ya en este repo.
- Spec sin actualizar: openspec/specs/tasks/spec.md no tiene ningún requisito sobre borrar tareas. No lo toqué, pero con el endpoint ya hecho conviene añadirlo por el flujo de OpenSpec.

No he abierto el PR ni pasado el adversarial-reviewer: según las reglas del repo eso va una sola vez, al terminar la unidad de trabajo.

---

## Prompt 3

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
DELETE /api/v1/tasks/:id ya borra una tarea y responde 204 sin cuerpo. La suite completa pasa (28 tests, 5 de ellos nuevos para este endpoint), y lint y typecheck también. Todo está en el commit b50e4bd, en la rama feat/delete-task, que creé porque estabas en s8/start.

- Controlador: TasksController.destroy busca la tarea y la borra. Si no existe responde 404, y sin token responde 401.
- Ruta: router.delete(':id', …) está en el grupo tasks, justo debajo del show.
- OpenAPI: la operación está anotada con los códigos 204, 401 y 404.
- README: actualicé docs/capabilities/tasks/README.md (tabla de endpoints, recuento de operaciones y el paso 7 del recorrido con curl).
- .adonisjs/: se regeneró el registro Tuyau y va en el mismo commit.
- Tests: delete.spec.ts comprueba el 204 sin cuerpo, el borrado de una tarea ajena, el 404 al repetir el borrado y el 401 sin sesión.
- Cualquier cuenta puede borrar cualquier tarea. No comprueba el responsable, igual que el cambio de estado. Es irreversible, así que dime si prefieres que solo pueda borrarla su responsable.
- La spec no incluye el borrado. openspec/specs/tasks/spec.md no tiene ningún requisito para esta operación, así que el README la lista sin una fila equivalente en la tabla de reglas. Para añadirlo habría que abrir un cambio con /opsx:propose.

Todavía no he abierto el PR ni pasado el adversarial-reviewer, porque CLAUDE.md los reserva para el cierre de la unidad de trabajo. Si esto cierra la unidad, dímelo y los hago.
---

## Prompt 4

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
DELETE /api/v1/tasks/:id ya existe. Borra la tarea y responde 204 sin cuerpo. Lint, typecheck y la suite completa (28 tests) pasan.

Lo hice en TasksController.destroy y declaré la ruta en start/routes.ts junto a las demás de tasks, dentro del grupo con auth. Con un token inválido da 401 y con un id que no existe da 404.

Cualquier cuenta con sesión puede borrar cualquier tarea, como ya pasa con el cambio de estado. El borrado es definitivo.

También añadí:
- tests/functional/tasks/delete.spec.ts: 5 tests (204 sin cuerpo, borrar la tarea de otra cuenta, 404, borrar dos veces, 401 con la tarea intacta).
- El README de la capability al día.
- El registro Tuyau de .adonisjs/ regenerado.

La rama era s8/start, así que creé feat/delete-task y commiteé ahí (8d3d64f).

Dos cosas pendientes:
- Spec: openspec/specs/tasks/spec.md no tiene ningún requisito de borrado, solo prohíbe borrar estados. Lo implementé como pediste y el README avisa de que no tiene requisito. Si quieres que quede en la spec, es un cambio aparte con /opsx:propose.
- PR y review: no he abierto el PR ni pasado el adversarial-reviewer. Según el CLAUDE.md van una sola vez, al terminar la unidad de trabajo. Si con esto la das por terminada, dímelo y los hago.
---

## Prompt 5

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
DELETE /api/v1/tasks/:id ya existe: borra la tarea y responde 204 sin cuerpo. Lint, typecheck y los 29 tests functional pasan, incluidos 6 nuevos que he escrito para este endpoint.

Está hecho en TasksController.destroy, con la ruta declarada junto a las demás de tasks, dentro del grupo con auth. Un id que no existe da 404 y sin token da 401. Cualquier cuenta con sesión puede borrar cualquier tarea, como ya ocurre con el cambio de estado. El borrado es definitivo, sin papelera.

Los 6 tests están en backend/tests/functional/tasks/delete.spec.ts. Cubren el 204 sin cuerpo, que la tarea desaparezca de la lista y de GET /tasks/:id, el borrado de una tarea ajena, el 404 por id inexistente o por borrar dos veces, y el 401 sin token. En el commit también van el diff regenerado de .adonisjs/ y el README de la capability actualizado.

- Rama: partías de s8/start, así que creé feat/delete-task. El commit es 171b346.
- Spec sin requisito de borrado: openspec/specs/tasks/spec.md no tiene ningún requisito para borrar una tarea, y el ADR 0001 ya lo señala. Implementé lo que pediste sin pasar por un change de OpenSpec, y lo dejé anotado en el README. Si quieres que la spec lo recoja, haría falta un change aparte.
- PR y revisión adversarial: no he abierto el PR ni lanzado el adversarial-reviewer. Según el CLAUDE.md van una sola vez, al terminar la unidad de trabajo. Dime cuándo la das por cerrada y los hago.

