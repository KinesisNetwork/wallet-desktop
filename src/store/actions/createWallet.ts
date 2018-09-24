import { CreateWalletForm, CreateWalletFormView, FormUpdate } from '@types'
import { buildAction } from 'typesafe-actions'

export const updateCreateWalletForm = buildAction('UPDATE_CREATE_WALLET_FORM').payload<
  FormUpdate<CreateWalletForm>
>()
export const changeCreateWalletView = buildAction('CHANGE_CREATE_WALLET_VIEW').payload<
  CreateWalletFormView
>()
