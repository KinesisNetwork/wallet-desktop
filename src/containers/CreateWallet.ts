import { connect } from 'react-redux'

import { addWallet, changeCreateWalletView, updateCreateWalletForm } from '@actions'
import { CreateWallet as CreateWalletPresentation } from '@components/CreateWallet'
import { Dispatch, RootState } from '@store'
import { CreateWalletForm, CreateWalletFormView, Wallet } from '@types'

export const mapStateToProps = ({ createWallet }: RootState) => ({
  ...createWallet.form,
  activeView: createWallet.formView,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addWallet: (wallet: Wallet) => dispatch(addWallet(wallet)),
  changeFormView: (newView: CreateWalletFormView) => dispatch(changeCreateWalletView(newView)),
  handleChange: (field: keyof CreateWalletForm, newValue: string) =>
    dispatch(updateCreateWalletForm({ field, newValue })),
})

export const CreateWallet = connect(mapStateToProps, mapDispatchToProps)(CreateWalletPresentation)
