import { retrieveItems, saveItems } from '@services/persistance'
import { Payee } from '@types'
const PAYEE_KEY = 'payees'

export function savePayees(payees: Payee[]) {
  return saveItems<Payee>(PAYEE_KEY, payees)
}

export function retrievePayees() {
  return retrieveItems<Payee>(PAYEE_KEY)
}
