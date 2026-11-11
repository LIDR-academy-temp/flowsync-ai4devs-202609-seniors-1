#!/usr/bin/env bash
# datos-que-no-salen — hook PreToolUse (matcher Bash) de Claude Code.
#
# Impide que un commit incorpore: (1) un secreto con forma reconocible,
# (2) un correo con dominio no permitido, (3) un fichero llamado exactamente `.env`.
#
# Entrada : JSON por stdin; el comando está en .tool_input.command.
# Salida  : 0 sin escribir nada si no hay nada que bloquear;
#           2 + mensaje por stderr + una línea en docs/seguridad/registro-de-bloqueos.md
#           si salta alguna regla. Nunca se imprime ni se registra el valor detectado.
#
# Sin `set -e` a propósito: los códigos de salida se controlan a mano.
set -uo pipefail
export LC_ALL=C

# --- Entrada ---------------------------------------------------------------
input=$(cat)
command -v jq >/dev/null 2>&1 || exit 0
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null) || exit 0

# Solo actúa si el comando contiene `git commit`.
[[ $cmd =~ git[[:space:]]+commit ]] || exit 0

# --- Raíz del repositorio ---------------------------------------------------
root=${CLAUDE_PROJECT_DIR:-.}
cd "$root" 2>/dev/null || exit 0
top=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$top" || exit 0

# `--literal-pathspecs`: una ruta con `*` o `?` se trata como nombre, no como patrón.
g() { git --literal-pathspecs -c core.quotepath=false "$@"; }

# ¿Qué entrará en el commit? Lo que ya está en el índice, y lo que el propio comando
# va a preparar (el hook corre ANTES del comando: el índice aún no lo tiene).
scan_unstaged=0
scan_untracked=0
if [[ $cmd =~ git[[:space:]]+add ]]; then
  scan_unstaged=1
  scan_untracked=1
fi
# `git commit -a` / `--all` también prepara los cambios de ficheros ya seguidos.
if [[ $cmd =~ (^|[[:space:]])(-[A-Za-z]*a[A-Za-z]*|--all)([[:space:]]|$) ]]; then
  scan_unstaged=1
fi

# --- Patrones ---------------------------------------------------------------
# Los prefijos se montan por trozos para que este fichero no contenga ninguno
# de ellos literal y pueda commitearse sin dispararse a sí mismo.
p_ant='sk-''ant-'
p_ghp='gh''p_'
p_pat='github''_pat_'
re_secret="AKIA[0-9A-Z]{16}|${p_ant}|${p_ghp}|${p_pat}|AIza[0-9A-Za-z_-]{35}|xox[bpa]-|-----BEGIN( [A-Z]+)* PRIVATE KEY-----"
re_appkey="(^|[^A-Za-z0-9_])APP_""KEY=[[:space:]]*['\"]?[^[:space:]'\"]"
re_email='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'

# --- Hallazgos (sin duplicados) ----------------------------------------------
declare -A found=()
declare -a order=()
record() {
  local k="$1|$2"
  [[ -n ${found[$k]:-} ]] && return 0
  found[$k]=1
  order+=("$k")
}

# Regla 3: el nombre del fichero, sea cual sea su carpeta.
check_name() {
  [[ ${1##*/} == ".env" ]] && record R3-env "$1"
  return 0
}

# Reglas 1 y 2 sobre el texto añadido que llega por stdin.
scan_content() {
  local f=$1 content m dom
  content=$(cat)
  [[ -n $content ]] || return 0
  if grep -aqE -e "$re_secret" <<<"$content" || grep -aqE -e "$re_appkey" <<<"$content"; then
    record R1-secreto "$f"
  fi
  while IFS= read -r m; do
    dom=${m##*@}
    dom=${dom,,}
    case $dom in
      example.com | example.org | example.net | github.com) ;;
      *)
        record R2-correo "$f"
        break
        ;;
    esac
  done < <(grep -aoE -e "$re_email" <<<"$content")
  return 0
}

# Solo las líneas añadidas de un diff -U0: ni eliminadas, ni contexto, ni cabeceras.
added_lines() { awk '/^@@/{h=1;next} h && /^\+/{print substr($0,2)}'; }

scan_tracked_diff() { # $1 = --cached | (vacío = árbol de trabajo)
  local f
  while IFS= read -r -d '' f; do
    check_name "$f"
    # Sustitución de procesos y no tubería: `record` debe ejecutarse en esta shell.
    scan_content "$f" < <(
      g diff ${1:+"$1"} -U0 --no-color --no-ext-diff --no-textconv -- "$f" 2>/dev/null | added_lines
    )
  done < <(g diff ${1:+"$1"} --name-only -z --diff-filter=ACMR 2>/dev/null)
}

# --- Qué se analiza ---------------------------------------------------------
scan_tracked_diff --cached

if ((scan_unstaged)); then
  scan_tracked_diff ""
fi

if ((scan_untracked)); then
  while IFS= read -r -d '' f; do
    check_name "$f"
    [[ -f $f && ! -L $f ]] || continue
    scan_content "$f" < <(grep -I '' -- "$f" 2>/dev/null)
  done < <(g ls-files --others --exclude-standard -z 2>/dev/null)

  # `git add -f .env`: un .env ignorado no sale en la lista anterior, así que se
  # miran también los argumentos del propio comando (solo si el fichero existe).
  read -r -a toks <<<"$cmd"
  for tok in "${toks[@]}"; do
    tok=${tok//[\"\';]/}
    [[ ${tok##*/} == ".env" && -e $tok ]] && record R3-env "${tok#./}"
  done
fi

# --- Resultado --------------------------------------------------------------
((${#order[@]})) || exit 0

ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
reg=docs/seguridad/registro-de-bloqueos.md
mkdir -p docs/seguridad 2>/dev/null
if [[ ! -f $reg ]]; then
  printf '%s\n' '# Registro de bloqueos de datos-que-no-salen (fecha UTC | BLOQUEADO | regla | archivo)' >"$reg" 2>/dev/null
fi

clean() { printf '%s' "$1" | tr -d '\000-\037\177' | tr '|' '?'; }

for k in "${order[@]}"; do
  rule=${k%%|*}
  file=$(clean "${k#*|}")
  printf '%s | BLOQUEADO | %s | %s\n' "$ts" "$rule" "$file" >>"$reg" 2>/dev/null
  case $rule in
    R1-secreto) why='secreto con forma reconocible (clave, token, clave privada o APP_KEY con valor)' ;;
    R2-correo) why='correo con dominio no permitido (solo example.com, example.org, example.net y github.com)' ;;
    R3-env) why='fichero .env entre lo que entra al commit' ;;
  esac
  printf 'datos-que-no-salen: BLOQUEADO por %s en %s\n' "$why" "$file" >&2
done
printf '%s\n' 'Sustituye el dato por uno inventado que cumpla la regla (o saca el fichero del commit) y vuelve a intentarlo. No desactives ni te saltes este hook.' >&2
exit 2
