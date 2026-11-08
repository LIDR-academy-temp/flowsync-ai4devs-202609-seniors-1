# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- Saltó la regla 2, correo con dominio no permitido, creando 2 lineas: la primera cuando saltó el bloqueo, y la segunda cuando cambió el email a uno de `example.com` y realizó el commit.

- Las 2 lineas registradas fueron:

```
2026-11-08T16:52:38Z BLOQUEADO regla-2 docs/capabilities/tasks/README.md
2026-11-08T17:00:54Z BLOQUEADO regla-2 docs/capabilities/tasks/README.md
```

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- No detectó añadir una contraseña a `docs/capabilities/tasks/README.md`, ya que no sigue ninguno de los patrones establecidos en la regla 1, y lo interpretó como cualquier otro texto plano.

- Pasaría lo mismo con otros datos personales como: Nombres, DNI/NIF, direcciones, teléfonos, etc. El hook no tiene patrones definidos para poder detectarlos.

- En el archivo `.gitignore` se explicita el archivo `.env.local`, pero no un `.env.production`, que podria saltarse la tercera regla y subirse en un commit.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- Olvidé que para que el nuevo hook pudiera usarse en la sesión, debería haberlo cargado manualmente o reiniciado la sesión. En el primer intento no se disparó por este motivo, y fue el propio agente quien deshizo el commit.

- La regla 1 (claves con forma reconocible) quedó sin probar: solo revisé el código del patrón y no lancé ningún commit con una clave de ejemplo para ver si el hook la detectaba.

- Tampoco probé la regla 3, la del fichero `.env`.

- En la última prueba, el primer commit del agente, con el `@gmail.com` dentro, pasó sin que el hook lo bloqueara. El agente lo lanzó con `git add … && git commit …` en una sola llamada. Después volvió a ejecutar el hook por su cuenta con esa misma forma de comando, y no terminó en 60s. Con el `add` en una llamada aparte tarda unos 3s y bloquea bien.

La hipótesis del agente es que el harness cortó el hook por tiempo, pero no la comprobó. No vio ningún aviso de timeout, no midió cuánto tarda en total, no conoce el límite configurado ni investigó por qué es lento. Por eso tampoco puede afirmar que el hook falle hacia el lado inseguro: es solo una consecuencia de esa hipótesis. Para confirmarlo habría que cronometrarlo sin límite de tiempo y revisar el timeout configurado en Claude Code.
