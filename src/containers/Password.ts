import { changeUnlockPasswordInput, lockWallet, unlockWallet } from '@actions'
import { Password as PasswordPresentation } from '@components'
import { formAlert } from '@helpers/alert'
import { decryptPrivateKey } from '@services/encryption'
import { Dispatch, RootState } from '@store'
import { Wallet } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({ wallets, accounts, passwords }: RootState) => {
  const activeWallet = wallets.walletList[wallets.currentlySelected]
  const isAccountUnlocked = accounts.accountsMap[activeWallet.publicKey].isUnlocked
  const password = isAccountUnlocked
    ? passwords.map[activeWallet.publicKey].password
    : passwords.currentInput
  return {
    activeWallet,
    isAccountUnlocked,
    password,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  lockWallet: (wallet: Wallet) => dispatch(lockWallet(wallet)),
  setPasswordInput: (password: string) => dispatch(changeUnlockPasswordInput(password)),
  unlockWallet: ({ encryptedPrivateKey, publicKey }: Wallet, password: string) => {
    try {
      const decryptedPrivateKey = decryptPrivateKey(encryptedPrivateKey, password)
      dispatch(unlockWallet({ password, publicKey, decryptedPrivateKey }))
    } catch (e) {
      formAlert(e.message, e.key)
    }
  },
})

export const Password = connect(mapStateToProps, mapDispatchToProps)(PasswordPresentation)
