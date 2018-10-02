import swal from 'sweetalert'
import { focus } from './focus'

export async function formAlert(message: string, key: string) {
  await swal('Oops!', message, 'error')
  focus(key)
}

export async function generalFailureAlert(message: string) {
  return swal('Oops!', message, 'error')
}

export async function generalSuccessAlert(message: string) {
  return swal('Success', message, 'success')
}
