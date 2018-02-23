import { Wallet } from '../app';
import storage = require('electron-json-storage')
const walletsKey = 'wallets'

export function addNewWallet(publicKey: string, encryptedPrivateKey: string): Promise<Wallet[]> {
  const walletEntry = { publicKey, encryptedPrivateKey }

  return retrieveWallets()
    .then((wallets: Wallet[]) => {
      const newWalletList = [walletEntry].concat(wallets || [])
      return saveWallets(newWalletList)
    })
}

export function retrieveWallets(): Promise<Wallet[]> {
  const error = 'Something appeared to be wrong while attempting to retrieve your wallet'
  return new Promise((res, rej) => {
    storage.get(walletsKey, (getErr, data) => {
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

export function saveWallets(newWalletList): Promise<Wallet[]> {
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

export function deleteWallet(accountId): Promise<Wallet[]> {
  return retrieveWallets()
    .then((wallets: any[]) => {
      let newList = wallets.filter((wallet: any) => wallet.publicKey !== accountId)
      return saveWallets(newList)
    })
}
