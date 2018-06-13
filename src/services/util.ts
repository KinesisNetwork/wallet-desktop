export function renderAmount(amount: string | number) {
  return Number(amount).toLocaleString(undefined, {
    useGrouping: true,
  })
}
