import * as React from 'react'

import { AppState, View } from '../app'
import { addNewWallet } from '../services/wallet_persistance'
import { encryptPrivateKey } from '../services/encryption'
const StellarBase = require('stellar-sdk')


export class CreateAccount extends React.Component<{
  walletList: Function, setAccountKeys: Function, appState: AppState, changeView: Function
}, {
  privateKey: string, publicKey: string, err: string, password: string
}> {
  constructor (props) {
    super(props)
    this.state = {
      err: '',
      privateKey: '',
      publicKey: '',
      password: ''
    }
  }

  public generate() {
    const accountKeys = StellarBase.Keypair.random()
    const [accountKey, privateKey] = [accountKeys.publicKey(), accountKeys.secret()]
    this.addNewWallet(accountKey, privateKey, this.state.password)
    // Call create wallet here...
  }

  private addNewWallet(accountKey, privateKey, password) {
    let encryptedPrivateKey = encryptPrivateKey(privateKey, password)
    return addNewWallet(accountKey, encryptedPrivateKey)
      .then((walletList) => {
        this.props.setWalletList(walletList)
        this.props.setAccountKeys(accountKey, privateKey)
        this.props.changeView(View.dashboard, {walletId: 0})
      }, (err: string) => {
        this.setState({err: err})
      })
  }

  public importKeys() {
    // Call create wallet here...
    this.addNewWallet(this.state.publicKey, this.state.privateKey, this.state.password)
  }

  public handleSumbit(e) {
    e.preventDefault()
    this.importKeys()
  }

  public handlePublic(ev: any) {
    this.setState({publicKey: ev.target.value})
  }

  public handlePrivate(ev: any) {
    this.setState({privateKey: ev.target.value})
  }

  public handlePassword(ev: any) {
    this.setState({password: ev.target.value})
  }

  render() {
    return (
      <div className='columns'>
        <div className='column'>
          <h1>New Account</h1>
          <label>Wallet Password</label>
          <input onChange={(ev) => this.handlePassword(ev)} type='password' />
          <button className='button' onClick={() => this.generate()}>Create Account</button>
          <p>
            {this.state.err}
          </p>
        </div>
        <div className='column'>
          <h1>Import Account</h1>
          <form onSubmit={(ev) => this.handleSumbit(ev)}>
            <label>Public Key</label>
            <input onChange={(ev) => this.handlePublic(ev)} type='text' />
            <label>Private Key</label>
            <input onChange={(ev) => this.handlePrivate(ev)} type='text' />
            <label>Wallet Password</label>
            <input onChange={(ev) => this.handlePassword(ev)} type='password' />
            <input className='button' type='submit' />
          </form>
        </div>
      </div>
    )
  }
}
