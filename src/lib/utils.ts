export function getDictionaryFromDisplaySettings(
  settings: Array<{ key: string; value: string }> = []
): Record<string, string> {
  return Object.fromEntries(settings.map(({ key, value }) => [key, value]))
}

export function isEditContext(url: URL): boolean {
  return url.searchParams.get('ctx') === 'edit'
}

export function isPreviewContext(url: URL): boolean {
  const ctx = url.searchParams.get('ctx')
  return ctx === 'edit' || ctx === 'preview'
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
