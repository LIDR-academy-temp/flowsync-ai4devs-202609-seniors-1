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

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Actúa como un QA Engineer senior especializado en testing automatizado a tres niveles: unitario, API funcional y E2E.

Escribe los tests funcionales del Requirement «Cuándo una tarea está vencida» de openspec/specs/tasks/spec.md.

Instrucciones y restricciones:
- Crea un único archivo backend/tests/functional/tasks/overdue.spec.ts con los tests funcionales. No modifiques nada más del proyecto.
- Entra por HTTP, tal cual lo haría un cliente que llama a la API y que consume ese backend.
- Crea un test por cada Scenario.
- Los tests quedan en rojo en la primera ejecución si no se cumple la spec.
- No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador. No toques código ni intentes hacerlo pasar a verde si falla.
- Los tests comprueban lo que sale en la respuesta, no lo que devuelve un método interno. El campo se llama isOverdue y viaja en el cuerpo.
- El día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj.
- Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otra.
- No des por hecho ningún identificador: usa el que te devuelva la creación.

Al finalizar:
- Lanza "make test-e2e" y muéstrame toda la salida entera, no solo si pasó o no.
- Muéstrame también una tabla Scenario → rojo/verde → causa.
- Verifícame que no cambió nada fuera de backend/tests/: `git status` antes y después.
```

**Qué salió:** salió casi a la primera, pero no como esperaba: de los 7 tests nuevos solo 3 quedaron en rojo, porque el vencimiento ya estaba implementado, y esos 3 destaparon dos fallos reales (el `GET` nunca marca una tarea como vencida y no se tiene en cuenta `done`). Los 40 que ya había siguieron en verde (44 de 47 en total) y tuve que salir del modo auto para que pudiera escribir el archivo.

## Prompt 2

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Ahora escribe los tests unitarios del Requirement «Cuándo una tarea está vencida». La regla vive en isOverdueOn, en backend/app/models/task.ts.

Instrucciones y restricciones:
- Crea el directorio backend/tests/unit/, que aún no existe.
- Crea un único archivo backend/tests/unit/tasks_isoverdue.spec.ts con los tests unitarios.
- No modifiques nada más del proyecto. Sin commit.
- Los tests quedan en rojo en la primera ejecución si no se cumple la spec.
- Como antes, el día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj.
- Sin servidor y sin base de datos.

Casos (cada borde con un segundo caso que una implementación equivocada no pueda pasar a la vez):
- Fecha anterior, sin hacer: en pending y en in_progress, y con cambio de mes y de año.
- Fecha igual al día de referencia.
- Fecha posterior, también con cambio de mes.
- Sin fecha, aunque se mire desde muy lejos.
- Hecha con la fecha pasada, y la misma fecha sin hacer para mostrar que decide el estado.
- Añade un caso más que no sale de la spec: que la regla se comporte igual reciba la fecha como texto o como objeto de fecha.

Al finalizar:
- Lanza los tests unitarios con "make test-unit".
- Muéstrame también una tabla Scenario → rojo/verde → causa.
- Pruébame que no cambió nada fuera de backend/tests/: `git status` antes y después.
```

**Qué salió:** funcionó a la primera: 18 casos creados, 13 en verde y 5 en rojo. El caso extra (fecha como texto o como objeto `Date`) «explicó por qué fallaban los tests funcionales que leen la tarea con `GET`, porque al leer de la base `dueDate` llega como `Date` y la comparación da siempre `false`.
