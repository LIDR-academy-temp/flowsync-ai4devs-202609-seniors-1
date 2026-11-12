# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.
- Saltó correo-real al pedir el ejemplo de curl de la parte C. El registro dejó esta línea: 2026-11-09T03:40:17Z BLOQUEADO regla=correo-real archivo=docs/capabilities/tasks/README.md. La línea no lleva el correo, pero en ese mismo instante quedaron otras tres a la vez: CLAUDE.md por clave-reconocible y prompts.md por correo-real y clave-reconocible. El hook bloquea la documentación de sus propias reglas y el inventario de prompts.md.

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.
- La contraseña secreto123 de la cuenta de pruebas entró tal cual en el README. El agente solo cambió el correo. Una contraseña en texto plano no tiene una forma reconocible como AKIA… o sk-ant-. Lo mismo pasa con un nombre como «Ana Pérez», que sale de users.full_name: el script solo ve patrones de texto, no sabe qué es información personal o una contraseña de usuario

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.
- CLAUDE.md y prompts.md bloquearan el git commit a través del agente. Imagino que podré hacer el commit sin problemas a través de la terminal.
