#!/usr/bin/env bash
# Hook PreToolUse (matcher Bash): impide que un `git commit` meta en el repo un
# secreto con forma reconocible, un correo que no sea de un dominio de ejemplo o
# un fichero `.env`.
#
# Solo mira las líneas AÑADIDAS. Si el comando también hace `git add` (o
# `git commit -a`), mira además lo que todavía no está en el índice, porque el
# mismo comando lo va a meter.
#
# Si encuentra algo: sale con 2, explica por stderr qué regla y en qué fichero, y
# apunta el bloqueo en docs/seguridad/registro-de-bloqueos.md. NUNCA escribe el
# valor detectado en ningún sitio: repetirlo sería crear otra copia del dato.
set -uo pipefail

cmd=$(jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0
[[ -n $cmd ]] || exit 0

re_commit='git[[:space:]]+commit'
[[ $cmd =~ $re_commit ]] || exit 0

root=$(git -C "${CLAUDE_PROJECT_DIR:-$PWD}" rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0

# ¿El mismo comando va a meter en el commit cosas que aún no están preparadas?
re_add='git[[:space:]]+add'
re_commit_all='git[[:space:]]+commit[^;&|]*[[:space:]](-[A-Za-z]*a[A-Za-z]*|--all)([[:space:]]|$)'
incluye_sin_preparar=0
if [[ $cmd =~ $re_add || $cmd =~ $re_commit_all ]]; then
  incluye_sin_preparar=1
fi

g() { git -c core.quotePath=false "$@"; }

# Líneas añadidas de un diff unificado, como "fichero<TAB>contenido".
lineas_añadidas() {
  awk '/^\+\+\+ /{ f = substr($0, 5); sub(/^b\//, "", f); next }
       /^\+/     { print f "\t" substr($0, 2) }'
}

# Todo lo que se va a revisar, en el mismo formato.
contenido_a_revisar() {
  g diff --cached -U0 --no-color --no-ext-diff | lineas_añadidas
  if ((incluye_sin_preparar)); then
    g diff -U0 --no-color --no-ext-diff | lineas_añadidas
    while IFS= read -r -d '' f; do
      [[ -f $f ]] && grep -Iq . "$f" 2>/dev/null || continue  # binarios y vacíos fuera
      awk -v f="$f" '{ print f "\t" $0 }' "$f"
    done < <(g ls-files -z --others --exclude-standard)
  fi
}

# Nombres de los ficheros que entrarían en el commit.
ficheros_a_incorporar() {
  g diff --cached --name-only --diff-filter=ACMR -z
  if ((incluye_sin_preparar)); then
    g diff --name-only --diff-filter=ACMR -z
    g ls-files -z --others --exclude-standard
    # `git add -f .env` mete un fichero ignorado que ls-files no enseña: se mira
    # también lo que se nombra después de cada `git add` del comando.
    grep -oE 'git[[:space:]]+add[^;&|]*' <<<"$cmd" | tr -s '[:space:]' '\n' |
      tr -d "\"'" | tr '\n' '\0'
  fi
}

declare -A hallazgos=()
anotar() { hallazgos["$1|$2"]=1; }

# --- Regla 1: claves con forma reconocible -----------------------------------
declare -A claves=(
  ['clave de AWS']='AKIA[0-9A-Z]{16}'
  ['clave de Anthropic']='sk-ant-[A-Za-z0-9_-]{8,}'
  ['token de GitHub']='(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})'
  ['clave de Google']='AIza[0-9A-Za-z_-]{35}'
  ['token de Slack']='xox[bpa]-[A-Za-z0-9-]{10,}'
  ['clave privada']='-----BEGIN ([A-Z0-9]+ )*PRIVATE KEY-----'
)
re_app_key='^[[:space:]]*(export[[:space:]]+)?APP_KEY[[:space:]]*=(.*)$'

# --- Regla 2: correos fuera de los dominios de ejemplo -----------------------
re_correo='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'

while IFS=$'\t' read -r fichero linea; do
  [[ -n $fichero ]] || continue

  for nombre in "${!claves[@]}"; do
    [[ $linea =~ ${claves[$nombre]} ]] && anotar "clave reconocible ($nombre)" "$fichero"
  done

  if [[ $linea =~ $re_app_key ]]; then
    valor=${BASH_REMATCH[2]%%#*}
    valor=${valor//[[:space:]\"\']/}
    [[ -n $valor ]] && anotar 'clave reconocible (APP_KEY con valor)' "$fichero"
  fi

  resto=$linea
  while [[ $resto =~ $re_correo ]]; do
    correo=${BASH_REMATCH[0]}
    dominio=${correo#*@}
    case ${dominio,,} in
      example.com | example.org | example.net | github.com) ;;
      *) anotar 'correo fuera de los dominios de ejemplo' "$fichero" ;;
    esac
    resto=${resto#*"$correo"}
  done
done < <(contenido_a_revisar)

# --- Regla 3: un fichero llamado exactamente .env -----------------------------
while IFS= read -r -d '' f; do
  [[ ${f##*/} == .env ]] && anotar 'fichero .env en el commit' "$f"
done < <(ficheros_a_incorporar)

((${#hallazgos[@]})) || exit 0

# --- Bloqueo -----------------------------------------------------------------
registro=docs/seguridad/registro-de-bloqueos.md
mkdir -p "${registro%/*}"
[[ -f $registro ]] || echo '# Registro de bloqueos del hook datos-que-no-salen' >"$registro"
ahora=$(date -u +%Y-%m-%dT%H:%M:%SZ)

{
  echo 'Commit bloqueado por el hook datos-que-no-salen:'
  for h in "${!hallazgos[@]}"; do
    regla=${h%%|*} fichero=${h#*|}
    echo "  - regla: $regla — fichero: $fichero"
    echo "- $ahora BLOQUEADO regla: $regla — fichero: $fichero" >>"$registro"
  done
  echo 'Sustituye el dato por uno inventado (correos en example.com, claves ficticias'
  echo 'sin la forma real) o saca el fichero del commit, y vuelve a intentarlo.'
} >&2

exit 2
