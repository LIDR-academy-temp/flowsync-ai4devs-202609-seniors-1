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
