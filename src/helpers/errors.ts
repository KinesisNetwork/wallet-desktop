import { focus } from '@helpers/focus'

export class InputError extends Error {
  public key: string
  constructor(message: string, key: string) {
    super(message)
    this.key = key
  }

  public async alert() {
    await sweetAlert('Oops!', this.message, 'error')
    focus(this.key)
  }
}

export class WalletLockError extends InputError {
  constructor() {
    super('Wallet must be unlocked', 'wallet-unlock-password')
  }
}

export class AccountMissingError extends Error {
  constructor() {
    super('Account does not exist on the network')
  }
}
