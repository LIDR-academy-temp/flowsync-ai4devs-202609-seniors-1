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
Identificá los datos personales y secretos del proyecto. Explicá que información consulta para trabajar. No modifiques ningún archivo. Guardá cada prompt en el archivo prompts.md de la raiz del proyecto.
Ordenar los datos en 3 listas:
  1. Datos Personales: tablas y columnas que almacenan información de una persona IDENFTIFICABLE, comprobada en las migraciones y no supuestas. Listá también los archivos que contienen ejemplos de correos o nombres
  2. Secretos: Los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio. Chequeá también los que figuren en en .gitignore
  3.Información que consulta el agente: Lo que ha leído y lo que podría leer al hacer un cambio en el backend: las instrucciones del repositorio, la configuración de la herramienta que lo ejecuta, los archivos de entorno y la base de datos local. Para cada elemento, indicar si su contenido sale de la máquina
```

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
guardá esta salida en el archivo docs/analysis/sensitive-data.md
```

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Crea un hook de Claude Code en .claude/hooks/datos-que-no-salen.sh, registrado en .claude/settings.json como PreToolUse con el matcher Bash, junto al hook existente. Debe leer el JSON de la entrada estándar mediante jq. El comando está en .tool_input.command, como en el hook de Prettier. Debe utilizar set -uo pipefail.
- Solo actúa si el comando contiene git commit. Ante cualquier otro comando, sale con 0 y no escribe nada.
- Revisa las líneas añadidas del diff preparado (git diff --cached). Si el mismo comando también incluye git add, revisa además los cambios sin preparar y los archivos nuevos sin seguimiento
- Aplica estas tres reglas únicamente:
1. Una clave con forma reconocible: AKIA seguido de 16 caracteres (Amazon Web Services, AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa- (Slack), un bloque ----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.
2. Una dirección de correo cuyo dominio no sea example.com, example.org, example.net ni github.com. 
3. Un archivo llamado exactamente .env, en cualquier carpeta, entre los archivos que se van a incorporar al commit. Los .env.example no cuentan.
- Si detecta una coincidencia: sale con código 2 y escribe por la salida de error qué regla se ha activado, en qué archivo y que el dato debe sustituirse por uno inventado. Además, añade la línea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (tiempo universal coordinado), en formato ISO 8601, la palabra BLOQUEADO, la regla y el archivo. Nunca debe incluir el valor detectado. Si el registro no existe, lo crea con una cabecera de una línea.
- Si no detecta ninguna coincidencia: sale con 0 y no escribe nada.
```

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
corregí sensitive-data.md pero no commitees aún nada. Solo corregilo para que no falle (es un documento local con el resultado de un análisis)
```

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Agregar un bloque breve en la sección de reglas de proceso del CLAUDE.md del repositorio. Debe explicar que el hook existe, cuando debe dispararse, qué tres cosas bloquea y cómo actuar ante un bloqueo.
```

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Vamos a probar la regla: crear un archivo temporal con un correo de gmail.com (el mio, martin.mariano.gil), ejecutar git add e intentar hacer un commit. Validar que el hook salga con código 2, impedida el commit y añada una línea al registro
```

**Qué salió:** bloqueó el commit (regla 2) y dejó la línea en el registro; destapó además que la versión preparada de `sensitive-data.md` aún tenía el correo corregido solo en la copia de trabajo.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Dejá solo las líneas de esta prueba en el registro
```

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añadir a docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, un ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@gmail.com, contraseña secreto123. Escribilo tal cual, sin cambiar ningún dato, y realizá el commit.
```

**Qué salió:** escribió el ejemplo tal cual; el hook bloqueó el commit (regla 2) y el agente paró a preguntar en vez de sustituir el dato o saltarse el hook.
