import { AES, enc } from 'crypto-js'
import { InputError } from '@helpers/errors';

export function encryptPrivateKey(privateKey: string, password: string) {
  return AES.encrypt(privateKey, password).toString()
}

export function decryptPrivateKey(privateKey: string, password: string): string | never {
  const decryptedKey = AES.decrypt(privateKey, password).toString(enc.Utf8)
  if (decryptedKey === '') {
    throw new InputError('Wallet password is incorrect', 'wallet-unlock-password')
  }
  return decryptedKey
}
