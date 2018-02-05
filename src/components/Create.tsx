import * as React from 'react'

import { AppState, View } from '../app'
import { addNewWallet } from '../services/wallet_persistance'
import { encryptPrivateKey } from '../services/encryption'
const StellarBase = require('stellar-sdk')

export class CreateAccount extends React.Component<{
  setWalletList: Function, setAccountKeys: Function, appState: AppState, changeView: Function
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
        console.log(walletList);
        this.props.setWalletList(walletList)
        this.props.changeView(View.dashboard, {walletIndex: 0})
      }, (err: string) => {
        this.setState({err})
      })
  }

  public importKeys() {
    // Call create wallet here...
    this.addNewWallet(this.state.publicKey, this.state.privateKey, this.state.password)
  }

  public handleSubmit(e) {
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
      <div>
        <div className='has-text-centered'>
          <h1 className='title-heading primary-font'>Add a new wallet</h1>
        </div>
        <div className='columns has-text-centered'>
          <div className='column' style={{padding: '30px', borderRight: '1px solid #2b3e50'}}>
              <i className="fas fa-user" style={{fontSize: '2.5em'}}></i>
            <h1 className='sub-heading primary-font'>New Account</h1>
            <label className='label'>Wallet Password</label>
            <input placeholder='Password' className='input' onChange={(ev) => this.handlePassword(ev)} type='password' />
            <button className='button' style={{marginTop: '6px', width: '100%'}} onClick={() => this.generate()}>Create Account</button>
            <p>
              {this.state.err}
            </p>
          </div>
          <div className='column' style={{padding: '30px', paddingRight: '40px'}}>
            <i className="far fa-user" style={{fontSize: '2.5em'}}></i>
            <h1 className='sub-heading primary-font'>Import Account</h1>
            <form onSubmit={(ev) => this.handleSubmit(ev)}>
              <label className='label'>Public Key</label>
              <input placeholder='Public Key' className='input' onChange={(ev) => this.handlePublic(ev)} type='text' />
              <label className='label'>Private Key</label>
              <input placeholder='Private Key' className='input' onChange={(ev) => this.handlePrivate(ev)} type='text' />
              <label className='label'>Wallet Password</label>
              <input placeholder='Password' className='input' onChange={(ev) => this.handlePassword(ev)} type='password' />
              <input className='button' value="Import" style={{marginTop: '8px', width: '100%'}} type='submit' />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
