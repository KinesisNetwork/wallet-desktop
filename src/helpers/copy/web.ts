export function copyToWebClipboard(value: string) {
  document.execCommand(value)
}
