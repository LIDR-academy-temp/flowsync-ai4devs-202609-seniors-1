# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- Se activó la regla 2 (correo con dominio no permitido) en las partes B y C. Evidencia de la Parte C: - 2026-11-09T19:49:44Z BLOQUEADO regla=2 (correos fuera de example.com/.org/.net y github.com) ruta=docs/capabilities/tasks/README.md


## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- Los nombres completos almacenados en users.full_name son datos personales identificados en las migraciones del backend, pero el hook no los detecta por sí solos porque únicamente comprueba patrones concretos de secretos, dominios de correo y archivos .env.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Detecté y corregí un error relacionado con subshells que impedía conservar las coincidencias en HITS. Después comprobé un bloqueo real, pero no he probado todas las variantes de comandos Git, como git commit -a, ni todos los patrones de secretos.
