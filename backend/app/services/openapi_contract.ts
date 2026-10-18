import type { ApplicationService } from '@adonisjs/core/types'

/** Ordena objetos recursivamente; conserva el orden significativo de los arrays. */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys)
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
        .map(([key, item]) => [key, sortKeys(item)])
    )
  }
  return value
}

export async function buildContract(app: ApplicationService): Promise<string> {
  const router = await app.container.make('router')
  router.commit()
  const openapi = await app.container.make('openapi')
  const document = await openapi.buildDocument()
  return `${JSON.stringify(sortKeys(document), null, 2)}\n`
}
