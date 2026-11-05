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
```
DELETE /api/v1/tasks/:id ya borra la tarea y responde 204 sin cuerpo. Está commiteado en feat/delete-task (55c3b77), una rama nueva que salió de s8/start.

- Código: TasksController.destroy hace findOrFail y delete(), y responde con response.noContent(). La ruta está en el grupo tasks de start/routes.ts, así que lleva el middleware auth.
- Respuestas: un id inexistente, o ya borrado, da 404. Sin token da 401. En ambos casos no se borra nada.
- Permisos: cualquier cuenta con sesión puede borrar cualquier tarea, como ya pasa con el cambio de estado.
- Tests: añadí backend/tests/functional/tasks/delete.spec.ts con 5 casos. Pasan los 28 tests de la suite, y lint, typecheck y prettier salen limpios.
- Documentación: el README de la capability y las anotaciones OpenAPI recogen la operación nueva. Comprobé en /api.json que aparecen los 204, 401 y 404.
- Registro de .adonisjs/: lo regeneré y está en el commit. También recoge las rutas de status y due-date, que estaban desfasadas desde antes, así que el diff trae esas líneas además de la del borrado.

La spec de OpenSpec (openspec/specs/tasks/spec.md) no tiene ningún requisito de borrado, y no la toqué. Lo dejé anotado en el README. Si quieres que el borrado sea parte de la spec, hay que proponer un cambio con /opsx:propose.

En el documento OpenAPI, el 204 sale con un content: application/json: {} vacío. Es un detalle estético de la librería.

No abrí PR ni pasé el adversarial-reviewer. El CLAUDE.md pide hacerlo una sola vez al terminar la unidad de trabajo. Dime cuándo la das por cerrada.
```
## Prompt 2

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
```
DELETE /api/v1/tasks/:id ya existe y está commiteado en la rama feat/borrar-tarea (b7ee5c2). Los tests (28), el lint y el typecheck pasan. No he abierto PR ni pasado el adversarial-reviewer, porque eso va al terminar la unidad de trabajo.

- Comportamiento: borra la tarea y responde 204 sin cuerpo. Si no existe o ya se borró, responde 404. Sin token responde 401 y no borra nada.
- Permisos: cualquier cuenta con sesión puede borrar cualquier tarea, como el resto de la capability.
- Código: TasksController.destroy está en backend/app/controllers/tasks_controller.ts, con anotaciones OpenAPI para 204, 401 y 404. La ruta está en backend/start/routes.ts junto a las demás de tasks.
- Tests: backend/tests/functional/tasks/delete.spec.ts cubre el 204 sin cuerpo, que desaparezca de la lista para otra cuenta, el borrado de una tarea ajena, el 401 y el doble borrado.
- Registro Tuyau: el registro de .adonisjs/ se regenera al arrancar el dev server, no al correr los tests. Lo arranqué un momento y commiteé el diff.
- README: actualicé docs/capabilities/tasks/README.md con la ruta, el curl de prueba y la lista de tests.
- Sin requisito en la spec: openspec/specs/tasks/spec.md no tiene ningún requisito de borrado. Los tests y el README se apoyan en la historia us-borrar-tarea.md y lo dicen. Si quieres que el reviewer lo contraste contra la spec, hace falta un change de OpenSpec antes (/opsx:propose).
- Confirmación: la confirmación explícita (CA-4 a CA-6) queda para el cliente. La API borra al recibir la petición, y el README lo dice.
```

