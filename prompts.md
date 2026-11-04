# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** funcionó a la primera. Rama `feat/delete-task` y commit `de2feeb` con controlador, ruta, `.adonisjs/`, `docs/api/openapi.json`, README de la capability y un test nuevo. `openapi:generate` no funciona (error de `jsonschema` con Node 24), así que el documento se sacó de `/api.json`.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
me puedes comentar que archivos modificaste
```

**Qué salió:** lista de los 9 archivos del commit, separados en hechos a mano y generados.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
ve guardando los prompts en el archivo raiz
```

**Qué salió:** rellenado este `prompts.md`.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añade a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks.
```

**Qué salió:** funcionó a la primera, en una sesión nueva. Como `feat/delete-task` ya existía del intento anterior, creó `feat/delete-task-2` y commit `25d8b27` con controlador, ruta, `.adonisjs/`, `docs/api/openapi.json`, README de la capability y un test nuevo (4 casos). Avisó de que el borrado no tiene requisito en la spec y de que `openapi:generate`/`openapi:check` fallan con `Invalid URL`.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
ME PUEDES DECIR QUE MODIFICASTE
```

**Qué salió:** lista de los archivos del commit `25d8b27`, separados en código, tests, generados y documentación, más lo que no tocó.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Necesito que crees el archivo docs/evals/SS.md para documentar la actividad del Módulo 8  correspondiente a la evaluación del cumplimiento de reglas de proceso definidas en CLAUDE.md.
Instrucciones generales
* Respeta la estructura solicitada en el ejercicio.
* Utiliza exclusivamente los resultados y datos proporcionados en este prompt.
* Redacta con lenguaje profesional, claro y técnico, pero fácil de comprender.
* No inventes resultados, métricas ni validaciones adicionales.
* No modifiques otros archivos del proyecto.
* No realices commits ni crees ramas.
* Verifica si existe docs/evals/ y créala únicamente si es necesario.
Parte A. Medición de la regla del README
Regla evaluada
"Un cambio que toque rutas, controladores, validadores o transformers de una capability se cierra en el mismo commit con el documento OpenAPI y el README de esa capability al día."
Encargo evaluado
Añadir a la capability tasks el endpoint DELETE /api/v1/tasks/:id, que borra una tarea y devuelve 204 sin cuerpo. Implementarlo en el controlador existente y declarar su ruta junto a las demás de tasks.
Predicción inicial
Mi expectativa inicial era que Claude no actualizaría el README, debido a que no le indiqué explícitamente que debía considerar la documentación al realizar el encargo.
Por ello, estimé que lograría actualizar el README únicamente en 3 de los 5 intentos.
Resultados
En los cinco intentos se logró implementar el endpoint solicitado y actualizar el README de la capability tasks.
Intento    Ruta DELETE declarada    README actualizado    ¿Cuenta para la medición?
1    Sí    Sí    Sí
2    Sí    Sí    Sí
3    Sí    Sí    Sí
4    Sí    Sí    Sí
5    Sí    Sí    Sí
Resultado: 5 de 5 intentos válidos actualizaron el README, equivalente a un cumplimiento observado del 100%.
Parte B. Análisis
1. Predicción y resultado obtenido
Mi predicción inicial fue que Claude actualizaría el README únicamente en 3 de los 5 intentos, ya que no le indiqué expresamente que debía considerar la documentación.
Sin embargo, el resultado fue de 5 de 5 intentos satisfactorios, superando mi expectativa inicial.
Esto demuestra que, durante las pruebas realizadas, Claude siguió la regla documentada en CLAUDE.md sin necesidad de recordársela explícitamente en el encargo.
2. ¿Qué haría con la regla?
Mi decisión sería mantener la regla y avanzar hacia su automatización mediante una comprobación técnica.
La razón es que los resultados muestran un cumplimiento observado del 100% en los cinco intentos, lo cual representa un resultado favorable y demuestra que la instrucción documentada está siendo considerada por el agente.
Sin embargo, no considero conveniente eliminar la regla ni depender exclusivamente de que el agente la interprete correctamente. Una instrucción escrita en CLAUDE.md no garantiza su cumplimiento en todos los escenarios.
Por ello, considero que automatizar su validación sería la mejor alternativa a mediano plazo. Se podría implementar una comprobación que identifique los cambios realizados en rutas, controladores, validadores o transformers y verifique que el README de la capability correspondiente también haya sido actualizado.
Esto permitiría reducir la dependencia de la interpretación del agente, detectar omisiones y fortalecer la calidad y consistencia de la documentación del proyecto.
La automatización funcionaría como una segunda capa de control, complementando las instrucciones existentes en CLAUDE.md, en lugar de sustituirlas.
3. Limitaciones de la medición
Aunque se obtuvo un cumplimiento del 100%, existen algunas limitaciones que deben considerarse:
* Tamaño de la muestra: únicamente se realizaron cinco intentos, por lo que no es suficiente para garantizar que el comportamiento se mantenga en futuras ejecuciones.
* Un solo escenario: se utilizó el mismo encargo en todos los intentos, enfocado en la creación de un endpoint DELETE para la capability tasks. No se evaluaron otros tipos de cambios, como validadores o transformers.
* Ausencia de una línea base: no se realizaron pruebas en un escenario sin la regla documentada en CLAUDE.md. Por lo tanto, no podemos determinar si Claude habría actualizado el README incluso sin esa instrucción.
* Calidad de la documentación: la medición se enfocó en comprobar si el README fue actualizado, pero no evaluó exhaustivamente si toda la documentación generada era técnicamente correcta y completa.
* Variabilidad del modelo: los resultados corresponden a las ejecuciones realizadas y no garantizan que otros modelos, configuraciones o versiones de Claude tengan el mismo comportamiento.
Por lo anterior, considero que el resultado obtenido es una referencia inicial favorable, pero sería necesario ampliar las pruebas y establecer una comparación sin la regla para determinar con mayor certeza su efectividad.
Conclusión general
El ejercicio permitió comprobar que Claude Code puede seguir instrucciones documentadas en CLAUDE.md sin necesidad de repetirlas explícitamente en cada solicitud.
El cumplimiento observado del 100% superó la expectativa inicial; sin embargo, el principal aprendizaje es que no debemos confundir un resultado satisfactorio con una garantía de cumplimiento.
Por ello, considero importante conservar las reglas de proceso y complementarlas progresivamente con mecanismos de validación automática que permitan comprobar su cumplimiento de manera objetiva y consistente.
El resultado de esta evaluación servirá como línea base para futuras mediciones y para identificar oportunidades de mejora en las instrucciones y controles del agente.
Consideraciones finales
Mantén la distinción entre cumplimiento observado y garantía de cumplimiento. No afirmes que se validó OpenAPI, la funcionalidad del endpoint o el commit si no existen evidencias específicas de esas comprobaciones.
Al terminar:
1. Crea el archivo docs/evals/SS.md.
2. Muéstrame el contenido completo.
3. Confirma la ubicación del archivo.
4. No realices ninguna otra modificación al repositorio.
```

**Qué salió:** creó `docs/evals/` y `docs/evals/SS.md` con la Parte A y la Parte B, siguiendo la estructura del README del ejercicio. Añadió una sección de comprobaciones por intento y una nota de alcance de lo verificado. Sin commit. Avisó de que el archivo quedó en `feat/delete-task-2` y de que la entrega va en una rama `evals-<iniciales>`.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
guardaste los prompts ?
```

**Qué salió:** no; `prompts.md` solo tenía los 3 prompts de la sesión anterior. Listó los que faltaban y preguntó antes de añadirlos.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Si adañelos por favor
```

**Qué salió:** añadidos los prompts 4 a 8 a este `prompts.md`, sin commit.
