import { clipboard } from 'electron'

export function copyToClipboard(value: string) {
  clipboard.writeText(value)
}
