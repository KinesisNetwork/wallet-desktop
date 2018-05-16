import { getElectronStorage, setElectronStorage } from './electron'
import { getWebStorage, setWebStorage } from './web'

export function setStorage<T>(key: string, items: T[], callback: (err: any) => void) {
  return process.env.IS_WEB
    ? setElectronStorage(key, items, callback)
    : setWebStorage(key, items, callback)
}

export function getStorage(key: string, callback: (err: any, data: {}) => void) {
  return process.env.IS_WEB
    ? getElectronStorage(key, callback)
    : getWebStorage(key, callback)
}
