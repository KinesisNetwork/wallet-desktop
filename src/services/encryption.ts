import { AES, enc } from 'crypto-js'

export function encryptWithPassword(stringToEncrypt: string, password: string) {
  return AES.encrypt(stringToEncrypt, password).toString()
}

export function decryptWithPassword(encryptedString: string, password: string): string {
  try {
    const decryptedKey = AES.decrypt(encryptedString, password).toString(enc.Utf8)
    return decryptedKey
  } catch (e) {
    return ''
  }
}
