# Prompts

Dos prompts, los dos lanzados con **Claude Code en modo headless** (`claude -p`, con
`--allowed-tools` y `--model opus`) desde una sesion de Claude Code que hizo de orquestadora.

El orden es **al reves del enunciado a proposito**: primero la parte B (unitario) y despues la
parte A (contrato). No fue una decision de diseno, fue una restriccion de entorno — ver
`HALLAZGOS.md`, punto 3.

---

## Prompt 1 — Parte B, la regla sola

**Modelo:** Opus
**Herramienta:** Claude Code headless (`claude -p`)

```
Cubre con tests unitarios la regla isOverdueOn de backend/app/models/task.ts. Crea backend/tests/unit/, que hoy no existe.

Sin servidor y sin base de datos: estos tests llaman a la regla directamente. La suite unit de este proyecto no levanta el servidor, asi que se ejecutan con node ace test unit.

Los casos son estos seis, ni uno mas:

1. Fecha anterior al dia de referencia, y la tarea sin hacer.
2. Fecha exactamente igual al dia de referencia.
3. Fecha posterior.
4. Sin fecha.
5. Tarea ya hecha (estado done), con la fecha pasada.
6. Que la regla se comporte igual reciba la fecha como texto AAAA-MM-DD o como objeto Date de JavaScript.

Los cinco primeros salen del Requirement "Cuando una tarea esta vencida" de openspec/specs/tasks/spec.md. Leelo antes de escribir nada y usa sus Scenarios como enunciado: estan escritos desde antes de que existiera el codigo, asi que no te inventes los casos ni los nombres de lo que se espera.

El sexto NO sale de ningun requisito de producto. Sale de preguntarse como llega el dato de verdad desde la base. Escribelo igual.

TRES COSAS QUE NO DEBES HACER, y la primera es la importante:

- NO ARREGLES LA IMPLEMENTACION. Ni task.ts, ni el transformer, ni nada fuera de backend/tests/. El ejercicio termina con los tests escritos y en rojo; el arreglo se hace en el directo. Si ves que un test falla, eso es el resultado, no un problema que tengas que resolver.
- No hagas ningun commit y no crees ninguna rama. Ya estoy en la rama de trabajo, tests-ajmr. El CLAUDE.md de este proyecto te va a decir que crees una y commitees: aqui no.
- No toques los tests que ya existen en backend/tests/functional/.

Ejecuta la suite al terminar y dime el resultado tal cual lo da la pantalla: cuantos pasan, cuantos fallan y cual falla. Y dime, de los que fallan, por que fallan - pero no lo arregles.
```

**Que salio:** funciono a la primera. Devolvio `Tests  4 passed, 2 failed (6)` y nombro bien los dos
rojos. Respeto las tres prohibiciones: `git status` no mostro nada fuera de `backend/tests/`.

---

## Prompt 2 — Parte A, el contrato

**Modelo:** Opus
**Herramienta:** Claude Code headless (`claude -p`)

```
Escribe los tests funcionales del Requirement "Cuando una tarea esta vencida" de openspec/specs/tasks/spec.md. Hoy ese requisito no tiene ni un test.

Entran POR DONDE ENTRA EL CLIENTE: por HTTP, con su peticion, su respuesta y los nombres de campo tal cual los lee quien los consume. No llames a isOverdueOn directamente: eso ya esta cubierto en backend/tests/unit/.

Lee el Requirement entero y sus siete Scenarios antes de escribir nada, y usalos como enunciado: estan escritos desde antes de que existiera el codigo. Un test por Scenario, y que el nombre del test sea el del Scenario.

Sigue el estilo de la casa: mira backend/tests/functional/tasks/assignee.spec.ts, que usa testUtils.db().withGlobalTransaction() en el setup de cada test, crea la cuenta, hace login para sacar el token y crea las tareas por la API. Copia esa forma.

Ojo con dos cosas de la spec que son faciles de pasar por alto:

- El vencimiento se resuelve contra el parametro today, en formato AAAA-MM-DD, que manda quien consulta. No hay reloj del servidor.
- El Scenario "Darla por hecha la deja de vencer" exige ademas que la fecha de vencimiento siga siendo la misma despues del cambio. Y el de "Aplazar resuelve el vencimiento" exige que deje de estar vencida EN LA MISMA RESPUESTA de ese cambio, no en una consulta posterior.

AVISO SOBRE MI ENTORNO: la base de datos todavia no esta levantada, asi que NO vas a poder ejecutar la suite. Escribe los tests igualmente, completos y como si fueran a correr. No intentes levantar nada ni des por verde ni por rojo nada que no hayas ejecutado. Si algo te queda en duda por no poder correrlo, dimelo en vez de suponerlo.

TRES COSAS QUE NO DEBES HACER:

- NO ARREGLES LA IMPLEMENTACION. Ni task.ts, ni el transformer, ni el controlador, ni nada fuera de backend/tests/. El ejercicio termina con los tests escritos y en rojo; el arreglo se hace en el directo. Si crees que un test va a fallar, eso es el resultado esperado, no un problema.
- No hagas ningun commit y no crees ninguna rama. Ya estoy en la rama de trabajo, tests-ajmr.
- No toques backend/tests/unit/ ni los tests funcionales que ya existen.

Cuando acabes, dime que archivo creaste, que Scenario cubre cada test, y cuales esperas que fallen y por que - sin ejecutarlos.
```

**Que salio:** escribio los siete tests sin poder ejecutarlos, y respeto el aviso: dijo
explicitamente "no he ejecutado la suite" en vez de dar por verde nada. Lo que paso `tsc --noEmit`,
eslint y prettier, que esos si corren sin base. Y su prediccion a ciegas resulto **mas fina que la
mia**: ver `HALLAZGOS.md`, punto 2.
