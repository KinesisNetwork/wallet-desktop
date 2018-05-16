import { copyToElectronClipboard } from './electron'
import { copyToWebClipboard } from './web'

export function copyToClipboard(value: string) {
  return process.env.IS_WEB
    ? copyToWebClipboard(value)
    : copyToElectronClipboard(value)
}
