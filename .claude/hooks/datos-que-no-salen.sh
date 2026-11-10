#!/usr/bin/env bash
# Hook PreToolUse (Bash) de Claude Code: frena un `git commit` que incorpore una
# clave con forma reconocible, un correo con dominio real o un archivo .env.
# Nunca imprime ni registra el valor detectado: solo la regla y el archivo.
set -uo pipefail
export LC_ALL=C   # rangos [A-Z] literales en las regex

cmd=$(jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0
[[ $cmd == *"git commit"* ]] || exit 0

raiz=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}
cd "$raiz" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

con_add=0
[[ $cmd == *"git add"* ]] && con_add=1

# Patrones partidos con '' para que este mismo archivo no se bloquee al commitearlo.
re_aws='AKIA[0-9A-Z]{16}'
re_anthropic='sk-''ant-'
re_github='gh''p_|github''_pat_'
re_google='AIza[0-9A-Za-z_-]{35}'
re_slack='xox[bpa]-'
re_privada='-----BEGIN[A-Z ]*PRIVATE KEY-----'
re_appkey="^[[:space:]]*(export[[:space:]]+)?APP_KEY[[:space:]]*=[[:space:]]*[\"']?[^[:space:]#\"']"
re_correo='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'

declare -A visto=()
hallazgos=()
anotar() {   # $1 regla, $2 archivo; sin duplicados
  local k="$1"$'\t'"$2"
  [[ -n ${visto[$k]:-} ]] && return
  visto[$k]=1
  hallazgos+=("$k")
}

revisar_linea() {   # $1 archivo, $2 línea añadida
  local f=$1 l=$2 resto m dom
  [[ $l =~ $re_aws ]]       && anotar "clave de AWS" "$f"
  [[ $l =~ $re_anthropic ]] && anotar "clave de Anthropic" "$f"
  [[ $l =~ $re_github ]]    && anotar "token de GitHub" "$f"
  [[ $l =~ $re_google ]]    && anotar "clave de Google" "$f"
  [[ $l =~ $re_slack ]]     && anotar "token de Slack" "$f"
  [[ $l =~ $re_privada ]]   && anotar "clave privada (bloque PEM)" "$f"
  [[ $l =~ $re_appkey ]]    && anotar "APP_KEY con valor" "$f"
  resto=$l
  while [[ $resto =~ $re_correo ]]; do
    m=${BASH_REMATCH[0]}
    dom=${m#*@}; dom=${dom,,}
    case $dom in
      example.com|example.org|example.net|github.com) ;;
      *) anotar "correo con dominio no permitido" "$f"; break ;;
    esac
    resto=${resto#*"$m"}
  done
}

lineas_anadidas() {   # emite "archivo<TAB>línea" por cada línea añadida del diff
  git -c core.quotePath=false diff --no-color --no-ext-diff -U0 "$@" |
    awk '/^\+\+\+ /{ f=substr($0,5); sub(/^b\//,"",f); next }
         /^\+/     { if (f != "/dev/null") print f "\t" substr($0,2) }'
}

contenido_sin_seguimiento() {   # archivos nuevos de texto, enteros
  local f
  while IFS= read -r -d '' f; do
    [[ -f $f ]] && grep -Iq . "$f" 2>/dev/null || continue
    awk -v f="$f" '{ print f "\t" $0 }' "$f"
  done < <(git ls-files -z --others --exclude-standard)
}

# Reglas 1 y 2: contenido añadido.
while IFS=$'\t' read -r f l; do
  revisar_linea "$f" "$l"
done < <(
  lineas_anadidas --cached
  if ((con_add)); then lineas_anadidas; contenido_sin_seguimiento; fi
)

# Regla 3: un archivo llamado exactamente .env entre los que entran al commit.
while IFS= read -r -d '' f; do
  [[ ${f##*/} == .env ]] && anotar "archivo .env" "$f"
done < <(
  git diff --cached --name-only -z --diff-filter=d
  if ((con_add)); then
    git diff --name-only -z --diff-filter=d
    git ls-files -z --others --exclude-standard
  fi
)

((${#hallazgos[@]})) || exit 0

registro=docs/seguridad/registro-de-bloqueos.md
mkdir -p "${registro%/*}"
[[ -f $registro ]] || echo '# Registro de bloqueos del hook datos-que-no-salen' > "$registro"
ahora=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "Commit bloqueado por .claude/hooks/datos-que-no-salen.sh:" >&2
for h in "${hallazgos[@]}"; do
  regla=${h%%$'\t'*}; archivo=${h#*$'\t'}
  echo "- regla: $regla; archivo: $archivo. Sustituye el dato por uno inventado (p. ej. un correo @example.com o una variable vacía en .env.example) y vuelve a intentarlo." >&2
  echo "- $ahora BLOQUEADO regla: $regla; archivo: $archivo" >> "$registro"
done
exit 2
