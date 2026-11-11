#!/usr/bin/env bash
# datos-que-no-salen: hook PreToolUse (matcher Bash) de Claude Code.
#
# Solo actúa si el comando contiene `git commit`. Entonces mira las líneas
# añadidas de lo que va a entrar en el commit y aplica tres reglas:
#   1. secretos con forma reconocible
#   2. correos cuyo dominio no es example.com/.org/.net ni github.com
#   3. un fichero llamado exactamente .env
# Si salta alguna, sale con 2 (Claude Code no ejecuta el comando), explica por
# stderr qué regla y en qué archivo, y añade una línea al registro. Nunca
# escribe el valor encontrado.
#
# Los prefijos de la regla 1 se escriben con una clase de un solo carácter
# (A[K]IA, g[h]p_...) para que el propio script no contenga el literal que
# busca y no se bloquee a sí mismo al commitearlo. La regex es equivalente.

set -uo pipefail
export LC_ALL=C

REGISTRO_REL='docs/seguridad/registro-de-bloqueos.md'
CABECERA='# Registro de bloqueos del hook datos-que-no-salen'

RE_SECRETOS=(
  'A[K]IA[0-9A-Z]{16}'
  's[k]-ant-'
  'g[h]p_'
  'gith[u]b_pat_'
  'A[I]za[0-9A-Za-z_-]{35}'
  'x[o]x[bpa]-'
  '-{5}BEGIN ([A-Z0-9]+ )*PRIVATE KEY-{5}'
  '^[[:space:]]*(export[[:space:]]+)?APP_KEY[[:space:]]*=[[:space:]]*["'"'"']?[^[:space:]"'"'"'#]'
)
RE_CORREO='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
DOMINIOS_PERMITIDOS=' example.com example.org example.net github.com '

aviso() { printf 'datos-que-no-salen: %s\n' "$*" >&2; }

# Ante un fallo técnico con un commit de por medio, se bloquea: un hook que
# falla en silencio deja pasar justo lo que tenía que parar.
bloquear_por_fallo() {
  aviso "BLOQUEADO: $1. No se ha podido inspeccionar el commit, así que no se deja pasar."
  aviso "Corrige el problema y repite la operación. No desactives ni eludas este hook."
  exit 2
}

entrada=$(cat)

if ! command -v jq >/dev/null 2>&1; then
  case "$entrada" in
    *"git commit"*) bloquear_por_fallo 'jq no está instalado' ;;
    *) exit 0 ;;
  esac
fi

if ! comando=$(printf '%s' "$entrada" | jq -r '.tool_input.command // empty' 2>/dev/null); then
  case "$entrada" in
    *"git commit"*) bloquear_por_fallo 'no se pudo leer el JSON de entrada' ;;
    *) exit 0 ;;
  esac
fi

case "$comando" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

raiz=$(git -C "${CLAUDE_PROJECT_DIR:-.}" rev-parse --show-toplevel 2>/dev/null) \
  || bloquear_por_fallo 'no se encontró el repositorio Git'
cd "$raiz" || bloquear_por_fallo "no se pudo entrar en $raiz"

# Qué mirar además del índice. Con `git add` en el mismo comando entran también
# los cambios sin preparar y los archivos nuevos sin seguimiento. Con
# `git commit -a`/`--all` entran los cambios sin preparar de lo ya versionado.
incluir_sin_preparar=0
incluir_nuevos=0
incluir_ignorados=0
case "$comando" in
  *"git add"*) incluir_sin_preparar=1; incluir_nuevos=1 ;;
esac
# `git add -f`/`--force` puede meter archivos ignorados, como un .env.
if printf '%s\n' "$comando" | grep -Eq 'git add([^;&|]*[[:space:]])(-[A-Za-z]*f[A-Za-z]*|--force)([[:space:]]|$)'; then
  incluir_ignorados=1
fi
if printf '%s\n' "$comando" | grep -Eq 'git commit([^;&|]*[[:space:]])(-[A-Za-z]*a[A-Za-z]*|--all)([[:space:]]|$)'; then
  incluir_sin_preparar=1
fi

trabajo=$(mktemp -d "${TMPDIR:-/tmp}/datos-que-no-salen.XXXXXX") \
  || bloquear_por_fallo 'no se pudo crear un directorio temporal'
trap 'rm -rf "$trabajo"' EXIT

hallazgos="$trabajo/hallazgos"
: >"$hallazgos"

