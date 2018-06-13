import { changeUnlockPasswordInput, lockWallet, unlockWallet } from '@actions'
import { Password as PasswordPresentation } from '@components'
import { formAlert } from '@helpers/alert'
import { decryptPrivateKey } from '@services/encryption'
import { Dispatch, RootState } from '@store'
import { Wallet } from '@types'
import { connect } from 'react-redux'

const mapStateToProps = ({ wallets, accounts, passwords }: RootState) => {
  const activeWallet = wallets.selectedWallet as Wallet
  const isAccountUnlocked = accounts.accountsMap[activeWallet.publicKey].isUnlocked
  const password = isAccountUnlocked
    ? passwords.livePasswords[activeWallet.publicKey].password
    : passwords.currentInput
  const decryptedPrivateKey = decryptPrivateKey(activeWallet.encryptedPrivateKey, password)
  return {
    activeWallet,
    isAccountUnlocked,
    password,
    decryptedPrivateKey,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  lockWallet: (wallet: Wallet) => dispatch(lockWallet(wallet)),
  setPasswordInput: (password: string) => dispatch(changeUnlockPasswordInput(password)),
  unlockWallet: ({ encryptedPrivateKey, publicKey }: Wallet, password: string) => {
    const decryptedPrivateKey = decryptPrivateKey(encryptedPrivateKey, password)
    if (decryptedPrivateKey !== '') {
      return dispatch(unlockWallet({ password, publicKey, decryptedPrivateKey }))
    } else {
      return formAlert('Account password is incorrect', 'wallet-unlock-password')
    }
  },
})

export const Password = connect(mapStateToProps, mapDispatchToProps)(PasswordPresentation)
