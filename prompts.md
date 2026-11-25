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

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Lee con un agente explore el requirimiento de la spec: Cuándo una tarea está vencida. Una vez hecho esto, crea una suite de tests pasando por el controlador HTTP. 1 test por escenario de la spec. No toques mas specs, solo la requerido. Revisa al final si realmente has creado 1 test por escenario. No toques nada del codigo fuente.
```

**Qué salió:** He creado backend/tests/functional/tasks/overdue.spec.ts, con 7 tests para los 7 escenarios del requisito. Ahora mismo 3 fallan, y es por fallos del código, no de los tests. El código fuente no lo he tocado.

---

## Prompt 2

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Vuelve a revisar la suite de tests que has creado para ver si cumplen los siguientes requisitos: No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador. Si tu agente cambia implementación mientras escribe el test, el test nacerá verde y no comprobará nada.

Los tests comprueban lo que sale en la respuesta, no lo que devuelve un método interno. El campo se llama isOverdue y viaja en el cuerpo.

El día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj.

Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otra.

No des por hecho ningún identificador: usa el que te devuelva la creación.
```

**Qué salió:** Repasados los cinco requisitos sobre backend/tests/functional/tasks/overdue.spec.ts: los cumple todos y no he tenido que cambiar nada.

---

## Prompt 3

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Vamos con lo siguiente:
La regla vive en isOverdueOn, en backend/app/models/task.ts. Crea backend/tests/unit/, que hoy no existe, y escribe ahí sus bordes, sin servidor y sin base de datos:

Fecha anterior al día de referencia, y la tarea sin hacer.

Fecha exactamente igual al día de referencia.

Fecha posterior.

Sin fecha.

Tarea ya hecha, con la fecha pasada.

Y añade un caso más que no sale de la spec: que la regla se comporte igual reciba la fecha como texto o como objeto de fecha. Ese no lo pide ningún requisito de producto. Sale de preguntarse cómo llega el dato de verdad, que es justo donde tu criterio no lo pone nadie por ti.

Sigue sin tocar implementación.
```

**Qué salió:** He creado backend/tests/unit/task_is_overdue_on.spec.ts, la primera suite unit del repo. Corre en unos milisegundos, sin servidor y sin base de datos: la tarea se construye con new Task() y no se guarda nunca. El día de referencia es fijo (2026-08-20). Lint, formato y tipos pasan. Fuera de backend/tests/ no he tocado nada.

