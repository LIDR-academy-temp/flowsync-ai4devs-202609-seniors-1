import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

/**
 * PostgreSQL en Docker (`compose.yaml` en la raíz). Una sola conexión: qué base
 * toca la deciden las variables `DB_*`. En desarrollo salen de `.env` (servicio
 * `db`, puerto 54410) y en pruebas `.env.test` las sobrescribe para apuntar a
 * `db-test` (puerto 54411), de modo que la batería nunca pisa los datos de
 * desarrollo.
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
