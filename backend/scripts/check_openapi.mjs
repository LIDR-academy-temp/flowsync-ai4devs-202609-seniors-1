import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'

// Entorno exclusivo de esta comprobación: no usa claves ni configuración personales.
const result = spawnSync(process.execPath, ['ace', 'openapi:check'], {
  cwd: new URL('../', import.meta.url),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'test',
    TZ: 'UTC',
    HOST: 'localhost',
    PORT: '3333',
    APP_URL: 'http://localhost:3333',
    LOG_LEVEL: 'error',
    SESSION_DRIVER: 'memory',
    APP_KEY: randomBytes(32).toString('hex'),
  },
})

if (result.error) {
  console.error(result.error)
}
process.exitCode = result.status ?? 1
