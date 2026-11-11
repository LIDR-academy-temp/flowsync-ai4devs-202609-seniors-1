# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- Saltó «correo real» en la parte C, al intentar el commit del README (después, tras preguntarte, sustituí el correo por uno de example.com), y el registro dejó, sin el dato: `2026-11-11T10:36:48Z BLOQUEADO correo real docs/capabilities/tasks/README.md`.

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- La contraseña de la cuenta de pruebas del ejemplo de `curl` (la misma de `README.md:143`): el hook solo aplica sus tres reglas y ninguna mira contraseñas, así que entró en el commit `874643b` sin aviso; tampoco caza nombres de personas ni lo que guarde `backend/tmp/db.sqlite3` (hoy vacía; correos y hashes cuando tenga filas) si se añade a la fuerza, porque es binario y no deja líneas añadidas que revisar.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No comprobé contra el servidor real que el `curl` funcione (la cuenta con el correo sustituido no existe hasta registrarla), ni lo que pasa fuera de mis comandos: el hook solo corre en el Bash de Claude Code, así que un commit desde tu terminal o un `git -C … commit` no pasan por él, y un `git commit <ruta>` no revisa lo no preparado de esa ruta (la revisión adversarial encontró que `git commit -a` y `git add -f` de un `.env` en el mismo comando también se escapaban: ya corregido); tampoco probé casos límite como los subdominios de example.com, que hoy bloquearía.
