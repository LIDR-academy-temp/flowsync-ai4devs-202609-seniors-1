# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: un cambio de motor a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras y con lo que mediste, no con lo que suponías.

1. Cuántos de tus casos nuevos fallaron y cuántos de los que ya había siguieron en verde, con la cifra que te dio la pantalla.

De los nuevos 6 test unitarios 2 fallaron de los nuevos 14 test funcionales fallaron 6. De los casos previos todos se mantuvieron en verde. Lo que tiene sentido porque no se ha modificado ningun logica implementada. Que alguno fallara seria una pista para saber que se cambio algo mas que los tests.

2. Cuál de tus casos nuevos PASÓ, si alguno pasó, y por qué crees que pasó. Es la pregunta más interesante del ejercicio, y la respuesta no está en ningún sitio: se deduce mirando qué tienen en común los que fallaron.

test unitarios que pasaron
- ✔ fecha anterior al día de referencia y sin hacer: vencida (0.57ms)
- ✔ fecha exactamente igual al día de referencia: no vencida (0.08ms)
- ✔ fecha posterior al día de referencia: no vencida (0.05ms)
- ✔ sin fecha: no vencida, por lejano que sea el día de referencia (0.06ms)
test funcionales que pasaron
- ✔ vencer hoy todavía no es estar vencida (66.26ms)
- ✔ fecha futura: no llega vencida (66.62ms)
- ✔ sin fecha no se vence nunca, por lejano que sea el día de referencia (59.4ms)
- ✔ una tarea hecha con la fecha pasada no llega vencida (82.93ms)
- ✔ sin today la respuesta es 422 sobre ese parámetro (62.31ms)
- ✔ un today mal formado ("13/08/2026") es 422 y no devuelve tarea (62.43ms)
- ✔ un today imposible ("2026-02-31") es 422 y no devuelve tarea (61.04ms)
- ✔ un today vacío ("") es 422 y no devuelve tarea (62.05ms)
- ✔ un today no es una fecha ("hoy") es 422 y no devuelve tarea (60.9ms)

Todos esos casos cubren la implementacion actual del campo vencida. Los test que fallaron son los que cubren los escenarios cubiertos por la logica a implementar

3. De qué dudaste, o qué no pudiste comprobar.

Analizando los casos que no pasaron me consto ver la relacion entre ellos, pero evaluando la logica ya implementada para la fecha vencida fue claro cual era la razon