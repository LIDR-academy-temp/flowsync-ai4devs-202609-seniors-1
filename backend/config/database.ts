import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

/**
 * Una única conexión PostgreSQL (`pg`). A qué base apunta lo decide el entorno:
 * `.env` lleva la de desarrollo (servicio `db`, puerto 54410) y `.env.test`,
 * que el framework carga solo cuando `NODE_ENV=test`, sobrescribe `DB_PORT` y
 * `DB_DATABASE` con la de pruebas (servicio `db-test`, puerto 54411).
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

      debug: app.inDev,
    },
  },
})

export default dbConfig
