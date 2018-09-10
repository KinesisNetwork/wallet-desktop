import { buildAction } from 'typesafe-actions'

export const createWallet = buildAction('CREATE_WALLET').empty()
export const setPassphrase = buildAction('SET_PASSPHRASE').payload<{ passphrase: string }>()
