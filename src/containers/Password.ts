import { connect } from 'react-redux'
import { Dispatch, RootState } from '@store'
import { Password as PasswordPresentation } from '@components'
import { decryptPrivateKey } from '@services/encryption'
import { unlockWallet, changeUnlockPasswordInput, lockWallet } from '@actions';
import { Wallet } from '@types'
import { copyToClipboard } from '@helpers/copy';
import { InputError } from '@helpers/inputError';

const mapStateToProps = ({wallets, accounts, passwords}: RootState) => {
  const activeWallet = wallets.walletList[wallets.currentlySelected]
  const isAccountUnlocked = accounts.accountsMap[activeWallet.publicKey].isUnlocked
  const password = isAccountUnlocked
    ? passwords.map[activeWallet.publicKey].password
    : passwords.currentInput
  return {
    activeWallet,
    isAccountUnlocked,
    password,
    copyDecryptedPrivateKey: () => {
      // Password has already been validated
      const decryptedPrivateKey = decryptPrivateKey(activeWallet.encryptedPrivateKey, password)
      copyToClipboard(decryptedPrivateKey)
    },
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  unlockWallet: (wallet: Wallet, password: string) => {
    try {
      decryptPrivateKey(wallet.encryptedPrivateKey, password)
      dispatch(unlockWallet({ password, publicKey: wallet.publicKey }))
    } catch (e) {
      if (e instanceof InputError) {
        e.alert()
      }
    }
  },
  setPasswordInput: (password: string) => dispatch(changeUnlockPasswordInput(password)),
  lockWallet: (wallet: Wallet) => dispatch(lockWallet(wallet)),
})

export const Password = connect(mapStateToProps, mapDispatchToProps)(PasswordPresentation)
