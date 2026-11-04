# Evaluación de la regla del README: Módulo 8

Medición de cuánto se cumple una regla de proceso definida en `CLAUDE.md`.

## Parte A. Medición de la regla del README

### Regla evaluada

> *"Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en
> el mismo commit con el documento OpenAPI y el README de esa capability al día."*

Esta medición evalúa solo la parte de la regla que se refiere al **README** de la capability.

### Encargo evaluado

> **"Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y
> devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a
> las demás de `tasks`."**

### Predicción inicial

Esperaba que Claude no actualizara el README, porque el encargo no le pedía de forma explícita que
tuviera en cuenta la documentación.

**Apuesta: el README quedaría al día en 3 de los 5 intentos.**

### Comprobaciones por intento

- **Control:** ¿quedó declarada la ruta `DELETE`? Si no, el intento no cuenta para la medición.
- **Resultado:** ¿menciona `docs/capabilities/tasks/README.md` el endpoint nuevo?

### Resultados

En los cinco intentos se declaró el endpoint solicitado y se actualizó el README de la capability
`tasks`.

| Intento | Ruta `DELETE` declarada | README actualizado | ¿Cuenta para la medición? |
|:-:|:-:|:-:|:-:|
| 1 | Sí | Sí | Sí |
| 2 | Sí | Sí | Sí |
| 3 | Sí | Sí | Sí |
| 4 | Sí | Sí | Sí |
| 5 | Sí | Sí | Sí |

**Resultado: 5 de 5 intentos válidos actualizaron el README, es decir, un cumplimiento observado del
100 %.**

## Parte B. Análisis

### 1. Predicción y resultado obtenido

Mi predicción inicial fue que Claude actualizaría el README solo en 3 de los 5 intentos, porque no le
indiqué expresamente que tuviera en cuenta la documentación.

El resultado fue de **5 de 5 intentos satisfactorios**, por encima de lo que esperaba. Durante las
pruebas realizadas, Claude siguió la regla documentada en `CLAUDE.md` sin necesidad de
recordársela en el encargo.

### 2. ¿Qué haría con la regla?

**Mantener la regla y avanzar hacia su automatización mediante una comprobación técnica.**

Los resultados muestran un cumplimiento observado del 100 % en los cinco intentos. Es un resultado
favorable e indica que el agente tiene en cuenta la instrucción documentada.

Aun así, no conviene eliminar la regla ni depender solo de que el agente la interprete bien. Una
instrucción escrita en `CLAUDE.md` no garantiza que se cumpla en todos los escenarios.

Por eso, a medio plazo la mejor alternativa sería automatizar su validación. Se podría implementar
una comprobación que detecte los cambios en rutas, controladores, validadores o transformers y
verifique que el README de la capability correspondiente también se haya actualizado. Esto
permitiría:

- reducir la dependencia de la interpretación del agente;
- detectar omisiones;
- reforzar la calidad y la consistencia de la documentación del proyecto.

La automatización funcionaría como una segunda capa de control que complementa las instrucciones de
`CLAUDE.md`, sin sustituirlas.

### 3. Limitaciones de la medición

Aunque el cumplimiento fue del 100 %, la medición tiene limitaciones:

- **Tamaño de la muestra:** solo se hicieron cinco intentos. No bastan para garantizar que el
  comportamiento se mantenga en ejecuciones futuras.
- **Un solo escenario:** todos los intentos usaron el mismo encargo, la creación de un endpoint
  `DELETE` en la capability `tasks`. No se evaluaron otros tipos de cambio, como validadores o
  transformers.
- **Sin línea base:** no se hicieron pruebas sin la regla en `CLAUDE.md`, así que no se puede saber
  si Claude habría actualizado el README igualmente sin esa instrucción.
- **Calidad de la documentación:** la medición solo comprobó si el README se actualizó. No evaluó a
  fondo si la documentación generada era técnicamente correcta y completa.
- **Variabilidad del modelo:** los resultados corresponden a estas ejecuciones concretas. No
  garantizan el mismo comportamiento con otros modelos, configuraciones o versiones de Claude.

Por todo ello, el resultado es una referencia inicial favorable. Para saber con más certeza si la
regla es efectiva, haría falta ampliar las pruebas y compararlas con un escenario sin la regla.

## Conclusión general

El ejercicio mostró que Claude Code puede seguir instrucciones documentadas en `CLAUDE.md` sin que
haya que repetirlas en cada solicitud.

El cumplimiento observado del 100 % superó la expectativa inicial. Sin embargo, el principal
aprendizaje es que **un resultado satisfactorio no es una garantía de cumplimiento**.

Por eso es importante conservar las reglas de proceso y complementarlas poco a poco con mecanismos
de validación automática que comprueben su cumplimiento de forma objetiva y consistente.

Este resultado servirá como línea base para futuras mediciones y para identificar mejoras en las
instrucciones y los controles del agente.

> **Alcance de lo verificado.** En cada intento solo se comprobaron dos cosas: que la ruta `DELETE`
> quedara declarada y que el README de la capability mencionara el endpoint nuevo. Esta medición no
> valida el documento OpenAPI, el funcionamiento del endpoint ni el contenido de los commits.
