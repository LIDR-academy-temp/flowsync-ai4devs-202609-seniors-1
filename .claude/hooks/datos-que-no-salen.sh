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
root=$(git -C "${cwd:-${CLAUDE_PROJECT_DIR:-.}}" rev-parse --show-toplevel 2>/dev/null) || exit 0
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

# Convierte un diff en líneas añadidas prefijadas con su archivo.
added_lines() {
  awk '
    /^diff --git / { header = 1; next }
    header && /^\+\+\+ / { file = substr($0, 5); sub(/\t$/, "", file); header = 0; next }
    /^@@/ { header = 0; next }
    !header && /^\+/ { print file "\t" substr($0, 2) }
  '
}

git diff --cached --no-color --no-ext-diff --no-prefix -U0 --diff-filter=d | added_lines >>"$lines"
git diff --cached --name-only --diff-filter=d >>"$files"

# Con `git add` en el mismo comando, lo que aún no está en el índice también
# va a entrar: los cambios sin preparar y los archivos nuevos sin seguimiento.
case "$cmd" in
  *"git add"*)
    git diff --no-color --no-ext-diff --no-prefix -U0 --diff-filter=d | added_lines >>"$lines"
    git diff --name-only --diff-filter=d >>"$files"
    while IFS= read -r -d '' f; do
      printf '%s\n' "$f" >>"$files"
      if grep -Iq . "$f" 2>/dev/null; then
        awk -v f="$f" '{ print f "\t" $0 }' "$f" >>"$lines"
      fi
    done < <(git ls-files --others --exclude-standard -z)
    ;;
esac

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
