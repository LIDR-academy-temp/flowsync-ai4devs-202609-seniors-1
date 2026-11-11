#!/usr/bin/env bash
# Hook PreToolUse (Bash): bloquea un `git commit` que lleve una clave reconocible,
# un correo real o un archivo .env. Nunca imprime ni registra el valor detectado:
# solo la regla y el archivo.
set -uo pipefail

cmd=$(jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0
case "$cmd" in *"git commit"*) ;; *) exit 0 ;; esac

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

con_add=0
case "$cmd" in *"git add"*) con_add=1 ;; esac

# Los patrones van partidos en trozos ("AK""IA"...) para que este mismo archivo
# no active las reglas cuando se commitea.
p_claves="AK""IA[0-9A-Z]{16}|sk""-ant-|gh""p_|github""_pat_|AI""za[0-9A-Za-z_-]{35}|xox""[bpa]-"
p_claves+="|-----BEGIN [A-Z ]*PRIVATE ""KEY-----|APP""_KEY=[\"']?[^[:space:]\"']"
p_correo='[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}'

declare -A hallazgos=()

# $1 = archivo; el texto que se va a commitear llega por stdin.
revisa() {
  local f="$1" texto m dom
  texto=$(cat)
  [ -n "$texto" ] || return 0
  if grep -qE -- "$p_claves" <<<"$texto"; then
    hallazgos["clave con forma reconocible|$f"]=1
  fi
  while IFS= read -r m; do
    dom=$(tr '[:upper:]' '[:lower:]' <<<"${m##*@}")
    case "$dom" in
      example.com | example.org | example.net | github.com) ;;
      *) hallazgos["correo con dominio real|$f"]=1 ;;
    esac
  done < <(grep -oE -- "$p_correo" <<<"$texto")
}

# Solo las líneas añadidas del diff de un archivo (se salta la cabecera hasta el primer @@).
anadidas() {
  git -c core.quotepath=false diff "$@" --no-color --no-ext-diff -U0 2>/dev/null |
    awk '/^@@/ { h = 1; next } h && /^\+/ { print substr($0, 2) }'
}

es_env() { [ "$(basename -- "$1")" = ".env" ] && hallazgos["archivo .env|$1"]=1; return 0; }

readarray -d '' preparados < <(git diff --cached --name-only --diff-filter=ACMRT -z 2>/dev/null)
for f in "${preparados[@]}"; do
  es_env "$f"
  revisa "$f" < <(anadidas --cached -- "$f")
done

if [ "$con_add" -eq 1 ]; then
  readarray -d '' sin_preparar < <(git diff --name-only --diff-filter=ACMRT -z 2>/dev/null)
  for f in "${sin_preparar[@]}"; do
    es_env "$f"
    revisa "$f" < <(anadidas -- "$f")
  done
  readarray -d '' nuevos < <(git ls-files --others --exclude-standard -z 2>/dev/null)
  for f in "${nuevos[@]}"; do
    es_env "$f"
    # grep -I descarta los binarios.
    [ -f "$f" ] && revisa "$f" < <(grep -I '' -- "$f" 2>/dev/null)
  done
fi

[ "${#hallazgos[@]}" -eq 0 ] && exit 0

registro="docs/seguridad/registro-de-bloqueos.md"
mkdir -p "$(dirname -- "$registro")"
[ -f "$registro" ] || printf '# Registro de bloqueos del hook datos-que-no-salen\n' >"$registro"
ahora=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "Commit bloqueado por .claude/hooks/datos-que-no-salen.sh:" >&2
while IFS= read -r k; do
  regla="${k%%|*}"
  f="${k#*|}"
  echo "  - regla: $regla · archivo: $f" >&2
  echo "- $ahora BLOQUEADO regla: $regla · archivo: $f" >>"$registro"
done < <(printf '%s\n' "${!hallazgos[@]}" | sort)
echo "Sustituye el dato por uno inventado que cumpla las reglas y vuelve a intentarlo. No desactives ni te saltes este hook." >&2
exit 2
