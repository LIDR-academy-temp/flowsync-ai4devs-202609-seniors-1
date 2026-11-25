#!/usr/bin/env node
// Hook PreToolUse (Bash): bloquea `git commit` del agente si el contenido a commitear
// incluye (1) un secreto reconocible, (2) un email fuera de los dominios permitidos
// o (3) un fichero .env. Cada bloqueo se registra en .claude/logs/commit-guard.log (JSONL).
// Los secretos nunca se escriben en el log: solo una versión enmascarada.
import { execFileSync } from 'node:child_process'
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(readFileSync(join(here, 'commit-guard.config.json'), 'utf8'))

const SECRET_PATTERNS = [
  ['AWS access key', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,})\b/],
  ['Anthropic API key', /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ['OpenAI API key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}/],
  ['Stripe key', /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['Clave privada', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY(?: BLOCK)?-----/],
  ['JWT', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  [
    'Credencial en URL',
    /\b[a-z][a-z0-9+.-]*:\/\/[^\s:@/]+:[^\s:@/]{4,}@[^\s/]+/i,
  ],
  [
    'Asignación de secreto',
    /\b[\w.-]*(?:secret|password|passwd|api[_-]?key|access[_-]?token|auth[_-]?token|private[_-]?key)[\w.-]*["']?\s*[:=]\s*["'][A-Za-z0-9+/=_-]{16,}["']/i,
  ],
]
const PLACEHOLDER = /(example|placeholder|changeme|your[_-]|xxxx|<[^>]+>|\$\{|process\.env|env\.get)/i
const EMAIL = /[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)/g

const input = JSON.parse(readFileSync(0, 'utf8'))
const command = input.tool_input?.command ?? ''
const cwd = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd()
const projectDir = process.env.CLAUDE_PROJECT_DIR || cwd

const commitRe = /(?:^|[;&|(]\s*|\s)git\s+(?:-[^\s]+\s+(?:[^\s-][^\s]*\s+)?)*commit\b/
if (!commitRe.test(command)) process.exit(0)

const git = (args) =>
  execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

const stages = /\bgit\s+(?:\S+\s+)*add\b/.test(command)
const commitAll = /\bcommit\b[^;&|]*\s(?:-[a-zA-Z]*a[a-zA-Z]*|--all)\b/.test(command)
const wide = stages || commitAll // el contenido a commitear aún no está en el índice

const isEnvFile = (p) => {
  const base = p.split('/').pop()
  return (
    (base === '.env' || base.startsWith('.env.')) &&
    !config.envAllowedSuffixes.some((s) => base.endsWith(s))
  )
}

const findings = []
const add = (kind, file, detail, line) => findings.push({ kind, file, detail, line })
const mask = (s) => (s.length <= 8 ? '****' : `${s.slice(0, 4)}…${s.slice(-2)} (${s.length} car.)`)

function scanLine(file, text, lineNo) {
  for (const [name, re] of SECRET_PATTERNS) {
    const m = text.match(re)
    if (m && !PLACEHOLDER.test(m[0])) add('secret', file, `${name}: ${mask(m[0])}`, lineNo)
  }
  for (const m of text.matchAll(EMAIL)) {
    const domain = m[1].toLowerCase()
    const ok = config.allowedEmailDomains.some((d) => domain === d || domain.endsWith(`.${d}`))
    if (!ok) add('email', file, `Email fuera de dominios permitidos: ${mask(m[0])}`, lineNo)
  }
}

try {
  // Ficheros .env (por nombre)
  const names = new Set(git(['diff', '--cached', '--name-only', '-z']).split('\0').filter(Boolean))
  let untracked = []
  if (wide) {
    git(['diff', 'HEAD', '--name-only', '-z']).split('\0').filter(Boolean).forEach((n) => names.add(n))
    untracked = git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean)
    untracked.forEach((n) => names.add(n))
    // `git add -f .env` salta el .gitignore: mira también los argumentos del add
    for (const seg of command.matchAll(/\bgit\s+(?:\S+\s+)*?add\b([^;&|]*)/g))
      for (const tok of seg[1].split(/\s+/)) {
        const t = tok.replace(/^["']|["']$/g, '')
        if (t && isEnvFile(t)) names.add(t)
      }
  }
  for (const n of names) if (isEnvFile(n)) add('env-file', n, 'Fichero .env en el commit')

  // Contenido añadido
  const diff = git(['diff', ...(wide ? ['HEAD'] : ['--cached']), '-U0', '--no-color', '--no-ext-diff'])
  let file = null
  let lineNo = 0
  for (const l of diff.split('\n')) {
    if (l.startsWith('+++ ')) file = l.slice(6) === '' ? null : l.replace(/^\+\+\+ (b\/)?/, '')
    else if (l.startsWith('@@')) lineNo = Number(/\+(\d+)/.exec(l)?.[1] ?? 0) - 1
    else if (l.startsWith('+') && file) {
      lineNo++
      if (!config.ignoreFiles.includes(file.split('/').pop()) && !isEnvFile(file)) scanLine(file, l.slice(1), lineNo)
    }
  }
  for (const f of untracked) {
    if (isEnvFile(f) || config.ignoreFiles.includes(f.split('/').pop())) continue
    let text
    try { text = readFileSync(join(cwd, f), 'utf8') } catch { continue }
    if (text.includes('\0')) continue
    text.split('\n').forEach((l, i) => scanLine(f, l, i + 1))
  }
  // Mensaje del commit (-m "...")
  for (const m of command.matchAll(/(?:-m|--message)[=\s]+(?:"([^"]*)"|'([^']*)')/g))
    scanLine('<mensaje del commit>', m[1] ?? m[2], 0)
} catch (err) {
  // Fallar cerrado: si no se puede inspeccionar el commit, se bloquea.
  add('error', '-', `No se pudo inspeccionar el commit: ${err.message.split('\n')[0]}`)
}

if (findings.length === 0) process.exit(0)

// Registro de bloqueos (JSONL, sin secretos en claro)
const logDir = join(projectDir, '.claude', 'logs')
try {
  mkdirSync(logDir, { recursive: true })
  appendFileSync(
    join(logDir, 'commit-guard.log'),
    JSON.stringify({
      ts: new Date().toISOString(),
      session_id: input.session_id,
      cwd,
      command: command.replace(/\s+/g, ' ').slice(0, 300),
      findings,
    }) + '\n',
  )
} catch (e) {
  console.error(`commit-guard: no se pudo escribir el log: ${e.message}`)
}

const shown = findings.slice(0, 10).map((f) => `  - [${f.kind}] ${f.file}${f.line ? `:${f.line}` : ''} — ${f.detail}`)
console.error(
  `Commit bloqueado por commit-guard (${findings.length} hallazgo(s)):\n${shown.join('\n')}\n` +
    'Quita el secreto/email/.env del commit (usa variables de entorno o .env.example) y vuelve a intentarlo. ' +
    'No eludas el hook. Detalle en .claude/logs/commit-guard.log.',
)
process.exit(2)
