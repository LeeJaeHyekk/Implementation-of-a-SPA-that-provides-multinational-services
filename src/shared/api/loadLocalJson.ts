interface LoadLocalJsonArgs<T> {
  loaders: Array<() => Promise<{ default: T }>>
  errorMessage: string
}

export async function loadLocalJson<T>({ loaders, errorMessage }: LoadLocalJsonArgs<T>): Promise<T> {
  for (const loader of loaders) {
    try {
      const loaded = await loader()
      return loaded.default
    } catch {
      continue
    }
  }

  throw new Error(errorMessage)
}

