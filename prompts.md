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

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

Cubre con tests el requisito «Cuándo una tarea está vencida», que hoy no tiene ninguno. 
Empieza por el contrato, míralo en rojo, y baja la regla a un test que la llame directamente

Lee solo este requermiento entero y sus scenarios.

Escribe un archivo de tests funcionales que los ejerza entrando por HTTP (HyperText Transfer Protocol, el protocolo por el que entra un cliente de la interfaz de programación de aplicaciones), igual que entra la aplicación que consume este backend. Uno por Scenario.

Cinco restricciones, y ninguna es decorativa:

No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador. Si tu agente cambia implementación mientras escribe el test, el test nacerá verde y no comprobará nada.

Los tests comprueban lo que sale en la respuesta, no lo que devuelve un método interno. El campo se llama isOverdue y viaja en el cuerpo.

El día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj.

Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otra.

No des por hecho ningún identificador: usa el que te devuelva la creación.

## Prompt 2

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

La regla vive en isOverdueOn, en backend/app/models/task.ts. Crea backend/tests/unit/, que hoy no existe, y escribe ahí sus bordes, sin servidor y sin base de datos:

-Fecha anterior al día de referencia, y la tarea sin hacer.

-Fecha exactamente igual al día de referencia.

-Fecha posterior.

-Sin fecha.

-Tarea ya hecha, con la fecha pasada.

Y añade un caso más que no sale de la spec: que la regla se comporte igual reciba la fecha como texto o como objeto de fecha

Sigue sin tocar implementación.

