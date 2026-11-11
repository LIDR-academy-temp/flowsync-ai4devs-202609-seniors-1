# Hallazgos

Aquí van **las tres líneas** del ejercicio, una por cada punto de abajo. Es lo único que hay que
traer hecho: una parte del hook a medias con estas tres líneas escritas vale más que lo contrario,
porque lo que se discute en el directo es dónde te chocaste.

Escribe **una sola línea por punto**, con tus palabras, y **sin el dato dentro**: si tu línea
repite el correo o el secreto, eso es otra copia del dato (y también es un hallazgo, de los buenos).

## 1. La regla que saltó

Qué regla saltó en tu prueba, y la línea literal que dejó el registro.

- Saltó la **regla 2, correo con dominio no permitido**, y la línea del registro fue
  `- 2026-11-11T17:53:11Z BLOQUEADO | regla: correo con dominio no permitido | archivo: docs/capabilities/tasks/README.md`
  — la copio literal porque **no lleva el dato dentro**, solo fecha, regla y archivo. Salieron
  **los dos comportamientos y en este orden**: el hook bloqueó el commit con código 2, y *después*
  el agente leyó la regla del `CLAUDE.md`, sustituyó el correo por uno de `example.com` y volvió a
  intentarlo. La evidencia del bloqueo, por tanto, es del hook y no solo de la prueba de la parte B.

## 2. Lo que el hook no puede cazar

Un dato personal o un secreto de este proyecto que el hook NO puede cazar, y por qué.

- **La identidad de quien commitea.** El commit que el hook aprobó lleva mi nombre y mi correo
  personal como metadatos de autor, y ese correo es de **un dominio que la regla 2 prohíbe** — el
  mismo dominio que acababa de bloquear dos líneas más arriba en el registro. El hook no lo ve
  porque solo lee **las líneas añadidas de `git diff` y los nombres de archivo**: los metadatos del
  commit no son ni una cosa ni la otra. Es decir, **en la misma operación en que bloqueó un correo
  de ese dominio escribió otro en el repositorio**, de forma permanente y de una persona real, no
  ficticia. El inventario de la parte A ya lo recogía: el historial son cuatro autores con nombre y
  correo, y es el único dato personal real que hay en este repo.
  - Y dos huecos más del mismo tipo: la **contraseña en claro** del ejemplo de la parte C entró sin
    que nadie la tocara, porque la regla 1 solo reconoce claves **con forma** (prefijo o longitud) y
    una contraseña corriente no tiene ninguna; el agente incluso razonó que *«no rompe ninguna
    regla»*, así que **el hook no solo no la cazó: le dio permiso**. Y la contraseña de un servidor
    MCP que vive en mi `~/.claude/settings.json`, **fuera del repositorio**, nunca pasará por un
    control que se ejecuta en el commit.

## 3. Tu duda

De qué dudaste, o qué no pudiste comprobar.

- **De que lo que medí sea lo que el ejercicio quería medir.** Tres cosas. (1) `git commit -a` se
  salta el hook: lo comprobé yo con un archivo ya seguido y devolvió 0, mientras que
  `git add -A && git commit` sobre el mismo caso devolvió 2 — el hook solo mira lo no preparado si
  el comando dice `git add`, y `-a` lo mete igual. (2) **El hook no lo instaló el agente, lo
  instalé yo**: Claude Code le rechazó dos veces escribir en `.claude/`, y él no lo esquivó por
  shell; así que esto no demuestra que un agente pueda montarse su propio guardarraíl, solo que
  puede escribirlo. (3) Probé que las tres reglas saltan y que el hook calla ante `git status`,
  pero **solo busqué los falsos negativos que ya sospechaba**; de los que no se me ocurrieron no sé
  nada. A lo que se añade un falso positivo que ya apareció solo: el hook bloquea el propio
  inventario por el *placeholder* `tu@email.com` de la página de login, que no es dato de nadie.
  - Y una consecuencia de eso que conviene dejar dicha: **ese inventario está en la entrega porque
    lo commiteé yo desde una terminal**, donde el hook no se activa —el glosario del enunciado lo
    dice—. No me lo salté: es que el control está puesto en la vía del agente, y yo entré por otra.
    Es la misma forma del hallazgo 2, vista desde el otro lado.
