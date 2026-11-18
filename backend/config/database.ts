import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

/**
 * PostgreSQL en Docker (`compose.yaml` en la raíz del repo). La conexión sale
 * entera de las variables `DB_*`, que no tienen valor por defecto a propósito:
 *
 * - desarrollo las lee de `.env` → servicio `db`, puerto 54410;
 * - pruebas las lee de `.env.test` → servicio `db-test`, puerto 54411.
 *
 * `tests/bootstrap.ts` comprueba antes de la primera prueba que la conexión
 * apunta de verdad a la base de pruebas.
 */
const dbConfig = defineConfig({
  /**
   * Default connection used for all queries.
   */
  connection: 'pg',

  connections: {
    pg: {
      client: 'pg',

      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },

      migrations: {
        /**
         * Sort migration files naturally by filename.
         */
        naturalSort: true,

        /**
         * Paths containing migration files.
         */
        paths: ['database/migrations'],
      },

      schemaGeneration: {
        /**
         * Enable schema generation from Lucid models.
         */
        enabled: true,

        /**
         * Custom schema rules file paths.
         */
        rulesPaths: ['./database/schema_rules.js'],
      },
    },
  },
})

export default dbConfig
