interface LoadLocalJsonArgs<T> {
  loaders: Array<() => Promise<{ default: T }>>
  errorMessage: string
}

export async function loadLocalJson<T>({ loaders, errorMessage }: LoadLocalJsonArgs<T>): Promise<T> {
  for (const loader of loaders) {
    globalThis.console?.log?.('[LocalJson] try loader')
    try {
      const loaded = await loader()
      const value = loaded?.default
      const info = Array.isArray(value)
        ? { type: typeof value, isArray: true, length: value.length }
        : { type: typeof value, isArray: false, keys: value ? Object.keys(value as object) : [] }
      globalThis.console?.log?.('[LocalJson] loaded', info)
      if (value === undefined || value === null) {
        globalThis.console?.warn?.('[LocalJson] loader returned empty default, trying next')
        continue
      }
      if (Array.isArray(value) && value.length === 0) {
        globalThis.console?.warn?.('[LocalJson] loader returned empty array, trying next')
        continue
      }
      return value
    } catch {
      continue
    }
  }

  throw new Error(errorMessage)
}

