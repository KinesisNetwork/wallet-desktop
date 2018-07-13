import { connect } from 'react-redux'

import { changeUnlockPasswordInput, lockWallet, unlockWallet } from '@actions'
import { Password as PasswordPresentation } from '@components/Password'
import { formAlert } from '@helpers/alert'
import { decryptPrivateKey } from '@services/encryption'
import { Dispatch, RootState } from '@store'
import { Wallet } from '@types'

export const mapStateToProps = ({ wallets, accounts, passwords }: RootState) => {
  const activeWallet = wallets.activeWallet as Wallet
  const isAccountUnlocked = accounts.accountsMap[activeWallet.publicKey].isUnlocked
  const password = passwords.currentInput
  const decryptedPrivateKey = isAccountUnlocked ? passwords.livePasswords[activeWallet.publicKey].privateKey : ''
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
