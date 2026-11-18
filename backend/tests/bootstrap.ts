import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { dbAssertions } from '@adonisjs/lucid/plugins/db'
import testUtils from '@adonisjs/core/services/test_utils'
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
import type { Registry } from '../.adonisjs/client/registry/schema.d.ts'

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */
declare module '@japa/api-client/types' {
  interface RoutesRegistry extends Registry {}
}

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [
  assert(),
  pluginAdonisJS(app),
  dbAssertions(app),
  apiClient(),
  sessionApiClient(app),
  authApiClient(app),
]

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executed after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [assertTestDatabase],
  teardown: [],
}

/**
 * Seguro contra correr la batería sobre la base de desarrollo.
 *
 * Las pruebas leen la conexión de `.env.test`, pero el loader de AdonisJS
 * rellena con `.env` (desarrollo) cualquier `DB_*` que falte, y una variable
 * exportada en la terminal pisa a las dos. Ninguno de esos caminos avisa. Por
 * eso, antes de la primera prueba y de cualquier escritura, se comprueba:
 *
 * 1. que la configuración que Lucid va a usar apunta al puerto 54411 y a la base
 *    `flowsync_test` (se mira la config resuelta, no solo las variables);
 * 2. que la base a la que de verdad se conecta se llama `flowsync_test`;
 * 3. que el servidor es el de pruebas: en `db-test` no existe la base `flowsync`
 *    de desarrollo, y en `db` sí.
 *
 * Si algo no cuadra, la batería se para sin ejecutar ninguna prueba.
 */
async function assertTestDatabase() {
  const EXPECTED_PORT = 54411
  const EXPECTED_DATABASE = 'flowsync_test'
  const DEV_DATABASE = 'flowsync'

  const { default: db } = await import('@adonisjs/lucid/services/db')
  const name = db.primaryConnectionName
  const config = db.getRawConnection(name)?.config.connection as
    { port?: number | string; database?: string } | undefined

  const stop = (reason: string): never => {
    throw new Error(
      `Batería detenida: la conexión "${name}" no es la base de pruebas (${reason}). ` +
        `Revisa backend/.env.test y que no haya DB_* exportadas en la terminal.`
    )
  }

  if (Number(config?.port) !== EXPECTED_PORT) {
    stop(`DB_PORT es ${config?.port}, se esperaba ${EXPECTED_PORT}`)
  }
  if (config?.database !== EXPECTED_DATABASE) {
    stop(`DB_DATABASE es ${config?.database}, se esperaba ${EXPECTED_DATABASE}`)
  }

  const current = await db.rawQuery('select current_database() as name')
  const currentName = current.rows[0]?.name
  if (currentName !== EXPECTED_DATABASE) {
    stop(`la base conectada es ${currentName}`)
  }

  const dev = await db.rawQuery('select 1 from pg_database where datname = ?', [DEV_DATABASE])
  if (dev.rows.length > 0) {
    stop(
      `el servidor contiene la base "${DEV_DATABASE}" de desarrollo: es el servicio db, no db-test`
    )
  }
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
