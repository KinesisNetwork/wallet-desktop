import * as React from 'react'

import { InputField } from '@components'
import { SignProps, SignTransactionForm } from '@containers'
import { formAlert } from '@helpers/alert'
import { enumStringValues } from '@helpers/enumStringValues'
import { InputError, WalletLockError } from '@helpers/errors'
import { SignBehaviour, SignedMessage } from '@types'
import { Keypair } from 'js-kinesis-sdk'
import { kebabCase, startCase } from 'lodash'

const verify = require('js-kinesis-sdk').verify
const StrKey = require('js-kinesis-sdk').StrKey

export class Sign extends React.Component<SignProps> {
  constructor(props: SignProps) {
    super(props)
  }

  tabs = () => {
    const behaviourOpts = enumStringValues(SignBehaviour)
    return behaviourOpts.map((b) => {
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
        <div className='tabs'>
          <ul>{this.tabs()}</ul>
        </div>
        {this.props.focus === SignBehaviour.sign && <SignForm {...this.props} />}
        {this.props.focus === SignBehaviour.verify && <VerifyForm {...this.props} />}
        {this.props.focus === SignBehaviour.signTransaction && <SignTransactionForm />}
      </div>
    )
  }
}

export class SignForm extends React.Component<SignProps> {
  constructor(props: SignProps) {
    super(props)
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
      formAlert(e.message, e.key)
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

  render() {
    const { signData, handleSignFormChange } = this.props
    return (
      <div className='is-centered'>
        <form onSubmit={this.signData}>
          <InputField
            label='Message'
            value={signData.message}
            id='signdata-message'
            helpText='Enter the text to sign'
            onChangeHandler={(newValue) => handleSignFormChange('message', newValue)}
          />
          <div className='field is-grouped'>
            <div className='control is-expanded'>
              <button className='button is-fullwidth' type='submit'>Sign</button>
            </div>
          </div>
          <div className='field'>
            <div className='label is-small'>Signature</div>
            <div className='control'>
              <textarea
                className='textarea'
                rows={5}
                style={{ width: '100%' }}
                value={this.props.signature}
                disabled={true}
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export class VerifyForm extends React.Component<SignProps> {
  constructor(props: SignProps) {
    super(props)
  }

  verifyData = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    try {
      this.validateProps()
      const decodedPubKey = StrKey.decodeEd25519PublicKey(this.props.verifyData.publicKey)
      const isVerified = verify(
        Buffer.from(this.props.verifyData.message, 'utf8'),
        Buffer.from(this.props.verifyData.signature, 'hex'),
        decodedPubKey,
      )

      this.props.verifyMessage(isVerified)
    } catch (e) {
      formAlert(e.message, e.key)
    }
  }

  validateProps = (): void | never => {
    this.checkValidEntry('message')
    this.checkValidEntry('signature')
    this.checkValidEntry('publicKey')
  }

  checkValidEntry = (key: keyof SignedMessage) => {
    if (!this.props.verifyData[key]) {
      throw new InputError(`${startCase(key)} is required`, `verify-${kebabCase(key)}`)
    }
  }

  render() {
    const { verifyData, handleVerifyFormChange } = this.props
    return (
      <div className='is-centered'>
        <form onSubmit={this.verifyData}>
          <InputField
            label='Message'
            value={verifyData.message}
            id='verify-message'
            helpText='Enter the raw message'
            onChangeHandler={(newValue) => handleVerifyFormChange('message', newValue)}
          />
          <InputField
            label='Signature'
            value={verifyData.signature}
            id='verify-signature'
            helpText='Enter the signed dataset'
            onChangeHandler={(newValue) => handleVerifyFormChange('signature', newValue)}
          />
          <InputField
            label='Public Key'
            value={verifyData.publicKey}
            id='verify-public-key'
            helpText='Enter the public key of the claimed signer'
            onChangeHandler={(newValue) => handleVerifyFormChange('publicKey', newValue)}
          />
          <div className='field is-grouped'>
            <div className='control is-expanded'>
              <button className='button is-fullwidth' type='submit'>Verify</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
