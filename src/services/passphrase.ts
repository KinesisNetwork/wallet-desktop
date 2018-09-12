import * as bip39 from 'bip39'
import * as hdKey from 'ed25519-hd-key'
import { Keypair } from 'js-kinesis-sdk'

export function generateMnemonic() {
  return bip39.generateMnemonic()
}

export function validateMnemonic(mnemonic: string) {
  return bip39.validateMnemonic(mnemonic)
}

export function getKeypairFromMnemonic(mnemonic: string, index: number) {
  const data = hdKey.derivePath(`m/44'/148'/${index}'`, bip39.mnemonicToSeedHex(mnemonic))
  return Keypair.fromRawEd25519Seed(data.key)
}

export function getKeypairFromSecret(secret: string) {
  return Keypair.fromSecret(secret)
}
