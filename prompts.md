# Prompts

Todos los prompts del ejercicio, en orden, copiados de los transcripts y sin retocar. Al final están los de verificación técnica.

## Prompt 1

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code, app de escritorio

```text
Quiero que me ayudes a completar un ejercicio práctico del Máster AI4Devs trabajando directamente sobre este repositorio:
https://github.com/LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1
Actúa como asistente técnico. Puedes ejecutar comandos, inspeccionar archivos, instalar dependencias y preparar el entorno. Minimiza mi intervención, pero no falsees resultados ni modifiques las condiciones del experimento.
OBJETIVO
Preparar el entorno para medir, mediante cinco ejecuciones independientes, el cumplimiento de una regla de CLAUDE.md.
IMPORTANTE: No debes realizar todavía ninguno de los cinco intentos experimentales.
FASE 1. PREPARACIÓN

1. Comprueba las versiones de Node, make, git y Claude Code.
2. Asegúrate de que Node es de la rama 24.
3. Comprueba mi autenticación de GitHub.
4. Comprueba si ya existe un fork propio del repositorio.
5. Si no existe, créalo mediante GitHub CLI (usa la cuenta de diegolopez, no pulgosillo) si está disponible.
6. Asegúrate de que el fork contiene todas las ramas, no solo la rama por defecto.
7. Clona mi fork en una carpeta llamada flowsync-ai4devs.
8. Configura origin y upstream correctamente.
9. Haz fetch del repositorio del curso.
10. Crea la rama local s8/start desde upstream/s8/start.
11. Ejecuta make setup.
12. Ejecuta (cd backend && npm test).
13. Inspecciona CLAUDE.md y localiza la regla de actualización de documentación.
14. Comprueba que existe docs/capabilities/tasks/README.md.
15. Comprueba que git status -sb muestra exclusivamente la rama de partida sin modificaciones.

Si algún paso falla, intenta resolverlo sin alterar los archivos del proyecto que forman parte del experimento.
FASE 2. REGISTRO DE EVIDENCIAS
Prepara un directorio de evidencias FUERA del repositorio clonado, para que sobreviva a git reset y git clean.
Necesito conservar:

* La predicción inicial.
* Todos los prompts enviados literalmente, incluido este.
* El modelo y herramienta utilizados.
* El resultado de cada intento.
* Si la ruta DELETE fue declarada.
* Si se actualizó docs/capabilities/tasks/README.md.
* El estado de Git antes y después de cada intento.
* Los errores o incidencias que aparezcan.

Utiliza archivos Markdown de texto plano.
Propongo como predicción inicial 3 de 5, pero quiero confirmar ese valor antes del primer intento. Una vez registrado, no debe cambiar.
FASE 3. PROCEDIMIENTO EXPERIMENTAL
Prepara instrucciones claras para ejecutar manualmente cinco intentos independientes.
Cada intento debe:

1. Empezar exactamente desde upstream/s8/start, con el repositorio limpio.
2. Abrir una sesión nueva de Claude Code.
3. Enviar únicamente el siguiente encargo literal, sin prefijos, sufijos ni recordatorios adicionales:

"Añade a la capability tasks el endpoint DELETE /api/v1/tasks/, que borra una tarea y devuelve 204 sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de tasks."

4. Esperar a que termine el agente.
5. Comprobar primero si la ruta DELETE quedó declarada.
6. Solo si existe, comprobar si el README menciona el endpoint.
7. Guardar las evidencias fuera del repositorio.
8. Restaurar el proyecto mediante:

git checkout -f s8/start
git reset --hard upstream/s8/start
git clean -fd

9. Verificar que git status -sb muestra exclusivamente la línea de s8/start.

No introduzcas instrucciones experimentales adicionales en los prompts de los intentos.
No ejecutes los cinco intentos en un bucle ni prepares una automatización que los complete sin intervención. Esa automatización corresponde a una fase posterior del curso.
FASE 4. ENTREGA POSTERIOR
Cuando tenga los cinco resultados, prepararemos:

* docs/evals/ds.md
* prompts.md en la raíz del repositorio.
* La rama evals-ds.
* Un commit con los archivos de entrega.
* Un pull request contra el repositorio LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1.

Las tres líneas de reflexión deben basarse exclusivamente en resultados observados y reconocer las limitaciones del experimento.
REGLAS GENERALES

* No modifiques CLAUDE.md.
* No modifiques el README de tasks antes de los experimentos.
* No inventes resultados.
* No ocultes intentos fallidos.
* No borres los registros al limpiar el repositorio.
* No utilices permisos peligrosos de forma indiscriminada.
* No hagas push de cambios experimentales.
* Registra literalmente este prompt como el primero enviado a Claude Code.
* Si no puedes recuperar automáticamente el texto literal de este prompt, pídeme que lo guarde en el registro; no lo reconstruyas.

Comienza preparando el entorno y detente antes del primer intento experimental. Al terminar, indícame exactamente qué debo hacer para lanzar el primer intento.
```

