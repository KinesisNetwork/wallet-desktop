import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as swal from 'sweetalert'
import { Wallet } from '../../app'
import { decryptPrivateKey } from '../../services/encryption'

class PasswordInput extends React.Component<{activeWallet: Wallet}, {password: string}> {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
    }
  }

  private changeText = (e) => {
    const text = e.target.value
    this.setState({password: text})
    const passwordCorrect = decryptPrivateKey(this.props.activeWallet.encryptedPrivateKey, text)
    if (passwordCorrect) {
      swal.setActionValue({cancel: {value: passwordCorrect}})
      swal.close()
    }
  }

  public render() {
    setTimeout(() => document.getElementById('popup-password-confirmation').focus())
    return (
      <input id='popup-password-confirmation' type='password' className='input is-large has-text-centered' value={this.state.password} onChange={(ev) => this.changeText(ev)} />
    )
  }
}

export const getPasswordConfirmation = async (activeWallet: Wallet, mode: string = 'danger'): Promise<boolean> => {
  const wrapper = document.createElement('div')
  ReactDOM.render(<PasswordInput activeWallet={activeWallet} />, wrapper)
  const element = wrapper.firstChild

  const typeOfPopup = mode === 'danger' ? {icon: 'warning', dangerMode: true} : {icon: mode}

  return await swal({
    text: 'Please input password to confirm',
    content: element,
    buttons: {
      cancel: {
        value: '',
        visible: false,
      }
    },
    ...typeOfPopup,
  })
}
