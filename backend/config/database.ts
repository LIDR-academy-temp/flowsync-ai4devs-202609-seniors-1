import pg from 'pg'
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

/**
 * Las columnas `date` de PostgreSQL llegan como texto `AAAA-MM-DD`, igual que
 * llegaban con SQLite, y no como un `Date` de JavaScript.
 *
 * Por defecto el driver `pg` convierte cada `date` en un `Date` a medianoche
 * **del huso del proceso**. `database/schema.ts` declara `dueDate` como
 * `string` (regla de `database/schema_rules.ts`) y `Task.isOverdueOn` compara
 * texto contra texto, así que con la conversión por defecto TypeScript seguía
 * en verde mientras `Date < 'AAAA-MM-DD'` daba siempre `false`: ninguna tarea
 * leída de la base salía vencida, y con un huso al este de UTC la fecha
 * serializada retrocedía un día. Lo cubre `tests/functional/tasks/overdue.spec.ts`.
 *
 * Es un ajuste global del driver: afecta a toda columna `date` de cualquier
 * conexión `pg` del proceso. Hoy la única es `tasks.due_date`.
 */
pg.types.setTypeParser(pg.types.builtins.DATE, (value: string) => value)

const dbConfig = defineConfig({
  /**
   * Default connection used for all queries.
   */
  connection: 'pg',

  connections: {
    /**
     * PostgreSQL 17 en Docker (`compose.yaml` en la raíz). Los datos de conexión
     * salen del entorno: `.env` apunta a `db` (puerto 54410) y `.env.test`, que
     * el framework carga solo con `NODE_ENV=test`, a `db-test` (puerto 54411).
     */
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

    /**
     * MySQL / MariaDB connection.
     * Install package to switch: npm install mysql2
     */
    // mysql: {
    //   client: 'mysql2',
    //   connection: {
    //     host: env.get('DB_HOST'),
    //     port: env.get('DB_PORT'),
    //     user: env.get('DB_USER'),
    //     password: env.get('DB_PASSWORD'),
    //     database: env.get('DB_DATABASE'),
    //   },
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    //   debug: app.inDev,
    // },

    /**
     * Microsoft SQL Server connection.
     * Install package to switch: npm install tedious
     */
    // mssql: {
    //   client: 'mssql',
    //   connection: {
    //     server: env.get('DB_HOST'),
    //     port: env.get('DB_PORT'),
    //     user: env.get('DB_USER'),
    //     password: env.get('DB_PASSWORD'),
    //     database: env.get('DB_DATABASE'),
    //   },
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    //   debug: app.inDev,
    // },

    /**
     * libSQL (Turso) connection.
     * Install package to switch: npm install @libsql/client
     */
    // libsql: {
    //   client: 'libsql',
    //   connection: {
    //     url: env.get('LIBSQL_URL'),
    //     authToken: env.get('LIBSQL_AUTH_TOKEN'),
    //   },
    //   useNullAsDefault: true,
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    //   debug: app.inDev,
    // },
  },
})

export default dbConfig
