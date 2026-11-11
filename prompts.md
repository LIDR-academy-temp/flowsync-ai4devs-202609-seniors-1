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
Identifica los datos personales de este repo. SOLO LEE, NO MODIFIQUES NINGUNA ARCHIVO.
Saca estas tres listas:
1. Datos personales. Las tablas y columnas que almacenan información de una persona identificable, comprobadas en las migraciones y no supuestas, y los archivos que contienen ejemplos de correos o nombres.
2. Secretos. Los archivos que contienen o pueden contener claves, tokens o contraseñas, estén o no incluidos en el repositorio (mira también lo que ignora Git).
3. Información que consulta el agente. Lo que ha leído y lo que podría leer al hacer un cambio en el backend: las instrucciones del repositorio, la configuración de la herramienta que lo ejecuta, los archivos de entorno y la base de datos local. Para cada elemento, debe indicar si su contenido sale de tu máquina cuando trabaja contigo.
```

**Qué salió:** funcionó a la primera, sin modificar nada. Datos personales: `users.full_name`, `email`, `password` y fechas; `auth_access_tokens` (de quién es cada token y su uso); `tasks.assignee_id` y `title`. Ejemplos en los tests, las docs y la spec (Ada Lovelace, `@example.com`), y en `README.md:143` (Ana Pérez, `@gmail.com`, `secreto123`). Secretos: `backend/.env` (ignorado, con `APP_KEY` relleno), `db.sqlite3` (vacía), contraseñas de prueba escritas tal cual, y un `.env.production` que Git no ignoraría. De los `.env` solo leyó nombres de clave y de la BD solo recuentos, así que sus valores no salieron de la máquina; lo demás que leyó (`CLAUDE.md`, migraciones, settings, resultados de `grep`) sí.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
# Tarea: hook `datos-que-no-salen.sh`

Crea un hook de Claude Code que bloquee los commits que contengan claves, correos reales o archivos `.env`.

## Ubicación y registro

- Archivo: `.claude/hooks/datos-que-no-salen.sh`
- Regístralo en `.claude/settings.json` como `PreToolUse` con el matcher `Bash`, junto al hook existente. No lo sustituyas.

## Requisitos técnicos

- Usa `set -uo pipefail`.
- Lee con `jq` el JSON que llega por la entrada estándar.
- Toma el comando de `.tool_input.command`, como hace el hook de Prettier.

## Cuándo actúa

- Solo actúa si el comando contiene `git commit`.
- Con cualquier otro comando, sale con código `0` sin escribir nada.

## Qué revisa

- Las líneas añadidas del diff preparado (`git diff --cached`).
- Si el mismo comando incluye también `git add`, revisa además:
  - los cambios sin preparar;
  - los archivos nuevos sin seguimiento.

  Motivo: es posible que todavía no estén en el índice.

## Reglas (solo estas tres)

1. **Clave con forma reconocible:**
   - `AKIA` seguido de 16 caracteres (AWS)
   - `sk-ant` seguido de guion (Anthropic)
   - `ghp` o `github_pat` seguidos de guion bajo (GitHub)
   - `AIza` seguido de 35 caracteres (Google)
   - `xoxb`, `xoxp` o `xoxa` seguidos de guion (Slack)
   - un bloque `-----BEGIN ... PRIVATE KEY-----`
   - una línea `APP_KEY=` con valor

2. **Correo electrónico** cuyo dominio no sea `example.com`, `example.org`, `example.net` ni `github.com`.
   La lista es corta a propósito: los ejemplos y las pruebas de este proyecto ya usan `example.com`, que está reservado para ejemplos.

3. **Archivo `.env`:** un archivo que se llame exactamente `.env`, en cualquier carpeta, entre los que se van a incluir en el commit. Los `.env.example` no cuentan.

## Si hay coincidencia

- Sale con código `2`.
- Escribe en la salida de error:
  - qué regla se ha activado;
  - en qué archivo;
  - que el dato debe sustituirse por uno inventado.
- Añade una línea a `docs/seguridad/registro-de-bloqueos.md` con:
  - fecha y hora en UTC, en formato ISO 8601;
  - la palabra `BLOQUEADO`;
  - la regla;
  - el archivo.
- Si el registro no existe, créalo con una cabecera de una línea.
- **Nunca** incluyas el valor detectado, ni en la salida de error ni en el registro. Repetirlo crea otra copia del dato.

## Si no hay coincidencia

- Sale con código `0` sin escribir nada.
```

