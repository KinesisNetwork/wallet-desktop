import { connect } from 'react-redux'

import {
  changeSignFocus,
  messageVerificationResult,
  signMessage,
  updateSignForm,
  updateVerifyForm,
} from '@actions'
import { Sign as SignPresentation } from '@components/Sign'
import { getActiveKeys } from '@selectors'
import { Dispatch, RootState } from '@store'
import { RawMessage, SignBehaviour, SignedMessage } from '@types'

const mapStateToProps = (state: RootState) => {
  const { sign } = state
  const activeKeys = getActiveKeys(state)
  const isWalletUnlocked = !!activeKeys.privateKey
  const decryptedPrivateKey = activeKeys.privateKey
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
})

export type SignProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
export const Sign = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignPresentation)
