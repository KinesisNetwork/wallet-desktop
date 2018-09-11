import * as React from 'react'
import { connect } from 'react-redux'

import { createWallet, updateFormField } from '@actions'
import { InputField } from '@components/InputField'
import { RootState } from '@store'
import { RootRoutes, WalletCreationRoutes } from '@types'
import { push } from 'connected-react-router'

const isValidWalletName = (name: string) => name.length > 0 && name.length <= 50
const isValidPassword = (password: string) => password.length >= 12 && password.length <= 30

function validCreateWalletState(state: RootState): boolean {
  const { name, password, confirmPassword } = state.wallet.create
  return isValidWalletName(name) && isValidPassword(password) && password === confirmPassword
}

const mapStateToProps = (state: RootState) => ({
  ...state.wallet.create,
  canSubmit: validCreateWalletState(state),
})

const mapDispatchToProps = dispatch => ({
  updateFormField: (formField: keyof RootState['wallet']['create']) => (fieldValue: string) =>
    dispatch(updateFormField({ fieldValue, formField, formName: 'WALLET_CREATE' })),
  confirmWalletCreate: () => (
    dispatch(createWallet()), dispatch(push(RootRoutes.create + WalletCreationRoutes.second))
  ),
})

type NamingWalletProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const NamingWalletPresentation: React.SFC<NamingWalletProps> = props => (
  <React.Fragment>
    <h1 className="title has-text-primary has-text-centered">Create your new wallet</h1>
    <form onSubmit={ev => ev.preventDefault()}>
      <InputField
        id="wallet-create-name"
        label="Name your wallet"
        icon="fa-user-circle"
        value={props.name}
        onChangeHandler={props.updateFormField('name')}
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
        onChangeHandler={props.updateFormField('password')}
        helpText="Choose a secure password for this wallet"
        placeholder="Minimum 12 characters"
        type="password"
        maxLength={30}
        minLength={12}
        errorText={
          props.password && props.password.length < 12
            ? 'Password must be 12 or more characters'
            : ''
        }
      />
      <InputField
        id="wallet-create-confirm-password"
        label="Confirm Password"
        value={props.confirmPassword}
        icon="fa-unlock"
        onChangeHandler={props.updateFormField('confirmPassword')}
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
          <button type="button" className="button is-text">
            Cancel
          </button>
        </div>
        <div className="control">
          <button
            type="submit"
            className="button is-primary"
            onClick={props.confirmWalletCreate}
            disabled={!props.canSubmit}
          >
            Create Wallet
          </button>
        </div>
      </div>
    </form>
  </React.Fragment>
)

export const NamingWallet = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NamingWalletPresentation)
