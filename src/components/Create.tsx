import * as React from 'react'
import { AppState, View } from '../app'
const StellarBase = require('stellar-sdk')

export class CreateAccount extends React.Component<{setAccountKeys: Function, appState: AppState, changeView: Function}, {privateKey: string, publicKey: string}> {
  constructor (props) {
    super(props)
  }

  public generate() {
    const accountKeys = StellarBase.Keypair.random()
    this.props.setAccountKeys(accountKeys.publicKey(),accountKeys.secret())
    // Call create wallet here...
    this.props.changeView(View.dashboard, {walletId: 0})
  }

  public importKeys() {
    this.props.setAccountKeys(this.state.publicKey, this.state.privateKey)
    // Call create wallet here...
    this.props.changeView(View.dashboard, {walletId: 0})
  }

  public handleSubmit(e) {
    e.preventDefault()
    this.importKeys()
  }

  public handlePublic(ev) {
    this.setState({publicKey: ev.target.value})
  }

  public handlePrivate(ev) {
    this.setState({privateKey: ev.target.value})
  }

  render() {
    return (
      <div className='columns'>
        <div className='column'>
          <h1>New Account</h1>
          <button className='button' onClick={() => this.generate()}>Create Account</button>
        </div>
        <div className='column'>
          <h1>Import Account</h1>
          <form onSubmit={(ev) => this.handleSubmit(ev)}>
            <label>Public Key</label>
            <input onChange={(ev) => this.handlePublic(ev)} type='text' />
            <label>Private Key</label>
            <input onChange={(ev) => this.handlePrivate(ev)} type='text' />
            <input className='button' type='submit' />
          </form>
        </div>
      </div>
    )
  }
}
