# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

## 1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde

Con la cifra que te dio la pantalla.

- Añadí 13 tests: 7 funcionales (4 pasan y 3 fallan) y 6 unitarios (4 pasan y 2 fallan); los 40 tests funcionales anteriores siguen en verde.


## 2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó

Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.

- Pasaron los casos funcionales que esperaban false porque al recuperar dueDate como Date desde PostgreSQL, la comparación con un string devuelve false incluso cuando debería ser true; los unitarios con fechas de texto pasan, pero también detecté que la regla no excluye el estado done.

## 3. De qué dudaste

O qué no pudiste comprobar.

- Dudé de si el fallo estaba en las fechas o en los endpoints; comprobé que Lucid devuelve Date al leer de PostgreSQL y que los cambios se guardan bien, pero sigue sin demostrarse correctamente el comportamiento de done y la transición completa de vencida a no vencida mientras falle la comparación inicial.
