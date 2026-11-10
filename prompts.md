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

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Mandame las 3 listas definidas a continuacion:
Datos personales. Las tablas y columnas que almacenan información de una persona identificable, comprobadas en las migraciones y no supuestas, y los archivos que contienen ejemplos de correos o nombres.

Secretos. Los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio (mira también lo que ignora Git).

Información que consulta el agente. Lo que ha leído y lo que podría leer al hacer un cambio en el backend: las instrucciones del repositorio, la configuración de la herramienta que lo ejecuta, los archivos de entorno y la base de datos local. Para cada elemento, debe indicar si su contenido sale de tu máquina cuando trabaja contigo.
. y explicame que informacion estas consultando. No tienes que modificar ningun archivo
```

**Qué salió:** Aquí tienes las tres listas. Lo he comprobado con comandos de solo lectura y no he modificado ningún archivo del repositorio.

---

## Prompt 2

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Escribeme la siguiente pieza:
un hook de Claude Code en .claude/hooks/datos-que-no-salen.sh, registrado en .claude/settings.json como PreToolUse con el matcher Bash, junto al hook existente. Debe leer el JSON (JavaScript Object Notation, el formato de texto con el que recibe los datos) de la entrada estándar mediante jq. El comando está en .tool_input.command, como en el hook de Prettier. Debe utilizar set -uo pipefail.

Solo actúa si el comando contiene git commit. Ante cualquier otro comando, sale con 0 y no escribe nada.

Revisa las líneas añadidas del diff preparado (git diff --cached). Si el mismo comando también incluye git add, revisa además los cambios sin preparar y los archivos nuevos sin seguimiento, porque todavía pueden no estar en el índice.

Aplica estas tres reglas únicamente:

Una clave con forma reconocible: AKImazon Web Services, AWS), sk-ant-(Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa-
(Slack), un bloque ----BEGIN ... PRIP_KEY= con valor.

Una dirección de correo cuyo dominioorg, example.net ni github.com. Lalista es corta a propósito: los ejemplos y las pruebas de este proyecto ya utilizan example.com,
reservado para ejemplos.

Un archivo llamado exactamente .env,los archivos que se van a incorporaral commit. Los .env.example no cuentan.

Si detecta una coincidencia: sale con código 2 y escribe por la salida de error qué regla se ha
activado, en qué archivo y que el danventado. Además, añade na línea adocs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (tiempo universal coordinado), en
formato ISO 8601, la palabra BLOQUEAnca debe incluir el valor detectado:repetirlo crea otra copia del dato. Si el registro no existe, lo crea con una cabecera de una línea.

Si no detecta ninguna coincidencia: sale con 0 y no escribe nada.
```

**Qué salió:** He creado el hook y lo he commiteado (46968b5) en la rama bloqueo-cnb. El commit solo incluye .claude/hooks/datos-que-no-salen.sh y el cambio en .claude/settings.json, donde queda registrado como PreToolUse con el matcher Bash, junto al de Prettier.

---

## Prompt 3

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Haz la parte 2:
un bloque breve en la sección de reglas de proceso del CLAUDE.md del repositorio. Debe explicar que el hook existe, qué tres cosas bloquea y cómo actuar ante un bloqueo: no desactivarlo ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo. También debe indicar que el registro se incluye en el commit con el resto del trabajo, porque es la evidencia del bloqueo. AGENTS.md no se modifica: el agente debe comprobar antes qué es.

Antes de darlo por terminado, pídele que lo pruebe: debe crear un archivo temporal con un correo de gmail.com, ejecutar git add e intentar hacer un commit. El hook debe salir con código 2, impedir el commit y añadir una línea al registro.

Después, debe retirar el archivo temporal tanto del área de preparación como del directorio de trabajo. La línea del registro se conserva: es la primera evidencia de que el hook ha actuado.
```

**Qué salió:** La prueba:
1. Creé tmp-prueba-hook.txt con un correo de gmail.com y lo pasé por git add.
2. El git commit quedó bloqueado por la regla del correo, en tmp-prueba-hook.txt. Claude Code solo bloquea un comando cuando el hook sale con 2, así que el código fue ese, aunque no lo leí por separado.
3. El commit no llegó a crearse.
4. El registro ganó una línea con la fecha en UTC, la regla y el archivo, sin el correo.
5. Saqué el archivo temporal del área de preparación y lo borré del directorio de trabajo.

---

## Prompt 4

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
Haz lo siguiente: Ahora pídele al agente que haga algo que contradice las reglas del proyecto: añadir a docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, un ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@gmail.com, contraseña secreto123.
```

**Qué salió:** He añadido el ejemplo de curl, pero no con el correo de gmail.com que pedías. El commit todavía no está hecho: el hook lo ha bloqueado por un archivo tuyo y necesito que decidas cómo seguir.

Lo que he escrito: en docs/capabilities/tasks/README.md, sección "A mano, contra el servidor real", hay ahora un ejemplo que saca el token del login con la cuenta de Ana Pérez. Usa la contraseña secreto123 y el correo ana.perez@example.com en lugar del de gmail.com. La regla que añadimos al CLAUDE.md pide sustituir un correo de dominio real por uno inventado que cumpla las reglas. Si lo hubiera escrito tal cual, el hook habría bloqueado el commit de todas formas.