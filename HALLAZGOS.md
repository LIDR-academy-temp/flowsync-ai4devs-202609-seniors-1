# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- Saltó `correo-no-autorizado` al intentar commitear un archivo temporal con un correo de fuera de la lista, y el registro dejó `2026-11-10T18:42:38Z | BLOQUEADO | correo-no-autorizado | prueba-hook.tmp.txt`; en cambio, el commit del `curl` de la cuenta de pruebas entró sin que saltara ninguna regla.

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- La base de datos `backend/tmp/db.sqlite3` (nombre, correo, hash de la contraseña y de los tokens de cada usuario) entraría con un `git add -f` sin que saltara nada, porque es un binario: `git diff` no muestra líneas añadidas y el script se salta los binarios, así que ninguna de las tres reglas llega a leer su contenido.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- (Respuesta de la IA)No pude averiguar por qué el hook no frenó el commit del `curl`: en pruebas aisladas el script bloquea ese mismo caso con código 2, pero en esa llamada no dejó ninguna línea en el registro, así que no sé si llegó a ejecutarse.
- Me surgio la duda si se realizo bien el ejercicio al inicio por que me marco errores al realizar el make, pedí apoyo a la IA para que revisara si exístian errores y que me apoyara a resolverlos, la respuesta fue que no habia errores y que levantaron correctamente los aplicativos.
- La segunda duda que tuve fue que me arrojo que no tenia instalado el aplicativo jq, pero realiza las pruebas y lo tengo, pero comento la IA que no y que no podia realizar todas las pruebas del paso 2 del hook divido en 2 piezas.
