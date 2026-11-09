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

**Modelo:** Opus 5.5 - Medium
**Herramienta:** Claude Code

```
Genera una lista identificando todos los elementos del proyecto que puedan contener datos personales (nombres, correo, nif, otra información que pueda servir para identificar a una persona).
Mira en tablas, columnas y archivos. comprobando las migraciones del esquema, no supongas nada no contrastado.

Despues genera otra lista con los secretos y configuraciones del proyecto (claves, tokens, contraseñas). incluyelas en la lista aunque sean elementos locales que no esten en el repositorio.

Por último genera una tercera lista de elementos que usarías como agente ante una peticion de un cambio en el backend (incluyendo ficheros de instrucciones, configuración del proyecto, herramientas, configuración del entorno, base de datos, etc.) Para cada elemento indica si el contenido sale de la máquina local o si se envía a servidores externos.

No modidiques ningun archivo. Solo genera las 3 listas.
```

**Qué salió:** 

Lista 1: Identifica tablas y campos. Tests, readme, historial github. 
Lista 2: Lista items de .env, .yml, localstorage, varios .json... 
Lista 3: Advierte que todo lo ejectutado entra en contexto y sale del equipo. Ademas lista elementos


## Prompt 2

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
escribe las listas en /home/emiralles/LIDR/modulo9/entornoPrompts/listagenerada_Claude.md
```

**Qué salió:** 


## Prompt 3

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Crea un hook (en .claude/hooks/datos-que-no-salen.sh), registrado en .claude/settings.json como PreToolUse con el matcher Bash. Mantén el hook existente. El nuevo hook debe leer el JSON de la entrada estándar mediante jq. El comando está en .tool_input.command (como en el hook de Prettier). Debe utilizar set -uo pipefail.

- Actuará solo si el comando contiene git commit.

- Revisará las líneas añadidas del diff preparado (git diff --cached). Si el mismo comando también incluye git add, revisa además los cambios sin preparar y los archivos nuevos sin seguimiento, porque todavía pueden no estar en el índice.

- Aplica estas tres reglas únicamente:

Una clave con forma reconocible: AKIA seguido de 16 caracteres (Amazon Web Services, AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa- (Slack), un bloque ----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.

Una dirección de correo cuyo dominio no sea example.com, example.org, example.net ni github.com. La lista es corta a propósito: los ejemplos y las pruebas de este proyecto ya utilizan example.com, reservado para ejemplos.

Un archivo llamado exactamente .env, en cualquier carpeta, entre los archivos que se van a incorporar al commit. Los .env.example no cuentan.


Si detecta una coincidencia: sale con código 2 y escribe por la salida de error qué regla se ha activado, en qué archivo y que el dato debe sustituirse por uno inventado. Además, añade na línea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (tiempo universal coordinado), en formato ISO 8601, la palabra BLOQUEADO, la regla y el archivo. Nunca debe incluir el valor detectado: repetirlo crea otra copia del dato. Si el registro no existe, lo crea con una cabecera de una línea.

Si no detecta ninguna coincidencia: sale con 0 y no escribe nada.

```

**Qué salió:** Lo genera y añade algun cambio (sk-ant- solo salta si le siguen al menos 8 caracteres. Si no, bloquearía docs/ci-revisor.md...)



## Prompt 4

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Añade un bloque breve en la sección de reglas de proceso del CLAUDE.md del repositorio. Debe explicar que el hook existe, qué tres cosas bloquea y cómo actuar ante un
  bloqueo: no desactivarlo ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo. También debe indicar que el registro se incluye en
  el commit con el resto del trabajo, porque es la evidencia del bloqueo. AGENTS.md no se modifica: el agente debe comprobar antes qué es.
```

**Qué salió:** Genera bloque y hace commit.


## Prompt 5

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
crea un archivo temporal con un correo de gmail.com, ejecutar git add e intentar hacer un commit.
```

**Qué salió:** funciona, bloquea cambio. Genera fichero de traza (sin enlazar al repo)


## Prompt 6

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
 ¿el hook ha salido con código 2? veo un permission denied. no se si corresponde a este codigo 2 o fallo al ejecutar.
```

**Qué salió:** Sí, el hook salió con código 2: fue un bloqueo deliberado, no un fallo al ejecutarse.


## Prompt 7

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Añade a docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, un ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@gmail.com, contraseña secreto123.
despuez haz un commit.

```

**Qué salió:** El hook ha bloquado el cambio, y ha decidido cambiarlo por ana.perez@example.com

