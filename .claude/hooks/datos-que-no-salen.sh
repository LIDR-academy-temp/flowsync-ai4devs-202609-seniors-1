#!/usr/bin/env bash
# Hook PreToolUse (matcher Bash): bloquea `git commit` si lo que va a entrar en el
# commit contiene datos que no deben salir de la máquina. Exit 2 = bloqueado.
#
# Los patrones de la regla 1 se escriben partidos ("AKI""A...") para que este
# fichero no se detecte a sí mismo al hacer commit de él.
set -uo pipefail
export LC_ALL=C

LOG_REL="docs/seguridad/registro-de-bloqueos.md"
TAB=$'\t'

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0

case "$cmd" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac
with_add=0
case "$cmd" in
  *"git add"*) with_add=1 ;;
esac

root=$(git -C "${CLAUDE_PROJECT_DIR:-$PWD}" rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0

# Lee un diff unificado y escribe "ruta<TAB>línea añadida" (solo las líneas con +).
added_lines() {
  awk '
    /^diff --git /           { hdr = 1; f = ""; next }
    hdr && /^\+\+\+ /        { f = ($0 == "+++ /dev/null") ? "" : substr($0, 7); next }
    /^@@/                    { hdr = 0; next }
    !hdr && f != "" && /^\+/ { print f "\t" substr($0, 2) }
  '
}

DIFF="git -c core.quotepath=off diff --no-color --no-ext-diff"

lines=$($DIFF --cached -U0 2>/dev/null | added_lines)
files=$($DIFF --cached --name-only --diff-filter=ACMRT 2>/dev/null)

if [ "$with_add" -eq 1 ]; then
  lines="$lines"$'\n'"$($DIFF -U0 2>/dev/null | added_lines)"
  files="$files"$'\n'"$($DIFF --name-only --diff-filter=ACMRT 2>/dev/null)"
  untracked=$(git -c core.quotepath=off ls-files --others --exclude-standard 2>/dev/null)
  files="$files"$'\n'"$untracked"
  while IFS= read -r f; do
    [ -n "$f" ] && [ -f "$f" ] && [ ! -L "$f" ] || continue
    grep -Iq '' "$f" 2>/dev/null || continue # solo ficheros de texto
    lines="$lines"$'\n'"$(awk -v f="$f" '{ print f "\t" $0 }' "$f")"
  done <<EOF
$untracked
EOF
fi

# --- Regla 1: clave con forma reconocible --------------------------------------
KEY_RE="AKI""A[0-9A-Z]{16}|sk-an""t-|gh""p_|github_p""at_|AI""za[0-9A-Za-z_-]{35}|xox[bpa]-|-----BEGIN [A-Z ]*PRIVATE KEY-----|APP_KE""Y=[\"']?[^[:space:]\"']"
r1=$(printf '%s\n' "$lines" | grep -E -e "$KEY_RE" 2>/dev/null | cut -f1 | sort -u)

# --- Regla 2: correo fuera de example.com/org/net y github.com ------------------
EMAIL_RE='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
r2=""
while IFS= read -r l; do
  [ -n "$l" ] || continue
  f=${l%%"$TAB"*}
  body=${l#*"$TAB"}
  for e in $(printf '%s\n' "$body" | grep -oE -e "$EMAIL_RE" 2>/dev/null); do
    dom=$(printf '%s' "${e##*@}" | tr 'A-Z' 'a-z')
    case "$dom" in
      example.com | example.org | example.net | github.com) ;;
      *)
        r2="$r2"$'\n'"$f"
        break
        ;;
    esac
  done
done <<EOF
$(printf '%s\n' "$lines" | grep -E -e "$EMAIL_RE" 2>/dev/null)
EOF
r2=$(printf '%s\n' "$r2" | sort -u)

# --- Regla 3: archivo .env que entraría en el commit -----------------------------
r3=""
while IFS= read -r f; do
  [ -n "$f" ] || continue
  [ "${f##*/}" = ".env" ] && r3="$r3"$'\n'"$f"
done <<EOF
$files
EOF
r3=$(printf '%s\n' "$r3" | sort -u)

# --- Resultado -------------------------------------------------------------------
found=0

log() {
  mkdir -p "$(dirname "$LOG_REL")" 2>/dev/null
  [ -f "$LOG_REL" ] || printf '# Registro de bloqueos de datos que no salen\n' >"$LOG_REL"
  printf -- '- %s BLOQUEADO regla %s (%s) %s\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" "$2" "$3" >>"$LOG_REL"
}

block() { # $1 nº de regla, $2 descripción, $3 lista de archivos (uno por línea)
  while IFS= read -r f; do
    [ -n "$f" ] || continue
    found=1
    printf 'datos-que-no-salen: commit BLOQUEADO. Regla %s (%s) en %s. Sustituye el dato por uno inventado antes de hacer commit.\n' \
      "$1" "$2" "$f" >&2
    log "$1" "$2" "$f"
  done <<EOF
$3
EOF
}

block 1 "clave con forma reconocible" "$r1"
block 2 "correo fuera de los dominios de ejemplo" "$r2"
block 3 "archivo .env" "$r3"

[ "$found" -eq 1 ] && exit 2
exit 0
