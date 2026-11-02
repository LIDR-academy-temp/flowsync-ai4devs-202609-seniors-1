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

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** commit generado con el nombre de la rama siguiendo la convención de CLAUDE.md, con mensaje final de recap: " Estoy añadiendo `DELETE /api/v1/tasks/:id` a la capability tasks, y ya está implementado, probado y commiteado en `feat/delete-task`."

## Prompt 2

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** detecta que la rama ya existe y pregunta cómo proceder. Se le indica que creando una nueva. Recap final: "Estoy añadiendo DELETE /api/v1/tasks/:id a tasks; ya está commiteado en feat/delete-task-2, pero sin verificar porque lint, typecheck y tests no corren aquí."

## Prompt 3

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** nuevamente detecta que la rama ya existe y pregunta cómo proceder. Se le indica que creando una nueva. Recap final: "Estamos añadiendo DELETE /api/v1/tasks/:id a la capability tasks; ya está implementado, probado y commiteado en feat/delete-task-3."

## Prompt 4

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** crea una nueva rama `feat/tasks-delete`, que posteriormente renombro a `feat/delete-task-4` para seguir el patrón establecido. Recap final: "Goal: añadir DELETE /api/v1/tasks/:id a la capability tasks; ya está implementado, probado y commiteado en feat/tasks-delete."

## Prompt 5

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** crea una nueva rama `feat/tasks-delete`, que posteriormente renombro a `feat/delete-task-5` para seguir el patrón establecido. En este caso no añadió el fichero de test `backend/tests/functional/tasks/delete.spec.ts`. Recap final: "El objetivo era añadir `DELETE /api/v1/tasks/:id` (204 sin cuerpo) a la capability tasks, y ya está implementado y commiteado en `feat/tasks-delete`."
