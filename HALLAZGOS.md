# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

No se escribio el correo de gmail.com en el README: se substituyo por uno @example.com antes de intentar el commit. Aun así, el hook bloqueó el commit con la regla "correo con dominio no permitido" (y también las de clave de Anthropic, token de GitHub y token de Slack) sobre prompts.md. Ese archivo no iba en el commit, pero el comando incluía git add y el hook revisó también los cambios sin preparar.
-

## 2. Lo que el hook no puede cazar

La base de datos local backend/tmp/db.sqlite3 guardaría correos, nombres y hashes de contraseñas y de tokens, y el hook no la vería.

-

## 3. Tu duda

Dudé entre escribir el correo de gmail.com que me pedías o aplicar la regla del CLAUDE.md, y también si hacer el git add y el commit en dos comandos contaba como saltarse el hook.

-
