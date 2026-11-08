# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- Saltó la regla CORREOS en la Parte C y `PreToolUse` bloqueó el commit con código 2; el registro dejó `2026-11-08T21:26:30Z | BLOQUEADO | CORREOS | docs/capabilities/tasks/README.md`.

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- `backend/tmp/db.sqlite3` puede guardar hashes de contraseñas y tokens ligados a usuarios, pero el hook no inspecciona la base de datos: solo analiza ciertos cambios de Git y patrones concretos; el inventario de la Parte A la encontró con las tablas vacías.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No verifiqué uno por uno todos los patrones de secretos ni todas las variantes de comandos Git.
