import { CreateWalletForm, CreateWalletFormView, FormUpdate } from '@types'
import { createStandardAction } from 'typesafe-actions'

export const updateCreateWalletForm = createStandardAction('UPDATE_CREATE_WALLET_FORM')<
  FormUpdate<CreateWalletForm>
>()
export const changeCreateWalletView = createStandardAction('CHANGE_CREATE_WALLET_VIEW')<
  CreateWalletFormView
>()
