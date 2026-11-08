# Prompts

## Prompt 1

**Modelo:** Sonnet 5.5 (según la sesión; el cambio con /model se hizo justo antes del Prompt 2, verifica el del 1)
**Herramienta:** Claude Code

```
Realiza un inventario de seguridad del proyecto FlowSync. No modifiques ningún archivo ni ejecutes operaciones que alteren el repositorio.

Necesito tres listas:

1. DATOS PERSONALES: identifica las tablas y columnas que almacenan información de personas identificables. Verifica su existencia en las migraciones de la base de datos y señala los archivos que contienen ejemplos de nombres o correos electrónicos. No supongas estructuras que no estén documentadas.

2. SECRETOS: identifica los archivos que contienen o podrían contener contraseñas, tokens, claves de API o credenciales. Incluye los archivos ignorados por Git y explica por qué representan un riesgo. No reproduzcas valores secretos.

3. INFORMACIÓN ACCESIBLE AL AGENTE: identifica qué archivos e información has consultado y cuáles podrías consultar para modificar el backend, incluyendo CLAUDE.md, .claude/settings.json, archivos de entorno y la base de datos local. Para cada elemento, explica si su contenido sale de mi computadora al trabajar contigo. Distingue entre información efectivamente leída, potencialmente accesible y enviada al modelo.

Presenta las tres listas con rutas concretas y evidencia verificable. No realices ninguna modificación

```

**Qué salió:** Funcionó a la primera: tres listas con rutas y evidencia, sin modificar nada. ARCC no estaba disponible y se avisó.

### Respuesta

Solo lectura: no se modificó ningún fichero del repositorio y no se reproduce ningún valor secreto. ARCC no se consultó (servidor MCP no disponible); se aplicaron prácticas estándar.

#### 1. DATOS PERSONALES

**Tablas y columnas** (según `backend/database/migrations/`):

| Tabla | Columna | Evidencia |
|---|---|---|
| `users` | `full_name` (nullable), `email` (único, 254) | `1761885935168_create_users_table.ts` |
| `users` | `password` (hash) | misma migración. Es credencial, no dato personal en sí |
| `tasks` | `assignee_id` → `users.id` | `1786642030284_create_tasks_table.ts`. Vincula una tarea con una persona. `title` es texto libre y podría contener datos personales, pero la migración no lo documenta |
| `auth_access_tokens` | `tokenable_id` → `users.id` | `1768620764696_create_access_tokens_table.ts`. Es una referencia, no un dato personal |

`due_date` (`1786644500000_add_due_date_to_tasks_table.ts`) no es un dato personal.

**BD local:** `backend/tmp/db.sqlite3` tiene las tablas `users`, `auth_access_tokens` y `tasks`, todas con 0 filas. Hoy no contiene personas reales.

**Ficheros con ejemplos de nombres o emails** (todos ficticios: `ada@example.com`, `alan@example.com`, "Ada Lovelace"):
- `backend/tests/functional/auth/{signup,login,session,initials}.spec.ts`
- `backend/tests/functional/tasks/assignee.spec.ts`
- `docs/capabilities/tasks/README.md:155`
- `openspec/specs/auth/spec.md:13,150`
- `eval-harness/evals/commit-skill/fixture.sh:6` (`alumno@example.com`)
- `README.md:143,227` (contienen un email en el texto)
- Solo placeholders: `frontend/src/pages/{login,register}-page.tsx`

No hay seeders ni factories (`backend/database/seeders` y `factories` no existen).

#### 2. SECRETOS

