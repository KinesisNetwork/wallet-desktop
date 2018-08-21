let CryptoJS = require('crypto-js')

export function encryptPrivateKey(privateKey: string, password: string) {
  let encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, password).toString()
  return encryptedPrivateKey
}

export function decryptPrivateKey(privateKey: string, password: string) {
  let decryptedPrivateKeyByte = CryptoJS.AES.decrypt(privateKey, password)
  let decryptedPrivateKey = decryptedPrivateKeyByte.toString(CryptoJS.enc.Utf8);

  return decryptedPrivateKey
}

