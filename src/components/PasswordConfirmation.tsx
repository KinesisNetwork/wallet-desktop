import { focus } from '@helpers/focus'
import { decryptPrivateKey } from '@services/encryption'
import { Wallet } from '@types'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as SwalImport from 'sweetalert'

const swal = SwalImport as any

class PasswordInput extends React.Component<{ activeWallet: Wallet }, { password: string }> {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
    }
  }

  changeText = (e) => {
    const text = e.target.value
    this.setState({ password: text })
    const decryptedPrivateKeyOrEmpty = this.decryptKey(text)
    // @ts-ignore
    if (decryptedPrivateKeyOrEmpty !== '') {
      // Returns the decrypted private key
      swal.setActionValue({ cancel: { value: decryptedPrivateKeyOrEmpty } })
      swal.close('cancel')
    }
  }

  decryptKey = (passwordInput: string) => {
    return decryptPrivateKey(this.props.activeWallet.encryptedPrivateKey, passwordInput)
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

export const getPasswordConfirmation = async (activeWallet: Wallet, mode = 'danger'): Promise<{ value: string }> => {
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
