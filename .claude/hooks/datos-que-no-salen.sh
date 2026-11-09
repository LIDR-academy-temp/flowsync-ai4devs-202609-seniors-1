#!/usr/bin/env bash
# PreToolUse (Bash): impide que un `git commit` arrastre datos que no deben salir
# del equipo. Tres reglas, y solo tres:
#   1. secretos (claves de proveedor, claves privadas, APP_KEY con valor)
#   2. correos cuyo dominio no sea example.com/.org/.net ni github.com
#   3. ficheros llamados exactamente `.env` (`.env.example` NO se bloquea)
# Exit 2 = bloquea la llamada. Nunca imprime ni registra el valor detectado.
#
# Los patrones usan corchetes (`sk-[a]nt-`) para que este fichero no se
# detecte a sí mismo al commitearlo.
set -uo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0
[ -n "$cmd" ] || exit 0

printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+commit' || exit 0

root=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}
[ -n "$root" ] && cd "$root" 2>/dev/null || exit 0

with_add=0
printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+add' && with_add=1

SECRET_RE='AKIA[0-9A-Z]{16}|sk-[a]nt-|gh[p]_|github_pa[t]_|AIza[0-9A-Za-z_-]{35}|xox[b]-|xox[p]-|xox[a]-|BEGIN [A-Z ]*PRIVATE KEY'
APPKEY_RE="APP_[K]EY=[[:space:]]*[\"']?[^[:space:]\"']"
EMAIL_RE='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
ALLOWED_DOMAINS_RE='example\.(com|org|net)|github\.com'

HITS=()
hit() { HITS+=("$1|$2"); }

# Reglas 1 y 2 sobre las líneas añadidas que llegan por stdin.
check_text() {
  local path=$1 content
  content=$(cat)
  [ -n "$content" ] || return 0
  if printf '%s\n' "$content" | grep -Eq "$SECRET_RE|$APPKEY_RE"; then
    hit 1 "$path"
  fi
  local bad
  bad=$(printf '%s\n' "$content" | grep -oE "$EMAIL_RE" | sed 's/.*@//' | tr 'A-Z' 'a-z' | grep -vxE "$ALLOWED_DOMAINS_RE")
  [ -z "$bad" ] || hit 2 "$path"
}

check_name() { [ "${1##*/}" = ".env" ] && hit 3 "$1"; return 0; }

# Líneas añadidas de un `git diff <args>`, fichero a fichero.
scan_diff() {
  local f
  while IFS= read -r -d '' f; do
    check_name "$f"
    # check_text va como comando simple con la entrada redirigida (no al final de
    # un pipeline) para que corra en este shell y conserve HITS.
    check_text "$f" < <(
      git diff "$@" --no-color --no-ext-diff -U0 -- "$f" \
        | sed -n '/^@@/,$p' | grep '^+' | sed 's/^+//'
    )
  done < <(git diff "$@" --name-only -z --diff-filter=ACMR 2>/dev/null)
}

scan_diff --cached

if [ "$with_add" -eq 1 ]; then
  scan_diff
  while IFS= read -r -d '' f; do
    check_name "$f"
    [ -f "$f" ] || continue
    check_text "$f" < <(head -c 1048576 "$f" | grep -I '')
  done < <(git ls-files --others --exclude-standard -z 2>/dev/null)

  # `git add -f ruta/.env` fuerza un fichero ignorado, que ls-files no lista.
  set -f
  for tok in $cmd; do
    tok=${tok//[\"\']/}
    [ -e "$tok" ] && check_name "$tok"
  done
  set +f
fi

[ "${#HITS[@]}" -gt 0 ] || exit 0

rule_name() {
  case $1 in
    1) echo "secretos" ;;
    2) echo "correos fuera de example.com/.org/.net y github.com" ;;
    3) echo "fichero .env" ;;
  esac
}

log="docs/seguridad/registro-de-bloqueos.md"
mkdir -p "$(dirname "$log")" 2>/dev/null
[ -f "$log" ] || printf '# Registro de bloqueos de datos que no salen\n' > "$log" 2>/dev/null
ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)

while IFS='|' read -r rule path; do
  echo "BLOQUEADO (datos-que-no-salen): regla $rule, $(rule_name "$rule"), en '$path'. Sustituye el dato por uno inventado (p. ej. usuario@example.com o un valor ficticio) y vuelve a intentarlo." >&2
  printf -- '- %s BLOQUEADO regla=%s (%s) ruta=%s\n' "$ts" "$rule" "$(rule_name "$rule")" "$path" >> "$log" 2>/dev/null
done < <(printf '%s\n' "${HITS[@]}" | sort -u)

exit 2
