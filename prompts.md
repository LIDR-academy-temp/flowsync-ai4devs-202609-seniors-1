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

**Modelo:** Opus 5.5 xHigh
**Herramienta:** Claude Code

```
A continuacion de voy a indicar una tarea para la implementacion de tests de backend. Antes de hacerlo te recalco que es importante que no toques ni una línea fuera de backend/tests/

```

**Qué salió:** Indica los casos en que algo de fuera puede cambiar sin que el lo edite: backend/.adonisjs/, backend/database/schema.ts o docs/seguridad/registro-de-bloqueos.md


## Prompt 2

**Modelo:** Opus 5.5 xHigh
**Herramienta:** Claude Code

```
Vas a escribir tests funcionales para el requerimiento "Cuándo una tarea está vencida" descrito en el fichero openspec/specs/tasks/spec.md. Para ello escribe un archivo de tests funcionales que los ejerza entrando por HTTP (HyperText Transfer Protocol, el protocolo por el que entra un cliente de la interfaz de programación de aplicaciones), igual que entra la aplicación que consume este backend. Para escribirlos sigue las sigueintes indicaciones: 
- Escribe un test por Scenario
- Los tests deben comprobar lo que sale en la respuesta, no lo que devuelve un método interno. El campo se llama isOverdue y viaja en el cuerpo
- El día de referencia se le pasa a la petición. Nada de la fecha de hoy ni de ningún reloj
- Sigue la forma de aislamiento que ya usan los tests de backend/tests/functional/, sin inventar otra
- No des por hecho ningún identificador: usa el que te devuelva la creación.

```

**Qué salió:** Indica que escribe el fichero de tests en backend/tests/functional/tasks/overdue.spec.ts. Inicialmente dice que fallan 3 de 7 y revisa. Indica que los 40 tests que ya había siguen pasando; los únicos que fallan son los 3 nuevos, y dice que fallan por un bug real del backend, no del test


## Prompt 3

**Modelo:** Opus 5.5 xHigh
**Herramienta:** Claude Code

```
Vas a escribir tests unitarios para cubrir la regla que vive en isOverdueOn, en backend/app/models/task.ts. Para ello crea backend/tests/unit/, que hoy no existe, y escribe ahí sus bordes, sin servidor y sin base de datos:
- Fecha anterior al día de referencia, y la tarea sin hacer.
- Fecha exactamente igual al día de referencia.
- Fecha posterior.
- Sin fecha.
- Tarea ya hecha, con la fecha pasada.
Adicionalmente haz que los tests comprueben que la regla se comporta igual reciba la fecha como texto o como objeto de fecha
De nuevo, no toques nada fuera del fichero que te he indicado. No lleves el trabajo a otra rama de git
```

**Qué salió:** Indica que salen justo los 3 fallos que se esperaban por los dos bugs, y la suite no toca la base (8 ms).

## Prompt 4

**Modelo:** Opus 5.5 xHigh
**Herramienta:** Claude Code

```
Que tienen en comun los tests que fallaron?
```

**Qué salió:** Los 6 fallos salen de la misma línea, return this.dueDate < referenceDay en backend/app/models/task.ts:77. Ninguno viene del controlador, del validador, del transformer ni de la parte HTTP. Esa línea tiene dos defectos, y cada uno explica un grupo de fallos. La regla no mira el estado. Este fallo solo se ve con la fecha en texto. En la suite functional queda tapado por el grupo 1: como todo sale false, la tarea hecha también da false y el test pasa.
