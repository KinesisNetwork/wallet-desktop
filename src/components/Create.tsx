import * as React from 'react'
import { AppState, View } from '../app'
const StellarBase = require('stellar-sdk')

export class CreateAccount extends React.Component<{setAccountKeys: Function, appState: AppState, changeView: Function}, undefined> {
  constructor (props) {
    super(props)
  }

  public generate() {
    const accountKeys = StellarBase.Keypair.random()
    this.props.setAccountKeys(accountKeys.publicKey(),accountKeys.secret())
    // Call create wallet here...
    this.props.changeView(View.dashboard, {walletId: 0})
  }

  render() {
    return (
      <button className='button' onClick={() => this.generate()}>Create Account</button>
    )
  }
}
