import * as React from 'react'
import { startCase, kebabCase } from 'lodash'
import { CreateWalletForm, CreateWalletFormView, Wallet } from '@types'
import { InputField } from '@components'
import { encryptPrivateKey } from '@services/encryption';
import { InputError } from '@helpers/inputError'

export interface Props extends CreateWalletForm {
  currentView: CreateWalletFormView
  addWallet: (wallet: Wallet) => any
  handleChange: (field: keyof CreateWalletForm, newValue: string) => any
  changeFormView: (newView: CreateWalletFormView) => any
}

export const CreateWallet: React.SFC<Props> = (props) => (
  <div className='vertical-spaced has-text-centered'>
    <h1 className='title-heading'>Add a new wallet</h1>
    <div> { props.currentView === CreateWalletFormView.select
        ? <FormSelection changeFormView={props.changeFormView} />
        : <WalletForm {...props} />
      }
    </div>
  </div>
)

const FormSelection: React.SFC<Pick<Props, 'changeFormView'>> = ({changeFormView}) => (
  <div className='buttons is-centered'>
    <button className='button' onClick={() => changeFormView(CreateWalletFormView.generate)}>
      Generate New Account
    </button>
    <button className='button' onClick={() => changeFormView(CreateWalletFormView.import)}>
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
      const encryptedPrivateKey = encryptPrivateKey(this.props.privateKey, this.props.password)
      this.props.addWallet({
        encryptedPrivateKey,
        accountName: this.props.accountName,
        publicKey: this.props.publicKey,
      })
    } catch (e) {
      if (e instanceof InputError) {
        e.alert()
      }
    }
  }

  validateProps = (): void | never => {
    this.checkValidEntry('accountName')
    if (this.props.currentView === CreateWalletFormView.import) {
      this.checkValidEntry('publicKey')
      this.checkValidEntry('privateKey')
    }
    this.checkValidEntry('password')
    this.checkValidPassword()
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

  render() {
    const {
      currentView,
      accountName,
      publicKey,
      privateKey,
      password,
      passwordVerify,
      changeFormView,
      handleChange,
    } = this.props
    const action = currentView === CreateWalletFormView.import ? 'Import' : 'Generate'
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
            <InputField label='Wallet Name' value={accountName}
              id='account-name' onChangeHandler={(newValue) => handleChange('accountName', newValue)}
            />
            {currentView === CreateWalletFormView.import && (
              <React.Fragment>
                <InputField label='Public Key' value={publicKey}
                  id='public-key' onChangeHandler={(newValue) => handleChange('publicKey', newValue)}
                />
                <InputField label='Private Key' value={privateKey}
                  id='private-key' onChangeHandler={(newValue) => handleChange('privateKey', newValue)}
                />
              </React.Fragment>
            )}
            <InputField label='Wallet Password' value={password} isPassword={true}
              id='password' onChangeHandler={(newValue) => handleChange('password', newValue)}
            />
            <InputField label='Repeat Password' value={passwordVerify} isPassword={true}
              id='password-verify' onChangeHandler={(newValue) => handleChange('passwordVerify', newValue)}
            />
            <div className='field is-grouped'>
              <div className='control is-expanded'>
                <button className='button is-fullwidth' type='submit'>{`${action} Account`}</button>
              </div>
              <div className='control'>
                <button className='button is-danger' type='button' onClick={() => changeFormView(CreateWalletFormView.select)}>Back</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
