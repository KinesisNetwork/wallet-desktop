import * as React from 'react'
import { AppState } from '../app'
import { getActivePrivateKey } from '../helpers/wallets'

export class PasswordPresentation extends React.Component<{appState: AppState, setPassword: Function, unlockWallet: Function, password: string, setPasswordInput: Function, lockWallet: Function}, {}> {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div>
      {!getActivePrivateKey(this.props.appState) ?
        (<form className='title-heading' onSubmit={this.props.unlockWallet.bind(this)} style={{ paddingBottom: '28px', paddingTop: '24px'}}>
          <input id='wallet-password' className='input is-small' value={this.props.password} type='password' placeholder='Password'
            onChange={(e: any) => this.props.setPasswordInput(e.target.value)} style={{display: 'inline-block', maxWidth: '200px', padding: '17px 8px'}} />
          <button type='submit' className='button' style={{display: 'inline-block'}}>
            <i className='fas fa-unlock-alt' style={{marginRight: '6px'}}></i> Unlock Wallet
          </button>
        </form>)
        :
        (<form className='title-heading'
          onSubmit={this.props.lockWallet.bind(this)}
          style={{ paddingBottom: '28px', paddingTop: '24px'}}
          >
          <button type='submit' className='button' style={{display: 'inline-block'}}>
            <i className='fas fa-lock-alt' style={{marginRight: '6px'}}></i> Lock Wallet
          </button>
        </form>)
      }
      </div>
    )
  }
}
