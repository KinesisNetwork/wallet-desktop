import * as React from 'react'

import { NameWalletForm } from './NameWalletForm'
import { PasswordConfirmModal } from './PasswordConfirmModal'

enum Modals {
  none,
  confirm,
}
class NamingWallet extends React.Component {
  state = {
    activeModal: Modals.none,
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="title has-text-primary has-text-centered">Create your new wallet</h1>
        <NameWalletForm openConfirmModal={this.openConfirmModal} />
        <PasswordConfirmModal
          isActive={this.state.activeModal === Modals.confirm}
          closeModal={this.closeModal}
        />
      </React.Fragment>
    )
  }

  closeModal = () => this.setState({ activeModal: Modals.none })
  openConfirmModal = () => this.setState({ activeModal: Modals.confirm })
}

export { NamingWallet }
