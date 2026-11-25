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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Cubre con tests el requisito «Cuándo una tarea está vencida», que hoy no tiene ninguno. Empieza por el contrato, míralo en rojo, y baja la regla a un test que la llame directamente.
La unidad de trabajo es una y está nombrada: el Requirement «Cuándo una tarea está vencida» de openspec/specs/tasks/spec.md. No elijas otro. Sus Scenarios son el enunciado, así que no tienes que inventarte los casos: están escritos, y están escritos desde antes de que existiera el código.

Lee el Requirement entero y sus Scenarios.

Escribe un archivo de tests funcionales que los ejerza entrando por HTTP (HyperText Transfer Protocol, el protocolo por el que entra un cliente de la interfaz de programación de aplicaciones), igual que entra la aplicación que consume este backend. Uno por Scenario.

Córrelo con make test-e2e y quédate con la salida entera, no solo con si pasó o no.

Cinco restricciones, y ninguna es decorativa:

No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador. Si tu agente cambia implementación mientras escribe el test, el test nacerá verde y no comprobará nada.

Los tests comprueban lo que sale en la respuesta, no lo que devuelve un método interno. El campo se llama isOverdue y viaja en el cuerpo.

El día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj.

Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otra.

No des por hecho ningún identificador: usa el que te devuelva la creación.
```

**Qué salió:** creó `backend/tests/functional/tasks/overdue.spec.ts` con 7 tests (uno por Scenario). `make test-e2e`: 44 pasados y 3 fallidos. Fallan los casos que deben llegar vencidos («Fecha del día anterior», «Darla por hecha la deja de vencer», «Aplazar resuelve el vencimiento»): `isOverdue` sale `false` porque `dueDate` viaja como `"2026-08-19T00:00:00.000Z"` (un `Date` del driver `pg`) y `isOverdueOn` lo compara con una cadena. No tocó implementación y revirtió los ficheros que la ejecución regeneró.

---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
La regla vive en isOverdueOn, en backend/app/models/task.ts. Crea backend/tests/unit/, que hoy no existe, y escribe ahí sus bordes, sin servidor y sin base de datos:

Fecha anterior al día de referencia, y la tarea sin hacer.

Fecha exactamente igual al día de referencia.

Fecha posterior.

Sin fecha.

Tarea ya hecha, con la fecha pasada.

Y añade un caso más que no sale de la spec: que la regla se comporte igual reciba la fecha como texto o como objeto de fecha. Ese no lo pide ningún requisito de producto. Sale de preguntarse cómo llega el dato de verdad, que es justo donde tu criterio no lo pone nadie por ti.

Sigue sin tocar implementación.
```

**Qué salió:** creó `backend/tests/unit/tasks/is_overdue_on.spec.ts` con 8 tests (los 5 bordes más el caso texto/`Date` para anterior, igual y posterior). `make test-unit`: 6 pasan y 2 fallan. Destapó dos defectos en `isOverdueOn`: no mira el estado (una tarea `done` con fecha pasada sale vencida) y una fecha anterior como `Date` sale `false`. Esto explica además que el test funcional de «tarea hecha» pasara solo por casualidad. No tocó implementación.

---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
escribe todos los prompts que te he pedido al archivo prompts.md. Fíjate que hay un ejemplo para que te hagas una idea. Reemplázalo con los prompts reales que te he pedido en esta sesión y con el restultado obtenido al ejecutar cada uno de ellos
```

**Qué salió:** reescribió este `prompts.md` sustituyendo el ejemplo por los tres prompts reales de la sesión y su resultado.
