const storage = require('electron-json-storage')
const walletsKey = 'wallets'

export function addNewWallet(publicKey: string, encryptedPrivateKey: string) {
  const walletEntry = { publicKey, encryptedPrivateKey }

  return retrieveWallets()
    .then((wallets) => {
      const newWalletList = [walletEntry].concat(wallets || [])
      return saveWallets(newWalletList)
    })
}

export function retrieveWallets() {
  const error = 'Something appeared to be wrong while attempting to retrieve your wallet'
  return new Promise((res, rej) => {
    storage.get(walletsKey, (getErr, data = []) => {
      if (getErr) {
        return rej(error)
      }
      return res(data)
    })
  })
}

export function saveWallets(newWalletList) {
  const error = 'Something appeared to be wrong while attempting to save the new address to your wallet'
  return new Promise((res, rej) => {
    storage.set(walletsKey, newWalletList, (setErr) => {
      if (setErr) {
        return rej(error)
      }
      return res(newWalletList)
    })
  })
}

export function deleteWallet(index) {
  return retrieveWallets()
    .then((wallets) => {
      wallets.splice(index, 1)
      return saveWallets(wallets)
    })
}
