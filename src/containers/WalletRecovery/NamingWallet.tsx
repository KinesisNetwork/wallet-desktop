import * as React from 'react'

import { NameWalletForm } from './NameWalletForm'

export class NamingWallet extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 className="title has-text-primary has-text-centered">Your wallet has been imported!</h1>
        <p className="content">
          Because we do not store your information, you need to rename your wallet and set a new
          password. Don't worry, it is still the same wallet and funds you had prior to the import.
        </p>
        <NameWalletForm submitButtonText="Import" />
      </React.Fragment>
    )
  }
}
