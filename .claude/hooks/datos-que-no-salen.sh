#!/usr/bin/env bash
# datos-que-no-salen: hook PreToolUse (matcher Bash) de Claude Code.
#
# Antes de un `git commit`, revisa las líneas que van a entrar al repositorio y
# bloquea el comando (exit 2) si encuentra alguna de estas tres cosas:
#   1. una clave con forma reconocible (AWS, Anthropic, GitHub, Google, Slack,
#      clave privada PEM o una línea APP_KEY con valor);
#   2. un correo cuyo dominio no sea example.com, example.org, example.net ni
#      github.com;
#   3. un fichero llamado exactamente `.env` (los `.env.example` no cuentan).
#
# Qué mira: el diff preparado (`git diff --cached`). Si el mismo comando hace
# `git add`, además los cambios sin preparar y los ficheros nuevos sin
# seguimiento (con `git commit -a`, solo los cambios sin preparar). Con
# `git add -f`, también los `.env` ignorados que el comando fuerza.
#
# Cada bloqueo añade una línea a docs/seguridad/registro-de-bloqueos.md con la
# fecha en UTC, BLOQUEADO, la regla y el archivo. Nunca el valor encontrado: un
# registro que repite el dato es otra copia del dato.
# Si no encuentra nada, sale con 0 y no escribe nada.

set -uo pipefail

entrada=$(cat)
comando=$(jq -r '.tool_input.command // empty' <<<"$entrada")
dir=$(jq -r '.cwd // empty' <<<"$entrada")

# ¿El comando invoca `git <subcomando>`? Admite opciones globales (git -C x commit).
invoca_git() {
  grep -Eq "(^|[^[:alnum:]_-])git([[:space:]]+-[^[:space:]]+([[:space:]]+[^-[:space:]][^[:space:]]*)?)*[[:space:]]+$1([[:space:]]|\$)" <<<"$comando"
}
# ¿Lleva `git add -f`/`--force`, o `git commit -a`/`--all`?
con_opcion() { # $1 = subcomando, $2 = letra corta, $3 = opción larga
  grep -Eq "git[^;&|]*[[:space:]]$1([[:space:]]+[^[:space:];&|]+)*[[:space:]]+(-[[:alpha:]]*$2[[:alpha:]]*|--$3)([[:space:]]|\$)" <<<"$comando"
}

invoca_git commit || exit 0

raiz=$(git -C "${dir:-${CLAUDE_PROJECT_DIR:-.}}" rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$raiz" || exit 0

CLAVES=(
  -e 'AKIA[0-9A-Z]{16}'
  -e 'sk-ant-[A-Za-z0-9_-]{20,}'
  -e 'ghp_[A-Za-z0-9]{36}'
  -e 'github_pat_[A-Za-z0-9_]{22,}'
  -e 'AIza[0-9A-Za-z_-]{35}'
  -e 'xox[bpa]-[A-Za-z0-9-]{10,}'
  -e '-----BEGIN[ A-Z]*PRIVATE KEY-----'
  -e "^[[:space:]]*(export[[:space:]]+)?APP_KEY=[\"']?[^[:space:]\"'#]"
)
CORREO='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
DOMINIOS_OK='@(example\.(com|org|net)|github\.com)$'

hallazgos=$(mktemp) || exit 0
trap 'rm -f "$hallazgos"' EXIT

g() { git -c core.quotePath=false "$@"; }
anota() { printf '%s\t%s\n' "$1" "$2" >>"$hallazgos"; } # regla, archivo

# Regla 3, sobre el nombre del archivo.
revisa_nombre() {
  if [ "${1##*/}" = ".env" ]; then anota "regla 3 (fichero .env)" "$1"; fi
}
# Reglas 1 y 2, sobre las líneas que entran de un archivo (por la entrada estándar).
revisa_lineas() {
  local lineas n
  lineas=$(cat)
  [ -n "$lineas" ] || return 0
  if grep -Eq "${CLAVES[@]}" <<<"$lineas"; then
    anota "regla 1 (clave con forma reconocible)" "$1"
  fi
  n=$(grep -Eo "$CORREO" <<<"$lineas" | grep -Eivc "$DOMINIOS_OK")
  if [ "${n:-0}" -gt 0 ]; then anota "regla 2 (correo de una persona)" "$1"; fi
}
# Líneas añadidas de un diff -U0 de un solo archivo.
lineas_nuevas() { awk '/^@@/ { h = 1; next } h && /^\+/ { print substr($0, 2) }'; }
# Con `git add -f`, un `.env` ignorado solo entra si el comando lo nombra (por su
# ruta, por su carpeta o como `.env` a secas) o si el add es general (-A, ., :/, *).
# Con `.env` a secas no se sabe cuál es, y cuentan todos.
escapa() { sed 's/[][\.*^$+?(){}|]/\\&/g' <<<"$1"; }
add_nombra() { # $1 = ruta de un .env ignorado
  local ruta carpeta
  ruta=$(escapa "$1")
  carpeta=$(escapa "${1%/.env}")
  grep -Eq "(^|[[:space:]\"'=])(\./)?($ruta|$carpeta/?|\.env)([[:space:]\"';&|)]|\$)" <<<"$comando" ||
    con_opcion add A all ||
    grep -Eq "git[^;&|]*[[:space:]]add([[:space:]]+[^[:space:];&|]+)*[[:space:]]+(\.|\./|:/|\*)([[:space:];&|]|\$)" <<<"$comando"
}
# Un archivo entero entra como líneas nuevas (si es de texto).
revisa_entero() {
  revisa_nombre "$1"
  if [ -f "$1" ] && grep -Iq . "$1"; then revisa_lineas "$1" <"$1"; fi
}

# Lo preparado.
while IFS= read -r f; do
  revisa_nombre "$f"
  g diff --cached -U0 --no-color --no-ext-diff -- "$f" | lineas_nuevas | revisa_lineas "$f"
done < <(g diff --cached --name-only --diff-filter=d)

# Lo que el mismo comando va a preparar.
if invoca_git add || con_opcion commit a all; then
  while IFS= read -r f; do
    revisa_nombre "$f"
    g diff -U0 --no-color --no-ext-diff -- "$f" | lineas_nuevas | revisa_lineas "$f"
  done < <(g diff --name-only --diff-filter=d)
fi
if invoca_git add; then
  while IFS= read -r f; do revisa_entero "$f"; done < <(g ls-files --others --exclude-standard)
fi
if con_opcion add f force; then
  while IFS= read -r f; do
    if add_nombra "$f"; then revisa_entero "$f"; fi
  done < <(g ls-files --others --ignored --exclude-standard -- ':(glob)**/.env')
fi

[ -s "$hallazgos" ] || exit 0

registro="docs/seguridad/registro-de-bloqueos.md"
mkdir -p "${registro%/*}"
[ -f "$registro" ] || echo "# Registro de bloqueos del hook datos-que-no-salen" >"$registro"
fecha=$(date -u +%Y-%m-%dT%H:%M:%SZ)

{
  echo "datos-que-no-salen: commit bloqueado."
  sort -u "$hallazgos" | while IFS=$'\t' read -r regla archivo; do
    echo "  - $regla en $archivo"
    echo "- $fecha BLOQUEADO $regla en \`$archivo\`" >>"$registro"
  done
  echo "Sustituye el dato por uno inventado (un correo de example.com, una clave falsa sin la forma real, el .env fuera del commit) y vuelve a intentarlo."
  echo "No desactives ni esquives este hook. El bloqueo ya está en $registro: commitéalo con el resto."
} >&2
exit 2
