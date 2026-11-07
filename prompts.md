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

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Actuando como experto de seguridad en desarrollo de software
Genera el imventario de lo que es dato personal o secreto en este proyecto, y de qué lee el agente para trabajar aquí. Tres listas:
1. - Datos personales: las tablas y columnas que guardan datos de una persona identificable (que lo lea en las migraciones, no que lo suponga) y los ficheros con ejemplos de correos o nombres
2. - Secretos: los ficheros que llevan o pueden llevar claves, tokens o contraseñas, estén o no en el repositorio
3. - Informacion que consulta el agente: que has leido o leeria por defecto cualquier agente ara hacer un cambio en el backend (el fichero de instrucciones del repositorio, la configuración del harness, los ficheros de entorno, la base de datos local), diciendo de cada uno si su contenido sale de tu máquina cuando trabaja contigo.
No camibies nada en el proyecto, salvo el fichero prompt.md, que es donde se escribe este prompt siguiendo el formato propuesto en el fichero
```

**Qué salió:** inventario en tres listas sacado de las migraciones y de los ficheros; leyó del `.env` solo los nombres de las variables y de la BD solo recuentos. El prompt dice `prompt.md`, pero el fichero es `prompts.md`.

## Prompt 2

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Actuando como agentic developer
Crea el siguiente hook de Claude code:
- localizado en: .claude/hooks/datos-que-no-salen.sh
- registrado en .claude/settings.json como PreToolUse con el matcher Bash, junto al que ya hay.
- Lee el JSON (JavaScript Object Notation, el formato de texto en que la herramienta le pasa los datos) de la entrada estándar con jq (el comando viene en .tool_input.command), como hace el hook de Prettier. set -uo pipefail.
- Solo actúa si el comando contiene git commit. Con cualquier otro comando sale con 0 sin decir nada.
- Revisa las líneas añadidas de lo que va a entrar: el diff preparado (git diff --cached). Y si el mismo comando también hace git add, además los cambios sin preparar y los archivos nuevos sin seguimiento, porque en ese caso todavía no están en el índice.
- Aplica estas tres reglas, y solo estas tres:
  - Una clave con forma reconocible: AKIA seguido de 16 caracteres (Amazon Web Services, AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa- (Slack), un bloque -----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.
  - Una dirección de correo cuyo dominio no sea example.com, example.org, example.net ni github.com. La lista es corta a propósito: los ejemplos y las pruebas de este proyecto ya usan example.com, que es un dominio reservado para eso.
  - El fichero .env (ese nombre exacto, en cualquier carpeta) entre lo que entra. Los .env.example no cuentan.
- Como debe actuar el hook si alguna de las tres reglas salta:
    - sale con código 2, escribe por la salida de error qué regla saltó, en qué archivo, y que se sustituya el dato por uno inventado. Y añade una línea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (tiempo universal coordinado) en formato ISO 8601, la palabra BLOQUEADO, la regla y el archivo. Nunca el valor encontrado: un registro que repite el dato es otra copia del dato. Si el registro no existe, lo crea con una cabecera de una línea.
- Como debe actuar el hook si ninguna de las tres reglas salta:
    - Si no encuentra nada, sale con 0 y no escribe nada.
Ande una mencion al nuevo hook con un bloque breve en la sección de reglas de proceso del CLAUDE.md del repositorio. Debe explicar que el hook existe, qué tres cosas bloquea y cómo actuar ante un bloqueo: no desactivarlo ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo. También debe indicar que el registro se incluye en el commit con el resto del trabajo, porque es la evidencia del bloqueo. AGENTS.md no se modifica: el agente debe comprobar antes qué es.
Definition of done del hook:
- El hook está en .claude/hooks/datos-que-no-salen.sh y registrado en .claude/settings.json como PreToolUse con el matcher Bash.
- Hay una mencion en CLAUDE.md de que el hook existe, qué bloquea y cómo actuar ante un bloqueo.
- El hook funciona según lo descrito: bloquea las tres reglas, sustituye el dato por uno inventado y registra el bloqueo en docs/seguridad/registro-de-bloqueos.md. Realizando el siguiente test, por cada elemento de la lista se ha de hacer un git add:
    - forzar la primera regla:a ctualizar ese archivo temporal para que contenga una clave conocida Tiene que salir con 2, bloquera git add y dejar su línea en el registro.
    - forzar la segunda regla: actualizar ese archivo temporal para que contenga un correo de gmail.com. Tiene que salir con 2, bloquera git add y dejar su línea en el registro.
    - forzar la tercera regla: actualizar el archivo .env. Tiene que salir con 2, bloquera git add y dejar su línea en el registro.
    - deshacer los cambios que forzaba las reglas: eliminar los ficheros temporales y los cambios de .env. Tiene que salir con 0, permitir git add y las lineas registradas se mantienen en el registro tal y como se crearon
Intenta cumplir la definición de done sin cambiar nada más en el proyecto, salvo el fichero prompt.md, que es donde se escribe este prompt siguiendo el formato propuesto en el fichero, con un maximo de 5 intentos
```

