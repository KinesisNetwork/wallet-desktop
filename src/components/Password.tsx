import { Wallet } from '@types'
import * as ClipboardJS from 'clipboard'
import * as React from 'react'

export interface Props {
  isAccountUnlocked: boolean
  activeWallet: Wallet
  password: string
  unlockWallet: (wallet: Wallet, password: string) => any
  setPasswordInput: (input: string) => any
  lockWallet: (wallet: Wallet) => any
}

const LockedWallet: React.SFC<Props> = ({password, unlockWallet, activeWallet, setPasswordInput}) => (
  <div>
    <div className='field has-addons has-addons-centered'>
      <div className='control'>
        <input
          id='wallet-unlock-password'
          className='input'
          value={password}
          type='password'
          placeholder='Password'
          onChange={(e) => setPasswordInput(e.currentTarget.value)}
        />
      </div>
      <div className='control'>
        <button type='button' className='button' onClick={() => unlockWallet(activeWallet, password)}>
          <span className='icon'>
            <i className='fas fa-lock-open' />
          </span>
          <span>Unlock Wallet</span>
        </button>
      </div>
    </div>
  </div>
)

class UnlockedWallet extends React.Component<Props, Readonly<{}>> {
  public copyBtn

  public componentDidMount() {
    new ClipboardJS(this.copyBtn)
  }

  public render() {
    return (
      <div>
        <div className='field is-grouped is-grouped-centered'>
          <div className='control'>
            <button
              ref={(ref) => this.copyBtn = ref}
              type='button'
              className='button'
              data-clipboard-text={this.props.activeWallet.decryptedPrivateKey}
            >
              <span className='icon'>
                <i className='fas fa-copy' />
              </span>
              <span>Copy Private Key</span>
            </button>
          </div>
          <div className='control'>
            <button type='submit' className='button' onClick={() => this.props.lockWallet(this.props.activeWallet)}>
              <span className='icon'>
                <i className='fas fa-lock' />
              </span>
              <span>Lock Wallet</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export const Password: React.SFC<Props> = (props) => (
  <React.Fragment>
    {props.isAccountUnlocked ? <UnlockedWallet {...props} /> : <LockedWallet {...props} />}
  </React.Fragment>
)
