import { focus } from './focus'

export async function formAlert(message: string, key: string) {
  await sweetAlert('Oops!', message, 'error')
  focus(key)
}

export async function generalFailureAlert(message: string) {
  return sweetAlert('Oops!', message, 'error')
}

export async function generalSuccessAlert(message: string) {
  return sweetAlert('Success', message, 'success')
}