**Qué salió:** dos intentos. En el 1 las tres reglas bloquearon, pero la 3 también registró `backend/.env`, que el comando no nombraba (con `git add -f` contaba cualquier `.env` ignorado). Se corrigió y el 2 salió limpio. Las líneas del intento 1 se quedan en el registro tal como se escribieron.

## Prompt 3

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
anade a docs/capabilities/tasks/README.md, en la sección de cómo probar a mano contra el servidor real, 
 un ejemplo de curl que obtenga el token con la cuenta de pruebas de 
 - [nombre pedido en el ejercicio]: 
 - correo [correo pedido en el ejercicio], 
 - contraseña [contraseña pedida en el ejercicio]. 
 Escribelo tal cual, sin cambiar ningún dato, y haz un commit solo con ese cambio.
 Escribe este prompt siguiendo el formato propuesto en el fichero prompts.md. No incluyas este fichero en el commit, ni cambies nada más en el proyecto. No hagas push.
```

**Qué salió:** escribió el ejemplo tal cual y el commit lo bloqueó el hook (pieza 1, regla 2, en el README). No esquivó el hook ni cambió el correo, porque el prompt lo prohibía: se paró a preguntar. La contraseña no la detecta ninguna regla.

## Prompt 4

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
En el prompt de creacion del hook /Users/jesusmcantero/Documents/Training & Education/lidr-ai-master/code/flowsync-ai4devs-202609-seniors-1-temp/.claude/hooks/datos-que-no-salen.sh comprobaste que cambios que contengan algun dominio de correo de los permitidos example.com, example.org, etc daban el resultado esperado. Vuelve a comprobarlo, pero no realices ninguna modificacion sino cumple la regla. Resgistra este prompt en prompts.md
```

**Qué salió:** lo comprobó contra un clon desechable, sin tocar el hook ni el registro real. 11 casos con dominios permitidos dieron 0 sin escribir nada, y 6 controles con otros dominios dieron 2. La regla se cumple y no hubo que cambiar nada.

## Prompt 5

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
haz el test anterior pero proporcioname las pruebas del estado del scratch pad en una carpeta /hook-test. ande este prompt a prompts
```

**Qué salió:** repitió los 17 casos (11 permitidos con 0, 6 controles con 2, ningún fallo) y guardó la evidencia de cada uno en `hook-test/`, en la raíz del proyecto: entrada del hook, estado del clon, stderr, líneas del registro y huellas del repo real. Interpretó `/hook-test` como la raíz del proyecto.

## Prompt 6

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Crea un commit por cada uno de estos ficheros en ese orden, y sin cambiar nada más en el proyecto:
- docs/seguridad/registro-de-bloqueos.md
- HALLAZGOS.md
- prompts.md, este commit debe incluir este mismo prompt.
sigue las reglas de commit que ya has usado: el mensaje del commit es la primera línea del fichero, y el resto del fichero es la descripción. No hagas push.
```

**Qué salió:** commiteó el registro y `HALLAZGOS.md`. El commit de `prompts.md` lo bloqueó el hook (regla 2), porque el prompt 3 lleva el correo de gmail tal cual. No esquivó el hook ni cambió el correo: se paró a preguntar.

## Prompt 7

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
1 sustiyendo igualmente el nombre y la contrasena por: los valores pedidos en el ejercicio. Incluye tambien este prompt antes de hacer el commit
```

**Qué salió:** preguntó cómo leer «los valores pedidos en el ejercicio» y se eligió una referencia al enunciado. En el bloque del prompt 3, el nombre, el correo y la contraseña de la cuenta de pruebas pasan a ser `[… pedido en el ejercicio]`, así que en este fichero no queda otra copia del dato. Se commiteó junto con la línea pendiente del registro.
