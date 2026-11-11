#!/usr/bin/env bash
# PreToolUse (Bash): antes de un `git commit`, busca en lo que va a entrar en el
# commit claves con forma reconocible, correos de dominios reales y archivos
# `.env`. Si encuentra algo, bloquea (exit 2) sin repetir nunca el dato: ni en
# la salida de error ni en el registro, solo la regla y el archivo.
#
# Los prefijos de clave van partidos ('sk-a''nt-') o escritos con clases de
# caracteres para que este mismo archivo no se bloquee al commitearse.
set -uo pipefail

input=$(cat)
cmd=$(jq -r '.tool_input.command // empty' <<<"$input")

case "$cmd" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

cwd=$(jq -r '.cwd // empty' <<<"$input")
cwd=${cwd:-${CLAUDE_PROJECT_DIR:-.}}
root=$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null) || exit 0
prefix=$(git -C "$cwd" rev-parse --show-prefix 2>/dev/null)  # cwd respecto a la raíz
cd "$root" || exit 0

tmp=$(mktemp -d) || exit 0
trap 'rm -rf "$tmp"' EXIT
lines="$tmp/lineas"    # archivo<TAB>línea añadida
files="$tmp/archivos"  # archivos que entran en el commit
hits="$tmp/hallazgos"  # regla<TAB>archivo
: >"$lines"
: >"$files"
: >"$hits"
tab=$'\t'

# Rutas sin escapar: con el `core.quotePath` por defecto, una carpeta con tilde
# sale entre comillas y `.env"` ya no se reconoce como `.env`.
g() { git -c core.quotePath=false "$@"; }

# Convierte un diff en líneas añadidas prefijadas con su archivo.
added_lines() {
  awk '
    /^diff --git / { header = 1; next }
    header && /^\+\+\+ / { file = substr($0, 5); sub(/\t$/, "", file); header = 0; next }
    /^@@/ { header = 0; next }
    !header && /^\+/ { print file "\t" substr($0, 2) }
  '
}

# Archivo completo como líneas añadidas, si es de texto.
whole_file() {
  printf '%s\n' "$1" >>"$files"
  if grep -Iq . "$1" 2>/dev/null; then
    awk -v f="$1" '{ print f "\t" $0 }' "$1" >>"$lines"
  fi
}

# Archivos ignorados que un `git add -f` del mismo comando va a forzar al índice
# (sin -f no entran, y `--exclude-standard` los deja fuera). Las rutas son
# relativas al cwd del comando; no se interpretan comillas.
forced_ignored() {
  grep -oE 'git add[^;&|]*' <<<"$cmd" | while read -r -a words; do
    force=0
    paths=()
    for w in "${words[@]:2}"; do
      case "$w" in
        -f | --force) force=1 ;;
        --*) ;;
        -*) [[ $w =~ ^-[A-Za-z]*f ]] && force=1 ;;
        *) paths+=("$prefix$w") ;;
      esac
    done
    if [ "$force" = 1 ] && [ ${#paths[@]} -gt 0 ]; then
      git ls-files -z --others --ignored --exclude-standard -- "${paths[@]}"
    fi
  done
}

with_add=0
case "$cmd" in *"git add"*) with_add=1 ;; esac
# `git commit -a` / `--all` (también agrupado, como `-am`) mete los cambios
# sin preparar de los archivos con seguimiento.
with_all=0
all_re='git[[:space:]]+commit[^;&|]*[[:space:]](-[A-Za-z]*a[A-Za-z]*|--all)([[:space:]]|$)'
[[ $cmd =~ $all_re ]] && with_all=1

g diff --cached --no-color --no-ext-diff --no-prefix -U0 --diff-filter=d | added_lines >>"$lines"
g diff --cached --name-only --diff-filter=d >>"$files"

# Con `git add` o `git commit -a`, lo que aún no está en el índice también va a
# entrar: los cambios sin preparar y, con `git add`, los archivos sin
# seguimiento y los ignorados que fuerce con -f.
if [ "$with_add" = 1 ] || [ "$with_all" = 1 ]; then
  g diff --no-color --no-ext-diff --no-prefix -U0 --diff-filter=d | added_lines >>"$lines"
  g diff --name-only --diff-filter=d >>"$files"
fi
if [ "$with_add" = 1 ]; then
  while IFS= read -r -d '' f; do
    whole_file "$f"
  done < <(git ls-files --others --exclude-standard -z; forced_ignored)
fi

record() { # regla, archivos por la entrada estándar
  sort -u | awk -v r="$1" 'NF { print r "\t" $0 }' >>"$hits"
}

# Regla 1: clave con forma reconocible (AWS, Anthropic, GitHub, Google, Slack,
# clave privada PEM) o una línea APP_KEY con valor.
key_re='AKIA[0-9A-Z]{16}|sk-a''nt-|gh''p_|github''_pat_|AIza[0-9A-Za-z_-]{35}|xox[bpa]-|-----BEGIN ([A-Z]+ )*PRIVATE KEY-----'
appkey_re="[[:space:]]*(export[[:space:]]+)?APP_KEY=[[:space:]]*[\"']?[^[:space:]\"'#]"
grep -E "^[^$tab]*$tab(.*($key_re)|$appkey_re)" "$lines" | cut -f1 | record 'clave'

# Regla 2: correo cuyo dominio no está reservado para ejemplos ni es github.com.
email_re='[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}'
grep -E "^[^$tab]*$tab.*$email_re" "$lines" | while IFS="$tab" read -r f content; do
  if grep -oE "$email_re" <<<"$content" | sed 's/.*@//' | tr '[:upper:]' '[:lower:]' |
    grep -qvxE 'example\.(com|org|net)|github\.com'; then
    printf '%s\n' "$f"
  fi
done | record 'correo real'

# Regla 3: un archivo llamado exactamente `.env`, en cualquier carpeta.
awk -F/ '$NF == ".env"' "$files" | record 'archivo .env'

[ -s "$hits" ] || exit 0

log="docs/seguridad/registro-de-bloqueos.md"
mkdir -p "$(dirname "$log")"
[ -f "$log" ] || echo '# Registro de bloqueos del hook datos-que-no-salen' >"$log"
now=$(date -u +%Y-%m-%dT%H:%M:%SZ)

{
  echo "Commit bloqueado por .claude/hooks/datos-que-no-salen.sh:"
  sort -u "$hits" | while IFS="$tab" read -r rule f; do
    echo "  - regla \"$rule\" en $f"
    printf -- '- %s BLOQUEADO %s %s\n' "$now" "$rule" "$f" >>"$log"
  done
  echo "Sustituye el dato por uno inventado (en correos, un dominio example.com) y vuelve a"
  echo "intentarlo; un archivo .env sácalo del commit con \`git restore --staged <archivo>\`."
} >&2
exit 2
