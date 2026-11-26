# Hallazgos

## 1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla

De los 7 casos nuevos (backend/tests/functional/tasks/overdue.spec.ts) fallaron 3 y pasaron 4. Los 40 que ya había siguieron todos en verde. La cifra de `make test-e2e` fue: "Tests  44 passed, 3 failed (47)", es decir, 40 anteriores + 4 nuevos en verde y 3 nuevos en rojo.

Los tres que fallaron: "Fecha del día anterior", "Darla por hecha la deja de vencer" y "Aplazar resuelve el vencimiento".

## 2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó

Pasaron 4 de los 7: "Vencer hoy todavía no es estar vencida", "Fecha futura", "Sin fecha no se vence nunca" y "Una tarea hecha con la fecha pasada".

Los tres que fallaron tienen en común que en algún punto esperan isOverdue: true; los cuatro que pasaron solo esperan false. De ahí deduje que el backend devuelve isOverdue: false siempre, y que esos cuatro pasaron por coincidencia: un campo fijo a false los pondría igual de verdes.

Después lo confirmé sin tocar la implementación. isOverdueOn (backend/app/models/task.ts) compara this.dueDate < referenceDay pensando que son dos textos, pero la columna es de tipo date y el driver de PostgreSQL la entrega como un objeto Date. Con una consulta de solo lectura a la base de pruebas vi que un Date comparado con el texto '2026-09-01' da false, mientras que la misma comparación texto contra texto da true. Por eso nunca sale true.

Hay un segundo fallo tapado por el primero: el método no mira el estado de la tarea, aunque su comentario dice que una tarea hecha no vence. "Una tarea hecha con la fecha pasada" pasa hoy sin que nada compruebe esa regla. En la Parte A era una sospecha; la Parte B la confirmó: el test unitario "ya hecha y con la fecha pasada" llama a isOverdueOn sobre una tarea hecha y falla porque devuelve true (`make test-unit`: "Tests  4 passed, 2 failed (6)"). El otro rojo unitario confirma el primer fallo: la víspera da true como texto y false como Date.

Un test que solo comprueba la ausencia de algo no distingue "la regla funciona" de "la función no hace nada". Los dos casos que primero afirman true y luego false ("Darla por hecha…" y "Aplazar…") son los que de verdad ejercen la regla.

## 3. De qué dudaste, o qué no pudiste comprobar

No pude comprobar tres cosas:

1. Que el test HTTP de "Una tarea hecha con la fecha pasada" se pondrá rojo cuando se arregle la comparación de fechas. El fallo en sí ya está confirmado por el test unitario de la Parte B, pero ese cambio de verde a rojo por HTTP se deduce y nadie lo ha visto.

2. Que las reglas de los cuatro casos verdes funcionen por HTTP. Los tests unitarios comprueban el límite de "vencer hoy" con la fecha como texto, pero por HTTP la fecha llega como Date e isOverdue sale siempre false, así que ahí que pasen no demuestra nada.

3. El scenario de la tarea sin fecha "creada hace semanas". La fecha de creación la pone el servidor y por HTTP no se puede fabricar; el test solo mueve el día de referencia a una fecha muy posterior, que no es exactamente lo mismo.

También me costó ver el segundo fallo: al principio di por bueno que el caso de la tarea hecha pasara "porque está hecha", cuando en realidad pasa porque todo devuelve false. Y la causa de fondo no la dieron los tests, que solo decían "esperaba true, llegó false": hubo que leer el modelo y consultar la base de pruebas.
