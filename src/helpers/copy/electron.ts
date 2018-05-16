import { clipboard } from 'electron'

export function copyToElectronClipboard(value: string) {
  clipboard.writeText(value)
}
