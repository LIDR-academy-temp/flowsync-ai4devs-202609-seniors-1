# Prompts

Todos los prompts lanzados en el ejercicio, en orden, con su modelo y herramienta.

## Prompt 1

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** control sí, README sí, commit 3e076a3

## Prompt 2

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** control sí, README sí, commit 861ef7f

## Prompt 3

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** control sí, README sí, commit 79f6409

## Prompt 4

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** control sí, README sí, commit db09ff0

## Prompt 5

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** control sí, README sí, commit c73ef84

## Prompt 6

**Modelo:** Sonnet 5.5 (claude-sonnet-5-5)
**Herramienta:** Claude Code

```
Guarda mis respuestas de la Parte B en docs/evals/ach.md, en la rama evals-ach (si no existe, créala desde s8/start).

- Si docs/evals/ach.md ya existe, añade o reemplaza solo la sección "## Parte B" y no toques la Parte A.
- Si no existe, créalo con el título "# Medición: ¿se cumple la regla del README de la capability?" y solo la sección "## Parte B", e indícame que falta la Parte A.
- Copia mi texto literalmente, sin reformular ni corregir nada.

## Parte B

1. Predicción y resultado: predije 3 de 5 porque el encargo no menciona el README ni la regla. El resultado fue 5 de 5: los cinco intentos declararon la ruta DELETE (control sí) y los cinco actualizaron docs/capabilities/tasks/README.md con fila nueva en la tabla y el recuento de operaciones de cinco a seis. Completé los cinco intentos, todos desde s8/start limpio.

2. Decisión sobre la regla: no la eliminaría ni la dejaría solo como texto. La convertiría en una comprobación automática (un script o hook que falle si el diff toca rutas, controladores, validadores o transformers de una capability sin tocar su README). Con 5 de 5 hoy la regla funciona, pero depende de que el modelo la recuerde, y un cambio de modelo o de CLAUDE.md puede romperla sin que nadie lo note. Antes de invertir en el guardarraíl mediría el mismo encargo sin la regla, para saber si el modelo ya lo haría por su cuenta.

3. Qué no comprueba la medición: (a) no hay línea base sin la regla, así que no sé si el README se actualiza por la regla o porque el modelo lo haría igualmente; (b) "el README menciona el endpoint" no es "el README está al día": no mido si el contenido es correcto; (c) no comprueba la otra mitad de la regla, el documento OpenAPI; (d) cinco intentos son pocos, y 5 de 5 es compatible con una tasa real de en torno al 80 %; (e) la comprobación nunca la vi fallar, así que no sé si detectaría un README sin actualizar; (f) un solo modelo y un solo encargo.
```

**Qué salió:** Creó/actualizó docs/evals/ach.md
