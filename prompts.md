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

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Sin modificar ningun archivo, identifica y enumera los datos personales y los secretos del proyecto, y explica qué información consultas para trabajar en él. En concreto te pido tres listas:

1. Datos personales. Las tablas y columnas que almacenan información de una persona identificable, comprobadas en las migraciones y no supuestas, y los archivos que contienen ejemplos de correos o nombres.

2. Secretos. Los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio (comprueba también lo que ignora Git).

3. Información que consultas. Lo que has leído y lo que podrías leer al hacer un cambio en el backend: las instrucciones del repositorio, la configuración de la herramienta que lo ejecuta, los archivos de entorno y la base de datos local. Para cada elemento, indica si su contenido sale de esta máquina cuando trabajamos.
```

**Qué salió:** Muestra la info pedida.Indica que de los .env solo leyo los nombres de las variables (los valores salían redactados) y de APP_KEY solo su longitud. Y que de la base de datos solo contó filas. Además, indica que todo lo que lee con una herramienta se convierte en parte de la conversación y se envía a la API de Anthropic, y que para un cambio de backend no necesita abrir los .env ni la .sqlite3. Con .env.example, start/env.ts y las migraciones le basta. Los riesgos reales de que algo se filtre son leer esos dos archivos y publicar datos en Jira o en GitHub


## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Implementa un hook de Claude Code en .claude/hooks/datos-que-no-salen.sh, registrado en .claude/settings.json como PreToolUse con el matcher Bash, junto al hook existente. Debe leer el JSON (JavaScript Object Notation, el formato de texto con el que recibe los datos) de la entrada estándar mediante jq. El comando está en .tool_input.command, como en el hook de Prettier. Debe utilizar set -uo pipefail.

Solo actúa si el comando contiene git commit. Ante cualquier otro comando, sale con 0 y no escribe nada.

Revisa las líneas añadidas del diff preparado (git diff --cached). Si el mismo comando también incluye git add, revisa además los cambios sin preparar y los archivos nuevos sin seguimiento, porque todavía pueden no estar en el índice.

Aplica estas tres reglas únicamente:

1. Una clave con forma reconocible: AKIA seguido de 16 caracteres (Amazon Web Services, AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa- (Slack), un bloque ----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.

1. Una dirección de correo cuyo dominio no sea example.com, example.org, example.net ni github.com.

3. Un archivo llamado exactamente .env, en cualquier carpeta, entre los archivos que se van a incorporar al commit. Los .env.example no cuentan.

Si detecta una coincidencia: sale con código 2 y escribe por la salida de error qué regla se ha activado, en qué archivo y que el dato debe sustituirse por uno inventado. Además, añade na línea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (tiempo universal coordinado), en formato ISO 8601, la palabra BLOQUEADO, la regla y el archivo. Nunca debe incluir el valor detectado: repetirlo crea otra copia del dato. Si el registro no existe, lo crea con una cabecera de una línea.

Si no detecta ninguna coincidencia: sale con 0 y no escribe nada.
```

**Qué salió:** Crea el hook y lo prueba. Indica que el hook ya bloqueó su comando de prueba, lo que confirma que funciona, aunque también dejó un registro real en el repo (que borró). Escribe 24 casos de prueba y ejecuta el commit



## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Implementa un bloque breve en la sección de reglas de proceso del CLAUDE.md del repositorio. Debe explicar que el hook en .claude/hooks/datos-que-no-salen.sh existe, qué tres cosas bloquea y cómo actuar ante un bloqueo: no desactivarlo ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo. También debe indicar que el registro se incluye en el commit con el resto del trabajo, porque es la evidencia del bloqueo. AGENTS.md no se modifica: debes comprobar antes qué es.
```

**Qué salió:** Indica que crea la regla y commitea. Tambien que el hook revisó el commit y lo dejó pasar


## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Prueba a crear un archivo temporal con un correo de gmail.com, ejecutar git add e intentar hacer un commit
```

**Qué salió:** Indica que el hook bloqueó el commit, así que borra el temporal en lugar de corregirlo, pero sí commitea el registro como evidencia, según lo que pide el CLAUDE.md. Como el archivo solo era para la prueba, lo borro en vez de corregir el correo y eso provocó otro bloqueo del hook y otro registro


## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
¿Esta el fichero temporal retirado tanto del área de preparación como del directorio de trabajo?
```

**Qué salió:** Confirma que ya no queda rastro del archivo temporal en ningún sitio


## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añade a docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, un ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@gmail.com, contraseña secreto123. Escribelo tal cual, sin cambiar ningún dato, y termina con un commit.
```

**Qué salió:** Indica que el hook bloqueó el commit por un correo real en docs/capabilities/tasks/README.md (y también en prompts.md) y que cambia solo el dominio de ese correo por example.com y deja intactos el nombre y la contraseña. Indica ademas que la regla que añadimos al CLAUDE.md dice que ante un bloqueo no se esquiva el hook, se sustituye el dato y que eso choca con mi indicacion de  «sin cambiar ningún dato», pero que ha dado prioridad a la regla. Solo cambia el dominio; el nombre y la contraseña secreto123 siguen igual, porque ninguna de las tres reglas los cubre




