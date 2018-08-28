import { connect } from 'react-redux'

import { changeUnlockPasswordInput, lockWallet, unlockWalletRequest } from '@actions'
import { Password as PasswordPresentation } from '@components/Password'
import { getActiveKeys } from '@selectors'
import { RootState } from '@store'

export const mapStateToProps = (state: RootState) => {
  const activeKeys = getActiveKeys(state)
  const password = state.passwords.currentInput
  return {
    activePublicKey: activeKeys.publicKey,
    isAccountUnlocked: !!activeKeys.privateKey,
    password,
    decryptedPrivateKey: activeKeys.privateKey,
  }
}

const mapDispatchToProps = {
  lockWallet,
  setPasswordInput: changeUnlockPasswordInput,
  unlockWallet: unlockWalletRequest,
}

export const Password = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PasswordPresentation)