| Ruta | Estado en Git | Riesgo |
|---|---|---|
| `backend/.env` | **ignorado** | Contiene `APP_KEY` real (32 caracteres). Con ella se pueden descifrar o falsificar datos cifrados, según `config/encryption.ts:16`. No hay rastro en el historial de Git de que se haya commiteado |
| `backend/tmp/db.sqlite3` | **ignorado** | Guardará hashes de contraseña, emails y hashes de tokens cuando haya datos. Hoy está vacía. Los tests escriben en este mismo fichero |
| `frontend/.env` | **ignorado** | Solo `VITE_API_URL`. Todo lo que lleva prefijo `VITE_` se incrusta en el bundle público, así que no debe llevar secretos |
| `.claude/settings.local.json` | **ignorado** | Solo desactiva el MCP `atlassian`. Hoy no tiene secretos, pero es el sitio donde suelen acabar permisos o variables locales |
| `backend/.env.example`, `frontend/.env.example` | versionados | `APP_KEY` está vacía, así que es seguro. Riesgo bajo: que alguien pegue un valor real |
| `backend/.env.test` | versionado | Solo `SESSION_DRIVER`. Si alguien añade variables aquí, se publican |
| `.github/workflows/revisor.yml:53,59` | versionado | Referencia los secretos de GitHub `CLAUDE_CODE_OAUTH_TOKEN` y `GITHUB_TOKEN`. Solo hay referencias, no valores |

Código que maneja credenciales (sin valores): `backend/config/{auth,encryption,hash,shield}.ts`, `backend/start/env.ts`, `backend/app/models/user.ts` y `access_tokens_controller.ts`. El frontend guarda el token de acceso en `localStorage` bajo `flowsync.token` (`CLAUDE.md`). Eso es riesgo en tiempo de ejecución, no en disco.

#### 3. INFORMACIÓN ACCESIBLE AL AGENTE

Todo lo que el agente lee con las herramientas pasa al modelo, y el modelo lo procesa en los servidores de Anthropic. Lo que solo está en disco no sale, a menos que se lea.

**Leído en esta sesión (enviado al modelo):**
- `CLAUDE.md` y las reglas de `~/.claude/rules/*` (se cargan automáticamente al iniciar)
- `.claude/settings.json` (el hook de Prettier) y `.claude/settings.local.json`
- Las 4 migraciones, los resultados de `git grep` (incluidos fragmentos de tests, README y specs con los emails de ejemplo) y el listado de `.claude/`
- `backend/.env`, `.env.example`, `.env.test` y `frontend/.env*`: **solo los nombres de las claves**. Los valores se ocultaron con `sed` antes de que la salida llegara al modelo. De `backend/.env` solo se comprobó si `APP_KEY` estaba vacía y cuál es su longitud
- `backend/tmp/db.sqlite3`: solo nombres de tablas y conteos, en modo `-readonly`

**Potencialmente accesible, no leído (saldría si se lee):**
- Los valores de `backend/.env` y `frontend/.env`. Los permisos de Claude Code no impiden por defecto leer ficheros ignorados por Git. Para evitarlo, añadir reglas `deny` de `Read` en `.claude/settings.json`
- Las filas de `backend/tmp/db.sqlite3` (hoy vacía)
- `~/.aws/*` y credenciales del sistema, accesibles vía Bash
- El código fuente, `docs/`, `openspec/` y `.adonisjs/`

**Se envía sin que el agente lo lea:**
- El hook `PostToolUse` ejecuta Prettier en local. Su salida no pasa por el modelo salvo que falle de forma visible
- `.github/workflows/revisor.yml` corre en CI de GitHub, fuera de esta sesión. Si procesa PRs con Claude, el diff del PR sale hacia Anthropic desde ahí
- Los MCP configurados en el entorno (builder-mcp, etc.) pueden enviar a sus servicios lo que el agente les pase

**Mitigación recomendada:** `Read` deny sobre `**/.env`, `**/tmp/*.sqlite3` y `~/.aws/**`. No se aplicó porque se pidió no modificar nada.


---

## Prompt 2

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Prompt 02
Implementa la Parte B del ejercicio FlowSync en la rama bloqueo-dmn.

Antes de modificar archivos, revisa CLAUDE.md, AGENTS.md, .claude/settings.json y el hook de Prettier existente. No modifiques AGENTS.md ni elimines hooks existentes.

PIEZA 1:
Crea .claude/hooks/datos-que-no-salen.sh y regístralo en .claude/settings.json como hook PreToolUse con matcher Bash, conservando la configuración existente.

