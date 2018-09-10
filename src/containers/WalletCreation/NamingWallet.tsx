import * as React from 'react'
import { connect } from 'react-redux'

import { createWallet, updateFormField } from '@actions'
import { InputField } from '@components/InputField'
import { RootState } from '@store'
import { RootRoutes, WALLET_CREATE_FORM_NAME } from '@types'
import { push } from 'connected-react-router'
import { WalletCreationRoutes } from './index'

const mapStateToProps = (state: RootState) => ({
  ...state.wallet.create,
})

const mapDispatchToProps = dispatch => ({
  updateFormField: (formField: keyof RootState['wallet']['create']) => (fieldValue: string) =>
    dispatch(updateFormField({ fieldValue, formField, formName: WALLET_CREATE_FORM_NAME })),
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
      />
      <InputField
        id="wallet-create-password"
        label="Password"
        value={props.password}
        icon="fa-unlock-alt"
        onChangeHandler={props.updateFormField('password')}
        helpText="Choose a secure password for this wallet"
        type="password"
      />
      <InputField
        id="wallet-create-confirm-password"
        label="Confirm Password"
        value={props.confirmPassword}
        icon="fa-unlock"
        onChangeHandler={props.updateFormField('confirmPassword')}
        type="password"
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
            className="button is-success"
            onClick={() => props.confirmWalletCreate()}
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
