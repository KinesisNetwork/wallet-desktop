import * as copy from 'copy-to-clipboard'
import * as React from 'react'

export interface Props {
  isAccountUnlocked: boolean
  activePublicKey: string
  password: string
  decryptedPrivateKey: string
  unlockWallet: () => any
  setPasswordInput: (input: string) => any
  lockWallet: (key: string) => any
}

export const LockedWallet: React.SFC<Props> = ({ password, unlockWallet, setPasswordInput }) => (
  <div>
    <div className="field has-addons has-addons-centered">
      <div className="control has-icons-left">
        <input
          id="wallet-unlock-password"
          className="input"
          value={password}
          type="password"
          placeholder="Unlock Account"
          onChange={e => setPasswordInput(e.currentTarget.value)}
        />
        <span className="icon is-left has-text-grey-lighter">
          <i className="fas fa-key" />
        </span>
      </div>
      <div className="control">
        <button type="button" className="button" onClick={() => unlockWallet()}>
          <span className="icon">
            <i className="fas fa-lock-open" />
          </span>
        </button>
      </div>
    </div>
  </div>
)

export class UnlockedWallet extends React.Component<Props> {
  public render() {
    return (
      <div>
        <div className="field is-grouped is-grouped-centered">
          <div className="control">
            <button type="button" className="button" onClick={this.copyPrivateKey}>
              <span className="icon">
                <i className="fas fa-copy" />
              </span>
              <span>Private Key</span>
            </button>
          </div>
          <div className="control">
            <button
              type="submit"
              className="button"
              onClick={() => this.props.lockWallet(this.props.activePublicKey)}
            >
              <span className="icon">
                <i className="fas fa-lock" />
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  private copyPrivateKey = () => copy(this.props.decryptedPrivateKey)
}

export const Password: React.SFC<Props> = props =>
  props.isAccountUnlocked ? <UnlockedWallet {...props} /> : <LockedWallet {...props} />
