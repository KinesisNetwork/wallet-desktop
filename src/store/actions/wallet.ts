import { buildAction } from 'typesafe-actions'

export const startWalletCreation = buildAction('CREATE_WALLET').empty()
export const setPassphrase = buildAction('SET_PASSPHRASE').payload<{ passphrase: string }>()