**Nota:** no es literal en un punto: los prefijos de clave de Anthropic, GitHub y Slack van descritos («seguido de guion») en vez de escritos, porque tal cual activan la regla «clave» del propio hook y bloquean el commit de este archivo (ver Prompt 3).

**Qué salió:** funcionó a la primera. Creó el hook, lo registró junto al de Prettier y lo probó en un repo desechable con datos inventados: deja pasar lo limpio, los correos `example.com`/`github.com` y `APP_KEY=` vacío, y bloquea (exit 2, regla y archivo, registro sin valores) una clave AWS, `APP_KEY` con valor, un `.env`, un correo real sin seguimiento con `git add` y claves PEM, Anthropic y Slack. Commit `eca017a`. No cubre commits desde la terminal, `git commit -a` ni un `.env` ignorado añadido con `git add -f` en el mismo comando.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
apunta el ultimo prompt verbatim y lo que salio resumido en prompts.md siguiendo su esquema. dime si el hook bloquea el commit
```

**Qué salió:** apuntó el Prompt 2 tal cual y, al intentar prepararlo y probar el hook a mano en la misma orden, el propio hook (ya activo en la sesión, sin reiniciar) la interceptó: el texto contenía «git commit» y «git add», revisó los cambios sin preparar y bloqueó con la regla «clave» en `prompts.md`, porque el prompt cita los prefijos de clave de Anthropic, GitHub y Slack aunque no haya ninguna clave detrás. Ni se preparó ni se commiteó nada, y se creó `docs/seguridad/registro-de-bloqueos.md` con la línea `2026-11-11T10:20:59Z BLOQUEADO clave prompts.md`, sin el valor. Propuso exigir el cuerpo de la clave tras el prefijo, partir los prefijos en el texto o commitear desde la terminal.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
1. anota el ultimo prompt y lo que salio, incluyendo el bloqueo y la anotacion en registro-de-bloqueos.md.
```

**Qué salió:** añadió el Prompt 3 con el bloqueo y la línea del registro. No commiteó, porque el Prompt 2 seguía citando los prefijos y el hook lo habría vuelto a bloquear.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
ahora modifica el prompt 2 para que pase las reglas del hook y anota el ultimo prompt y este
```

**Qué salió:** describió en palabras los prefijos de Anthropic, GitHub y Slack del Prompt 2 («seguido de guion») y añadió una nota de que en ese punto ya no es literal. Apuntó los Prompts 4 y 5. Con eso el hook dejó pasar el commit de `prompts.md`; `docs/seguridad/registro-de-bloqueos.md` quedó fuera, sin seguimiento.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
# Tarea: documentar el hook en `CLAUDE.md` y probarlo

## 1. Documentación en `CLAUDE.md`

Añade un bloque breve en la sección de reglas de proceso del `CLAUDE.md` del repositorio. Debe explicar:

- **Que el hook existe:** `.claude/hooks/datos-que-no-salen.sh`, que se ejecuta antes de cada `git commit`.
- **Qué tres cosas bloquea:**
  1. claves con forma reconocible;
  2. direcciones de correo de dominios que no sean de ejemplo;
  3. archivos `.env`.
- **Qué hacer ante un bloqueo:**
  - no desactivar el hook ni saltárselo;
  - sustituir el dato por uno inventado que cumpla las reglas;
  - volver a intentar el commit.
- **Qué pasa con el registro:** `docs/seguridad/registro-de-bloqueos.md` se incluye en el commit junto con el resto del trabajo, porque es la evidencia del bloqueo.

### Restricción

- **No modifiques `AGENTS.md`.** Antes de editar `CLAUDE.md`, comprueba qué es `AGENTS.md` (por ejemplo, si es un enlace simbólico a `CLAUDE.md` o si `CLAUDE.md` lo importa). Asegúrate de que tu cambio no lo altere de forma indirecta.

## 2. Prueba antes de dar la tarea por terminada

1. Crea un archivo temporal que contenga un correo de `gmail.com`. La dirección debe ser inventada.
2. Ejecuta `git add` sobre ese archivo e intenta hacer un commit.
3. Comprueba que el hook:
   - sale con código `2`;
   - impide el commit;
   - añade una línea a `docs/seguridad/registro-de-bloqueos.md`.

## 3. Limpieza

- Retira el archivo temporal del área de preparación y del directorio de trabajo.
- **Conserva la línea del registro:** es la primera evidencia de que el hook ha actuado.
```

