import * as React from 'react'

import { AppState, View } from '../app'
import { addNewWallet } from '../services/wallet_persistance'
import { encryptPrivateKey } from '../services/encryption'
import swal from 'sweetalert'
import { CreateAccountPresentation } from './CreatePresentation';
import * as StellarBase from 'js-kinesis-sdk'

export class CreateAccount extends React.Component<{
  setWalletList: Function, setAccountKeys: Function, appState: AppState, changeView: Function
}, {
  privateKey: string, publicKey: string, password: string, passwordVerify: string
}> {
  constructor (props) {
    super(props)
    this.state = {
      privateKey: '',
      publicKey: '',
      password: '',
      passwordVerify: ''
    }
  }

  public async generate(ev) {
    ev.preventDefault()
    let validPassword = await this.verifyPassword(this.state.password, this.state.passwordVerify, 'generate')
    if (validPassword) {
      const accountKeys = StellarBase.Keypair.random()
      const [accountKey, privateKey] = [accountKeys.publicKey(), accountKeys.secret()]
      this.addNewWallet(accountKey, privateKey, this.state.password)
    }
  }

  private addNewWallet(accountKey, privateKey, password) {
    let encryptedPrivateKey = encryptPrivateKey(privateKey, password)
    return addNewWallet(accountKey, encryptedPrivateKey)
      .then((walletList) => {
        this.props.setWalletList(walletList)
        this.props.changeView(View.dashboard, {walletIndex: 0})
      }, (err: any) => {
        console.error(err)
        swal('Something went wrong', err.message, 'error')
      })
  }

  public async verifyPassword(password: string, passwordVerify: string, accountType: 'generate' | 'import'): Promise<boolean> {
    if (!password) {
      await swal('Oops!', 'Wallet password is required', 'error')
      document.getElementById(`${accountType}-password`).focus();
      return false
    }
    if (password !== passwordVerify) {
      await swal('Oops!', 'The verification password does not match the provided password', 'error')
      document.getElementById(`${accountType}-verify-password`).focus();
      return false
    }
    return true
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
    let validPassword = await this.verifyPassword(this.state.password, this.state.passwordVerify, 'import')
    if (validPassword) {
      this.addNewWallet(this.state.publicKey, this.state.privateKey, this.state.password)
    }
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

  public handleVerifyPassword(ev: any) {
    this.setState({passwordVerify: ev.target.value})
  }

  public handlePassword(ev: any) {
    this.setState({password: ev.target.value})
  }

  render() {
    return (
      <CreateAccountPresentation
        setWalletList={this.props.setWalletList}
        setAccountKeys={this.props.setAccountKeys}
        appState={this.props.appState}
        changeView={this.props.changeView}
        handleSubmit={this.handleSubmit.bind(this)}
        generate={this.generate.bind(this)}
        handlePublic={this.handlePublic.bind(this)}
        handlePrivate={this.handlePrivate.bind(this)}
        handleVerifyPassword={this.handleVerifyPassword.bind(this)}
        handlePassword={this.handlePassword.bind(this)}
      />
    )
  }
}
