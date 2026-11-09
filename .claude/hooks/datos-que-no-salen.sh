#!/usr/bin/env bash
# Hook PreToolUse (matcher Bash): impide `git commit` si lo que va a entrar en
# el commit contiene datos que no deben salir de la máquina.
#
# Reglas (y solo estas):
#   1. Clave con forma reconocible (AWS, Anthropic, GitHub, Google, Slack,
#      bloque de clave privada o una línea de APP_KEY con valor).
#   2. Correo cuyo dominio no sea example.com/.org/.net ni github.com.
#   3. Archivo llamado exactamente .env (los .env.example no cuentan).
#
# Código de salida: 0 = deja pasar, 2 = bloquea (lo que va por stderr se lo
# enseña la herramienta a Claude). El valor detectado NUNCA se escribe, ni en
# stderr ni en el registro: solo la regla y el archivo.
#
# Nota: los patrones de abajo están escritos con un corchete ("sk-an[t]-")
# para que este mismo fichero no se bloquee a sí mismo al commitearlo.

set -uo pipefail
export LC_ALL=C

command -v jq >/dev/null 2>&1 || {
  echo "datos-que-no-salen: falta jq, no puedo leer el comando." >&2
  exit 1
}

entrada=$(cat)
comando=$(printf '%s' "$entrada" | jq -r '.tool_input.command // empty' 2>/dev/null)

# Cualquier comando que no sea un commit: fuera, sin ruido.
[[ $comando == *"git commit"* ]] || exit 0

TAB=$'\t'
REGISTRO_REL="docs/seguridad/registro-de-bloqueos.md"

raiz=$(git -C "${CLAUDE_PROJECT_DIR:-.}" rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$raiz" || exit 0

# Qué más puede acabar en el commit además del índice. Con `git add` en el
# mismo comando, los cambios sin preparar y los archivos nuevos todavía no
# están en el índice. `commit -a` también mete los cambios sin preparar de
# los archivos con seguimiento (pero no los nuevos).
con_add=0
[[ $comando == *"git add"* ]] && con_add=1
re_commit_a='git commit[^;&|]*[[:space:]](-[A-Za-z]*a[A-Za-z]*|--all)([[:space:]]|$)'
con_a=0
[[ $comando =~ $re_commit_a ]] && con_a=1
revisar_sin_preparar=$((con_add || con_a))
revisar_sin_seguimiento=$con_add

flujo=$(mktemp) || exit 0
trap 'rm -f "$flujo"' EXIT

# --- Origen de los datos: líneas "archivo<TAB>contenido" ---------------------

# Líneas añadidas de un git diff (los argumentos se pasan a git diff).
emitir_diff() {
  git -c core.quotepath=off diff --no-color --no-ext-diff --no-textconv \
    --no-prefix -U0 "$@" 2>/dev/null |
    awk '
      /^diff --git /                 { cab = 1; next }
      cab && /^@@ /                  { cab = 0; next }
      cab && /^\+\+\+ /              { f = substr($0, 5); sub(/\t.*$/, "", f)
                                       if (f == "/dev/null") f = ""; next }
      !cab && /^\+/ && f != ""       { print f "\t" substr($0, 2) }
    '
}

# Todas las líneas de los archivos nuevos sin seguimiento (solo texto).
emitir_sin_seguimiento() {
  git -c core.quotepath=off ls-files -z --others --exclude-standard 2>/dev/null |
    while IFS= read -r -d '' f; do
      [[ -f $f && ! -L $f ]] || continue
      grep -Iq '' "./$f" 2>/dev/null || continue
      F="$f" awk '{ print ENVIRON["F"] "\t" $0 }' "./$f"
    done
}

{
  emitir_diff --cached
  ((revisar_sin_preparar)) && emitir_diff
  ((revisar_sin_seguimiento)) && emitir_sin_seguimiento
} >"$flujo"

coincidencias=()

# --- Regla 1: clave con forma reconocible ------------------------------------
re_claves="AKIA[0-9A-Z]{16}|sk-an[t]-|gh[p]_|github_pa[t]_|AIza[0-9A-Za-z_-]{35}|xox[bpa]-"
re_claves+="|-----BEGIN [A-Z ]*PRIVATE KEY-----"
re_claves+="|${TAB}[[:space:]]*(export[[:space:]]+)?APP_KE[Y]=[^[:space:]]"

while IFS= read -r f; do
  [[ -n $f ]] && coincidencias+=("1${TAB}$f")
done < <(grep -aE "$re_claves" "$flujo" | cut -f1 | sort -u)

# --- Regla 2: correo con dominio no permitido --------------------------------
while IFS= read -r f; do
  [[ -n $f ]] && coincidencias+=("2${TAB}$f")
done < <(
  awk '
    BEGIN { ok["example.com"] = 1; ok["example.org"] = 1
            ok["example.net"] = 1; ok["github.com"] = 1 }
    {
      i = index($0, "\t"); if (!i) next
      f = substr($0, 1, i - 1); s = substr($0, i + 1)
      while (match(s, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z][A-Za-z]+/)) {
        e = substr(s, RSTART, RLENGTH)
        d = tolower(substr(e, index(e, "@") + 1))
        if (!(d in ok) && !(f in visto)) { print f; visto[f] = 1 }
        s = substr(s, RSTART + RLENGTH)
      }
    }
  ' "$flujo"
)

