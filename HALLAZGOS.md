# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde

- Tests  62 passed, 10 failed (72)

De los casos nuevos  fallaron 10 tests (sobre 32 tests nuevos generados).
Todos los existentes al inicio (40 funcionales) siguen en verde.

## 2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó.

Han pasado porque la comprobación de fecha y date siempre da false. Esto provoca que pasen los de fecha hoy o futura, aunque no se esté validando nada. Además en los de tarea "hecha" no se mira el estado para determinar si está vencida o no.

### Funcional tests

    - vencer hoy todavía no es estar vencida.
    - una tarea con fecha futura no llega vencida.
    - una tarea sin fecha no se vence nunca, por antigua que sea.
    - una tarea hecha con la fecha ya pasada no llega vencida.


### Unit Test:

    - fecha exactamente igual al día de referencia: no vencida
    - fecha posterior al día de referencia: no vencida
    - sin fecha: no vencida


## 3. De qué dudaste

De qué dudaste, o qué no pudiste comprobar.

- Si corregir las comprobaciones adicionales que habia añadido sobre dueDate y status; o bien si mantenerlo como lo había dejado tras el prompt 1.
  

