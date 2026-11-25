# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Saltó el hook al hacer commit. Contenido de `docs/seguridad/registro-de-bloqueos.md`:
```
# Registro de bloqueos de datos que no deben salir
- 2026-11-25T17:25:37Z BLOQUEADO regla=correo-real archivo=temporal-prueba-hook.txt
- 2026-11-25T17:28:20Z BLOQUEADO regla=correo-real archivo=docs/capabilities/tasks/README.md

```
- 

## 2. Lo que el hook no puede cazar

La lista de datos personales a comprobar es una lista cerrada de archivos y formatos. Cualquier dato que no esté en uno de los archivos especificados o que no tenga uno de los formatos especificados, se escaparía.

- 

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.
De que la forma de detectar datos personales sea robusta. No se comprueba que los datos personales no salgan a través de algún MCP o de la propia API de Anthropic al enviar contexto en cada petición

- 