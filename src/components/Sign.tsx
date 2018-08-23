import * as copy from 'copy-to-clipboard'
import { Keypair } from 'js-kinesis-sdk'
import { kebabCase, startCase } from 'lodash'
import * as React from 'react'

import { InputField } from '@components/InputField'
import { SignProps } from '@containers/Sign'
import { SignTransactionForm } from '@containers/SignTransactionForm'
import { enumStringValues } from '@helpers/enumStringValues'
import { InputError, WalletLockError } from '@helpers/errors'
import { SignBehaviour, SignedMessage } from '@types'

export class Sign extends React.Component<SignProps> {
  displayName: string = 'Sign'

  tabs = () => {
    const behaviourOpts = enumStringValues(SignBehaviour)
    return behaviourOpts.map(b => {
      const behaviour = b as SignBehaviour
      return (
        <li
          key={behaviour}
          className={`${this.props.focus === behaviour && 'is-active'}`}
          onClick={() => this.props.changeSignFocus(behaviour)}
        >
          <a>
            <span>{b}</span>
          </a>
        </li>
      )
    })
  }

  render() {
    return (
      <div>
        <div className="tabs">
          <ul>{this.tabs()}</ul>
        </div>
        {this.props.focus === SignBehaviour.sign && <SignForm {...this.props} />}
        {this.props.focus === SignBehaviour.verify && <VerifyForm {...this.props} />}
        {this.props.focus === SignBehaviour.signTransaction && <SignTransactionForm />}
      </div>
    )
  }
}

interface State {
  copied: boolean
}
export class SignForm extends React.Component<SignProps, State> {
  displayName: string = 'SignForm'

  state: State = {
    copied: false,
  }
  signData = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    try {
      this.validateProps()
      const secret = this.props.decryptedPrivateKey
      const kp = Keypair.fromSecret(secret)
      const signature = kp.sign(Buffer.from(this.props.signData.message, 'utf8'))
      this.props.signMessage(signature.toString('hex'))
    } catch (e) {
      this.props.callFormAlert({
        message: e.message,
        key: e.key
      })
    }
  }

  checkWalletIsUnlocked = () => {
    if (!this.props.isWalletUnlocked) {
      throw new WalletLockError()
    }
  }

  validateProps = (): void | never => {
    this.checkWalletIsUnlocked()
    this.checkValidEntry('message')
  }

  checkValidEntry = (key: keyof SignedMessage) => {
    if (!this.props.signData[key]) {
      throw new InputError(`${startCase(key)} is required`, `signdata-${kebabCase(key)}`)
    }
  }

  copySignature = () => {
    copy(this.props.signature)
    this.setState({ copied: true })
    setTimeout(() => this.setState({ copied: false }), 2000)
  }

  render() {
    const { signData, handleSignFormChange, signature } = this.props
    const { copied } = this.state
    return (
      <div className="is-centered">
        <form onSubmit={this.signData}>
          <InputField
            label="Message"
            value={signData.message}
            id="signdata-message"
            helpText="Enter the text to sign"
            onChangeHandler={newValue => handleSignFormChange('message', newValue)}
          />
          <div className="field is-grouped">
            <div className="control is-expanded">
              <button className="button is-fullwidth" type="submit">
                Sign
              </button>
            </div>
          </div>
          <div className="field">
            <label className="label is-small">Signature</label>
            <div className="field is-grouped">
              <div className="control is-expanded">
                <input className="input" value={signature} readOnly={true} disabled={true} />
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button"
                  onClick={this.copySignature}
                  disabled={!signature}
                >
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                  {copied && (
                    <span className="icon has-text-success">
                      <i className="fas fa-check" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export class VerifyForm extends React.Component<SignProps> {
  displayName: string = 'VerifyForm'

  constructor(props: SignProps) {
    super(props)
  }

  verifyData = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (!this.isValidForm()) {
      return
    }
    this.props.messageVerificationResult(this.verifyMessageSignature())
  }

  verifyMessageSignature = () => {
    try {
      const keypair = Keypair.fromPublicKey(this.props.verifyData.publicKey)
      return keypair.verify(
        Buffer.from(this.props.verifyData.message, 'utf8'),
        Buffer.from(this.props.verifyData.signature, 'hex'),
      )
    } catch (e) {
      return false
    }
  }

  isValidForm = (): boolean => {
    try {
      this.checkValidEntry('message')
      this.checkValidEntry('signature')
      this.checkValidEntry('publicKey')
      return true
    } catch (e) {
      this.props.callFormAlert({
        message: e.message,
        key: e.key
      })
      return false
    }
  }

  checkValidEntry = (key: keyof SignedMessage) => {
    if (!this.props.verifyData[key]) {
      throw new InputError(`${startCase(key)} is required`, `verify-${kebabCase(key)}`)
    }
  }

  render() {
    const { verifyData, handleVerifyFormChange } = this.props
    return (
      <div className="is-centered">
        <form onSubmit={this.verifyData}>
          <InputField
            label="Message"
            value={verifyData.message}
            id="verify-message"
            helpText="Enter the raw message"
            onChangeHandler={newValue => handleVerifyFormChange('message', newValue)}
          />
          <InputField
            label="Signature"
            value={verifyData.signature}
            id="verify-signature"
            helpText="Enter the signed dataset"
            onChangeHandler={newValue => handleVerifyFormChange('signature', newValue)}
          />
          <InputField
            label="Public Key"
            value={verifyData.publicKey}
            id="verify-public-key"
            helpText="Enter the public key of the claimed signer"
            onChangeHandler={newValue => handleVerifyFormChange('publicKey', newValue)}
          />
          <div className="field is-grouped">
            <div className="control is-expanded">
              <button className="button is-fullwidth" type="submit">
                Verify
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
