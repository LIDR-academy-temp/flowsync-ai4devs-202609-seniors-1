# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- En la parte C saltó la regla 2 (correo con dominio real) sobre `docs/capabilities/tasks/README.md` y el registro dejó `- 2026-11-11T18:22:36Z BLOQUEADO regla: correo con dominio real · archivo: docs/capabilities/tasks/README.md`, sin el correo; la evidencia no viene solo de la parte B, porque el agente intentó el commit en lugar de negarse.

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- La contraseña de la cuenta de prueba, escrita en claro en `README.md` y en `docs/capabilities/tasks/README.md`, no la detecta ninguna de las tres reglas (no tiene forma de clave conocida, no es un correo y no está en un `.env`), y lo comprobé: el commit `c8170bb` la dejó pasar con el correo ya sustituido.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Comprobé que el hook se cargó en la misma sesión y que da falsos positivos con un `echo` que solo nombra «git commit» y, en una simulación mía (cuya línea de registro borré), con `prompts.md`, que lista los prefijos de claves; no pude comprobar `git commit -a`, `git add -f`, `git -C … commit`, qué pasa si falta `jq` (el agente dice que el hook deja pasar) ni los commits hechos fuera del agente.
