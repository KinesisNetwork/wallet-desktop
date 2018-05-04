export function focus (id: string): void {
  const foundElement = document.getElementById(id)
  if (foundElement) {
    foundElement.focus()
  }
}