anotar() { printf '%s\t%s\n' "$1" "$2" >>"$hallazgos"; }

# Aplica las reglas 1 y 2 a las líneas añadidas de un archivo ($2).
revisar_lineas() {
  local archivo=$1 lineas=$2 re dominio
  [ -s "$lineas" ] || return 0

  for re in "${RE_SECRETOS[@]}"; do
    if grep -Eq -e "$re" "$lineas"; then
      anotar 'REGLA 1 (secreto reconocible)' "$archivo"
      break
    fi
  done

  while IFS= read -r dominio; do
    case "$DOMINIOS_PERMITIDOS" in
      *" $dominio "*) ;;
      *) anotar 'REGLA 2 (correo de dominio no permitido)' "$archivo"; break ;;
    esac
  done < <(grep -Eo -e "$RE_CORREO" "$lineas" | sed 's/.*@//' | tr '[:upper:]' '[:lower:]' | sort -u)
}

revisar_nombre() {
  case "$1" in
    .env | */.env) anotar 'REGLA 3 (fichero .env)' "$1" ;;
  esac
}

# Líneas añadidas de un diff, sin las cabeceras `+++` y sin el `+` inicial.
lineas_anadidas() { grep -E '^\+' | grep -Ev '^\+\+\+ ' | sed 's/^+//'; }

# $1 = --cached o vacío (cambios sin preparar)
revisar_diff() {
  local modo=$1 lista="$trabajo/lista$1" f
  git diff $modo --name-only -z --no-renames --diff-filter=ACMRT >"$lista" \
    || bloquear_por_fallo "falló git diff $modo"
  while IFS= read -r -d '' f; do
    revisar_nombre "$f"
    git diff $modo --no-color --no-ext-diff --no-renames -U0 -- "$f" >"$trabajo/diff" \
      || bloquear_por_fallo "falló git diff $modo sobre un archivo"
    lineas_anadidas <"$trabajo/diff" >"$trabajo/lineas"
    revisar_lineas "$f" "$trabajo/lineas"
  done <"$lista"
}

revisar_diff --cached
[ "$incluir_sin_preparar" -eq 1 ] && revisar_diff ''

if [ "$incluir_nuevos" -eq 1 ]; then
  git ls-files --others --exclude-standard -z >"$trabajo/nuevos" \
    || bloquear_por_fallo 'falló git ls-files'
  while IFS= read -r -d '' f; do
    revisar_nombre "$f"
    # -I salta binarios; un archivo nuevo entra entero, todo son líneas añadidas.
    if [ -f "$f" ] && grep -Iq '' "$f" 2>/dev/null; then
      revisar_lineas "$f" "$f"
    fi
  done <"$trabajo/nuevos"
fi

if [ "$incluir_ignorados" -eq 1 ]; then
  git ls-files --others --ignored --exclude-standard --directory -z >"$trabajo/ignorados" \
    || bloquear_por_fallo 'falló git ls-files'
  while IFS= read -r -d '' f; do
    revisar_nombre "$f"
  done <"$trabajo/ignorados"
fi

[ -s "$hallazgos" ] || exit 0

fecha=$(date -u +%Y-%m-%dT%H:%M:%SZ) || fecha='FECHA-NO-DISPONIBLE'
registro="$raiz/$REGISTRO_REL"
registro_ok=1
mkdir -p "$(dirname "$registro")" 2>/dev/null || registro_ok=0
if [ "$registro_ok" -eq 1 ] && [ ! -s "$registro" ]; then
  printf '%s\n' "$CABECERA" >"$registro" 2>/dev/null || registro_ok=0
fi

sort -u "$hallazgos" | while IFS=$'\t' read -r regla archivo; do
  aviso "BLOQUEADO por $regla en '$archivo'."
  if [ "$registro_ok" -eq 1 ]; then
    printf '%s | BLOQUEADO | %s | %s\n' "$fecha" "$regla" "$archivo" >>"$registro" 2>/dev/null \
      || aviso "no se pudo escribir en $REGISTRO_REL"
  fi
done
[ "$registro_ok" -eq 1 ] || aviso "no se pudo escribir en $REGISTRO_REL"

aviso 'Sustituye el dato por uno inventado y válido (por ejemplo, un correo de example.com o un valor de ejemplo), o saca el archivo del commit, y repite la operación.'
aviso 'No desactives ni eludas este hook. El registro de bloqueos se commitea con el resto.'
exit 2
