import { connect } from 'react-redux'

import {
  changeSignFocus,
  invalidForm,
  messageVerificationResult,
  signMessage,
  updateSignForm,
  updateVerifyForm,
} from '@actions'
import { Sign as SignPresentation } from '@components/Sign'
import { Dispatch, RootState } from '@store'
import { FormAlert, RawMessage, SignBehaviour, SignedMessage, Wallet } from '@types'

const mapStateToProps = ({ sign, wallets, passwords, accounts }: RootState) => {
  const activeWallet = wallets.activeWallet as Wallet
  const isWalletUnlocked = accounts.accountsMap[activeWallet.publicKey].isUnlocked
  const decryptedPrivateKey = isWalletUnlocked
    ? passwords.livePasswords[activeWallet.publicKey].privateKey
    : ''
  return {
    decryptedPrivateKey,
    isWalletUnlocked,
    focus: sign.focus,
    signature: sign.signature,
    isValidSignature: sign.isValidSignature,
    signData: sign.signData,
    verifyData: sign.verifyData,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeSignFocus: (focus: SignBehaviour): void => {
    dispatch(changeSignFocus(focus))
  },
  handleSignFormChange: (field: keyof RawMessage, newValue: string) => {
    dispatch(updateSignForm({ field, newValue }))
  },
  handleVerifyFormChange: (field: keyof SignedMessage, newValue: string) => {
    dispatch(updateVerifyForm({ field, newValue }))
  },
  signMessage: (signature: string) => dispatch(signMessage(signature)),
  messageVerificationResult: (isValid: boolean) => dispatch(messageVerificationResult(isValid)),
  formIsInvalid: (error: FormAlert) => dispatch(invalidForm(error))
})

export type SignProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
export const Sign = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignPresentation)
