import { AES, enc } from 'crypto-js'

export function encryptPrivateKey(privateKey: string, password: string) {
  return AES.encrypt(privateKey, password).toString()
}

export function decryptPrivateKey(privateKey: string, password: string) {
  return AES.decrypt(privateKey, password).toString(enc.Utf8)
}
