#!/usr/bin/env bash
# PreToolUse (Bash): bloquea un `git commit` si lo que va a entrar contiene
# datos que no deben salir del repo, y deja constancia en el registro.
# El registro y stderr NUNCA llevan el valor detectado: solo regla y archivo.
set -uo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)
case "$cmd" in *"git commit"*) ;; *) exit 0 ;; esac

cwd=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)
cd "${cwd:-${CLAUDE_PROJECT_DIR:-.}}" 2>/dev/null || exit 0
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0

con_add=0
case "$cmd" in *"git add"*) con_add=1 ;; esac

diff_opts=(-c core.quotepath=off diff -U0 --no-color --no-ext-diff --src-prefix=a/ --dst-prefix=b/)

# Convierte un diff en líneas "archivo<TAB>línea añadida".
lineas_anadidas() {
  awk '
    /^diff --git / { cab = 1; next }
    /^@@/          { cab = 0; next }
    cab && /^\+\+\+ / { p = substr($0, 5); sub(/^b\//, "", p); next }
    !cab && /^\+/  { print p "\t" substr($0, 2) }
  '
}

# Reglas 1 y 2 sobre las líneas añadidas; salida "archivo<TAB>línea".
contenido() {
  git "${diff_opts[@]}" --cached | lineas_anadidas
  if [ "$con_add" -eq 1 ]; then
    git "${diff_opts[@]}" | lineas_anadidas
    git -c core.quotepath=off ls-files --others --exclude-standard -z | while IFS= read -r -d '' f; do
      grep -Iq . "$f" 2>/dev/null || continue
      awk -v p="$f" '{ print p "\t" $0 }' "$f"
    done
  fi
}

# Regla 3: archivos llamados exactamente .env que van a entrar al commit.
archivos() {
  git -c core.quotepath=off diff --cached --name-only --diff-filter=d
  if [ "$con_add" -eq 1 ]; then
    git -c core.quotepath=off diff --name-only --diff-filter=d
    git -c core.quotepath=off ls-files --others --exclude-standard
    # `git add -f ruta/.env` salta el .gitignore: mira también lo que nombra el comando.
    set -f
    for w in $cmd; do
      w=${w//\"/}; w=${w//\'/}
      [ "${w##*/}" = ".env" ] && [ -f "$w" ] && echo "$w"
    done
    set +f
  fi
}

# Los patrones llevan corchetes donde hace falta para que este fichero no se bloquee a sí mismo.
reglas_awk='
  function clave(s) {
    return s ~ /AKIA[0-9A-Z]{16}/ || s ~ /sk-an[t]-/ || s ~ /gh[p]_/ || s ~ /github_pa[t]_/ ||
           s ~ /AIza[0-9A-Za-z_-]{35}/ || s ~ /xox[bpa]-/ ||
           s ~ /-----BEGIN ([A-Z0-9]+ )*PRIVATE KEY-----/ ||
           s ~ /^[[:space:]]*(export[[:space:]]+)?APP_KEY[[:space:]]*=[[:space:]]*["\047]?[^[:space:]"\047#]/
  }
  function correo(s,   e, d) {
    while (match(s, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)) {
      e = substr(s, RSTART, RLENGTH); d = tolower(substr(e, index(e, "@") + 1))
      if (d != "example.com" && d != "example.org" && d != "example.net" && d != "github.com") return 1
      s = substr(s, RSTART + RLENGTH)
    }
    return 0
  }
'

hallazgos=$(
  {
    contenido | awk -F'\t' "$reglas_awk"'
      { l = substr($0, length($1) + 2)
        if (clave(l))  print "clave con forma reconocible\t" $1
        if (correo(l)) print "correo con dominio no permitido\t" $1 }'
    archivos | awk '$0 ~ /(^|\/)\.env$/ { print "archivo .env\t" $0 }'
  } | sort -u
)

[ -z "$hallazgos" ] && exit 0

{
  echo "Commit bloqueado por el hook datos-que-no-salen:"
  printf '%s\n' "$hallazgos" | awk -F'\t' '{ print "  - regla \"" $1 "\" en " $2 }'
  echo "Sustituye el dato por uno inventado que cumpla las reglas (p. ej. un correo @example.com,"
  echo "una clave de mentira sin la forma real, o saca el .env del commit) y vuelve a intentarlo."
  echo "No desactives ni te saltes el hook."
} >&2

registro="$root/docs/seguridad/registro-de-bloqueos.md"
mkdir -p "$(dirname "$registro")"
[ -f "$registro" ] || echo "# Registro de bloqueos del hook datos-que-no-salen" > "$registro"
ahora=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Solo fecha, regla y archivo; si la propia ruta tuviera forma de dato sensible, tampoco va.
printf '%s\n' "$hallazgos" | awk -F'\t' -v t="$ahora" "$reglas_awk"'
  { a = (clave($2) || correo($2)) ? "(ruta omitida)" : $2
    print "- " t " BLOQUEADO | regla: " $1 " | archivo: " a }' >> "$registro"

exit 2
