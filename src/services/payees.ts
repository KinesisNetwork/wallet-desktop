import { saveItems } from '@services/persistance'
import { Payee } from '@types'
const PAYEE_KEY = 'payees'

export function savePayees(payees: Payee[]) {
  return saveItems<Payee>(PAYEE_KEY, payees)
}
