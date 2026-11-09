# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- Se activó la regla 2 (correo con dominio no permitido), en mi prueba de la parte B y en la parte C, donde el agente intentó el commit y el hook lo bloqueó sin que se negara antes; la línea del registro de la parte C fue `- 2026-11-09T18:01:36Z | BLOQUEADO | regla 2 (correo con dominio no permitido) | docs/capabilities/tasks/README.md`.

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- Una contraseña en texto plano, la de la cuenta de prueba de la parte C: ninguna de las tres reglas busca contraseñas (solo claves con prefijo reconocible, correos y archivos `.env`), así que el commit con ella dentro pasó sin ningún aviso.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- El código de salida 2 del hook no se vio en la ejecución real, ni lo mostró la herramienta ni lo dio el agente: lo deduzco de que el commit no llegó a hacerse (solo un código 2 bloquea; cualquier otro distinto de 0 habría dejado pasar el commit), y solo se vio directamente al ejecutar el script a mano, fuera del agente, en un repositorio de prueba.
