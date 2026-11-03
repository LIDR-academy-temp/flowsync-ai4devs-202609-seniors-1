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

**Modelo:** Opus 1M 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks
```

**Qué salió:** Indica que crea la rama y hace los cambios, los enumera, define un test funcional e indica explicitamente que verifica que el documento OpenAPI servido recoge la operación y tambien el README de la capability (las reglas del CLAUDE.md). Cumple el encargo y actualiza README


## Prompt 2

**Modelo:** Opus 1M 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks
```

**Qué salió:** Indica que crea la rama y hace el trabajo. Aunque con mas atrancos que en el primer caso, termina por confirmar que ha regenerado docs/api/openapi.json y he incluido en el commit el diff de .adonisjs/ y que el README de la capability queda al día con la ruta nueva. Cumple el encargo y actualiza README

## Prompt 3

**Modelo:** Opus 1M 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks. Cumple el encargo y actualiza README
```

**Qué salió:** Indica que abre rama, implementa controlador y ruta, implementa un test funcional, regenera OpenAPI (aunque con problemas, que resuelve) y README. Cumple el encargo y actualiza README

## Prompt 4

**Modelo:** Opus 1M 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks
```

**Qué salió:** Indica que crea la rama, implementa metodo del controlador, ruta y test funcional, reporta problemas que resuelve para regenerar OpenAPI, y que actualiza el README de la capability. Cumple el encargo y actualiza README

## Prompt 5

**Modelo:** Opus 1M 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks
```

**Qué salió:** Indica que crea el branch, muestra los cambios a realizar en el codigo y explicitamente indica que "ahora OpenAPI y README". En este caso tambien tiene problemas con la generacion de OpenAPI, y los resuelve. Cumple el encargo y actualiza README
