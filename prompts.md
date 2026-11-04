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

**Modelo:** Sonnet 5.5 Low
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
```
Estoy en s8/start, así que crearé una rama de trabajo. Primero miro el código existente.

  Ran 2 shell commands

Ya existe una rama feat/delete-task con un commit que parece hacer justo esto. La reviso antes de decidir nada.

  Ran 2 shell commands

La rama feat/delete-task ya contiene la implementación completa (controlador, ruta y README). Me paso a ella, en vez de rehacerla, y compruebo que funciona.

  Ran 1 shell command

DELETE /api/v1/tasks/:id ya estaba hecho en la rama feat/delete-task (commit ae62771), así que no he escrito código nuevo. Me he movido a esa rama y la he comprobado:

- Controlador: TasksController.destroy en backend/app/controllers/tasks_controller.ts busca la tarea con Task.findOrFail, la borra y devuelve response.noContent(), es decir, 204 sin cuerpo. Si el id no existe responde 404.
- Ruta: router.delete(':id', [controllers.Tasks, 'destroy']) en backend/start/routes.ts, junto a las demás rutas de tasks y dentro del grupo con auth. node ace list:routes la muestra.
- Documentación: el README docs/capabilities/tasks/README.md tiene la fila nueva y el 204 en la lista de códigos.
- Resultado de las comprobaciones: npm run typecheck pasa y el árbol de trabajo está limpio, sin diff pendiente en .adonisjs/.

No he ejecutado la suite de tests. Tampoco hay ningún test del endpoint, porque la capability tasks no tiene tests.

No he creado el PR ni lanzado el adversarial-reviewer: según CLAUDE.md van una sola vez, al terminar la unidad de trabajo. Dime si esta ya está cerrada y los lanzo.

✻ Cogitated for 43s · done 12:00 PM
```

---

## Prompt 2

**Modelo:** Sonnet 5.5 Low
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Me detectó la rama de la ejecución anterior, y me propuso descartar la anterior.  Para que no tomase nada, he decidido salir y verificar otra vez que haya quedado todo eliminado. Después he leído que no se tenían en cuenta los feat/.. anteriores pero igualmente los iré borrando con delete branch para hacerlo 100% limpio.
```
Estoy en s8/start, así que crearé una rama de trabajo. Primero miro el código de tasks.

  Ran 2 shell commands

Ya existe una rama feat/delete-task con un commit que parece hacer exactamente esto. Miro qué contiene antes de decidir.

  Ran 1 shell command
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 ☐ Rama previa

│ La rama feat/delete-task ya existe y contiene un commit (ae62771) que implementa este mismo endpoint (controlador, ruta y README de tasks). ¿Cómo sigo?

❯ 1. Continuar en ella
     Hago checkout de feat/delete-task, reviso lo que hay y lo completo o corrijo si falta algo (p. ej. diff de .adonisjs/ y tests).
  2. Rama nueva desde s8/start
     Creo feat/delete-task-2 y lo implemento desde cero, dejando la existente intacta.
  3. Descartar la anterior
     Borro feat/delete-task y la recreo desde s8/start para empezar limpio (destructivo).
  4. Type something.
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  5. Chat about this
```

---

## Prompt 3

**Modelo:** Sonnet 5.5 Low
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
```
Estás en s8/start, así que creo una rama de trabajo antes de tocar código. Miro también el controlador y las rutas de tasks.

  Ran 3 shell commands

Implemento el endpoint, la ruta y el README.

  Read 1 file, ran 3 shell commands

● Skill(commit)
Successfully loaded skill

  Ran 1 shell command

DELETE /api/v1/tasks/:id ya funciona: borra la tarea y responde 204 sin cuerpo. Está commiteado en la rama feat/delete-task (8829930). No he abierto el PR ni pasado el adversarial-reviewer, porque tus reglas los dejan para cuando termine la unidad de trabajo.

- Controlador y ruta: añadí TasksController.destroy y router.delete(':id', ...) en el grupo tasks, que ya exige autenticación. Si la tarea no existe, responde 404; sin token, 401.
- Documentación: el endpoint lleva sus decoradores OpenAPI (204, 401, 404) y el README de la capability tiene la fila nueva. Como .adonisjs/ no cambió al correr los tests, no hay diff generado que commitear.
- Tests: añadí backend/tests/functional/tasks/delete.spec.ts con tres casos (204 y tarea borrada, 404, 401 sin borrar nada). La suite functional pasa entera (26 tests), y lint y typecheck salen limpios.
- Permisos: cualquier cuenta con sesión puede borrar cualquier tarea, igual que ya pasa con el cambio de estado. No encontré ninguna regla sobre quién puede borrar, así que seguí ese criterio; si debe restringirse al responsable, hay que cambiarlo.
- Spec de OpenSpec: la spec de tasks no tiene un requisito de borrado. Si es la fuente de verdad, conviene añadirlo antes de dar la unidad por cerrada.

✻ Cogitated for 1m 28s · done 12:14 PM
```

---

## Prompt 4

