export const ApiKeyConfig = {
  length: 128,
  chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_',
  prefix: 'sv_',
  tries: 5,
} as const

export function generateApiKey(): string {
  const randomValues = new Uint8Array(
    ApiKeyConfig.length - ApiKeyConfig.prefix.length
  )

  crypto.getRandomValues(randomValues)

  return (
    ApiKeyConfig.prefix +
    Array.from(randomValues)
      .map((x) => ApiKeyConfig.chars[x % ApiKeyConfig.chars.length])
      .join('')
  )
}

export function generateNApiKeys(
  __count: number = ApiKeyConfig.tries
): string[] {
  if (__count <= 0 && __count > ApiKeyConfig.tries) {
    throw 'Number of API Keys to generate cannot be either less than 0 or more than 10'
  }

  // we won't check if all the generated API Keys are unique because it is highly unlikely to happen
  // and even though it happens it will lead to no issues but a little latency
  return [...Array(__count)].map(() => generateApiKey())
}
