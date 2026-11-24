# Hallazgos

## PARTE A
### Resultado de make test-e2e
functional / Tasks | cuándo una tarea está vencida (tests/functional/tasks/overdue.spec.ts)
  ✖ Fecha del día anterior (77.1ms)
  ✔ Vencer hoy todavía no es estar vencida (67.82ms)
  ✔ Fecha futura (70.79ms)
  ✔ Sin fecha no se vence nunca (63.54ms)
  ✖ Darla por hecha la deja de vencer (72.97ms)
  ✔ Una tarea hecha con la fecha pasada (78.89ms)
  ✖ Aplazar resuelve el vencimiento (63.14ms)
  ...
  Tests  44 passed, 3 failed (47)

## PARTE B
He creado backend/tests/unit/task_is_overdue_on.spec.ts: 13 tests sin servidor y sin base (la suite tarda 8 ms). 3 fallan, por los dos bugs de isOverdueOn que ya habían salido en los tests funcionales, y que aquí se ven sin nada que los tape.

## PARTE C
### 1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla.
Siguen pasando los 40 que ya había, además de 4 de los 7 nuevos
Fallan 3 de os 7 nuevos

-

### 2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó. Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.
Los cuatro que pasaron fueron 
- Vencer hoy todavía no es estar vencida (67.82ms)
- Fecha futura (70.79ms)
- Sin fecha no se vence nunca (63.54ms)
- Una tarea hecha con la fecha pasada (78.89ms)

Al leer de la base, due_date llega como un Date de JS y no como texto. Entonces isOverdueOn compara un Date con un texto, y eso da siempre false. Ninguna tarea leída de la base sale vencida. Los 3 fallos salen de la misma línea, return this.dueDate < referenceDay en backend/app/models/task.ts:77. Ninguno viene del controlador, del validador, del transformer ni de la parte HTTP. Esa línea tiene dos defectos, y cada uno explica un grupo de fallos. 

Ademas isOverdueOn no comprueba que el estado sea done. "Una tarea hecha con la fecha pasada" pasa solo porque todo sale false. La regla no mira el estado. Este fallo solo se ve con la fecha en texto. En la suite functional queda tapado por el grupo 1: como todo sale false, la tarea hecha también da false y el test pasa.

-

### 3. De qué dudaste, o qué no pudiste comprobar.

El analisis del agente fue muy util y me permitio identificar por que fallaron unos tests y pasaron otros

-




De qué dudaste, o qué no pudiste comprobar.