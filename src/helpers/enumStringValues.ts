export function enumStringValues(enumerable: any): string[] {
  return Object.entries(enumerable)
    .map(([, val]) => val)
    .filter(val => typeof val === 'string') as string[]
}
