import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet, getActivePrivateKey } from '../helpers/wallets'
import * as swal from 'sweetalert'
import { decryptPrivateKey } from '../services/encryption'

export class Password extends React.Component<{appState: AppState, setPassword: Function}, {password: any}> {
  constructor (props) {
    super(props)
    this.state = { password: '' }
  }

  public setPassword(){
      this.props.setPassword(getActiveWallet(this.props.appState).publicKey, this.state.password)
  }

  public async unlockWallet(ev) {
    ev.preventDefault()
    let decryptedPrivateKey = decryptPrivateKey(getActiveWallet(this.props.appState).encryptedPrivateKey, this.state.password)
    if (decryptedPrivateKey) {
      this.setPassword()
    } else {
      await swal('Oops!', 'Incorrect password, try again.', 'error')
      this.setState({
        password: ''
      }, () => {
        document.getElementById('wallet-password').focus();
      })
    }
  }

  public lockWallet(ev) {
    ev.preventDefault();
    this.setState({
      password: ''
    }, () => {
      this.setPassword()
    })
  }

  render() {
    return (
      <div>
      {!getActivePrivateKey(this.props.appState) ?
        (<form className='title-heading' onSubmit={this.unlockWallet.bind(this)} style={{ paddingBottom: '28px', paddingTop: '24px'}}>
          <input id='wallet-password' className="input is-small" value={this.state.password} type="password" placeholder="Password"
            onChange={(e: any) => this.setState({password: e.target.value})} style={{display:'inline-block', maxWidth: '200px', padding: '17px 8px'}} />
          <button type='submit' className='button' style={{display:'inline-block'}}>
            <i className='fas fa-unlock-alt' style={{marginRight:'6px'}}></i> Unlock Wallet
          </button>
        </form>)
        :
        (<form className='title-heading'
          onSubmit={this.lockWallet.bind(this)}
          style={{ paddingBottom: '28px', paddingTop: '24px'}}
          >
          <button type='submit' className='button' style={{display:'inline-block'}}>
            <i className='fas fa-lock-alt' style={{marginRight:'6px'}}></i> Lock Wallet
          </button>
        </form>)
      }
      </div>
    )
  }
}

