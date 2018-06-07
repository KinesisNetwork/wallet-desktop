export class InputError extends Error {
  public key: string
  constructor(message: string, key: string) {
    super(message)
    this.key = key
  }
}

export class WalletLockError extends InputError {
  constructor() {
    super('Wallet must be unlocked', 'wallet-unlock-password')
  }
}

export class AccountMissingError extends Error {
  publicKey: string
  constructor(key: string) {
    super('Account does not exist on the network')
    this.publicKey = key
  }
}

export class TransferSubmitError extends InputError {
  constructor() {
    super('A Target Address and Payee cannot both be specified', 'transfer-error')
  }
}
