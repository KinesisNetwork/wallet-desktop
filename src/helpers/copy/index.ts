import { copyToWebClipboard } from './web'

let copyToElectronClipboard

// If we are in webmode, we can't require electron, as it has reference to the fs module
if (!process.env.IS_WEB) {
  copyToElectronClipboard = require('./electron').copyToElectronClipboard
}

export function copyToClipboard(value: string) {
  return process.env.IS_WEB
    ? copyToWebClipboard(value)
    : copyToElectronClipboard(value)
}
