export function enumStringValues(enumerable: any) {
  const members = Object.keys(enumerable).map((key) => enumerable[key])
  return members.filter((val) => typeof val !== 'number')
}
