import storage = require('electron-json-storage')

export function addNewItem<T>(typeKey: string, item: any): Promise<T[]> {
  return retrieveItems(typeKey)
    .then((items: T[]) => {
      const newItemList = [item].concat(items || [])
      return saveItems<T>(typeKey, newItemList)
    })
}

export function retrieveItems<T>(typeKey: string): Promise<T[]> {
  const error = 'Something appeared to be wrong while attempting to retrieve your wallet'
  return new Promise((res, rej) => {
    storage.get(typeKey, (getErr, data) => {
      if (!data.length) {
        data = []
      }

      if (getErr) {
        return rej(error)
      }
      return res(data)
    })
  })
}

export function saveItems<T>(typeKey: string, newItemList: any[]): Promise<T[]> {
  const error = 'Something appeared to be wrong while attempting to save the new address to your wallet'
  return new Promise((res, rej) => {
    storage.set(typeKey, newItemList, (setErr) => {
      if (setErr) {
        return rej(error)
      }
      return res(newItemList)
    })
  })
}

export function deleteItem<T>(typeKey: string, filterFunc: any): Promise<T[]> {
  return retrieveItems<T>(typeKey)
    .then((items: any[]) => {
      let newList = items.filter(filterFunc)//(wallet: any) => wallet.publicKey !== accountId)
      return saveItems<T>(typeKey, newList)
    })
}
