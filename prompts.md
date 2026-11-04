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

---


## Prompt 1

**Modelo:** Opus 5.5, Claude Max, modo manual
**Herramienta:** Claude Code 2.1.318 (Claude Code)

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Intento 1 (modo manual, 2 min 51 s): creó la rama feat/delete-task y un commit (3fe4fe6) con destroy en TasksController, la ruta en routes.ts, tests, OpenAPI, .adonisjs y el README de tasks, sin que se le recordara la regla; al terminar ofreció abrir el PR.

## Prompt 2

**Modelo:** Opus 5.5, Claude Max, modo manual
**Herramienta:** Claude Code 2.1.318 (Claude Code)

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Intento 2 (modo manual, 2 min 49 s): creó la rama feat/tasks-delete y un commit (dba9891) con destroy en TasksController, la ruta en routes.ts, tests, OpenAPI, .adonisjs y el README de tasks, sin que se le recordara la regla. Dijo que ya existía feat/delete-task del intento anterior y que no la había tocado.

## Prompt 3

**Modelo:** Opus 5.5, Claude Max, modo manual
**Herramienta:** Claude Code 2.1.318 (Claude Code)

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Intento 3 (modo manual, 2 min 57 s): creó la rama feat/tasks-delete-endpoint y un commit (96c1c15, 8 archivos) con destroy en TasksController, la ruta en routes.ts, tests, .adonisjs y el README de tasks (tabla, reglas, tests y curl), sin que se le recordara la regla. No commiteó docs/api/openapi.json (los intentos 1 y 2 sí). Avisó de las dos ramas viejas de intentos anteriores y dijo que no las había tocado.

## Prompt 4

**Modelo:** Opus 5.5, Claude Max, modo manual
**Herramienta:** Claude Code 2.1.318 (Claude Code)

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Intento 4 (modo manual, 3 min 31 s): creó la rama feat/tasks-destroy y un commit (1029ebd, 9 archivos) con destroy en TasksController, la ruta en routes.ts, destroy.spec.ts, docs/api/openapi.json, .adonisjs y el README de tasks, sin que se le recordara la regla. Avisó de las tres ramas viejas de intentos anteriores y dijo que no las había tocado, y de que openapi:generate y openapi:check fallan con Invalid URL.

## Prompt 5

**Modelo:** Opus 5.5, Claude Max, modo manual
**Herramienta:** Claude Code 2.1.318 (Claude Code)

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Intento 5 (modo manual, 3 min 16 s): creó la rama feat/tasks-delete-by-id y un commit (038ff02, 9 archivos) con destroy en TasksController, la ruta en routes.ts, delete.spec.ts, docs/api/openapi.json, .adonisjs y el README de tasks, sin que se le recordara la regla. Dijo que había ramas de intentos anteriores, que no las había tocado y que partió de s8/start.
