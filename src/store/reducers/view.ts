import { addWallet, changeTransferView, changeWalletView, setPayee } from '@actions'
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
      case getType(changeWalletView): return action.payload
      case getType(addWallet): return WalletView.dashboard
      default: return state
    }
  },
  transferView: (state = TransferView.transfer, action) => {
    switch (action.type) {
      case getType(changeTransferView): return action.payload

      case getType(setPayee):
      case getType(changeWalletView):
        return TransferView.transfer
      default: return state
    }
  },
})
