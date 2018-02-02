import * as React from 'react'
import { AppState, View } from '../app'
import * as _ from 'lodash'
import { deleteWallet } from '../services/wallet_persistance';

export class WalletList extends React.Component<{appState: AppState, changeView: Function, setWalletList: Function}, undefined> {
  constructor (props) {
    super(props)
  }

  public deleteW(index) {
    console.log(index)
    deleteWallet(index)
      .then((wallets) => {
        this.props.setWalletList(wallets)
      })
  }

  render() {
    return (
      <div>
      { _.map(this.props.appState.walletList, (wallet, index) => {
          return (
            <div key={index}>
              {wallet.publicKey}
              <button onClick={() => this.props.changeView(View.dashboard, index)}>Open Wallet</button>
              <button onClick={() => this.deleteW(index)}>Delete Wallet</button>
            </div>
          )
        })}
        <div>
          <button onClick={() => this.props.changeView(View.create)}> + </button>
        </div>
      </div>
    )
  }
}

