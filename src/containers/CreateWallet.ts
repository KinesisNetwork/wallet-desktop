import { connect } from 'react-redux'
import { Dispatch, RootState } from '@store'
import { addWallet, updateCreateWalletForm, changeCreateWalletView } from '@actions'
import { Wallet, CreateWalletForm, CreateWalletFormView } from '@types'
import { addNewWallet } from '@services/wallets'
import { CreateWallet as CreateWalletPresentation } from '@components'

const mapStateToProps = ({createWallet}: RootState) => ({
  ...createWallet.form,
  currentView: createWallet.formView,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addWallet: async (wallet: Wallet) => {
    dispatch(addWallet(wallet))
    await addNewWallet(wallet)
  },
  handleChange: (field: keyof CreateWalletForm, newValue: string) => {
    dispatch(updateCreateWalletForm({field, newValue}))
  },
  changeFormView: (newView: CreateWalletFormView) => dispatch(changeCreateWalletView(newView)),
})

export const CreateWallet = connect(mapStateToProps, mapDispatchToProps)(CreateWalletPresentation)
