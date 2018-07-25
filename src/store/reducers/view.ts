import {
  addPayee,
  addWallet,
  changeTransferView,
  changeWalletView,
  deleteWallet,
  selectWallet,
} from '@actions'
import { RootAction } from '@store'
import { TransferView, WalletView } from '@types'
import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

export interface ViewState {
  readonly walletView: WalletView
  readonly transferView: TransferView
}

export const view = combineReducers<ViewState, RootAction>({
  walletView: (state = WalletView.create, action) => {
    switch (action.type) {
      case getType(changeWalletView):
        return action.payload

      case getType(selectWallet):
      case getType(addWallet):
        return WalletView.dashboard

      case getType(deleteWallet):
        return WalletView.create
      default:
        return state
    }
  },
  transferView: (state = TransferView.transfer, action) => {
    switch (action.type) {
      case getType(changeTransferView):
        return action.payload

      case getType(addPayee):
      case getType(changeWalletView):
        return TransferView.transfer
      default:
        return state
    }
  },
})
