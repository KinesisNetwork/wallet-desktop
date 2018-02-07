import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet, getPrivateKey } from '../helpers/wallets'

export class Password extends React.Component<{appState: AppState, setPassword: Function}, {password: any}> {
  constructor (props) {
    super(props)
    this.state = { password: '' }
  }

  public setPassword(){
    this.props.setPassword(getActiveWallet(this.props.appState).publicKey, this.state.password)
  }

  public unlockWallet(ev) {
    ev.preventDefault()
    this.setPassword()
  }

  public lockWallet(ev) {
    ev.preventDefault();
    this.setState({
      password: ''
    }, () => {
      this.setPassword()
    })
  }

  public privateKey() {
    let activeWallet = getActiveWallet(this.props.appState) || {}
    return getPrivateKey(this.props.appState, activeWallet)
  }

  render() {
    return (
      <div>
      {!this.privateKey() ?
        (<form className='title-heading' onSubmit={this.unlockWallet.bind(this)} style={{ paddingBottom: '28px', paddingTop: '24px'}}>
          <input className="input is-small" type="password" placeholder="Password" onChange={(e: any) => this.setState({password: e.target.value})} style={{display:'inline-block', maxWidth: '200px', padding: '17px 8px'}} />
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

