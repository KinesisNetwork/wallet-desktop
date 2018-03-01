import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet } from '../helpers/wallets'
import * as swal from 'sweetalert'
import { decryptPrivateKey } from '../services/encryption'
import { PasswordPresentation } from './PasswordPresentation';

export class Password extends React.Component<{appState: AppState, setPassword: Function}, {password: any}> {
  constructor (props) {
    super(props)
    this.state = { password: '' }
  }

  public setPassword() {
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

  public setPasswordInput(password: string) {
    this.setState({password: password})
  }

  render() {
    return (
      <PasswordPresentation
        appState={this.props.appState}
        setPassword={this.props.setPassword}
        unlockWallet={this.unlockWallet.bind(this)}
        lockWallet={this.lockWallet.bind(this)}
        setPasswordInput={this.setPasswordInput.bind(this)}
        password={this.state.password}
      />
    )
  }
}
