import { buildAction } from 'typesafe-actions'
import { CreateWalletFormView, FormUpdate, CreateWalletForm } from '@types'

export const updateCreateWalletForm = buildAction('UPDATE_CREATE_WALLET_FORM').payload<FormUpdate<CreateWalletForm>>()
export const changeCreateWalletView = buildAction('CHANGE_CREATE_WALLET_VIEW').payload<CreateWalletFormView>()
