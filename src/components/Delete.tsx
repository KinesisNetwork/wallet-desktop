import * as React from 'react'
import * as StellarSdk from 'js-kinesis-sdk'
import * as swal from 'sweetalert'
import { AppState, View } from '../app'
import { deleteWallet } from '@services/wallets';
import { getActiveWallet } from '../helpers/wallets'
import { DeletePresentation } from './DeletePresentation';
import { getPasswordConfirmation } from './helpers'

export class Delete extends React.Component<{appState: AppState, setWalletList: Function, changeView: Function}, {}> {
  constructor (props) {
    super(props)
  }

  public async deleteW(accountId: string) {
    const willDelete = await swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this wallet.',
      icon: 'warning',
      dangerMode: true,
      buttons: true
    })
    if (willDelete) {
      const activeWallet = getActiveWallet(this.props.appState)
      const server = new StellarSdk.Server(this.props.appState.connection.horizonServer, {allowHttp: true})
      try {
        // Want to check whether an account exists, and if so request password confirmation
        // Otherwise just delete
        const account = await server.loadAccount(activeWallet.publicKey)
        const balance = Number(account.balances.find(b => b.asset_type === 'native').balance)
        if (balance > 0) {
          const stillContinue = await getPasswordConfirmation(activeWallet)
          if (!stillContinue) {
            return
          }
        }
      } finally {
        const wallets = await deleteWallet(accountId)
        this.props.setWalletList(wallets)
        this.props.changeView(View.create)
      }
    }
  }

  render() {
    return (
      <DeletePresentation appState={this.props.appState} deleteW={this.deleteW.bind(this)} />
    )
  }
}