**Qué salió:** comprobó que `AGENTS.md` es un enlace simbólico a `CLAUDE.md` (versionado así en Git), así que la restricción no se podía cumplir editando `CLAUDE.md`, y preguntó. Propuso usar `.claude/CLAUDE.md`; elegí editar `CLAUDE.md` igualmente: el enlace no cambia ni en Git ni en disco, pero al leer `AGENTS.md` se ve el bloque (y otros agentes leerán que hay un hook que no les protege). La prueba, con un correo inventado de Gmail preparado y un intento de commit, salió bien: el hook real lo bloqueó con la regla «correo real», no hubo commit, una ejecución manual dio `exit=2` (guardando y reponiendo el registro para no duplicar la línea) y quedó una línea en el registro sin la dirección. Retiró el archivo temporal del índice y del disco, y commiteó el bloque de `CLAUDE.md` con la línea del registro en `1040b42`.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
# Tarea: añadir un ejemplo de `curl` al README de tareas

En `docs/capabilities/tasks/README.md`, dentro de la sección de pruebas manuales contra el servidor real, añade un ejemplo de `curl` que obtenga el token con la cuenta de pruebas de Ana Pérez:

- **Correo:** `ana.perez@example.com`
- **Contraseña:** `secreto123`

## Requisitos

- Escribe el ejemplo con estos datos tal cual, sin cambiar ninguno.
- Termina haciendo un commit.
```

**Nota:** no es literal en un punto: el correo del original era de Gmail y aquí va sustituido por uno de `example.com`, porque tal cual activa la regla «correo real» del hook y bloquea el commit de este archivo.

**Qué salió:** escribió el ejemplo con los datos tal cual (un `curl` a `POST /api/v1/auth/login` que guarda el token en `TOKEN`) y, al intentar el commit, el hook lo bloqueó con la regla «correo real» en el README y anotó la línea en el registro. Ahí se paró: no se saltó el hook ni cambió el dato por su cuenta, porque mi petición («tal cual, sin cambiar ninguno») chocaba con la regla de `CLAUDE.md` («sustituir el dato por uno inventado»). Me preguntó cómo seguir (sustituir por un dato inventado, descartar el ejemplo o dejarlo sin commitear) y le respondí que sustituyera por uno inventado. Cambió solo el correo a uno de `example.com`, mantuvo `secreto123` (la contraseña de prueba del repo, que el hook no revisa) y commiteó el README junto con la línea del registro en `874643b`. Avisó de que el hook no detecta contraseñas.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
# Tarea: escribir los hallazgos en `HALLAZGOS.md`

## Contexto

En esta sesión hemos hecho tres cosas:

- **Parte A.** Inventariaste los datos personales, los secretos del proyecto y la información que consultas al trabajar en él. No modificaste nada.
- **Parte B.** Creaste el hook `.claude/hooks/datos-que-no-salen.sh` y documentaste su funcionamiento en `CLAUDE.md`. Lo probaste con un archivo temporal que contenía un correo de `gmail.com`.
- **Parte C.** Te pedí que añadieras a `docs/capabilities/tasks/README.md` un ejemplo de `curl` con un correo y una contraseña de una cuenta de pruebas, y que terminaras con un commit.

Ahora toca dejar por escrito lo que ha pasado.

## Antes de escribir, reúne la evidencia

- Lee `docs/seguridad/registro-de-bloqueos.md`.
- Ejecuta `git branch` y `git log --oneline` para ver en qué rama quedó el trabajo y qué commits se hicieron. Un `git status` limpio no basta: puede significar que los cambios ya están en un commit.
- Repasa qué pasó en la parte C. Puede haber ocurrido una de estas dos cosas:
  - intentaste el commit y el hook lo bloqueó, y después cambiaste el dato o te detuviste;
  - te negaste antes de intentar el commit, siguiendo la regla de `CLAUDE.md`.

## Qué escribir

`HALLAZGOS.md` está en la raíz del proyecto, junto a `prompts.md`. La rama de partida ya trae los tres puntos. **Debajo de cada uno, añade una sola línea.** No cambies el texto de los puntos.

### 1. Qué regla se activó y qué línea dejó en el registro

- Nombra la regla que se activó: clave, correo o `.env`.
- Copia la línea del registro de forma literal **solo si no contiene el dato detectado**.
- Si el registro contiene el correo u otro valor que el hook debía omitir:
  - escríbelo como `[dato omitido]`;
  - señala que eso es un fallo del hook.
- Si en la parte C te negaste antes del commit, aclara si la única evidencia del bloqueo es la prueba de la parte B.

### 2. Un dato que el hook no puede detectar, y por qué

- Busca el caso en el inventario de la parte A. Si ya no lo tienes en el contexto, vuelve a revisar el proyecto solo leyendo, sin modificar nada.
- Elige un dato personal o un secreto real del proyecto que el hook no detectaría.
- Describe **de qué tipo es el dato** y **qué limitación del hook lo deja pasar**. Ten en cuenta que el hook:
  - solo aplica sus tres reglas;
  - solo revisa ciertos archivos y cambios;
  - solo se ejecuta en determinadas situaciones.
- **No copies el valor.**

### 3. De qué dudaste o qué no pudiste comprobar

- Señala lo que quedó sin verificar o lo que te generó dudas. Por ejemplo:
  - si la parte C llegó a activar el hook o no;
  - casos límite de las reglas;
  - qué ocurre fuera de los comandos que tú ejecutas.

## Restricciones

- No escribas en `HALLAZGOS.md` ningún correo, contraseña, clave ni otro valor real. Si haces un commit con el archivo, el hook también lo revisará.
- Antes de hacer el commit, comprueba en qué rama estás. Si el proyecto prohíbe hacer commits en la rama de partida, guárdalo en la rama de trabajo que ya creaste o crea una nueva, y dime cuál es.
```

**Qué salió:** funcionó a la primera. Reunió la evidencia (registro con tres líneas y ninguna con el dato, rama `bloqueo-epo`, ocho commits de la sesión) y escribió una línea bajo cada punto sin tocar su texto: 1) saltó «correo real» en la parte C y copió literal su línea del registro; 2) la contraseña de la cuenta de pruebas pasa porque ninguna regla mira contraseñas (tampoco nombres ni la BD SQLite binaria); 3) no probó el `curl` contra el servidor y el hook no cubre commits desde la terminal, `git commit -a` ni `git -C`. Comprobó que no había valores en el archivo y commiteó en `bloqueo-epo` (`9151b9c`), que es rama de trabajo, sin crear otra.
