import * as React from 'react'

import { AppState, View } from '../app'
import { addNewWallet } from '../services/wallet_persistance'
import { encryptPrivateKey } from '../services/encryption'
import * as swal from 'sweetalert'
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

  public async generate(ev) {
    ev.preventDefault()
    if (!this.state.password) {
      await swal('Oops!', 'Wallet password is required', 'error')
      return document.getElementById('generate-password').focus();
    }
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

  public async importKeys() {
    if (!this.state.publicKey) {
      await swal('Oops!', 'A public key is required to import an account', 'error')
      return document.getElementById('import-public-key').focus();
    }
    if (!this.state.privateKey) {
      await swal('Oops!', 'A private key is required to import an account', 'error')
      return document.getElementById('import-private-key').focus();
    }
    if (!this.state.password) {
      await swal('Oops!', 'Wallet password is required', 'error')
      return document.getElementById('import-password').focus();
    }
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
        <div className='columns has-text-centered' style={{marginTop: '35px'}}>
          <div className='column' style={{padding: '25px 60px 60px 70px', borderRight: '1px solid #2b3e50'}}>
              <i className="fas fa-user" style={{fontSize: '2.5em'}}></i>
            <h1 className='sub-heading primary-font'>Generate Account</h1>
            <form onSubmit={(ev) => this.generate(ev)}>
              <label className='label'>Wallet Password</label>
              <input id='generate-password' className='input' onChange={(ev) => this.handlePassword(ev)} type='password' />
              <button className='button' type='submit' style={{marginTop: '6px', width: '100%'}}>Create Account</button>
            </form>
            <p>
              {this.state.err}
            </p>
          </div>
          <div className='column' style={{padding: '60px', paddingTop: '25px', paddingRight: '80px'}}>
            <i className="far fa-user" style={{fontSize: '2.5em'}}></i>
            <h1 className='sub-heading primary-font'>Import Account</h1>
            <form onSubmit={(ev) => this.handleSubmit(ev)}>
              <label className='label'>Public Key</label>
              <input id='input-public-key' className='input' onChange={(ev) => this.handlePublic(ev)} type='text' />
              <label className='label'>Private Key</label>
              <input id='input-private-key' className='input' onChange={(ev) => this.handlePrivate(ev)} type='text' />
              <label className='label'>Wallet Password</label>
              <input id='input-password' className='input' onChange={(ev) => this.handlePassword(ev)} type='password' />
              <input className='button' value="Import Account" style={{marginTop: '8px', width: '100%'}} type='submit' />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
