#!/usr/bin/env bash
# Hook PreToolUse (matcher Bash): impide que un `git commit` se lleve datos que
# no deben salir de la máquina. Tres reglas y nada más:
#   clave-reconocible  una clave con forma conocida o un valor para la clave de la app
#   correo-real        un correo cuyo dominio no es de ejemplo
#   archivo-env        un archivo llamado exactamente .env entre los que se incorporan
# Con coincidencia: exit 2, explicación por stderr y una línea en el registro.
# Nunca se escribe el valor detectado, ni en stderr ni en el registro.
#
# Los patrones se escriben partidos ('ab''cd') para que este mismo fichero no
# dispare sus propias reglas cuando se commitea.
set -uo pipefail
export LC_ALL=C

input=$(cat)

# Sin jq no se puede leer el comando. Solo se avisa si la entrada en bruto parece
# un commit; ante cualquier otro comando, silencio y exit 0.
if ! command -v jq >/dev/null 2>&1; then
  if [[ $input =~ git[[:space:]]+commit ]]; then
    echo "datos-que-no-salen: falta jq y NO se ha revisado este commit." >&2
    exit 1
  fi
  exit 0
fi

cmd=$(jq -r '.tool_input.command // empty' <<<"$input" 2>/dev/null)
[[ -n $cmd ]] || exit 0

re_commit='git[[:space:]]+commit'
re_add='git[[:space:]]+add'
re_all='git[[:space:]]+commit[^;&|]*[[:space:]]-([a-zA-Z]*a|-all)'
re_force='[[:space:]](-[a-zA-Z]*f[a-zA-Z]*|--force)([[:space:]]|$)'

[[ $cmd =~ $re_commit ]] || exit 0

dir=$(jq -r '.cwd // empty' <<<"$input" 2>/dev/null)
dir=${dir:-${CLAUDE_PROJECT_DIR:-$PWD}}
root=$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0

# Qué se revisa: siempre lo preparado. Si el mismo comando hace `git add`, lo
# todavía sin preparar y los archivos nuevos (con -f, también los ignorados).
# `git commit -a` incorpora además los cambios de archivos que ya seguía git.
unstaged=0 untracked=0 ignored=0
if [[ $cmd =~ $re_add ]]; then
  unstaged=1 untracked=1
  [[ $cmd =~ $re_force ]] && ignored=1
fi
[[ $cmd =~ $re_all ]] && unstaged=1

T=$'\t'
gd=(git -c core.quotepath=false diff -U0 --no-color --no-ext-diff --src-prefix=a/ --dst-prefix=b/)

# Rutas de los archivos que entrarían en el commit.
names=$("${gd[@]}" --cached --name-only --diff-filter=d)
if ((unstaged)); then names+=$'\n'$("${gd[@]}" --name-only --diff-filter=d); fi
if ((untracked)); then names+=$'\n'$(git -c core.quotepath=false ls-files -o --exclude-standard); fi
if ((ignored)); then names+=$'\n'$(git -c core.quotepath=false ls-files -o -i --exclude-standard | grep -aE '(^|/)\.env$'); fi

# Líneas añadidas, como "ruta<TAB>línea".
added() {
  awk '
    /^diff --git / { hdr = 1; f = ""; next }
    /^@@/          { hdr = 0; next }
    hdr && /^\+\+\+ / { f = $0; sub(/^\+\+\+ b\//, "", f); if ($0 ~ /\/dev\/null/) f = ""; next }
    !hdr && f != "" && /^\+/ { print f "\t" substr($0, 2) }'
}
lines=$("${gd[@]}" --cached | added)
if ((unstaged)); then lines+=$'\n'$("${gd[@]}" | added); fi
if ((untracked)); then
  while IFS= read -r -d '' f; do
    [[ -f $f && $(wc -c <"$f") -lt 1048576 ]] || continue
    grep -aIq . "$f" 2>/dev/null || continue
    awk -v f="$f" '{ print f "\t" $0 }' "$f"
  done < <(git -c core.quotepath=false ls-files -o --exclude-standard -z) > "${TMPDIR:-/tmp}/dqs.$$" 2>/dev/null
  lines+=$'\n'$(cat "${TMPDIR:-/tmp}/dqs.$$"); rm -f "${TMPDIR:-/tmp}/dqs.$$"
fi

hits=""
add_hits() { # $1 = regla; stdin = rutas
  local f
  while IFS= read -r f; do [[ -n $f ]] && hits+="$1${T}${f}"$'\n'; done
}

# 1. Clave con forma reconocible.
key_re='AKI''A[0-9A-Z]{16}|sk-an''t-|gh''p_|github_p''at_|AIz''a[0-9A-Za-z_-]{35}|xox''[bpa]-|-{4,}BEG''IN( [A-Z]+)* PRIV''ATE KEY'
appkey='APP_''KEY'
add_hits clave-reconocible < <(
  {
    printf '%s\n' "$lines" | grep -aE -e "$key_re"
    printf '%s\n' "$lines" | grep -aE -e "^[^${T}]*${T}[[:space:]]*(export[[:space:]]+)?${appkey}=([^[:space:]\"']|[\"'][^\"'[:space:]])"
  } | cut -f1 | sort -u
)

# 2. Correo con dominio que no es de ejemplo.
mail_re='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z][A-Za-z]+'
add_hits correo-real < <(
  printf '%s\n' "$lines" | awk -v re="$mail_re" '
    BEGIN {
      FS = "\t"
      ok["example.com"] = ok["example.org"] = ok["example.net"] = ok["github.com"] = 1
    }
    {
      f = $1; s = substr($0, length(f) + 2)
      while (match(s, re)) {
        e = substr(s, RSTART, RLENGTH)
        d = tolower(substr(e, index(e, "@") + 1))
        if (!(d in ok)) { print f; break }
        s = substr(s, RSTART + RLENGTH)
      }
    }' | sort -u
)

# 3. Archivo .env (los .env.example no cuentan: el nombre ha de ser exacto).
add_hits archivo-env < <(printf '%s\n' "$names" | grep -aE '(^|/)\.env$' | sort -u)

[[ -n $hits ]] || exit 0

log=docs/seguridad/registro-de-bloqueos.md
mkdir -p "$(dirname "$log")" 2>/dev/null
[[ -f $log ]] || printf '# Registro de bloqueos de datos que no deben salir\n' >"$log" 2>/dev/null
ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)

while IFS="$T" read -r regla archivo; do
  [[ -n $regla ]] || continue
  case $regla in
    clave-reconocible) que='una clave con forma reconocible (o APP''_KEY con valor)' ;;
    correo-real)       que='una dirección de correo con un dominio que no es de ejemplo' ;;
    archivo-env)       que='un archivo .env entre los que se van a incorporar' ;;
  esac
  printf '%s BLOQUEADO regla=%s archivo=%s\n' "$ts" "$regla" "$archivo" | sed 's/^/- /' >>"$log" 2>/dev/null
  echo "BLOQUEADO (datos-que-no-salen): regla $regla en $archivo: $que." >&2
done <<<"$hits"

echo "Sustituye el dato por uno inventado (p. ej. ada@example.com, o una clave falsa del mismo formato; un .env se queda fuera del commit) y vuelve a intentarlo. No desactives ni te saltes este hook. El registro $log se commitea con el resto del trabajo." >&2
exit 2
