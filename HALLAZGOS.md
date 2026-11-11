# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- 2026-11-11T17:49:12Z | BLOQUEADO | R2-correo | docs/capabilities/tasks/README.md

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- Una contraseña en texto plano, en el fichero docs/capabilities/tasks/README.md. Porque es una cadena cualquiera sin prefijo ni forma reconocible, así que ninguna de las tres reglas puede distinguirla de texto normal y supongo que el hook la dejaría pasar aunque el correo se arreglase.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No vi el código de salida como número en Claude Code: el 0 del git status lo deduzco porque no hubo aviso ni línea en el registro, y el 2 del bloqueo solo lo comprobé con una ejecución controlada del script; el bloqueo en sí lo vi por el mensaje del hook y la línea del registro.