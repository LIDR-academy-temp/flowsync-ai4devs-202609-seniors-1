#!/usr/bin/env bash
set -uo pipefail

command=$(jq -r '.tool_input.command // empty' 2>/dev/null)
[[ $command == *"git commit"* ]] || exit 0

root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root" || exit 0

tab=$'\t'
log=docs/seguridad/registro-de-bloqueos.md

git_quiet() { git -c core.quotePath=false "$@" 2>/dev/null; }
git_diff() { git_quiet diff --no-color --no-ext-diff --no-prefix --unified=0 "$@"; }

changed_files() {
  git_quiet diff --cached --name-only --diff-filter=d
  git_quiet diff --name-only --diff-filter=d
  git_quiet ls-files --others --exclude-standard
}

added_lines() {
  {
    git_diff --cached
    git_diff
    git_quiet ls-files --others --exclude-standard -z |
      while IFS= read -r -d '' file; do
        git_diff --no-index -- /dev/null "$file"
      done
  } | awk '
    /^diff / { header = 1; next }
    header && /^\+\+\+ / { file = substr($0, 5); sub(/\t$/, "", file); header = 0; next }
    /^@@/ { header = 0; next }
    !header && /^\+/ { print file "\t" substr($0, 2) }
  '
}

# Cada prefijo exige al menos un carácter de clave detrás: así una mención del
# prefijo a secas (en docs, en prompts.md o en este mismo fichero) no cuenta como clave.
key_files() {
  grep -E \
    -e "^[^$tab]*$tab.*(AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|sk-ant-[A-Za-z0-9_-]|ghp_[A-Za-z0-9]|github_pat_[A-Za-z0-9_]|xox[bpa]-[A-Za-z0-9-]|-----BEGIN [A-Z ]*PRIVATE KEY-----)" \
    -e "^[^$tab]*$tab[[:space:]]*(export[[:space:]]+)?APP_KEY=[^[:space:]]" |
    cut -f1
}

email_files() {
  awk -F "$tab" '
    function allowed(domain) {
      return domain ~ /(^|\.)example\.(com|org|net)$/ || domain ~ /(^|\.)github\.com$/
    }
    {
      rest = substr($0, length($1) + 2)
      while (match(rest, /[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z][A-Za-z]+/)) {
        address = tolower(substr(rest, RSTART, RLENGTH))
        if (!allowed(substr(address, index(address, "@") + 1))) { print $1; next }
        rest = substr(rest, RSTART + RLENGTH)
      }
    }
  '
}

added=$(added_lines)
keys=$(printf '%s\n' "$added" | key_files | sort -u)
emails=$(printf '%s\n' "$added" | email_files | sort -u)
envs=$(changed_files | awk -F/ '$NF == ".env"' | sort -u)

[[ -n $keys$emails$envs ]] || exit 0

mkdir -p "${log%/*}"
[[ -f $log ]] || echo '# Registro de bloqueos del hook datos-que-no-salen' > "$log"
now=$(date -u +%Y-%m-%dT%H:%M:%SZ)

block() {
  local rule=$1 file
  while IFS= read -r file; do
    [[ -n $file ]] || continue
    echo "  - $rule en $file" >&2
    echo "- $now BLOQUEADO $rule \`$file\`" >> "$log"
  done <<< "$2"
}

echo 'Commit bloqueado por .claude/hooks/datos-que-no-salen.sh:' >&2
block 'regla 1 (clave con forma reconocible)' "$keys"
block 'regla 2 (correo de un dominio que no es de ejemplo)' "$emails"
block 'regla 3 (fichero .env)' "$envs"
echo 'Sustituye el dato señalado por uno inventado (un .env, déjalo fuera del commit) y vuelve a intentarlo.' >&2
exit 2
