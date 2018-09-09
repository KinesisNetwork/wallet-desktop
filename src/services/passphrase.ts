import * as bip39 from 'bip39'
import { createHash } from 'crypto'
import { Keypair } from 'js-kinesis-sdk'

function getSeedphrase(): string[] {
  return bip39.generateMnemonic().split(' ')
}

function generateKeypair(seedphrase: string, index: number): Keypair {
  const hash = createHash('sha256')
    .update(seedphrase + String(index))
    .digest()
  const keypair = Keypair.fromRawEd25519Seed(hash)
  return keypair
}
