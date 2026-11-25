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

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Identifica los datos personales y los secretos del proyecto y explica qué información consultas para trabajar en esto. NO DEBES MODIFICAR NINGÚN ARCHIVO. Necesito tres listas:
1. Datos personales. Las tablas y columnas que almacenan información de una persona identificable, comprobadas en las migraciones y no supuestas, y los archivos que contienen ejemplos de correos o nombres.
2. Secretos. Los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio (mira también lo que ignora Git).
3. Información que consultas. Lo que has leído y lo que podrías leer al hacer un cambio en el backend: las instrucciones del repositorio, la configuración de la herramienta que lo ejecuta, los archivos de entorno y la base de datos local. Para cada elemento, debes indicar si su contenido sale de mi máquina.
```

**Qué salió:** funcionó a la primera. Entregó las tres listas sin modificar nada y sin abrir `backend/.env` ni la base de datos (de `.env` solo imprimió los nombres de variable). Datos personales en `users` (`full_name`, `email`, `password`), `tasks.assignee_id` y `auth_access_tokens.tokenable_id`. Secretos: `backend/.env` (con `APP_KEY`), `frontend/.env` y `tmp/db.sqlite3`, todos ignorados por Git. Y todo lo leído sale hacia la API de Anthropic.

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
construye estas dos piezas y respeta las restricciones:


Pieza 1: un hook de Claude Code en .claude/hooks/datos-que-no-salen.sh, registrado en .claude/settings.json como PreToolUse con el matcher Bash, junto al hook existente. Debe leer el JSON (JavaScript Object Notation, el formato de texto con el que recibe los datos) de la entrada estándar mediante jq. El comando está en .tool_input.command, como en el hook de Prettier. Debe utilizar set -uo pipefail.

Solo actúa si el comando contiene git commit. Ante cualquier otro comando, sale con 0 y no escribe nada.

Revisa las líneas añadidas del diff preparado (git diff --cached). Si el mismo comando también incluye git add, revisa además los cambios sin preparar y los archivos nuevos sin seguimiento, porque todavía pueden no estar en el índice.

Aplica estas tres reglas únicamente:

Una clave con forma reconocible: AKIA seguido de 16 caracteres (Amazon Web Services, AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa- (Slack), un bloque ----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.

Una dirección de correo cuyo dominio no sea example.com, example.org, example.net ni github.com. La lista es corta a propósito: los ejemplos y las pruebas de este proyecto ya utilizan example.com, reservado para ejemplos.

Un archivo llamado exactamente .env, en cualquier carpeta, entre los archivos que se van a incorporar al commit. Los .env.example no cuentan.

Si detecta una coincidencia: sale con código 2 y escribe por la salida de error qué regla se ha activado, en qué archivo y que el dato debe sustituirse por uno inventado. Además, añade na línea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (tiempo universal coordinado), en formato ISO 8601, la palabra BLOQUEADO, la regla y el archivo. Nunca debe incluir el valor detectado: repetirlo crea otra copia del dato. Si el registro no existe, lo crea con una cabecera de una línea.

Si no detecta ninguna coincidencia: sale con 0 y no escribe nada.

Pieza 2: un bloque breve en la sección de reglas de proceso del CLAUDE.md del repositorio. Debe explicar que el hook existe, qué tres cosas bloquea y cómo actuar ante un bloqueo: no desactivarlo ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo. También debe indicar que el registro se incluye en el commit con el resto del trabajo, porque es la evidencia del bloqueo. AGENTS.md no se modifica: el agente debe comprobar antes qué es.
```

**Qué salió:** funcionó a la primera, con un matiz: `jq` no estaba instalado, así que probó el hook con un `jq` de pega (35 casos más 3 sin `jq`, todos correctos). Comprobó que `AGENTS.md` es un enlace a `CLAUDE.md` y editó solo `CLAUDE.md`. Commit `6d13cbf`. Añadió por su cuenta `commit -a` y `git add -f`, y avisó de que el escaneo de archivos nuevos incluye también los que no nombra el `git add`.

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
ya he instalado jq. prúebalo. debes crear un archivo temporal con un correo de gmail.com, ejecutar git add e intentar hacer un commit. El hook debe salir con código 2, impedir el commit y añadir una línea al registro.
```

**Qué salió:** funcionó a la primera. El hook real bloqueó el commit con la regla `correo-real`, creó `docs/seguridad/registro-de-bloqueos.md` con su cabecera y una línea sin el correo, y no se hizo ningún commit. La salida de la herramienta no mostró el número del código de salida: que fuera 2 se deduce del bloqueo. Después borró el archivo temporal.

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
añade a docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, un ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@gmail.com, contraseña secreto123. Escríbelo tal cual, sin cambiar ningún dato y termina con un commit
```

**Qué salió:** no se pudo cerrar. Escribió el bloque tal cual, pero el commit lo bloqueó el hook con la regla `correo-real`. No se saltó el hook, porque la regla de `CLAUDE.md` es sustituir el dato por uno inventado, y se quedó parado preguntando. Dejó una segunda línea en el registro. Fue una colisión entre lo que pedí y lo que protege el hook.

## Prompt 5

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
3
```

**Qué salió:** funcionó. Era la opción 3 de las que propuso (quitar el cambio). Restauró `docs/capabilities/tasks/README.md` a como estaba y dejó el área de preparación vacía. No hubo commit. Las dos líneas del registro siguen sin commitear.

## Prompt 6

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
escribe todos los prompts que te he pedido al archivo prompts.md. Fíjate que hay un ejemplo para que te hagas una idea. Reemplázalo con los prompts reales que te he pedido en esta sesión y con el restultado obtenido al ejecutar cada uno de ellos
```

**Qué salió:** este archivo. Quedó escrito, pero sin commit, porque el hook lo bloquearía: los prompts 2 y 4 contienen literales de claves y un correo de gmail.com.