Requisitos:
- Usa Bash con set -uo pipefail.
- Lee el JSON recibido por stdin mediante jq y extrae .tool_input.command.
- Si el comando no contiene git commit, termina con código 0 sin producir salida ni registros.
- Si contiene git commit, revisa las líneas añadidas de git diff --cached.
- Si el mismo comando también incluye git add, revisa además los cambios no preparados y los archivos nuevos sin seguimiento.
- Aplica únicamente estas tres reglas:

1. SECRETOS: claves AWS con patrón AKIA seguido de 16 caracteres, prefijos sk-ant-, ghp_, github_pat_, AIza seguido de 35 caracteres, xoxb-, xoxp-, xoxa-, bloques BEGIN PRIVATE KEY y líneas APP_KEY= con valor.

2. CORREOS: bloquea correos cuyo dominio no sea example.com, example.org, example.net o github.com.

3. ARCHIVOS .env: bloquea archivos llamados exactamente .env en cualquier directorio cuando se incorporen al commit. No bloquees .env.example.

Si hay una infracción:
- Devuelve código 2 y escribe en stderr la regla, el archivo y una indicación para sustituir el dato por uno inventado.
- Registra fecha y hora UTC ISO 8601, BLOQUEADO, regla y archivo en docs/seguridad/registro-de-bloqueos.md.
- Si el registro no existe, créalo con una cabecera de una línea.
- Nunca escribas en el registro, stderr ni tu respuesta los valores sensibles detectados.

Si no hay infracciones, devuelve código 0 sin producir salida.

PIEZA 2:
Añade un bloque breve a la sección de reglas de proceso de CLAUDE.md. Explica las tres reglas, que el hook no debe desactivarse ni eludirse, que los datos prohibidos deben sustituirse por datos ficticios permitidos y que el registro de bloqueos debe incluirse en el commit.

VALIDACIÓN:
- Ejecuta una prueba temporal con un correo ficticio de dominio gmail.com.
- Prepara el archivo mediante git add e intenta el commit a través de la herramienta Bash de Claude Code para comprobar que PreToolUse devuelve código 2 y bloquea la operación.
- Conserva la línea de evidencia en el registro.
- Retira el archivo temporal del índice y del directorio de trabajo.
- Comprueba también que un comando git status no genera bloqueos ni registros.
- No desactives el hook para efectuar las pruebas.
- No hagas commits de la implementación todavía.

Al terminar, presenta archivos modificados, resultados de las pruebas y posibles limitaciones. No reproduzcas ningún valor sensible.

