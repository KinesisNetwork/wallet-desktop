import { WalletCreationModals } from '@types'
import { buildAction } from 'typesafe-actions'

export const createWallet = buildAction('CREATE_WALLET').empty()
export const setPassphrase = buildAction('SET_PASSPHRASE').payload<{ passphrase: string }>()

export const setWalletCreationActiveModal = buildAction(
  'SET_WALLET_CREATION_ACTIVE_MODAL',
).payload<{ activeModal: WalletCreationModals }>()
export const closeWalletCreationModal = buildAction('CLOSE_WALLET_CREATION_ACTIVE_MODAL').empty()
