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
Lee el requirement «Cuándo una tarea está vencida» y sus Scenarios de openspec/specs/tasks/spec.md. Escribe un archivo de tests funcionales que los ejerza entrando por HTTP (HyperText Transfer Protocol, el protocolo por el que entra un cliente de la interfaz de programación de aplicaciones), igual que entra la aplicación que consume este backend. Uno por Scenario. Córrelo con make test-e2e y quédate con la salida entera, no solo con si pasó o no. Algunas restricciones 1) No toques ni una línea fuera de backend/tests/. Ni el modelo, ni el transformer, ni el controlador. Si cambias la implementación mientras se escribe el test, el test nacerá verde y no comprobará nada. Los tests deben nacer y comprobarse en rojo 2) Los tests comprueban lo que sale en la respuesta, no lo que devuelve un método interno. El campo se llama isOverdue y viaja en el cuerpo 3) El día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj. 4) Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otra. 5) No des por hecho ningún identificador: usa el que te devuelva la creación.
```

**Qué salió:** Creó `backend/tests/functional/tasks/overdue.spec.ts` con 7 tests, uno por Scenario, sin tocar nada fuera de `backend/tests/`. Con `make test-e2e`: 41 pasan y 6 fallan (47). Los 6 fallan porque `isOverdue` nunca llega a `true`; solo pasa «Sin fecha no se vence nunca». Hubo que quitar aserciones sobre el formato de `dueDate` que no eran del Scenario y añadir contrastes a tres tests para que no pasaran por casualidad.

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
sí añade los prompts que realiza y tambien hay que rellenar el fichero HALLAZGOS.md en la raíz con estos 3 puntos. Dame una propuesta que yo revisaré "

<pasted_content id="e90f">
Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla.

Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó. Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.

De qué dudaste, o qué no pudiste comprobar.
</pasted_content id="e90f">

"
```

**Qué salió:** Rellenó este fichero con los dos prompts y dejó en `HALLAZGOS.md` una propuesta de los tres puntos, con las cifras de la última corrida, para que la revises.

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
 El caso sin fecha pasa por coincidencia con ese false constante, no porque la regla funcione. Comprueba la causa que probablemente es que  dueDate llega como Date aunque el modelo lo declare string. También estaría bien comprobar si los contrastes «vencer hoy», «fecha futura» y «hecha con fecha pasada» que se reescribieron pasarían si no se hubieran hecho
```

**Qué salió:** Confirmó la causa con una sonda temporal (`dueDate` llega como `Date` y `Date < texto` da `false`) y comprobó que las versiones sin contraste de los tres casos pasaban en verde contra la implementación rota. En una copia fuera del repo apareció un segundo fallo: `isOverdueOn` no mira el estado `done`. Con las dos correcciones la copia dio 47/47; el repo real sigue en 41 pasan y 6 fallan. Quitó una aserción de formato que se le había quedado en «Darla por hecha». Sonda y copia borradas.

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
La corrección de la copia depende de que el huso del servidor sea UTC, vuelve a probar también con otro huso horario
```

**Qué salió:** Rehízo la copia fuera del repo y corrió los 7 tests con varios husos. La corrección con `toISOString()` pasa 7/7 en UTC y Los Ángeles pero falla 1 en Zúrich y Tokio («vencer hoy»). Una variante con los componentes locales de la fecha (`getFullYear`/`getMonth`/`getDate`) pasa 7/7 en cinco husos, incluido el +14 de Kiritimati. Repo sin tocar, copia borrada.

## Prompt 5

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
La regla vive en isOverdueOn, en backend/app/models/task.ts. Crea backend/tests/unit/ y escribe ahí sus bordes, sin servidor y sin base de datos:

- Fecha anterior al día de referencia, y la tarea sin hacer.
- Fecha exactamente igual al día de referencia.
- Fecha posterior.
- Sin fecha.
- Tarea ya hecha, con la fecha pasada.  Haz que la regla se comporte igual reciba la fecha como texto o como objeto de fecha. No toques nada de la implementación
```

**Qué salió:** Creó `backend/tests/unit/task_is_overdue_on.spec.ts` con 9 tests: los 4 bordes con fecha, cada uno con la fecha como texto y como objeto de fecha, más «sin fecha». Con `make test-unit`: 4 pasan y 5 fallan. Como no se tocó la implementación, «se comporte igual con texto y con objeto» queda como exigencia en rojo, no como código arreglado.

## Prompt 6

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Propone actualización de HALLAZGOS.md con esta información
```

**Qué salió:** Reescribió los tres puntos de `HALLAZGOS.md` sumando la suite unitaria: 16 casos nuevos, 11 en rojo (6 funcionales y 5 unitarios), 5 que pasan, y las dudas que quedan.

## Prompt 7

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Me comentas como duda que puede haber un posible tercer fallo tapado en test funcionales. Cual es?
```

**Qué salió:** Reconoció que no tenía ningún tercer fallo identificado: era una cautela por haber visto un fallo tapando a otro. Corrigió en `HALLAZGOS.md` una frase inexacta (los 47 funcionales solo se corrieron en UTC; en cinco husos fueron los 7 de `overdue.spec.ts` y los 9 unitarios) y concretó la duda: los Scenarios de otros requisitos de la spec no están cubiertos por estos tests.
