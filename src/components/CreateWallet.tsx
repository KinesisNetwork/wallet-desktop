import { InputField } from '@components'
import { InputError } from '@helpers/errors'
import { encryptPrivateKey } from '@services/encryption'
import { CreateWalletForm, CreateWalletFormView as FormView, Wallet } from '@types'
import { Keypair } from 'js-kinesis-sdk'
import { kebabCase, startCase } from 'lodash'
import * as React from 'react'

export interface Props extends CreateWalletForm {
  currentView: FormView
  addWallet: (wallet: Wallet) => any
  handleChange: (field: keyof CreateWalletForm, newValue: string) => any
  changeFormView: (newView: FormView) => any
}

export const CreateWallet: React.SFC<Props> = (props) => (
  <div className='vertical-spaced has-text-centered'>
    <h1 className='title-heading'>Add a new wallet</h1>
    <div>
      {props.currentView === FormView.select && <FormSelection changeFormView={props.changeFormView} />}
      {props.currentView !== FormView.select && <WalletForm {...props} />}
    </div>
  </div>
)

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
      if (e instanceof InputError) {
        e.alert()
      }
    }
  }

  validateProps = (): void | never => {
    this.checkValidEntry('accountName')
    if (this.props.currentView === FormView.import) {
      this.checkValidEntry('publicKey')
      this.checkValidEntry('privateKey')
    }
    this.checkValidEntry('password')
    this.checkValidPassword()
  }

  generateKeyOrExtractFromProps = () => {
    if (this.props.currentView === FormView.import) {
      return { publicKey: this.props.publicKey, privateKey: this.props.privateKey }
    } else {
      const keypair = Keypair.random()
      return { publicKey: keypair.publicKey(), privateKey: keypair.secret() }
    }
  }

  checkValidEntry = (key: keyof CreateWalletForm) => {
    if (!this.props[key]) {
      throw new InputError(`${startCase(key)} is required`, `input-${kebabCase(key)}`)
    }
  }

  checkValidPassword = () => {
    if (this.props.password !== this.props.passwordVerify) {
      throw new InputError(`Passwords don't match`, `input-${kebabCase('passwordVerify')}`)
    }
  }

  renderImportFields = () => {
    return (
      <React.Fragment>
        <InputField
          label='Public Key'
          value={this.props.publicKey}
          id='public-key'
          onChangeHandler={(newValue) => this.props.handleChange('publicKey', newValue)}
        />
        <InputField
          label='Private Key'
          value={this.props.privateKey}
          id='private-key'
          onChangeHandler={(newValue) => this.props.handleChange('privateKey', newValue)}
        />
      </React.Fragment>
    )
  }

  render() {
    const {
      currentView,
      accountName,
      password,
      passwordVerify,
      changeFormView,
      handleChange,
    } = this.props
    const action = currentView === FormView.import ? 'Import' : 'Generate'
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
              label='Wallet Name'
              value={accountName}
              id='account-name'
              onChangeHandler={(newValue) => handleChange('accountName', newValue)}
            />
            {currentView === FormView.import && this.renderImportFields()}
            <InputField
              label='Wallet Password'
              value={password}
              isPassword={true}
              id='password'
              onChangeHandler={(newValue) => handleChange('password', newValue)}
            />
            <InputField
              label='Repeat Password'
              value={passwordVerify}
              isPassword={true}
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