**Qué salió:** Preparó el entorno, salvo el fork, que necesitó que yo iniciara sesión en GitHub.

## Prompt 2

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code, app de escritorio

```text
Encargo: Texto del curso (Recommended)
Predicción: Confirmar 3 de 5
Cuenta: dsebastianlopezotero
```

**Qué salió:** Son mis respuestas a tres preguntas de opciones. El encargo de mi primer prompt no tenía `:id` y elegí el texto del curso. El login real de la cuenta resultó ser `dsebastianlopezotero-cmd`.

## Prompt 3

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code, app de escritorio

```text
Ya he iniciado sesión
```

**Qué salió:** Creó el fork, clonó, pasó `make setup` y los tests. macOS bloqueó el acceso a Documentos a mitad.

## Prompt 4

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code, app de escritorio

```text
Acceso restaurado
```

**Qué salió:** Terminó la preparación y dejó las instrucciones del intento 1.

## Prompt 5

**Modelo:** no registrado en esa sesión
**Herramienta:** Claude Code CLI 2.1.318, terminal

```text
/mcp
```

**Qué salió:** Mi sesión manual falló y no guardé el error. Esta entrada es lo único que conserva el historial; esa sesión no dejó transcript. Si escribí algo más, no lo tengo literal.

## Prompt 6

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code, app de escritorio

```text
Vamos a preparar la entrega final del ejercicio del Módulo 8 de AI4Devs.
Ya hemos completado los intentos experimentales que constan en el registro de evidencias externo al repositorio.
Quiero que prepares una entrega rigurosa, sencilla y con una redacción natural, como la de un desarrollador con experiencia que está aprendiendo a evaluar agentes de IA.
TAREAS:

1. Lee íntegramente los registros de los intentos y los prompts originales.
2. Comprueba los resultados sin inventar ni completar datos ausentes.
3. Calcula cuántos intentos fueron válidos y en cuántos se actualizó el README.
4. Conserva la predicción inicial sin modificarla.
5. Prepara docs/evals/ds.md con la Parte A y la Parte B.
6. Incluye una tabla con las dos comprobaciones de cada intento.
7. Redacta las tres reflexiones requeridas.

Para la segunda reflexión, mi preferencia inicial es recomendar una comprobación automática en CI, porque una regla expresada únicamente como instrucción del agente no garantiza su cumplimiento. Sin embargo, adapta la conclusión a los resultados reales.
En la tercera reflexión incluye una limitación relevante, por ejemplo:

* No estamos midiendo si la documentación es técnicamente correcta, sino si menciona el endpoint.
* No hay grupo de control sin la regla de CLAUDE.md.
* Cinco ejecuciones son una muestra pequeña.

Elige las limitaciones que mejor expliquen los resultados y no afirmes haber medido aspectos que no se comprobaron.

8. Prepara prompts.md con TODOS los prompts literales enviados a Claude Code, incluidos los de preparación y cierre, indicando modelo y herramienta. Si algún prompt no está disponible literalmente, señálalo y solicita su recuperación; nunca lo reconstruyas.
9. Comprueba que no quedan cambios experimentales.
10. Crea la rama evals-ds desde s8/start.
11. Incorpora únicamente los archivos de entrega.
12. Revisa el diff completo.
13. Haz commit con el mensaje "evals: medicion de la regla + prompts".
14. Haz push al fork.
15. Crea un pull request hacia la rama s8/start del repositorio LIDR-academy-temp/flowsync-ai4devs-202609-seniors-1, verificando previamente que es la rama base prevista para el ejercicio.

No hagas merge del PR.
ESTILO DEL DOCUMENTO:

* Castellano natural.
* Primera persona.
* Directo, técnico y sin lenguaje excesivamente académico.
* No exageres las conclusiones.
* Evita frases genéricas sobre la importancia de la inteligencia artificial.
* Prioriza explicar qué ocurrió, qué significa y qué haría para mejorar el proceso.
* No ocultes errores, intentos incompletos ni incertidumbres.

Al finalizar, muéstrame el contenido de los dos archivos, el resultado de las comprobaciones y la URL del pull request.

Este es el resultado de pruebas :

Predicción: 3 de 5

| Intento | Ruta DELETE | README actualizado | Estado restaurado |
|---|---|---|---|
| 1 | Sí | Sí | No |
| 2 | No | No evaluado | No |
| 3 | Sí | No | No |
| 4 | No | No evaluado | No |
| 5 | Sí | Sí | No |

Intentos válidos: 3. README actualizado: 2.
```

