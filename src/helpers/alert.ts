import * as _swal from 'sweetalert'
import { SweetAlert } from 'sweetalert/typings/core'
import { focus } from './focus'

const swal: SweetAlert = _swal as any

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
