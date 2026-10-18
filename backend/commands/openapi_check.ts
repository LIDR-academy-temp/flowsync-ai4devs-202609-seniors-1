import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { BaseCommand } from '@adonisjs/core/ace'
import { buildContract } from '#services/openapi_contract'

export default class OpenapiCheck extends BaseCommand {
  static commandName = 'openapi:check'
  static description = 'Comprueba que el contrato OpenAPI versionado está actualizado'
  static options = { startApp: true }

  async run() {
    await mkdir(this.app.tmpPath(), { recursive: true })
    const temporaryDirectory = await mkdtemp(this.app.tmpPath('openapi-'))

    try {
      const generatedPath = join(temporaryDirectory, 'openapi.json')
      await writeFile(generatedPath, await buildContract(this.app), 'utf8')
      const generated = await readFile(generatedPath, 'utf8')
      const versioned = await readFile(this.app.makePath('../docs/api/openapi.json'), 'utf8')

      if (generated !== versioned) {
        this.logger.error(
          'OpenAPI desactualizado. Ejecuta npm run openapi:generate desde backend/ y revisa el diff de docs/api/openapi.json.'
        )
        this.exitCode = 1
        return
      }

      this.logger.success('El contrato OpenAPI versionado está actualizado')
    } finally {
      await rm(temporaryDirectory, { recursive: true, force: true })
    }
  }
}
