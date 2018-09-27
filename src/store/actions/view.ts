import { TransferView, WalletView } from '@types'
import { createStandardAction } from 'typesafe-actions'

export const changeWalletView = createStandardAction('CHANGE_WALLET_VIEW')<WalletView>()
export const changeTransferView = createStandardAction('CHANGE_TRANFER_VIEW')<TransferView>()