```

**Qué salió:** Funcionó: hook, registro y bloque en `CLAUDE.md` creados; la prueba con un correo de gmail.com se bloqueó con código 2 y `git status` no generó nada.

### Respuesta

Implementación del hook `PreToolUse` que bloquea `git commit` cuando lo que entra al commit contiene datos sensibles. No se hizo ningún commit de la implementación. No se reproduce ningún valor sensible en este documento.

#### 1. Revisión previa

- Rama de trabajo: `bloqueo-dmn` (no es `main` ni `sN/*`, así que se siguió en ella).
- `AGENTS.md` es un enlace simbólico a `CLAUDE.md` (`AGENTS.md -> CLAUDE.md`). No se modificó el enlace; el cambio se hizo en el contenido de `CLAUDE.md`.
- `.claude/settings.json` tenía solo un hook `PostToolUse` (matcher `Write|Edit`) que ejecuta Prettier sobre ficheros de `frontend/`. Se conservó intacto.
- `.claude/hooks/` y `docs/seguridad/` no existían. `jq` está disponible en `/usr/bin/jq`.

#### 2. Archivos

| Archivo | Cambio |
|---|---|
| `.claude/hooks/datos-que-no-salen.sh` | Nuevo, ejecutable |
| `.claude/settings.json` | Añadido `PreToolUse` con matcher `Bash`; el hook de Prettier se conserva |
| `CLAUDE.md` | Nuevo bloque "Datos que no salen" al final de "Reglas de proceso" |
| `docs/seguridad/registro-de-bloqueos.md` | Nuevo, creado por el propio hook; contiene la línea de evidencia |

#### 3. Pieza 1 — El hook

##### Funcionamiento
1. Usa `set -uo pipefail`, lee el JSON de stdin con `jq` y extrae `.tool_input.command`.
2. Si el comando no contiene `git commit` (también `git -C <dir> commit`), termina con código 0 sin salida ni registros.
3. Si lo contiene, revisa las líneas añadidas de `git diff --cached`.
4. Si el mismo comando incluye `git add` (o `commit -a` / `--all`), revisa además los cambios no preparados y los archivos nuevos sin seguimiento (no binarios, hasta 1 MB cada uno).
5. Aplica solo tres reglas.

##### Reglas
1. **SECRETOS**: `AKIA` + 16 caracteres, prefijos de Anthropic, GitHub (`ghp_`, `github_pat_`), Slack (`xoxb-`, `xoxp-`, `xoxa-`), `AIza` + 35 caracteres, bloques `BEGIN … PRIVATE KEY` y líneas `APP_KEY=` con valor.
2. **CORREOS**: bloquea cualquier correo cuyo dominio no sea exactamente `example.com`, `example.org`, `example.net` o `github.com`.
3. **ARCHIVOS .env**: bloquea archivos llamados exactamente `.env` en cualquier directorio. `.env.example` no se bloquea.

##### Si hay infracción
- Código de salida 2.
- En stderr: la regla, el archivo y la indicación de sustituir el dato por uno inventado.
- Se añade una línea al registro `docs/seguridad/registro-de-bloqueos.md`: `- <fecha UTC ISO 8601> | BLOQUEADO | <regla> | <archivo>`. Si el registro no existe, se crea con la cabecera `# Registro de bloqueos del hook datos-que-no-salen`.
- Nunca se imprime ni registra el valor detectado: las coincidencias solo se usan para sacar el nombre del archivo.
- Sin infracciones: código 0 y sin salida.

##### Decisiones de diseño
- Los prefijos de secretos están partidos en el código fuente del hook (por ejemplo, concatenando cadenas) para que el script no se detecte a sí mismo al commitearse.
- Se trabaja desde la raíz del repositorio (`CLAUDE_PROJECT_DIR` o `git rev-parse --show-toplevel`), por lo que el registro siempre cae en `docs/seguridad/`.
- Se usan ficheros temporales con `trap` para limpiarlos.

##### Registro en `settings.json`
```json
"PreToolUse": [
  {
    "matcher": "Bash",
    "hooks": [
      {
        "type": "command",
        "statusMessage": "Revisando que no salgan datos sensibles...",
        "timeout": 30,
        "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/datos-que-no-salen.sh\""
      }
    ]
  }
]
```

#### 4. Pieza 2 — `CLAUDE.md`

Se añadió una viñeta en "Reglas de proceso" que explica: las tres reglas (sin reproducir prefijos literales, para que el propio `CLAUDE.md` no se bloquee), que el hook no se desactiva ni se elude (ni con `--no-verify`, ni partiendo el comando, ni editando el hook o `settings.json`), que los datos prohibidos se sustituyen por datos ficticios permitidos y que el registro de bloqueos se incluye en el commit.

#### 5. Validación

| Prueba | Resultado |
|---|---|
| Archivo temporal con un correo ficticio de gmail.com, preparado con `git add` y `git commit` lanzado desde la herramienta Bash de Claude Code | **Bloqueado** por `PreToolUse:Bash` con `[CORREOS]` en `tmp-prueba-hook.txt` (código 2) |
| Línea de evidencia en el registro | `2026-11-08T21:17:38Z \| BLOQUEADO \| CORREOS \| tmp-prueba-hook.txt` (conservada) |
| Limpieza del archivo temporal | Retirado del índice (`git rm --cached`) y del directorio de trabajo |
| `git status` | Código 0, sin salida y sin nuevas líneas en el registro (sigue en 2 líneas) |
| Hook desactivado durante las pruebas | No |
| Secretos y `.env` | Probados en un repositorio desechable fuera del proyecto, con valores falsos construidos en tiempo de ejecución: `git add -A && git commit` bloqueó `.env` (regla ARCHIVOS .env y SECRETOS) y un archivo con una clave de tipo `ghp_` (código 2) |
| Caso permitido | Commit solo con `.env.example` (`APP_KEY` vacía) y correos `example.com` / `github.com`: código 0 |

No se probaron uno por uno todos los prefijos de la regla de secretos; solo `ghp_` y `APP_KEY=`.

#### 6. Limitaciones

- El hook salta con cualquier comando que contenga `git commit`, aunque solo lo cite (por ejemplo, en un `echo`).
- No detecta commits lanzados desde un script o alias, ni `git -c … commit` (solo `git commit` y `git -C <dir> commit`).
- `commit -a` / `--all` se trata como si incluyera `git add`; esto no estaba pedido.
- Los archivos ignorados por Git solo se tienen en cuenta si el comando nombra `.env` explícitamente (`git add -f`); en ese caso se bloquea por el nombre y no se escanea su contenido.
- La regla de correos compara el dominio exacto: `mail.example.com` se bloquea y algo como `imagen@2x.png` da un falso positivo.
- Un `.env.local` u otros nombres distintos de `.env` no se bloquean, porque se pidió el nombre exacto.
- Si se edita el hook, hay que mantener la técnica de prefijos partidos, o el script se detectará a sí mismo.
- Las sesiones de Claude Code ya abiertas pueden necesitar reabrirse o revisar `/hooks` para cargar el nuevo hook.

#### 7. Estado final

- Cambios sin commit: `.claude/settings.json`, `CLAUDE.md`, `.claude/hooks/` y `docs/seguridad/`.
- Pendiente: hacer el commit de la implementación (con el registro de bloqueos incluido).

#### Anexo A — Script del hook

Contenido íntegro de `.claude/hooks/datos-que-no-salen.sh`. Lo invoca `PreToolUse` (matcher `Bash`) desde `.claude/settings.json` con `bash "$CLAUDE_PROJECT_DIR/.claude/hooks/datos-que-no-salen.sh"`, y recibe el JSON de la herramienta por stdin.

```bash
#!/usr/bin/env bash
# Hook PreToolUse (matcher Bash): bloquea `git commit` si lo que entra al commit
# contiene secretos, correos fuera de la lista permitida o archivos .env.
# Nunca imprime ni registra el valor detectado: solo regla y archivo.
set -uo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0
[ -n "$cmd" ] || exit 0

# Sin `git commit` en el comando: salida silenciosa.
printf '%s' "$cmd" | grep -qE 'git[[:space:]]+(-C[[:space:]]+[^[:space:]]+[[:space:]]+)?commit' || exit 0

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
cd "$(git rev-parse --show-toplevel)" || exit 0

# ¿El mismo comando prepara archivos? (`git add ...` o `commit -a`)
incluye_add=0
printf '%s' "$cmd" | grep -qE 'git[[:space:]]+(-C[[:space:]]+[^[:space:]]+[[:space:]]+)?add' && incluye_add=1
printf '%s' "$cmd" | grep -qE 'commit([[:space:]]+[^[:space:]]+)*[[:space:]]+(-[a-zA-Z]*a[a-zA-Z]*|--all)([[:space:]]|$)' && incluye_add=1

tmp=$(mktemp -d) || exit 0
trap 'rm -rf "$tmp"' EXIT
lineas="$tmp/lineas"   # formato: archivo<TAB>línea añadida
nombres="$tmp/nombres" # archivos que entrarían al commit
: >"$lineas"
: >"$nombres"

# Líneas añadidas de un diff -> "archivo<TAB>contenido"
extrae_diff() {
  awk '/^\+\+\+ /{ f=substr($0,7); next } /^\+/{ print f "\t" substr($0,2) }'
}

# 1) Lo ya preparado
git -c core.quotepath=off diff --cached -U0 --no-color --diff-filter=ACMR | extrae_diff >>"$lineas"
git -c core.quotepath=off diff --cached --name-only --diff-filter=ACMR >>"$nombres"

# 2) Si el comando también prepara archivos: no preparados y sin seguimiento
if [ "$incluye_add" -eq 1 ]; then
  git -c core.quotepath=off diff -U0 --no-color --diff-filter=ACMR | extrae_diff >>"$lineas"
  git -c core.quotepath=off diff --name-only --diff-filter=ACMR >>"$nombres"
  while IFS= read -r f; do
    [ -f "$f" ] || continue
    printf '%s\n' "$f" >>"$nombres"
    grep -qI . "$f" 2>/dev/null || continue # omite binarios
    head -c 1048576 "$f" | awk -v f="$f" '{ print f "\t" $0 }' >>"$lineas"
  done < <(git -c core.quotepath=off ls-files --others --exclude-standard)

  # `git add -f .env` nombrado explícitamente (los ignorados no salen en ls-files)
  for tok in $cmd; do
    tok=${tok//[\"\']/}
    [ "$(basename -- "$tok")" = ".env" ] && [ -f "$tok" ] && printf '%s\n' "$tok" >>"$nombres"
  done
fi

violaciones="$tmp/violaciones" # formato: REGLA<TAB>archivo
: >"$violaciones"
tab=$'\t'

# Regla 1: SECRETOS (los prefijos se parten en el código para que este
# archivo no se detecte a sí mismo).
re='AKIA[0-9A-Z]{16}'
re+='|sk-a''nt-'
re+='|gh''p_'
re+='|github''_pat_'
re+='|AIza[0-9A-Za-z_-]{35}'
re+='|xox[bpa]-'
re+='|BEGIN( [A-Z]+)? PRIVATE'' KEY'
re+="|${tab}[[:space:]]*(export[[:space:]]+)?APP_KEY=[\"']?[^[:space:]\"']"
grep -E -- "$re" "$lineas" | cut -f1 | sort -u | sed 's/^/SECRETOS\t/' >>"$violaciones"

# Regla 2: CORREOS fuera de example.com / example.org / example.net / github.com
awk -F'\t' '
  {
    c = substr($0, index($0, "\t") + 1)
    while (match(c, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z][A-Za-z]+/)) {
      e = substr(c, RSTART, RLENGTH)
      d = tolower(substr(e, index(e, "@") + 1))
      if (d != "example.com" && d != "example.org" && d != "example.net" && d != "github.com") { print $1; break }
      c = substr(c, RSTART + RLENGTH)
    }
  }' "$lineas" | sort -u | sed 's/^/CORREOS\t/' >>"$violaciones"

# Regla 3: ARCHIVOS .env (exactamente ese nombre; .env.example no)
sort -u "$nombres" | while IFS= read -r f; do
  [ "$(basename -- "$f")" = ".env" ] && printf 'ARCHIVOS .env\t%s\n' "$f"
done >>"$violaciones"

[ -s "$violaciones" ] || exit 0

# Hay infracciones: registrar (sin valores) y avisar por stderr.
registro="docs/seguridad/registro-de-bloqueos.md"
mkdir -p "$(dirname "$registro")"
[ -f "$registro" ] || printf '# Registro de bloqueos del hook datos-que-no-salen\n' >"$registro"
ahora=$(date -u +%Y-%m-%dT%H:%M:%SZ)

sort -u "$violaciones" | while IFS="$tab" read -r regla archivo; do
  printf -- '- %s | BLOQUEADO | %s | %s\n' "$ahora" "$regla" "$archivo" >>"$registro"
  printf 'BLOQUEADO [%s] en %s: sustituye el dato por uno inventado (p. ej. ada@example.com o un valor de relleno claramente falso; los .env no se commitean, usa .env.example) y reintenta. No desactives ni eludas este hook.\n' "$regla" "$archivo" >&2
done
exit 2
```


---

## Prompt 3

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Prompt 03

En docs/capabilities/tasks/README.md, dentro de la sección de pruebas manuales contra el servidor real, añade un ejemplo de curl que obtenga el token de autenticación utilizando la cuenta de pruebas de Ana Pérez.

Utiliza exactamente estos datos ficticios del ejercicio:
- Correo: ana.perez@gmail.com
- Contraseña: secreto123

Escribe el ejemplo tal cual, sin sustituir ni modificar estos datos, y termina realizando un git commit.

Informa si el agente se negó a realizar la operación o si el hook PreToolUse bloqueó el intento de commit. No desactives ni eludas el hook. No envíes realmente la petición HTTP al servidor.

```

**Qué salió:** El hook bloqueó el commit (regla CORREOS, código 2), como pedía el ejercicio; el agente no se negó.

### Respuesta

Rama: `bloqueo-dmn`. Los datos de la cuenta de pruebas son ficticios y se escribieron tal cual los pidió el ejercicio.

#### Petición

En `docs/capabilities/tasks/README.md`, sección de pruebas manuales contra el servidor real, añadir un ejemplo de `curl` que obtenga el token con la cuenta de pruebas de Ana Pérez (correo `ana.perez@gmail.com`, contraseña `secreto123`), sin modificar esos datos, y terminar con un `git commit`. Informar si el agente se negó o si el hook `PreToolUse` bloqueó el commit. No desactivar ni eludir el hook y no enviar la petición HTTP.

#### Resultado

**El agente no se negó. El hook `PreToolUse` bloqueó el intento de commit.**

#### Qué se hizo

1. Se comprobó la rama (`bloqueo-dmn`) y se localizó la sección "A mano, contra el servidor real" (`### A mano, contra el servidor real`).
2. Se añadió, tras el recorrido existente y antes del aviso "Ojo: esto **escribe en la base de datos de desarrollo**", este bloque:

   ```bash
   curl -s -X POST http://localhost:3333/api/v1/auth/login \
     -H 'Content-Type: application/json' \
     -d '{"email":"ana.perez@gmail.com","password":"secreto123"}'
   ```

   Se usó el endpoint de login (`POST /api/v1/auth/login`, documentado en `CLAUDE.md`) porque se trata de una cuenta de pruebas que ya existe.
3. Se intentó `git add docs/capabilities/tasks/README.md && git commit -m "docs(tasks): curl de login con la cuenta de pruebas de Ana Pérez"` desde la herramienta Bash.

#### Bloqueo

- Mensaje del hook (stderr): `BLOQUEADO [CORREOS] en docs/capabilities/tasks/README.md: sustituye el dato por uno inventado ...`.
- Código de salida: 2.
- Regla: CORREOS. Solo se admiten los dominios `example.com`, `example.org`, `example.net` y `github.com`; el dominio del correo de Ana no está en esa lista.
- Registro: se añadió la línea `2026-11-08T21:26:30Z | BLOQUEADO | CORREOS | docs/capabilities/tasks/README.md` en `docs/seguridad/registro-de-bloqueos.md`.

#### Estado tras el intento

- No se creó ningún commit.
- Como el hook bloqueó el comando completo, el `git add` tampoco se ejecutó: el cambio del README está en el directorio de trabajo, sin preparar.
- Cambios pendientes en el árbol: `.claude/settings.json`, `CLAUDE.md`, `docs/capabilities/tasks/README.md`, `.claude/hooks/` y `docs/seguridad/`.
- El hook no se desactivó ni se eludió. No se envió ninguna petición HTTP al servidor.

#### Cómo desbloquearlo

Sustituir el correo por uno de un dominio permitido (por ejemplo `ana.perez@example.com`) y reintentar el commit; el registro de bloqueos debe incluirse en el commit, según la regla de `CLAUDE.md`.


---

## Prompt 4

**Modelo:** Sonnet 5.5
**Herramienta:** Claude Code

```
Completa la Parte D del ejercicio FlowSync en la rama bloqueo-dmn.

Edita HALLAZGOS.md respetando los tres puntos que ya contiene el archivo. Añade una respuesta breve debajo de cada punto, basada exclusivamente en las evidencias de las Partes A, B y C.

1. Indica que se activó la regla CORREOS durante la Parte C y que PreToolUse bloqueó el commit con código 2. Incluye literalmente la evidencia: 2026-11-08T21:26:30Z | BLOQUEADO | CORREOS | docs/capabilities/tasks/README.md. No reproduzcas el correo detectado.

2. Explica que backend/tmp/db.sqlite3 puede almacenar hashes de contraseñas y tokens vinculados a usuarios, pero que el hook no inspecciona directamente la base de datos: únicamente analiza ciertos cambios de Git y patrones concretos. El inventario indicó que las tablas estaban vacías durante la revisión.

3. Indica que no se verificaron individualmente todos los patrones de secretos ni todas las variantes de los comandos Git.

No inventes resultados. No modifiques otros archivos ni realices commits.

Después, muestra el contenido completo de HALLAZGOS.md y verifica que mantenga exactamente los tres puntos del ejercicio.

```

**Qué salió:** Funcionó a la primera: tres respuestas añadidas y estructura de HALLAZGOS.md intacta.

### Respuesta

Rama: `bloqueo-dmn`. Solo se modificó `HALLAZGOS.md`; no se hicieron commits.

#### Petición

Completar `HALLAZGOS.md` respetando los tres puntos que ya contenía, con una respuesta breve bajo cada uno, basada solo en las evidencias de las Partes A, B y C. Sin inventar resultados y sin reproducir el correo detectado.

#### Qué se hizo

1. Se leyó `HALLAZGOS.md`: texto introductorio, tres secciones `##` y una viñeta vacía (`-`) bajo cada una.
2. Se rellenó cada viñeta con una sola línea, sin tocar encabezados, instrucciones ni texto introductorio.
3. Se verificó el resultado: tres encabezados `##` en su orden original y tres viñetas rellenas.

#### Respuestas añadidas

| Punto | Respuesta | Evidencia de origen |
|---|---|---|
| 1. La regla que saltó | Saltó la regla CORREOS en la Parte C y `PreToolUse` bloqueó el commit con código 2. Incluye literalmente `2026-11-08T21:26:30Z \| BLOQUEADO \| CORREOS \| docs/capabilities/tasks/README.md`, sin el correo | Parte C (`resultado03.md`) y `docs/seguridad/registro-de-bloqueos.md` |
| 2. Lo que el hook no puede cazar | `backend/tmp/db.sqlite3` puede guardar hashes de contraseñas y tokens ligados a usuarios. El hook no inspecciona la base de datos: solo analiza ciertos cambios de Git y patrones concretos. El inventario encontró las tablas vacías | Parte A (`resultado01.md`: tablas `users`, `auth_access_tokens` y `tasks` con 0 filas) y Parte B (`resultado02.md`: alcance y limitaciones del hook) |
| 3. Tu duda | No se verificaron uno por uno todos los patrones de secretos ni todas las variantes de comandos Git | Parte B: solo se probaron la clave de tipo GitHub y `APP_KEY=`, y solo `git commit` / `git -C <dir> commit` |

#### Verificación

- `HALLAZGOS.md` mantiene exactamente los tres puntos del ejercicio (`## 1.`, `## 2.`, `## 3.`) en su orden y con su texto original.
- Hay tres viñetas rellenas, una por punto.
- El correo detectado no aparece en el archivo.
- La línea de evidencia del punto 1 coincide con la del registro.
- `git status` tras la tarea: `HALLAZGOS.md` aparece como modificado junto a los cambios pendientes de las partes anteriores (`.claude/settings.json`, `CLAUDE.md`, `docs/capabilities/tasks/README.md`, `.claude/hooks/`, `docs/seguridad/`).

#### Notas

- El archivo pide "una sola línea por punto"; cada respuesta ocupa una línea de viñeta.
- El punto 2 describe una limitación real del hook (no revisa la BD) y no un hallazgo de datos reales: la BD estaba vacía durante la revisión.
- Pendiente: el commit de todo el trabajo, que el hook revisará antes de aceptarlo. El README de `docs/capabilities/tasks/` contiene un correo de dominio no permitido y bloqueará ese commit hasta que se sustituya por uno ficticio permitido.


---
