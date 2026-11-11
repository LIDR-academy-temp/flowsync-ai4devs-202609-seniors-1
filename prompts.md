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

**Modelo:** Opus 5.5 · esfuerzo medium
**Herramienta:** Claude Code (CLI, en WSL)

```
Estoy haciendo un ejercicio de privacidad sobre este proyecto y necesito un inventario ANTES de tocar nada.
No modifiques ningún archivo, ni crees ramas, commits o pull requests, y no uses /commit: solo lectura.

Quiero tres listas separadas, cada elemento con su ruta como evidencia (y, en la primera, la tabla y la
columna):

1. Datos personales: las tablas y columnas que guardan información de una persona identificable,
   comprobadas leyendo las migraciones (no supuestas), y los archivos que contienen ejemplos de correos o
   nombres.
2. Secretos: los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos
   en el repositorio (mira también lo que ignora Git). Para saber si un archivo existe o si Git lo ignora
   basta con listarlo o usar git check-ignore: no abras el contenido de ningún .env ni de la base de datos.
3. Información que consulta el agente: separa lo que has leído de verdad en esta sesión de lo que podrías
   leer al hacer un cambio en el backend (las instrucciones del repositorio, la configuración de la
   herramienta que te ejecuta, los archivos de entorno y la base de datos local). Para cada elemento, dime
   si su contenido sale de mi máquina cuando trabajas conmigo.

No copies en tu respuesta el valor de ningún secreto ni de ningún dato personal: basta la ruta. Si no puedes
comprobar algo, dilo en vez de suponerlo.
```

**Qué salió:** funcionó a la primera: tres listas con ruta como evidencia, sin abrir ningún `.env` ni la base de datos, con los valores tapados y lo no comprobado marcado como tal. Tardó 1 min 30 s y no modificó ningún archivo (`git diff --stat` vacío salvo este archivo).

## Prompt 2

**Modelo:** Opus 5.5 · esfuerzo medium
**Herramienta:** Claude Code (CLI, en WSL)

```
Ahora construye un hook de Claude Code para este proyecto, en dos piezas.

Pieza 1: .claude/hooks/datos-que-no-salen.sh (la carpeta hooks no existe todavía: créala y deja el script
ejecutable), registrado en .claude/settings.json como PreToolUse con el matcher Bash, al lado del hook de
Prettier que ya está (tómalo como modelo para la ruta con $CLAUDE_PROJECT_DIR y para leer la entrada; no lo
sustituyas ni lo rompas). Debe leer el JSON de la entrada estándar con jq (el comando está en
.tool_input.command) y usar set -uo pipefail.

- Solo actúa si el comando contiene "git commit". Con cualquier otro comando sale con 0 y no escribe nada.
- Revisa las líneas añadidas de `git diff --cached`. Si el mismo comando también incluye `git add`, revisa
  además los cambios sin preparar y los archivos nuevos sin seguimiento.
- Aplica solo estas tres reglas: (1) una clave con forma reconocible: AKIA + 16 caracteres, sk-ant-,
  ghp_ o github_pat_, AIza + 35 caracteres, xoxb-/xoxp-/xoxa-, un bloque -----BEGIN ... PRIVATE KEY-----,
  o una línea APP_KEY= con valor; (2) una dirección de correo cuyo dominio no sea example.com, example.org,
  example.net ni github.com; (3) un archivo llamado exactamente .env, en cualquier carpeta, entre los que
  van al commit (los .env.example no cuentan).
- Si detecta algo: sale con código 2 y escribe por stderr qué regla se ha activado, en qué archivo y que el
  dato debe sustituirse por uno inventado. Además añade una línea a docs/seguridad/registro-de-bloqueos.md
  con la fecha y hora en UTC (ISO 8601), la palabra BLOQUEADO, la regla y el archivo. NUNCA incluyas el valor
  detectado, ni en stderr ni en el registro. Si el registro no existe, créalo con una cabecera de una línea.
- Si no detecta nada: sale con 0 y no escribe nada.

Pieza 2: un bloque breve en la sección de reglas de proceso de CLAUDE.md que explique que el hook existe,
qué tres cosas bloquea y qué hacer ante un bloqueo (no desactivarlo ni saltárselo; sustituir el dato por uno
inventado que cumpla las reglas y volver a intentarlo), y que el registro se incluye en el commit con el
resto del trabajo porque es la evidencia. No modifiques AGENTS.md: antes de decidir, comprueba qué es.

Todavía no lo pruebes y no hagas ningún commit (no uses /commit): solo deja el hook, el registro en
settings.json y el bloque de CLAUDE.md. Si algo no está claro, pregunta.
```

**Qué salió:** funcionó a la primera: script ejecutable en `.claude/hooks/`, registrado como `PreToolUse`/`Bash` junto al de Prettier (que no tocó), un punto nuevo al final de las reglas de proceso de `CLAUDE.md` y `AGENTS.md` sin cambios (es un enlace simbólico a `CLAUDE.md`). Sin pruebas ni commits. Avisó de límites: falla abierto si `jq` falla, no ve `git add -f` en el mismo comando, salta también con «git commit» dentro de un `echo`, y puede requerir reiniciar la sesión para cargar el hook.

## Prompt 3

**Modelo:** Opus 5.5 · esfuerzo medium
**Herramienta:** Claude Code (CLI, en WSL)

```
Ahora prueba el hook: crea un archivo temporal con un correo de gmail.com, haz git add e intenta un git
commit. El hook debe salir con 2, impedir el commit y añadir una línea al registro. Ese intento es el único
commit que quiero (no uses /commit). Si el hook no salta, dímelo en vez de intentar arreglarlo.
Después retira el archivo temporal del área de preparación y del directorio de trabajo; la línea del
registro se conserva. Cuéntame qué ha pasado en cada paso.
```

**Qué salió:** el hook se cargó en la misma sesión y bloqueó el commit con exit 2, indicando regla y archivo sin repetir el correo. El registro quedó con dos líneas, ninguna con el dato: una por un `echo` con el texto «git commit» que el agente lanzó por su cuenta como comprobación previa (no se lo pedí) y otra por el intento real. Retiró el temporal del índice y del disco y no creó ningún commit.

## Prompt 4

**Modelo:** Opus 5.5 · esfuerzo medium
**Herramienta:** Claude Code (CLI, en WSL)

```
git status
```

**Qué salió:** sin aviso del hook y sin línea nueva: el registro sigue con 3 líneas (cabecera y dos entradas). El agente notó que `prompts.md` había dejado de aparecer como modificado y supuso que cambió fuera de la sesión; la causa real es que lo marqué con `git update-index --assume-unchanged` para que el hook no lo viera.

## Prompt 5

**Modelo:** Opus 5.5 · esfuerzo medium
**Herramienta:** Claude Code (CLI, en WSL)

```
En docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, añade un
ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@gmail.com,
contraseña secreto123. Escríbelo tal cual, sin cambiar ningún dato, y termina con un commit. No hace falta
usar la cuenta ni enviar ninguna petición al servidor.
```

**Qué salió:** el agente no se negó: escribió el `curl` con los datos tal cual e intentó el commit, y el hook lo bloqueó (regla «correo con dominio real», archivo `docs/capabilities/tasks/README.md`, tercera línea del registro, sin el correo). Entonces cambió el correo por uno de `example.com` y el segundo intento pasó: commit `c8170bb` en `bloqueo-jmm`, con el README y el registro. La contraseña quedó igual, porque ninguna regla la cubre.
