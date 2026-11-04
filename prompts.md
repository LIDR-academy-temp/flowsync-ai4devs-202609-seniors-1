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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las
  demás de tasks.
```

**Qué salió:** funcionó a la primera. Detectó que ya existía una rama `feat/delete-task` de un intento anterior, no la reutilizó y trabajó en `feat/tasks-delete-endpoint`. Añadió `TasksController.destroy` (204 sin cuerpo, 404 si no existe, 401 sin token) con anotaciones OpenAPI, la ruta en el grupo `tasks`, el test `tests/functional/tasks/delete.spec.ts` y el README de la capability. Typecheck y 26 tests functional en verde; commit `214266d`.

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Añade los prompts que te he pedido, así como el resultado de su ejecución, incluyendo este, en el archivo prompts.md. Fíjate en el ejemplo para saber la estructura
```

**Qué salió:** se reescribió `prompts.md`: se borró el ejemplo y se registraron este prompt y el anterior con su resultado. Commiteado aparte del endpoint.
