let getElectronStorage, setElectronStorage

// If we are in webmode, we can't require electron, as it has reference to the fs module
if (!process.env.IS_WEB) {
  getElectronStorage = require('./electron').getElectronStorage
  setElectronStorage = require('./electron').setElectronStorage
}

import { getWebStorage, setWebStorage } from './webstorage'

export function setStorage<T>(key: string, items: T[], callback: (err: any) => void) {
  return process.env.IS_WEB
    ? setWebStorage(key, items, callback)
    : setElectronStorage(key, items, callback)
}

export function getStorage(key: string, callback: (err: any, data: {}) => void) {
  return process.env.IS_WEB
    ? getWebStorage(key, callback)
    : getElectronStorage(key, callback)
}
