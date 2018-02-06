import * as React from 'react'
import { AppState, View } from '../app'
import { getActiveWallet } from '../helpers/wallets'
import { deleteWallet } from '../services/wallet_persistance';

export class Delete extends React.Component<{appState: AppState, setWalletList: Function, changeView: Function}, {}> {
  constructor (props) {
    super(props)
  }

  public deleteW(accountId: string) {
    deleteWallet(accountId)
      .then((wallets) => {
        this.props.setWalletList(wallets)
        this.props.changeView(View.create, {})
      })
  }

  render() {
    return (
      <div>
        <h1 className='sub-heading primary-font' style={{marginTop: '18px'}}>Settings</h1>
        <button type='submit' className='button is-danger' style={{width: '100%'}} onClick={() => this.deleteW(getActiveWallet(this.props.appState).publicKey)} >
            <i className='fa fa-trash-alt fa-lg' style={{marginRight:'6px'}}></i> Delete Wallet
        </button>
      </div>
    )
  }
}

