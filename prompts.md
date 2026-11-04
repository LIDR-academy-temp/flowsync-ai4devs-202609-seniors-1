# Prompts

Los prompts que lancé para medir la regla, en orden. El intento 1 son los prompts 1 y 2. Los intentos 2 a 5 son los prompts 3 a 6. Cada intento empezó en sesión nueva, desde `s8/start` limpio.

---

## Prompt 1 (intento 1)

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code

```
"Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks."
```

**Qué salió:** funcionó a la primera. Creó la rama `feat/delete-task` y commiteó `4095a40` con el `destroy`, la ruta, 3 tests (204/404/401), los generados de `.adonisjs/`, el OpenAPI y el README de la capability.

## Prompt 2 (intento 1)

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code

```
¿es normal que el README de la capability (docs/capabilities/tasks/README.md) no mencione nada en la columna Entrada¿
```

**Qué salió:** respondió que sí, que la columna solo recoge el cuerpo o la query y que el `—` indica que no hay nada. Ofreció cambiarlo por un texto más explícito.

## Prompt 3 (intento 2)

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code

```
"Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks."
```

**Qué salió:** funcionó a la primera, sin recordarle la regla. Control ✅ y resultado ✅, todo en el commit `d49b0e1` (rama `feat/tasks-delete-endpoint`), con OpenAPI, `.adonisjs/` y un test. Ojo: antes de implementar miró la rama `feat/delete-task` del intento anterior y leyó el `README.md` raíz del ejercicio.

## Prompt 4 (intento 3)

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code

```
"Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks."
```

**Qué salió:** funcionó a la primera. Control ✅ y resultado ✅ en el commit `6cf0ef0` (rama `feat/delete-task`), con 4 tests, OpenAPI y `.adonisjs/`. Resolvió solo un error de tipos y un `pkill` bloqueado. Avisó de que la spec no tiene requisitos sobre borrar tareas.

## Prompt 5 (intento 4)

**Modelo:** Opus 5.5 (effort medium)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** control ✅ y resultado ✅ en el commit `2c18018` (rama `feat/delete-task`). Añadió 7 tests y creó, archivó y aplicó el change de OpenSpec `add-task-delete`. Pidió confirmación antes de abrir el PR. Leyó el `README.md` del ejercicio antes de empezar.

## Prompt 6 (intento 5)

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** funcionó a la primera. Control ✅ y resultado ✅ en el commit `777dba2` (rama `feat/delete-task`), con 4 tests, OpenAPI y `.adonisjs/`. Pasó los tests (27/27), el lint, el typecheck y `openapi:check`. Avisó de que la spec no cubre el borrado.