# --- Regla 3: archivo .env entre los que se van a incorporar ------------------
while IFS= read -r -d '' f; do
  [[ $f == */ ]] && continue
  [[ ${f##*/} == ".env" ]] && coincidencias+=("3${TAB}$f")
done < <(
  git diff --cached --name-only -z --diff-filter=d 2>/dev/null
  ((revisar_sin_preparar)) && git diff --name-only -z --diff-filter=d 2>/dev/null
  ((revisar_sin_seguimiento)) && git ls-files -z --others --exclude-standard 2>/dev/null
)

# Un `.env` ignorado por Git no aparece en ninguna lista de arriba, pero
# `git add -f .env` sí lo mete. Se mira el texto de cada `git add` del comando.
if ((con_add)); then
  re_add='git add([^;&|]*)'
  re_env="(^|[[:space:]'\"/])\.env([[:space:]'\"]|$)"
  resto=$comando
  while [[ $resto =~ $re_add ]]; do
    tramo=${BASH_REMATCH[1]}
    entero=${BASH_REMATCH[0]}
    if [[ $tramo =~ $re_env ]]; then
      coincidencias+=("3${TAB}.env (nombrado en el comando git add)")
    fi
    resto=${resto#*"$entero"}
  done
fi

((${#coincidencias[@]})) || exit 0

# --- Hay coincidencias: avisar, registrar y bloquear --------------------------
descripcion() {
  case $1 in
    1) echo "clave con forma reconocible" ;;
    2) echo "correo con dominio no permitido" ;;
    3) echo "archivo .env" ;;
  esac
}

marca=$(date -u +%Y-%m-%dT%H:%M:%SZ)
registro="$raiz/$REGISTRO_REL"
if [[ ! -f $registro ]]; then
  mkdir -p "$(dirname "$registro")" 2>/dev/null &&
    printf '# Registro de bloqueos de datos-que-no-salen\n' >"$registro" 2>/dev/null
fi

{
  echo "COMMIT BLOQUEADO por datos-que-no-salen:"
  for c in "${coincidencias[@]}"; do
    regla=${c%%"$TAB"*}
    archivo=${c#*"$TAB"}
    echo "  - regla $regla ($(descripcion "$regla")) en $archivo"
  done
  echo "El dato debe sustituirse por uno inventado antes de volver a hacer el commit."
  echo "(El valor detectado no se muestra ni se registra.)"
} >&2

for c in "${coincidencias[@]}"; do
  regla=${c%%"$TAB"*}
  archivo=${c#*"$TAB"}
  printf -- '- %s | BLOQUEADO | regla %s (%s) | %s\n' \
    "$marca" "$regla" "$(descripcion "$regla")" "$archivo" >>"$registro" 2>/dev/null ||
    echo "datos-que-no-salen: no he podido escribir en $REGISTRO_REL." >&2
done

exit 2