## Prompt 3

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
```
DELETE /api/v1/tasks/:id ya existe y está commiteado en feat/delete-task (ae99502). Lint, typecheck y los 28 tests de la suite pasan, y openapi:check también.

Estaba en s8/start, así que creé la rama feat/delete-task antes de tocar nada.

- Controlador: TasksController.destroy busca la tarea con findOrFail, la borra y responde 204 sin cuerpo. Está anotado con los decoradores OpenAPI (204, 401, 404).
- Ruta: router.delete(':id', [controllers.Tasks, 'destroy']) en el grupo tasks, así que hereda middleware.auth().
- Comportamiento:
  - Sin token responde 401 y no borra nada.
  - Una tarea que ya no existe da 404.
  - Cualquier cuenta con sesión puede borrar una tarea ajena, porque los roles son planos.
- Tests: backend/tests/functional/tasks/delete.spec.ts cubre el 204 sin cuerpo, que la tarea desaparezca de la lista para otra cuenta, el borrado de una tarea ajena, el 401 y el 404 al borrar dos veces.
- Docs:
  - OpenAPI: docs/api/openapi.json está regenerado, porque openapi:check fallaba sin la operación nueva.
  - README: docs/capabilities/tasks/README.md tiene la fila nueva en la tabla de endpoints y la aclaración de que el 204 no va envuelto en { data }.

Dos cosas que quizá te interesen:
- Spec sin actualizar: openspec/specs/tasks/spec.md no tiene ningún requisito de borrado, y la historia us-borrar-tarea.md sigue "sin descomponer". Ese es el trabajo de openspec-propose, y no lo toqué.
- Confirmación en el frontend: la historia dice que la confirmación explícita (CA-4 a CA-7) es lo que la hace segura. Eso queda para el frontend, porque esta API borra en cuanto recibe la petición.

Todavía no he abierto el PR ni pasado el adversarial-reviewer. Según CLAUDE.md van una sola vez, al terminar la unidad de trabajo.
```

## Prompt 4

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
```
DELETE /api/v1/tasks/:id ya existe, borra la tarea y responde 204 sin cuerpo. Está commiteado en la rama feat/delete-task, que creé desde s8/start porque ahí no se commitea directo.

Al terminar, la suite pasa (28 tests, 5 de ellos nuevos), y lint, typecheck y openapi:check salen limpios.

- Endpoint: TasksController.destroy en backend/app/controllers/tasks_controller.ts. Una tarea que no existe, o que ya se borró, responde 404.
- Ruta: declarada en el grupo tasks de backend/start/routes.ts, con el middleware de auth del grupo (sin token responde 401).
- Permisos: cualquier cuenta con sesión puede borrar cualquier tarea, como ya ocurre con el estado y el vencimiento. No se comprueba quién es el responsable.
- Tests: backend/tests/functional/tasks/delete.spec.ts. Cubre el 204 sin cuerpo, que la tarea desaparezca de la lista para otra cuenta, borrar una ajena, borrar dos veces (404) y borrar sin sesión (401).
- Docs: regeneré docs/api/openapi.json y puse al día docs/capabilities/tasks/README.md.

Quedan dos cosas fuera de lo que pediste:

- La spec viva no tiene ningún requisito de borrado. El ADR 0001 dice que todo cambio de comportamiento pasa por un change de OpenSpec en openspec/changes/, y aquí no lo hice. Conviene abrir uno (/opsx:propose) para dejar la spec al día.
- El endpoint solo cubre la API, no el guardarraíl de la historia E2-10. Los criterios CA-4 a CA-7 piden confirmación explícita en la interfaz antes de borrar, y eso no está hecho.

No he abierto el PR ni pasado el adversarial-reviewer: según CLAUDE.md van una sola vez, al terminar la unidad de trabajo.
```

## Prompt 5

**Modelo:** Sonnet 5.5 High
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
```
 DELETE /api/v1/tasks/:id ya existe y está commiteado en la rama feat/delete-task, que creé desde s8/start porque no se puede commitear sobre una sN/*. Los 28 tests functional pasan, y el typecheck y el lint están limpios.

- Controlador: TasksController.destroy busca la tarea, la borra y responde 204 sin cuerpo. Si no existe responde 404, y sin token responde 401. Lleva los decoradores OpenAPI, así que el documento servido en /api.json incluye la operación.
- Ruta: router.delete(':id', ...) va dentro del grupo tasks, con la autenticación del grupo.
- Tests: backend/tests/functional/tasks/delete.spec.ts cubre el 204 sin cuerpo, el borrado de una tarea ajena, el 404, repetir el borrado (404) y el 401 sin token.
- README: actualicé docs/capabilities/tasks/README.md con el endpoint nuevo.
- Sin comprobar responsable: el borrado no comprueba quién es el responsable. Cualquier cuenta con sesión puede borrar cualquier tarea, igual que el cambio de estado.
- Spec sin requisito: openspec/specs/tasks/spec.md no tiene requisito para borrar tareas. Los tests fijan el contrato mientras tanto. Si quieres que quede en la spec, hay que proponerlo vía OpenSpec.
- .adonisjs/: no hay diff que commitear. El registro versionado no contiene las rutas de tasks.

No he abierto el PR ni pasado el adversarial-reviewer, porque según CLAUDE.md eso va una sola vez al terminar la unidad de trabajo.
```