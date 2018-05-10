import { focus } from '@helpers/focus'
import { decryptPrivateKey } from '@services/encryption'
import { Wallet } from '@types'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import swal from 'sweetalert'

class PasswordInput extends React.Component<{activeWallet: Wallet}, {password: string}> {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
    }
  }

  changeText = (e) => {
    const text = e.target.value
    this.setState({password: text})
    const isDecryptionSuccessful = this.decryptKey(this.props.activeWallet.encryptedPrivateKey, text)
    if (isDecryptionSuccessful) {
      if (swal.setActionValue && swal.close) {
        swal.setActionValue({ cancel: { value: '' } })
        swal.close('cancel')
      }
    }
  }

  decryptKey = (encryptedKey: string, passwordInput: string) => {
    try {
      return !!decryptPrivateKey(encryptedKey, passwordInput)
    } catch (e) {
      return false
    }
  }

  render() {
    setTimeout(() => focus('popup-password-confirmation'))
    return (
      <input
        id='popup-password-confirmation'
        type='password'
        className='input is-large has-text-centered'
        value={this.state.password}
        onChange={(ev) => this.changeText(ev)}
      />
    )
  }
}

export const getPasswordConfirmation = async (activeWallet: Wallet, mode: string = 'danger'): Promise<boolean> => {
  const wrapper = document.createElement('div')
  ReactDOM.render(<PasswordInput activeWallet={activeWallet} />, wrapper)
  const element = (wrapper.firstChild as Node)

  const typeOfPopup = mode === 'danger' ? { icon: 'warning', dangerMode: true } : { icon: mode }
  return await sweetAlert({
    buttons: {
      cancel: {
        value: '',
        visible: false,
      },
    },
    content: { element },
    text: 'Please input password to confirm',
    ...typeOfPopup,
  })
}
