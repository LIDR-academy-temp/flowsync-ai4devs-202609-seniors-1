import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

/**
 * Una única conexión PostgreSQL. A qué base apunta lo decide el entorno:
 * `.env` lleva a `db` (54410, desarrollo) y `.env.test`, que el framework carga
 * encima cuando NODE_ENV=test, lleva a `db-test` (54411, en memoria). Las dos
 * se levantan con `make db-up` (ver compose.yaml).
 */
const dbConfig = defineConfig({
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
