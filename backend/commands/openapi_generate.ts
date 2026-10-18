import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { BaseCommand } from '@adonisjs/core/ace'
import { buildContract } from '#services/openapi_contract'

export default class OpenapiGenerate extends BaseCommand {
  static commandName = 'openapi:generate'
  static description = 'Genera el contrato versionado en docs/api/openapi.json'
  static options = { startApp: true }

  async run() {
    const contract = await buildContract(this.app)
    const target = this.app.makePath('../docs/api/openapi.json')
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, contract, 'utf8')
    this.logger.success('Contrato generado en docs/api/openapi.json')
  }
}