**Modelo:** Sonnet 5.5 Low
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
```
Estoy en s8/start, así que crearé una rama de trabajo. Primero miro el código existente.

  Searched for 1 pattern, ran 5 shell commands

● Skill(commit)
Successfully loaded skill

Estoy cerrando la petición con el commit del endpoint de borrado.

  Ran 1 shell command

He añadido DELETE /api/v1/tasks/:id y lo he commiteado en la rama feat/delete-task (1f25b85). La rama la creé yo, porque estabas en s8/start.

- Controlador: TasksController.destroy en backend/app/controllers/tasks_controller.ts busca la tarea con findOrFail y la borra. Responde 204 sin cuerpo, o 404 si no existe. Lleva las anotaciones OpenAPI para 204, 401 y 404.
- Ruta: router.delete(':id', [controllers.Tasks, 'destroy']) en backend/start/routes.ts, dentro del grupo tasks. Hereda middleware.auth(), así que sin token da 401.
- README: docs/capabilities/tasks/README.md tiene la fila nueva en la tabla de endpoints y el recuento de operaciones y códigos actualizado.

Pasan typecheck, lint y los 23 tests existentes, y list:routes muestra la ruta nueva. No he escrito un test ni llamado al endpoint con curl, así que el 204 no está comprobado de extremo a extremo.

Ni la spec de openspec/specs/tasks/spec.md ni el registro de .adonisjs/ los he tocado. Este último no cambió al regenerarse con los tests.

El borrado es definitivo y cualquier cuenta con sesión puede borrar cualquier tarea, sea o no la responsable. Lo hice así por coherencia con el cambio de estado.

Todavía no he abierto el PR ni pasado el adversarial-reviewer. Según CLAUDE.md eso va una sola vez al terminar la unidad de trabajo; dime cuándo la das por terminada.

✻ Worked for 1m 0s · done 12:18 PM

```

---

## Prompt 5

**Modelo:** Sonnet 5.5 Low
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
```
Estoy en s8/start, así que creo una rama de trabajo antes de tocar código y miro el código existente.

  Read 1 file, listed 1 directory, ran 1 shell command

La spec no regula el borrado de tareas; implemento lo pedido.

  Ran 3 shell commands

● Skill(commit)
Successfully loaded skill

  Ran 1 shell command

DELETE /api/v1/tasks/:id ya existe: borra la tarea y responde 204 sin cuerpo. Lo dejé commiteado (7de77aa) en la rama nueva feat/delete-task, porque partía de s8/start.

El borrado está en TasksController.destroy, con la ruta declarada junto a las demás de tasks, bajo middleware.auth(). Si el id no existe devuelve 404. Como con el cambio de estado, no comprueba quién es el responsable: cualquier cuenta con sesión puede borrar cualquier tarea.

Añadí la operación al OpenAPI (204, 401 y 404) y actualicé el README de tasks. typecheck, lint y los 23 tests existentes pasan. No escribí un test para el endpoint ni lo probé con curl contra el servidor: tasks sigue sin tests.

La spec de tasks no menciona el borrado de tareas, así que no hay requisito que cubra este endpoint. Si quieres que quede en la spec, habría que proponerlo con OpenSpec.

No he abierto el PR ni pasado el adversarial-reviewer: según CLAUDE.md van una sola vez, al terminar la unidad de trabajo.

✻ Brewed for 1m 8s · done 12:22 PM
```

---

## Prompt 6

**Modelo:** Sonnet 5.5 Low
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** 
```
Estoy en s8/start, así que creo una rama de trabajo y miro el código existente de tasks.

  Searched for 1 pattern, listed 1 directory, ran 2 shell commands

La spec no contempla borrar tareas; lo implemento como se pide y lo señalo al final.

  Ran 2 shell commands

● Skill(commit)
Successfully loaded skill

  Ran 1 shell command

DELETE /api/v1/tasks/:id ya existe: borra la tarea y responde 204 sin cuerpo, o 404 si el id no existe. Typecheck, lint y los 23 tests existentes pasan. No he escrito ningún test del endpoint ni lo he probado con una petición real, así que el 204 y el 404 siguen sin comprobarse.

Está en TasksController.destroy, con la ruta junto a las demás de tasks en backend/start/routes.ts, dentro del grupo con auth. Sin token da 401. También anoté el endpoint con los decoradores OpenAPI (204, 401, 404) y actualicé el README de la capability.

Lo hice en la rama nueva feat/tasks-delete, porque partía de s8/start. El commit es 4d6d352.

- Sin comprobar el responsable: cualquier cuenta con sesión puede borrar cualquier tarea. Es coherente con cómo funcionan las demás operaciones de tasks, pero conviene que lo sepas.
- La spec no lo cubre: openspec/specs/tasks/spec.md no dice nada sobre borrar tareas. El README dice que ante una discrepancia manda la spec, así que habría que añadirle un requisito si el borrado va a quedarse.
- Sin cambios en .adonisjs/: el registro generado no cambió tras regenerarlo, así que el commit no lleva diff de ese directorio.
- PR y review pendientes: todavía no he abierto el PR ni pasado el adversarial-reviewer, porque el proceso del repo los reserva para el final de la unidad de trabajo.

✻ Cogitated for 59s · done 12:27 PM
```

