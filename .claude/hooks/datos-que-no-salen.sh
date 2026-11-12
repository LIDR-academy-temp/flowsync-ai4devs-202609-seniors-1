#!/usr/bin/env bash
# Hook PreToolUse (matcher Bash): datos-que-no-salen.
# Bloquea (exit 2) un `git commit` si lo que va a entrar contiene claves reconocibles,
# correos reales o un fichero .env. Ver las tres reglas más abajo.
# Nunca imprime ni registra el valor detectado: solo regla y fichero.
set -uo pipefail

input=$(cat)
cmd=$(jq -r '.tool_input.command // empty' <<<"$input" 2>/dev/null) || exit 0
cwd=$(jq -r '.cwd // empty' <<<"$input" 2>/dev/null) || cwd=""

# Solo actúa con "git commit"; con cualquier otro comando, silencio y 0.
[[ $cmd == *"git commit"* ]] || exit 0

[[ -n $cwd ]] && { cd "$cwd" 2>/dev/null || true; }
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0

con_add=0
[[ $cmd == *"git add"* ]] && con_add=1

# --- Líneas añadidas, como "fichero<TAB>línea" ------------------------------
lineas_anadidas() {
  awk -v OFS='\t' '
    /^diff /      { cab = 1; next }
    cab && /^\+\+\+ / { f = $0; sub(/^\+\+\+ (b\/)?/, "", f); next }
    /^@@/         { cab = 0; next }
    !cab && /^\+/ { print f, substr($0, 2) }'
}

recoger_lineas() {
  git -c core.quotepath=off diff --cached -U0 --no-color | lineas_anadidas
  if ((con_add)); then
    git -c core.quotepath=off diff -U0 --no-color | lineas_anadidas
    local f
    while IFS= read -r -d '' f; do
      git -c core.quotepath=off diff --no-index -U0 --no-color -- /dev/null "$f" | lineas_anadidas
    done < <(git ls-files --others --exclude-standard -z)
  fi
}

# --- Ficheros que entrarían en el commit (sin los borrados) -----------------
recoger_ficheros() {
  git diff --cached --name-only --diff-filter=d -z
  if ((con_add)); then
    git diff --name-only --diff-filter=d -z
    git ls-files --others --exclude-standard -z
  fi
}

# --- Reglas -----------------------------------------------------------------
# Los literales se parten ("..""..") para que este script no dispare su propia regla.
re_clave="AKIA[0-9A-Z]{16}"
re_clave+="|sk-an""t-|gh""p_|github""_pat_"
re_clave+="|AIza[0-9A-Za-z_-]{35}"
re_clave+="|xox[bpa]-"
re_clave+="|-----BEGIN [A-Z ]*PRIVATE KEY-----"
re_clave+="|(^|[^A-Za-z0-9_])APP""_KEY=[\"']?[^\"'[:space:]]"
re_correo='([A-Za-z0-9._%+-]+)@([A-Za-z][A-Za-z0-9-]*(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})'

correo_ajeno() {
  local resto=$1 dom
  while [[ $resto =~ $re_correo ]]; do
    dom=${BASH_REMATCH[2],,}
    case $dom in
      example.com | example.org | example.net | github.com) ;;
      *) return 0 ;;
    esac
    resto=${resto#*"${BASH_REMATCH[0]}"}
  done
  return 1
}

declare -A hallazgos=()
orden=()
anotar() { # regla fichero
  local k="$1|$2"
  [[ -n ${hallazgos[$k]:-} ]] && return
  hallazgos[$k]=1
  orden+=("$k")
}

while IFS=$'\t' read -r fichero linea; do
  [[ $linea =~ $re_clave ]] && anotar clave-reconocible "$fichero"
  correo_ajeno "$linea" && anotar correo-real "$fichero"
done < <(recoger_lineas)

while IFS= read -r -d '' f; do
  [[ ${f##*/} == .env ]] && anotar archivo-env "$f"
done < <(recoger_ficheros)

((${#orden[@]} == 0)) && exit 0

# --- Bloqueo: mensaje, registro y exit 2 ------------------------------------
registro="$root/docs/seguridad/registro-de-bloqueos.md"
mkdir -p "${registro%/*}"
[[ -f $registro ]] || printf '# Registro de bloqueos de datos-que-no-salen\n' >"$registro"
ahora=$(date -u +%Y-%m-%dT%H:%M:%SZ)

for k in "${orden[@]}"; do
  regla=${k%%|*}
  fichero=${k#*|}
  echo "BLOQUEADO por datos-que-no-salen: regla '$regla' en '$fichero'. Sustituye ese dato por uno inventado (por ejemplo, un correo @example.com o una clave de mentira) antes de hacer commit." >&2
  printf '%s BLOQUEADO regla=%s archivo=%s\n' "$ahora" "$regla" "$fichero" >>"$registro"
done
exit 2
