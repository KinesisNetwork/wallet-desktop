import { TransferView, WalletView } from '@types'
import { buildAction } from 'typesafe-actions'

export const changeWalletView = buildAction('CHANGE_WALLET_VIEW').payload<WalletView>()
export const changeTransferView = buildAction('CHANGE_TRANFER_VIEW').payload<TransferView>()
