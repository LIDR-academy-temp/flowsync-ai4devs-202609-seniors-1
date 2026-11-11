# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- Saltó la regla 2 (correo no permitido) en la parte C, con exit 2; dejó `2026-11-11T15:30:52Z BLOQUEADO regla 2 (correo fuera de los dominios de ejemplo) docs/capabilities/tasks/README.md`. El agente luego cambió el correo, así que no cumplió el «sin cambiar ningún dato».

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- La contraseña de la cuenta de pruebas del `curl`: no encaja en ninguna de las tres reglas. Tampoco `backend/tmp/db.sqlite3`: Git la ignora y el hook solo mira el diff del commit.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- No comprobé el exit 2 en la parte B (el agente usó `--dry-run`). Dudo de `git commit -a`, de `git add -f` con un `.env` y de cambios hechos en el mismo comando que el commit.