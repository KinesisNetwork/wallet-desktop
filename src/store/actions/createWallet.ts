import { buildAction } from 'typesafe-actions'
import { CreateWalletFormView } from '@types'

interface FormUpdate {
  field: string
  newValue: string
}
export const updateCreateWalletForm = buildAction('UPDATE_CREATE_WALLET_FORM').payload<FormUpdate>()
export const changeCreateWalletView = buildAction('CHANGE_CREATE_WALLET_VIEW').payload<CreateWalletFormView>()
