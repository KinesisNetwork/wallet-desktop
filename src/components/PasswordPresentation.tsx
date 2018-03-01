import * as React from 'react'
import { AppState } from '../app'
import { getActivePrivateKey, copyPrivateKey } from '../helpers/wallets'

export interface Props {
  appState: AppState
  setPassword: Function
  unlockWallet: Function
  password: string
  setPasswordInput: Function
  lockWallet: Function
}

const LockedWallet: React.SFC<Props> = (props) => (
  <form onSubmit={(ev) => props.unlockWallet(ev)}>
    <div className='field has-addons has-addons-centered'>
      <div className='control'>
        <input id='wallet-password' className='input' value={props.password} type='password' placeholder='Password'
          onChange={(e) => props.setPasswordInput(e.currentTarget.value)} />
      </div>
      <div className='control'>
        <button type='submit' className='button'>
          <span className='icon'>
            <i className='fas fa-lock-open' />
          </span>
          <span>Unlock Wallet</span>
        </button>
      </div>
    </div>
  </form>
)

const UnlockedWallet: React.SFC<Props> = (props) => (
  <form onSubmit={(ev) => props.lockWallet(ev)} >
    <div className='field is-grouped is-grouped-centered'>
      <div className='control'>
        <button type='button' className='button' onClick={() => copyPrivateKey(props.appState)}>
          <span className='icon'>
            <i className='fas fa-copy' />
          </span>
          <span>Copy Private Key</span>
        </button>
      </div>
      <div className='control'>
        <button type='submit' className='button'>
          <span className='icon'>
            <i className='fas fa-lock' />
          </span>
          <span>Lock Wallet</span>
        </button>
      </div>
    </div>
  </form>
)

export const PasswordPresentation: React.SFC<Props> = (props) => (
  <div className='title-heading'>
    { !getActivePrivateKey(props.appState) ? <LockedWallet {...props} /> : <UnlockedWallet {...props} /> }
  </div>
)