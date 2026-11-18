import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import { dbAssertions } from '@adonisjs/lucid/plugins/db'
import testUtils from '@adonisjs/core/services/test_utils'
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { MigrationRunner } from '@adonisjs/lucid/migration'
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
  setup: [
    /**
     * Freno antes de tocar nada: las pruebas truncan, migran y escriben, así
     * que solo pueden correr contra la base de pruebas (`db-test`). Una
     * variable `DB_*` exportada en la shell tiene prioridad sobre `.env.test`
     * y podría apuntarlas a la de desarrollo sin que nada avisara.
     */
    () => {
      const database = env.get('DB_DATABASE')
      if (!database.endsWith('_test')) {
        throw new Error(
          `Las pruebas solo corren contra la base de pruebas (*_test) y DB_DATABASE es "${database}". Revisa .env.test y las variables DB_* de tu shell.`
        )
      }
    },
    /**
     * `db-test` vive en memoria y arranca vacía: se migra al empezar, sin
     * depender de que alguien haya corrido `make migrate-test` antes.
     *
     * Se usa el `MigrationRunner` de Lucid y no `testUtils.db().migrate()`
     * porque este último arranca el kernel de Ace dentro del proceso de las
     * pruebas, y el kernel muere al cargar `commands/openapi_check.ts`
     * («Invalid command exported... Invalid URL»). Tampoco regenera
     * `database/schema.ts`: eso queda para `node ace migration:run`.
     */
    async () => {
      const migrator = new MigrationRunner(db, app, { direction: 'up' })
      await migrator.run()
      if (migrator.error) throw migrator.error
    },
  ],
  teardown: [],
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
