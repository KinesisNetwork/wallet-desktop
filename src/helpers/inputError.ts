import { focus } from '@helpers/focus';

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
