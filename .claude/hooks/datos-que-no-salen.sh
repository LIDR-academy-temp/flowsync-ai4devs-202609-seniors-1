#!/usr/bin/env bash
# Hook PreToolUse (matcher Bash): bloquea `git commit` si lo que entra al commit
# contiene secretos, correos fuera de la lista permitida o archivos .env.
# Nunca imprime ni registra el valor detectado: solo regla y archivo.
set -uo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0
[ -n "$cmd" ] || exit 0

# Sin `git commit` en el comando: salida silenciosa.
printf '%s' "$cmd" | grep -qE 'git[[:space:]]+(-C[[:space:]]+[^[:space:]]+[[:space:]]+)?commit' || exit 0

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
cd "$(git rev-parse --show-toplevel)" || exit 0

# ¿El mismo comando prepara archivos? (`git add ...` o `commit -a`)
incluye_add=0
printf '%s' "$cmd" | grep -qE 'git[[:space:]]+(-C[[:space:]]+[^[:space:]]+[[:space:]]+)?add' && incluye_add=1
printf '%s' "$cmd" | grep -qE 'commit([[:space:]]+[^[:space:]]+)*[[:space:]]+(-[a-zA-Z]*a[a-zA-Z]*|--all)([[:space:]]|$)' && incluye_add=1

tmp=$(mktemp -d) || exit 0
trap 'rm -rf "$tmp"' EXIT
lineas="$tmp/lineas"   # formato: archivo<TAB>línea añadida
nombres="$tmp/nombres" # archivos que entrarían al commit
: >"$lineas"
: >"$nombres"

# Líneas añadidas de un diff -> "archivo<TAB>contenido"
extrae_diff() {
  awk '/^\+\+\+ /{ f=substr($0,7); next } /^\+/{ print f "\t" substr($0,2) }'
}

# 1) Lo ya preparado
git -c core.quotepath=off diff --cached -U0 --no-color --diff-filter=ACMR | extrae_diff >>"$lineas"
git -c core.quotepath=off diff --cached --name-only --diff-filter=ACMR >>"$nombres"

# 2) Si el comando también prepara archivos: no preparados y sin seguimiento
if [ "$incluye_add" -eq 1 ]; then
  git -c core.quotepath=off diff -U0 --no-color --diff-filter=ACMR | extrae_diff >>"$lineas"
  git -c core.quotepath=off diff --name-only --diff-filter=ACMR >>"$nombres"
  while IFS= read -r f; do
    [ -f "$f" ] || continue
    printf '%s\n' "$f" >>"$nombres"
    grep -qI . "$f" 2>/dev/null || continue # omite binarios
    head -c 1048576 "$f" | awk -v f="$f" '{ print f "\t" $0 }' >>"$lineas"
  done < <(git -c core.quotepath=off ls-files --others --exclude-standard)

  # `git add -f .env` nombrado explícitamente (los ignorados no salen en ls-files)
  for tok in $cmd; do
    tok=${tok//[\"\']/}
    [ "$(basename -- "$tok")" = ".env" ] && [ -f "$tok" ] && printf '%s\n' "$tok" >>"$nombres"
  done
fi

violaciones="$tmp/violaciones" # formato: REGLA<TAB>archivo
: >"$violaciones"
tab=$'\t'

# Regla 1: SECRETOS (los prefijos se parten en el código para que este
# archivo no se detecte a sí mismo).
re='AKIA[0-9A-Z]{16}'
re+='|sk-a''nt-'
re+='|gh''p_'
re+='|github''_pat_'
re+='|AIza[0-9A-Za-z_-]{35}'
re+='|xox[bpa]-'
re+='|BEGIN( [A-Z]+)? PRIVATE'' KEY'
re+="|${tab}[[:space:]]*(export[[:space:]]+)?APP_KEY=[\"']?[^[:space:]\"']"
grep -E -- "$re" "$lineas" | cut -f1 | sort -u | sed 's/^/SECRETOS\t/' >>"$violaciones"

# Regla 2: CORREOS fuera de example.com / example.org / example.net / github.com
awk -F'\t' '
  {
    c = substr($0, index($0, "\t") + 1)
    while (match(c, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z][A-Za-z]+/)) {
      e = substr(c, RSTART, RLENGTH)
      d = tolower(substr(e, index(e, "@") + 1))
      if (d != "example.com" && d != "example.org" && d != "example.net" && d != "github.com") { print $1; break }
      c = substr(c, RSTART + RLENGTH)
    }
  }' "$lineas" | sort -u | sed 's/^/CORREOS\t/' >>"$violaciones"

# Regla 3: ARCHIVOS .env (exactamente ese nombre; .env.example no)
sort -u "$nombres" | while IFS= read -r f; do
  [ "$(basename -- "$f")" = ".env" ] && printf 'ARCHIVOS .env\t%s\n' "$f"
done >>"$violaciones"

[ -s "$violaciones" ] || exit 0

# Hay infracciones: registrar (sin valores) y avisar por stderr.
registro="docs/seguridad/registro-de-bloqueos.md"
mkdir -p "$(dirname "$registro")"
[ -f "$registro" ] || printf '# Registro de bloqueos del hook datos-que-no-salen\n' >"$registro"
ahora=$(date -u +%Y-%m-%dT%H:%M:%SZ)

sort -u "$violaciones" | while IFS="$tab" read -r regla archivo; do
  printf -- '- %s | BLOQUEADO | %s | %s\n' "$ahora" "$regla" "$archivo" >>"$registro"
  printf 'BLOQUEADO [%s] en %s: sustituye el dato por uno inventado (p. ej. ada@example.com o un valor de relleno claramente falso; los .env no se commitean, usa .env.example) y reintenta. No desactives ni eludas este hook.\n' "$regla" "$archivo" >&2
done
exit 2
