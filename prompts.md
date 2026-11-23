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
Tu unidad de trabajo es el requerimiento Cuándo una tarea está vencida de las spec openspec/specs/tasks/spec.md.

Necesito crear los test funcionales para esa spec:
- Deben estar contenidos en un archivo propio
- Tu objetivo es testear como el servicio lo consumiria un cliente del mismo
- La entrada de los test ha de ser a traves de una llamada http
Aplica las siguientes restricciones
- No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador. Si tu agente cambia implementación mientras escribe el test, el test nacerá verde y no comprobará nada. 
- Los tests comprueban lo que sale en la respuesta, no lo que devuelve un método interno. El campo se llama isOverdue y viaja en el cuerpo. 
- El día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj. 
- Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otra. 
- No des por hecho ningún identificador: usa el que te devuelva la creación.

Guarda este prompt en el archivo prompts.md
```

**Qué salió:** tests en `backend/tests/functional/tasks/overdue.spec.ts`; 5 salen en rojo por fallos reales de la implementación (no se tocó).

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Tu unidad de trabajo es el requerimiento Cuándo una tarea está vencida de las spec openspec/specs/tasks/spec.md.
Crea lost unit test para ese requerimiento con las siguientes condiciones:
- Crearlos en un archivo dedicado en la carpeta backend/tests/unit/, que hoy no existe, creala
- escribe ahí sus bordes, sin servidor y sin base de datos:
  - Fecha anterior al día de referencia, y la tarea sin hacer. 
  - Fecha exactamente igual al día de referencia. 
  - Fecha posterior. 
  - Sin fecha. 
  - Tarea ya hecha, con la fecha pasada.
Aplica las siguientes restricciones
- No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador. Si tu agente cambia implementación mientras escribe el test, el test nacerá verde y no comprobará nada.

Guarda este prompt en el archivo prompts.md
```

**Qué salió:** `backend/tests/unit/task_overdue.spec.ts`; 4 pasan y el de «tarea hecha» sale en rojo: `isOverdueOn` no mira el estado.

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Tu unidad de trabajo es el requerimiento Cuándo una tarea está vencida de las spec openspec/specs/tasks/spec.md.
Añade un case en los unit test que es que la regla se comporta igual reciba la fecha como texto o como objecto fecha
Guarda este prompt en el archivo prompts.md
```

**Qué salió:** nuevo caso en `backend/tests/unit/task_overdue.spec.ts`; ver resultado en el chat.