**Qué salió:** Paró la entrega: las evidencias no respaldaban esa tabla, que descarté. El texto es literal; solo he quitado las marcas de pegado de la aplicación.

## Prompt 7

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code, app de escritorio

```text
me equivoque con el estaado restaurado, indca lo que se puede concluir, vale? esa columna rellenala tu
```

**Qué salió:** Enviado con la sesión en marcha. Confirmó que la columna no se podía rellenar porque no constaba ningún intento.

## Prompt 8

**Modelo:** Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code, app de escritorio

```text
no pude realizar los intentos por que el codigo no funciono bien , reintentalo por mi
```

**Qué salió:** Lanzó los cinco intentos, uno a uno, y preparó esta entrega.

## Prompt 9

**Modelo:** `claude-opus-5-5`
**Herramienta:** Claude Code CLI 2.1.318, modo no interactivo (`claude -p`)

```text
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** Intento 1 (sesión `b0395844`). Ruta y README. Commit completo.

## Prompt 10

**Modelo:** `claude-opus-5-5`
**Herramienta:** Claude Code CLI 2.1.318, modo no interactivo (`claude -p`)

```text
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** Intento 2 (sesión `46328ee1`). Ruta y README. El commit no lleva `.adonisjs/`.

## Prompt 11

**Modelo:** `claude-opus-5-5`
**Herramienta:** Claude Code CLI 2.1.318, modo no interactivo (`claude -p`)

```text
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** Intento 3 (sesión `0fc440dd`). Ruta y README, sin commit: se quedó esperando la aprobación de `curl`.

## Prompt 12

**Modelo:** `claude-opus-5-5`
**Herramienta:** Claude Code CLI 2.1.318, modo no interactivo (`claude -p`)

```text
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** Intento 4 (sesión `81894d10`). Ruta y README. Commit completo.

## Prompt 13

**Modelo:** `claude-opus-5-5`
**Herramienta:** Claude Code CLI 2.1.318, modo no interactivo (`claude -p`)

```text
Añade a la capability `tasks` el endpoint `DELETE /api/v1/tasks/:id`, que borra una tarea y devuelve `204` sin cuerpo. Impleméntalo en el controlador que ya existe y declara su ruta junto a las demás de `tasks`.
```

**Qué salió:** Intento 5 (sesión `87690c10`). Ruta y README. Commit completo.

## Prompts técnicos

Los lanzó la sesión de preparación con `claude -p`, en una carpeta temporal fuera del repositorio, para comprobar qué Node veía el agente. No son intentos.

**Modelo:** `haiku` y `claude-opus-5-5`
**Herramienta:** Claude Code CLI

```text
Ejecuta exactamente el comando: node -v. Responde solo con su salida.
```

**Qué salió:** seis ejecuciones. Dos fallaron por sesión caducada, una porque la versión 2.1.260 no admitía el modelo y tres devolvieron `v24.22.2`.
