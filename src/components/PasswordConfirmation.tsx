import { focus } from '@helpers/focus'
import { decryptPrivateKey } from '@services/encryption'
import { Wallet } from '@types'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

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
    const isDecryptionSuccessful = this.decryptKey(this.props.activeWallet.encryptedPrivateKey, text)
    if (isDecryptionSuccessful) {
      sweetAlert.setActionValue({ cancel: { value: '' } })
      sweetAlert.close()
    }
  }

  private decryptKey = (encryptedKey: string, passwordInput: string) => {
    try {
      return !!decryptPrivateKey(encryptedKey, passwordInput)
    } catch (e) {
      return false
    }
  }

  public render() {
    setTimeout(() => focus('popup-password-confirmation'))
    return (
      <input id='popup-password-confirmation'
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
  const element = wrapper.firstChild

  const typeOfPopup = mode === 'danger' ? {icon: 'warning', dangerMode: true} : {icon: mode}

  return await swal({
    text: 'Please input password to confirm',
    content: element,
    buttons: {
      cancel: {
        value: '',
        visible: false,
      },
    },
    ...typeOfPopup,
  })
}
