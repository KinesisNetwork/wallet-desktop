export function setWebStorage<T>(key: string, items: T[], callback: (err: any) => void) {
  const storageString = JSON.stringify(items)
  window.localStorage.set(key, storageString)
  callback(null)
}

export function getWebStorage(key: string, callback: (err: any, data: {}) => void) {
  const res = window.localStorage.get(key)
  const items = JSON.parse(res)
  callback(null, items)
}
