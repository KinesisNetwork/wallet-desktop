import * as React from 'react'
import { connect } from 'react-redux'

import { startWalletCreation, updateFormField } from '@actions'
import { InputField } from '@components/InputField'
import { RootState } from '@store'
import { Link } from 'react-router-dom'

const isValidWalletName = (name: string) => name.length > 0 && name.length <= 50
const isValidPassword = (password: string) => password.length >= 12 && password.length <= 30

function validCreateWalletState(state: RootState): boolean {
  const { name, password, confirmPassword } = state.createWallet.createForm
  return isValidWalletName(name) && isValidPassword(password) && password === confirmPassword
}
const mapStateToProps = (state: RootState) => ({
  ...state.createWallet.createForm,
  canSubmit: validCreateWalletState(state),
})

const mapDispatchToProps = {
  updateFormField: (formField: keyof RootState['createWallet']['createForm'], fieldValue: string) =>
    updateFormField({ fieldValue, formField, formName: 'WALLET_CREATE' }),
  startWalletCreation,
}

type NameWalletProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    openConfirmModal: () => any
  }

const NameWalletFormPresentation: React.SFC<NameWalletProps> = props => (
  <form onSubmit={ev => (ev.preventDefault(), props.startWalletCreation())}>
    <InputField
      id="wallet-create-name"
      label="Name your wallet"
      icon="fa-user-circle"
      value={props.name}
      onChangeHandler={newValue => props.updateFormField('name', newValue)}
      helpText="The wallet will hold all your accounts"
      placeholder="Wallet name"
      autoFocus={true}
      maxLength={50}
      minLength={1}
    />
    <InputField
      id="wallet-create-password"
      label="Password"
      value={props.password}
      icon="fa-unlock-alt"
      onChangeHandler={newValue => props.updateFormField('password', newValue)}
      helpText="Choose a secure password for this wallet"
      placeholder="Minimum 12 characters"
      type="password"
      maxLength={30}
      minLength={12}
      errorText={
        props.password && props.password.length < 12 ? 'Password must be 12 or more characters' : ''
      }
    />
    <InputField
      id="wallet-create-confirm-password"
      label="Confirm Password"
      value={props.confirmPassword}
      icon="fa-unlock"
      onChangeHandler={newValue => props.updateFormField('confirmPassword', newValue)}
      type="password"
      placeholder="Retype password"
      maxLength={30}
      minLength={12}
      errorText={
        props.confirmPassword && props.password !== props.confirmPassword
          ? `Passwords don't match`
          : ''
      }
    />
    <div className="field is-grouped is-grouped-right">
      <div className="control">
        <Link to="/" type="button" className="button is-text">
          Cancel
        </Link>
      </div>
      <div className="control">
        <button
          type="submit"
          className="button is-primary"
          onClick={props.openConfirmModal}
          disabled={!props.canSubmit}
        >
          Create Wallet
        </button>
      </div>
    </div>
  </form>
)
export const NameWalletForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameWalletFormPresentation)
