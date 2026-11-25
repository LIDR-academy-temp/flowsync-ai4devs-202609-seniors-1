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

**Modelo:** Opus 5.5 with medium effort
**Herramienta:** Claude Code

```
Genera un archivo con los tests funcionales para el Requirement: "Cuándo una tarea está vencida."

Crea los tests que cubran los scenarios especificados en openspec/specs/tasks/spec.md. 
No te bases en la implementación actual para definir los tests. 

No corrijas nada de la implementación.

Solo puedes escribir en backend/tests/

Basate en los parámertos de entrada y salida al endpoint (campo isOverdue que viaja en el cuerpo). No bases test en la implementación, funciones usadas o valores de variables internas.

La fecha de referecna se pasa por petición. Los tests no deben basarse en reloj ni fecha actual.

Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/

No te bases en identificadores generados desde la base de datos.

Si los tests resultantes quedan en rojo, no trates de arreglar nada.

```

**Qué salió:** Crea 7 Tests. 2 Verde, 5 Rojo. Pero además del campo  isOverdue, añade comprobaciones para dueDate.


## Prompt 2

**Modelo:** Opus 5.5 with medium effort
**Herramienta:** Claude Code

```
En los tests funcionales de backend/tests/functional/tasks/overdue.spec.ts, has añadido comprobaciones adicionales en la respuesta sobre dueDate y status. Solo quería validar el campo isOverdue.
Corrige los tests para validar solo isOverdue.

```

**Qué salió:** Ahoram de los 7 tests pasan 4 y fallan 3.



## Prompt 3

**Modelo:** Opus 5.5 with medium effort
**Herramienta:** Claude Code

```
Crea en backend/tests/unit/ tests unitarios para la función isOverdueOn de la clase Task (backend/app/models/task.ts). Test unitario (sin llamada a api ni base de datos).

No corrijas la implementación, ni te bases en la implementación actual para definir los tests. Los casos a validar son únicamente:

  - Fecha anterior al día de referencia, y la tarea sin hacer.
  - Fecha exactamente igual al día de referencia.
  - Fecha posterior.
  - Sin fecha.
  - Tarea ya hecha, con la fecha pasada
  - Se debe comportar igual reciba la fecha como texto o como objeto de fecha.

```

**Qué salió:** Genera 25 tests.  Grupo de 6 casos, ejecutados 4 veces por caso (4 por las combinaciones posibles entre fecha/texto en campos dueDate/Referencia).
Añade un test adicional par comprobar que en cada caso las 4 ejecuciones sean iguales (nombra al text  Misma respuesta texto/Date).
Posterior y sin fecha verde siempre. El resto depende de la combinación de texto/Date utilizada (18 tests pasan y 7 fallan)