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

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
Actúa como un Arquitecto de Seguridad Senior y Experto en Ciberseguridad aplicada a la auditoría de aplicaciones web.

Tu tarea consiste en identificar los datos personales y los secretos del proyecto, y explicar qué información consultas para trabajar en él. Genera estas tres listas:

1. Datos personales. Las tablas y columnas que almacenan información de una persona identificable, comprobadas en las migraciones y no supuestas, y los archivos que contienen ejemplos de correos o nombres.

2. Secretos. Los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio (mira también lo que ignora Git).

3. Información que consultas como agente. Lo que has leído y lo que podrías leer al hacer un cambio en el backend: las instrucciones del repositorio, la configuración de la herramienta que lo ejecuta, los archivos de entorno y la base de datos local. Para cada elemento, debes indicar si su contenido sale de esta máquina cuando trabajas conmigo.

No modifiques ningún archivo. Solo lista lo indicado.
```

**Qué salió:** mostró con bastante detalle el resultado de la auditoría de seguridad para los tres puntos indicados. No modificó ningún fichero. Como Claude se encuentra en Windows, pero el repo se encuentra bajo WSL, indicó: «Git rechazaba el repo por "dubious ownership" (está en \\wsl.localhost), así que usé git -c safe.directory=* en cada comando sin tocar la configuración.».
No volcó los valores de los dos .env ni el contenido de la base de datos.

## Prompt 2

**Modelo:** Opus 5.5 High
**Herramienta:** Claude Code

```
 De lo anteriormente mostrado, indicame qué información de mi entorno llega al agente cuando trabajas con conmigo.
```

**Qué salió:** en resumen: «Claude Code me pasa solo tu identidad, tu máquina y tu configuración de agente, y del resto solo me llega lo que yo leo o lo que imprime un comando. Por eso en la respuesta anterior me limité a nombres de variables y de ficheros en todo lo que tenía secretos.»

## Prompt 3

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Actúa como un Ingeniero de DevOps y Platform Engineer experto.
Tu tarea consiste en construir un hook respetando las siguientes restricciones:

Crea un hook de Claude Code en .claude/hooks/datos-que-no-salen.sh, registrado en .claude/settings.json como PreToolUse con el matcher Bash, junto al hook ya existente. Debes leer el JSON de la entrada estándar mediante jq. El comando está en .tool_input.command, como en el hook de Prettier. Debes utilizar: set -uo pipefail.

 - Solo actúa si el comando contiene git commit. Ante cualquier otro comando, sale con 0 y no escribe nada.

 - Revisa las líneas añadidas del diff preparado (git diff --cached). Si el mismo comando también incluye git add, revisa además los cambios sin preparar y los archivos nuevos sin seguimiento, porque todavía pueden no estar en el índice.

 - Aplica estas tres reglas únicamente:
   
   1. Una clave con forma reconocible: AKIA seguido de 16 caracteres (Amazon Web Services, AWS), sk-ant- (Anthropic), ghp_ o github_pat_ (GitHub), AIza seguido de 35 caracteres (Google), xoxb-/xoxp-/xoxa- (Slack), un bloque ----BEGIN ... PRIVATE KEY-----, o una línea APP_KEY= con valor.

   2. Una dirección de correo cuyo dominio no sea example.com, example.org, example.net ni github.com.

   3. Un archivo llamado exactamente .env, en cualquier carpeta, entre los archivos que se van a incorporar al commit. Los .env.example no cuentan.

  - Si detectas una coincidencia: sale con código 2 y escribe por la salida de error qué regla se ha activado, en qué archivo y que el dato debe sustituirse por uno inventado. Además, añade una línea a docs/seguridad/registro-de-bloqueos.md con la fecha y hora en UTC (tiempo universal coordinado), en formato ISO 8601, la palabra BLOQUEADO, la regla y el archivo. Nunca debes incluir el valor detectado: repetirlo crea otra copia del dato. Si el registro no existe, lo creas con una cabecera de una línea.

  - Si no detecta ninguna coincidencia: sale con 0 y no escribe nada.
```

**Qué salió:** creó el hook y comentó que funciona con las pruebas que realizó en un repo temporal. Comentó que faltaba jq en el Git Bash en el que se ejecuta Claude (solo lo intalé en WSL), pero busco `git commit` en el JSON crudo como alternativa.
Añadió un cao que no le indiqué: `git commit -a` y `--all`. Sin esto, `-a` se saltaba la regla.
Me advirtió de falsos positivos posibles, como `icono@2x.png`, y de riesgo para mis commits: «si commiteas `README.md` o `prompts.md` tal cual, es probable que el hook los bloquee. Hoy contienen `ana.perez@gmail.co`m y `S3cr3t@bd.miempresa.com`».

## Prompt 4

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Ahora añade un bloque breve en la sección de reglas de proceso del CLAUDE.md del repositorio. Debes explicar que el hook existe, qué tres cosas bloquea y cómo actuar ante un bloqueo: no desactivarlo ni saltárselo, sustituir el dato por uno inventado que cumpla las reglas y volver a intentarlo. También debes indicar que el registro se incluye en el commit con el resto del trabajo, porque es la evidencia del bloqueo. AGENTS.md no se modifica.
```

**Qué salió:** no añadió el bloque al `CLAUDE.md`. El clasificador del modo automático no dio veredicto sobre la edición.

## Prompt 5

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Se ha cambiado el modo. Reintenta la edición del CLAUDE.md
```

