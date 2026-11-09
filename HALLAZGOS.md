# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

-Saltó la regla del hook datos-que-no-salen. Tanto por el readme como por el archivo temp de la prueba de la parte B. Él mismo lo sustituyó por un @example.com y borró el archivo temp. 

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- Cualquier dato personal que no sea un email (nombre o nif), o cualquier secreto que no tenga el formato indicado. El hook ejecuta un script que comprueba un formato fijo. No hace una busqueda semántica como haría un adversarial reviewer. Tampoco caza envios fuera del repositorio (servidores Anthropic) o chat; ni cambios del repositorio efectuados anualmente fuera de claude.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Si el fichero de evidencias registrado es útil, ya que solo registra bloqueos. No deja evidencia de ejecución en caso que el hook no bloquee nada. 
- Si tiene sentido analizar a nivel de tabla y campos (para hook y/o prevención del repositorio), si para analizar riesgos de fuga o envío de información.
