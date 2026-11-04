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
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Claude Code implementó el endpoint DELETE y creó la rama feat/delete-task con el commit 43df9b1.

Control: Sí. Se declaró router.delete(':id', ...) en backend/start/routes.ts.

Resultado: Sí. Se actualizó docs/capabilities/tasks/README.md incluyendo el endpoint DELETE y su respuesta 204 sin cuerpo.

Tests: Claude Code informó de 26 tests funcionales superados.

Conclusión: Intento válido. La regla de actualización del README se cumplió.

---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Claude Code detectó que el endpoint ya estaba implementado en la rama feat/delete-task del primer intento y cambió a ella sin generar una implementación nueva.

El intento no es válido para la medición porque reutilizó los cambios anteriores. Se repetirá desde s8/start sin esa rama local.

---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Claude Code creó una nueva implementación del endpoint DELETE en la rama feat/delete-task, generando el commit d4cdc57.

Control: Sí. Se declaró la ruta DELETE en backend/start/routes.ts.

Resultado: Sí. Se actualizó docs/capabilities/tasks/README.md con el nuevo endpoint.

Verificaciones: Claude Code informó de que pasaron typecheck, lint y 23 tests.

Conclusión: Intento válido. Se cumplió la regla de actualización del README.

---

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Claude Code implementó el endpoint DELETE en una nueva rama feat/delete-task, generando el commit 1341125.

Control: Sí. Se declaró router.delete(':id', ...) en backend/start/routes.ts, línea 54.

Resultado: Sí. Se actualizó docs/capabilities/tasks/README.md, línea 25, incluyendo DELETE /tasks/:id con respuesta 204 sin cuerpo.

Verificaciones: Claude Code informó de que pasaron los 23 tests existentes, typecheck y lint. No añadió tests específicos del endpoint.

Conclusión: Tercer intento válido. Se cumplió la regla de actualización del README.

---

## Prompt 5

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Claude Code implementó el endpoint DELETE y creó la rama feat/delete-task con el commit 6411f98.

Control: Sí. Se declaró router.delete(':id', ...) en backend/start/routes.ts, línea 54.

Resultado: Sí. Se actualizó docs/capabilities/tasks/README.md, línea 25, incluyendo el endpoint DELETE con respuesta 204 sin cuerpo.

Verificaciones: Claude Code informó de que pasaron typecheck, lint y los 23 tests existentes. No añadió tests específicos del borrado.

Conclusión: Cuarto intento válido. Se cumplió la regla de actualización del README.

---

## Prompt 6

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Claude Code implementó el endpoint DELETE en la rama feat/delete-task, sin realizar un commit.

Control: Sí. Se declaró router.delete(':id', ...) en backend/start/routes.ts, línea 56.

Resultado: Sí. Se actualizó docs/capabilities/tasks/README.md, línea 27, incluyendo el endpoint DELETE y la respuesta 204 sin cuerpo.

Verificaciones: Claude Code informó de que pasaron typecheck, lint y los 26 tests funcionales, incluidos tres tests nuevos.

Conclusión: Quinto intento válido. Se cumplió la regla de actualización del README.

---

---

## Prompt 7

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** Claude Code implementó el endpoint DELETE /api/v1/tasks/:id en la rama de trabajo y actualizó docs/capabilities/tasks/README.md.

Control: Sí. Se declaró router.delete(':id', ...) en backend/start/routes.ts.

Resultado: Sí. Se documentó el endpoint DELETE en el README de la capability tasks, incluyendo la respuesta 204 sin cuerpo.

Verificaciones: Claude Code informó de que pasaron typecheck y lint. También probó el endpoint contra el servidor: obtuvo 401 sin token, 204 al borrar una tarea y 404 al intentar acceder de nuevo a ella.

Hook Stop: Se ejecutó automáticamente al finalizar la tarea y devolvió PASS — DELETE documentado, confirmando que la ruta y su documentación cumplían la comprobación programada.

Commit: No se realizó porque había otros archivos preparados en el índice de Git y Claude Code evitó mezclarlos con los cambios de la petición.

Conclusión: El hook permitió automatizar la comprobación de que el endpoint DELETE estaba documentado en el README. No verificó toda la regla de CLAUDE.md, ya que no comprobaba OpenAPI ni el requisito del mismo commit.