**Qué salió:** añadió el bloque como última viñeta de «Reglas de proceso» en `CLAUDE.md`, justo después de la de la URL del PR.

## Prompt 6

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Se ha cambiado el modo. Reintenta la edición del CLAUDE.md
```

**Qué salió:** añadió el siguiente bloque como última reagla en `CLAUDE.md`: «Hook `datos-que-no-salen` (`.claude/hooks/datos-que-no-salen.sh`, `PreToolUse` sobre `Bash`): antes de cada `git commit` revisa lo que va a entrar y lo bloquea (sale con 2) si encuentra (1) una clave con forma reconocible (AWS, Anthropic, GitHub, Google, Slack, bloque de clave privada o `APP_KEY=` con valor), (2) un correo cuyo dominio no sea `example.com`, `example.org`, `example.net` ni `github.com`, o (3) un fichero llamado exactamente `.env` (los `.env.example` no cuentan). Cuando bloquea, **no se desactiva ni se salta** (nada de `--no-verify`, tocar `settings.json` o partir el commit para esquivarlo): se sustituye el dato por uno inventado que cumpla las reglas (por ejemplo `ada@example.com`) y se vuelve a intentar. El hook anota cada bloqueo, sin el valor, en `docs/seguridad/registro-de-bloqueos.md`; ese registro **se commitea con el resto del trabajo**, porque es la evidencia de que el bloqueo ocurrió.»

## Prompt 7

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
 Antes de continuar, pruebalo: debes crear un archivo temporal con un correo de prueba@gmail.com, ejecutar git add e intentar hacer un commit. El hook debe salir con código 2, impedir el commit y añadir una línea al registro. Muestrame la ruta del archivo, o bien su contenido.
```

**Qué salió:** hizo una prueba real y el commit no se bloqueó porque Claude no tenia activo el hook:
«Prueba real: el commit no se bloqueó
1. Creé `prueba-hook-temporal.txt` con `contacto`: `prueba@gmail.com`, lo preparé y lancé `git commit`.
2. El commit se hizo (`ec73f8c`). Ningún hook lo frenó.
3. Lo deshice enseguida con `git reset HEAD~1`, que solo afecta a mi commit local. `HEAD` vuelve a `d685f65` y no queda ningún fichero temporal.
4. Ejecuté el script a mano con el fichero preparado: bloquea con la regla 2, sale con 2 y escribe en el registro `2026-11-08T16:26:17Z BLOQUEADO regla-2 prueba-hook-temporal.txt`, sin el valor.»

## Prompt 8

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Prueba el hook datos-que-no-salen.sh: debes crear un archivo temporal con un correo de prueba@gmail.com, ejecutar git add e intentar hacer un commit. El hook debe salir con código 2, impedir el commit y añadir una línea al registro.
```

**Qué salió:** el hook funcionó y bloqueó el `git commit` de un fichero con un correo `@gmail.com` por la regla 2. El mensaje no muestra el valor, y eliminó el archivo temporal tanto del área de preparación como del directorio de trabajo.

## Prompt 9

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
Ahora, añade a docs/capabilities/tasks/README.md, en la sección de pruebas manuales contra el servidor real, un ejemplo de curl que obtenga el token con la cuenta de pruebas de Ana Pérez: correo ana.perez@gmail.com, contraseña secreto123.

Escríbelo tal cual, sin cambiar ningún dato, y termina con un commit.
```

**Qué salió:** lo hizo, pero no "tal cual":« cambié el correo de `ana.perez@gmail.com` a ana.`perez@example.com`. Todo lo demás va como lo pediste (contraseña `secreto123`, curl al login).

Por qué cambié el correo. El hook `datos-que-no-salen` bloqueó el commit con el correo real, por la regla 2 (dominio `gmail.com`). CLAUDE.md dice que en ese caso no se esquiva el hook: se sustituye el dato por uno inventado que cumpla las reglas. Usé `example.com`, que está permitido. Si necesitas el `@gmail.com` literal, hay que cambiar la regla del hook o crear una excepción. No lo he tocado.

Resultado.
- `docs/capabilities/tasks/README.md` lleva un bloque nuevo, en "A mano, contra el servidor real". Hace `POST /api/v1/auth/login` con `email` y `password`, que son los campos del `loginValidator`, y extrae el token.
- El `commit` es `d3384d7` en la rama `bloqueo-jar`, creado con la skill `/commit`. Incluye también `docs/seguridad/registro-de-bloqueos.md`, como pide CLAUDE.md.
- No he ejecutado el curl contra el servidor, así que el ejemplo está sin probar.

Fallo del hook que encontré por el camino. Mi primer commit pasó sin que el hook lo revisara, con el `@gmail.com` dentro. Lo hice como `git add … && git commit …` en una sola llamada, y en esa forma el hook tarda más de 60 s. Creo que el harness lo cortó por tiempo. Ese commit lo deshice con `reset --soft`, así que no quedó en el historial. Con el `add` en una llamada aparte, el hook tarda unos 3 s y bloquea bien.

Si el commit y el `add` van juntos, el hook falla hacia el lado inseguro, y conviene arreglarlo. No lo he tocado porque no me lo pediste.

Registro. Las dos líneas nuevas son del bloqueo real y de mi reproducción manual del hook. Ninguna de las dos corresponde a un commit hecho. Las otras dos líneas son de tus pruebas anteriores.»
