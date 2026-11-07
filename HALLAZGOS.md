# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- En la prueba de la parte C salto la regla 2 debido a la presencia del email. En pruebas previas, durante la implementacion del hook todas las reglas santaron como se reflja en el documento `docs/seguridad/registro-de-bloqueos.md`.
- Esta es la linea registrada para el test de la parte C: `- 2026-11-07T22:47:42Z BLOQUEADO regla 2 (correo de una persona) en docs/capabilities/tasks/README.md`. 
- La linea anterior corresponde a la prueba de la parte C ya que todas las pruebas de la parte B se realizaron sobre otros ficheros, temporales y no sobre este.

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- Secretos o password que no tengan un formato reconocible, por ejemplo una contraseña de 8 caracteres al azar. El hook no puede cazarlo porque no tiene un patrón definido para identificarlo.
- El unico dato personal reconocible por el hook es un correo electronico, por lo que otros datos personales como nombres, apellidos, direcciones o numeros de telefono no pueden ser detectados por el hook. Esto se debe a que no hay un patrón definido para estos datos y no se pueden identificar de manera confiable.
- Siguiendo lo descubierto por el inventario emails y secretos ya en el repo no serian detectados por este hook. Herramientas de analisis de codigo estatico o revisiones manuales serian necesarias para detectarlos.
- Posible fuga de datos que el hook no puede detectar y no podria mitigar es aquella debido al accesso de datos de sesion del agente, como el email del usuario de git. La remediacion de esta parte no se puede hacer con un hook.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Analizando los resultados dude en si el hook habia funcionado con correos electronicos de la lista de permitidos, volvi a utilizar un prompt para que las pruebas se realizara y con otro solicite las pruebas para cerciorarme de que el test realmente pasaba, ya que las prueba se hacian en un scratch pad y desaparecian.
- De manera directa no comprobe las reglas 1 y 2, pero los test realizados durante la implementacion del hook y el test con hallazgos me dieron la confianza de que estas reglas funcionaban correctamente.
- Como no era parte del ejercicion comprobe de manera explicita el complimiento de las regals 2 y 3, pero que quedaron validadas durante los diferentes test que la IA realizo durante la implementacion, de los cuales tuve pruebas parciales y mi revision del codigo generardo para el hook. 
