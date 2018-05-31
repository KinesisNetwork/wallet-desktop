import { focus } from './focus'

export async function formAlert(message: string, key: string) {
  await sweetAlert('Oops!', message, 'error')
  focus(key)
}
