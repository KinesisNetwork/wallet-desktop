import * as React from 'react'
import { AppState, View } from '../app'
import { deleteWallet } from '../services/wallet_persistance';
import { getActiveWallet } from '../helpers/wallets'
import * as swal from 'sweetalert'
import { DeletePresentation } from './DeletePresentation';
import { getPasswordConfirmation } from './helpers'
import StellarSdk = require('stellar-sdk')

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
      const account = await server.loadAccount(activeWallet.publicKey)
      const kinesisBalance = account.balances.filter(b => b.asset_type === 'native')[0].balance
      if (kinesisBalance > 0) {
        const stillContinue = await getPasswordConfirmation(activeWallet)
        if (!stillContinue) {
          return
        }
      }
      deleteWallet(accountId)
        .then((wallets) => {
          this.props.setWalletList(wallets)
          this.props.changeView(View.create, {})
        })
    }
  }

  render() {
    return (
      <DeletePresentation appState={this.props.appState} deleteW={this.deleteW.bind(this)} />
    )
  }
}
