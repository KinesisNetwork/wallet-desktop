import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet } from '../helpers/wallets'

export class Password extends React.Component<{appState: AppState, setPassword: Function}, {password: any}> {
  constructor (props) {
    super(props)
    this.state = { password: '' }
  }

  public setPassword(){
    this.props.setPassword(getActiveWallet(this.props.appState).publicKey, this.state.password)
  }

  render() {
    return (
      <form className='title-heading' onSubmit={(ev) => {ev.preventDefault(); this.setPassword()}} style={{ paddingBottom: '28px', paddingTop: '24px'}}>
        <input className="input is-small" type="password" placeholder="Password" onChange={(e: any) => this.setState({password: e.target.value})} style={{display:'inline-block', maxWidth: '200px', padding: '17px 8px'}} />
        <button type='submit' className='button' style={{display:'inline-block'}}>
            <i className='fas fa-unlock-alt' style={{marginRight:'6px'}}></i> Unlock Wallet
        </button>
      </form>
    )
  }
}

