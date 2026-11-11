# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- La regla 2 bloqueó el commit de la prueba B y dejó `2026-11-11T21:53:10Z | BLOQUEADO | REGLA 2 (correo de dominio no permitido) | tmp-prueba-hook.txt`. En la prueba C también bloqueó el commit del README, sin incluir el correo en el registro.

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- La clave `APP_KEY` de `backend/.env` queda fuera de la inspección mientras el archivo esté ignorado y no preparado para Git. El agente podría leerla y enviarla al modelo sin intentar ningún commit, y el hook no detectaría esa transferencia.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- El hook estaba configurado, pero en la primera sesión no llegó a cargarse: el canario pasó sin bloquearse. Al iniciar Claude Code directamente en el repositorio sí funcionó. Me queda la duda de cómo verificar que una protección está activa sin tener que provocarla primero.
