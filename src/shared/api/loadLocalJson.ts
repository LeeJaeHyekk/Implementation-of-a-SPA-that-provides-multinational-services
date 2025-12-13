interface LoadLocalJsonArgs<T> {
  loaders: Array<() => Promise<{ default: T }>>
  errorMessage: string
}

export async function loadLocalJson<T>({ loaders, errorMessage }: LoadLocalJsonArgs<T>): Promise<T> {
  for (const loader of loaders) {
    try {
      const loaded = await loader()
      const value = loaded?.default
      if (value === undefined || value === null) {
        continue
      }
      if (Array.isArray(value) && value.length === 0) {
        continue
      }
      return value
    } catch {
      continue
    }
  }

  throw new Error(errorMessage)
}

