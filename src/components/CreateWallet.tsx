import { Keypair } from 'js-kinesis-sdk'
import { kebabCase, startCase } from 'lodash'
import * as React from 'react'

import { InputField } from '@components/InputField'
import { formAlert } from '@helpers/alert'
import { InputError } from '@helpers/errors'
import { encryptPrivateKey } from '@services/encryption'
import { CreateWalletForm, CreateWalletFormView as FormView, Wallet } from '@types'

export interface Props extends CreateWalletForm {
  activeView: FormView
  addWallet: (wallet: Wallet) => any
  handleChange: (field: keyof CreateWalletForm, newValue: string) => any
  changeFormView: (newView: FormView) => any
}

export const CreateWallet: React.SFC<Props> = (props) => (
  <div className='vertical-spaced has-text-centered'>
    <h1 className='title-heading'>ADD A NEW ACCOUNT</h1>
    <section className='section'>
      {props.activeView === FormView.select && <FormSelection changeFormView={props.changeFormView} />}
      {props.activeView !== FormView.select && <WalletForm {...props} />}
    </section>
  </div>
)

CreateWallet.displayName = 'CreateWallet'

const FormSelection: React.SFC<Pick<Props, 'changeFormView'>> = ({ changeFormView }) => (
  <div className='buttons is-centered'>
    <button className='button' onClick={() => changeFormView(FormView.generate)}>
      Generate New Account
    </button>
    <button className='button' onClick={() => changeFormView(FormView.import)}>
      Import Existing Account
    </button>
  </div>
)

export class WalletForm extends React.Component<Props> {
  displayName = 'WalletForm'

  constructor(props: Props) {
    super(props)
  }

  createNewWallet = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    try {
      this.validateProps()
      const { publicKey, privateKey } = this.generateKeyOrExtractFromProps()
      const encryptedPrivateKey = encryptPrivateKey(privateKey, this.props.password)
      this.props.addWallet({
        encryptedPrivateKey,
        publicKey,
        accountName: this.props.accountName,
      })
    } catch (e) {
      formAlert(e.message, e.key)
    }
  }

  validateProps = (): void | never => {
    this.checkValidEntry('accountName')
    if (this.props.activeView === FormView.import) {
      this.checkValidEntry('privateKey')
    }
    this.checkValidEntry('password')
    this.checkValidPassword()
  }

  generateKeyOrExtractFromProps = () => {
    const keypair = this.props.activeView === FormView.import
      ? Keypair.fromSecret(this.props.privateKey)
      : Keypair.random()
    return { publicKey: keypair.publicKey(), privateKey: keypair.secret() }
  }

  checkValidEntry = (key: keyof CreateWalletForm) => {
    if (!this.props[key]) {
      throw new InputError(`${startCase(key)} is required`, `input-${kebabCase(key)}`)
    }
  }

  checkValidPassword = () => {
    const password = this.props.password
    const lengthOfPassword = password.length
    if (lengthOfPassword < 12 || lengthOfPassword > 30) {
      throw new InputError('Password needs to be between 12 and 30 characters long', `input-${kebabCase('password')}`)
    }

    if (password !== this.props.passwordVerify) {
      throw new InputError(`Passwords don't match`, `input-${kebabCase('passwordVerify')}`)
    }
  }

  renderImportFields = () => (
    <InputField
      label='Private Key'
      value={this.props.privateKey}
      id='private-key'
      helpText='Add your private key'
      onChangeHandler={(newValue) => this.props.handleChange('privateKey', newValue)}
    />
  )

  render() {
    const {
      activeView,
      accountName,
      password,
      passwordVerify,
      changeFormView,
      handleChange,
    } = this.props
    const action = activeView === FormView.import ? 'Import' : 'Generate'
    return (
      <div>
        <div>
          <span className='icon is-large'>
            <i className='far fa-user' />
          </span>
          <h1 className='title is-4 heading primary-font'>
            {`${action} Account`}
          </h1>
        </div>
        <div className='columns is-centered'>
          <form onSubmit={this.createNewWallet} className='column is-half'>
            <InputField
              label='Account Name'
              value={accountName}
              id='account-name'
              helpText='Add an alias for your account'
              onChangeHandler={(newValue) => handleChange('accountName', newValue)}
            />
            {activeView === FormView.import && this.renderImportFields()}
            <InputField
              label='Account Password'
              value={password}
              type={'password'}
              id='password'
              helpText='Add a password for locking this account'
              onChangeHandler={(newValue) => handleChange('password', newValue)}
            />
            <InputField
              label='Repeat Password'
              value={passwordVerify}
              type={'password'}
              id='password-verify'
              onChangeHandler={(newValue) => handleChange('passwordVerify', newValue)}
            />
            <div className='field is-grouped'>
              <div className='control is-expanded'>
                <button className='button is-fullwidth' type='submit'>{`${action} Account`}</button>
              </div>
              <div className='control'>
                <button className='button is-danger' type='button' onClick={() => changeFormView(FormView.select)}>
                  Back
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
