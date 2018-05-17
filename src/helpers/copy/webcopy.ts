export function copyToWebClipboard(value: string) {
  document.execCommand('copy', undefined, value)
}
