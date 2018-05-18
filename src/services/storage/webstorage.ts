export function setWebStorage<T>(key: string, items: T[], callback: (err: any) => void) {
  const storageString = JSON.stringify(items)
  window.localStorage.setItem(key, storageString)
  callback(null)
}

export function getWebStorage(key: string, callback: (err: any, data: {}) => void) {
  const res = window.localStorage.getItem(key)
  const items = res ? JSON.parse(res) : null
  callback(null, items)
}
