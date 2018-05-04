import * as storage from 'electron-json-storage'

// We are saving everything to the JSON storage as an Array for convenience

export async function addNewItem<T extends object>(typeKey: string, item: T): Promise<T[]> {
  const existingItems = await retrieveItems<T>(typeKey)
  const itemsToSave = Array.isArray(existingItems)
    ? [item, ...existingItems] as T[]
    : [item]
  return saveItems(typeKey, itemsToSave)
}

export function retrieveItems<T>(typeKey: string, errorMessage?: string): Promise<T[]> {
  return new Promise<T[]>((res, rej) => {
    storage.get(typeKey, (err, data) => {
      if (err) {
        return rej(errorMessage)
      }
      const items = Array.isArray(data) ? data as T[] : []
      return res([...items])
    })
  })
}

export function saveItems<T>(typeKey: string, items: T[], errorMessage?: string): Promise<T[]> {
  return new Promise((res, rej) => {
    storage.set(typeKey, items, (err) => {
      if (err) {
        return rej(errorMessage)
      }
      return res(items)
    })
  })
}

export async function deleteItem<T extends object>(typeKey: string, filterFunc: (item: T) => boolean): Promise<T[]> {
  const existingItems = await retrieveItems<T>(typeKey)
  const items = Array.isArray(existingItems) ? existingItems : [existingItems]
  const newList = items.filter(filterFunc)
  return saveItems(typeKey, newList)
}
