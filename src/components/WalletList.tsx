import * as React from 'react'
import { AppState, View, Wallet } from '../app'
import * as _ from 'lodash'

export class WalletList extends React.Component<{appState: AppState, changeView: Function, setWalletList: Function}, undefined> {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <nav className="panel">
        <p className="panel-heading" style={{fontFamily: 'Open Sans'}}>
         Wallets
        </p>
        { _.map(this.props.appState.walletList, (wallet: Wallet, index) => {
          return (
            <a key={index} onClick={() => this.props.changeView(View.dashboard, { walletIndex: index })} className="panel-block is-active" style={{overflow: 'hidden', fontFamily: 'Fira Mono'}}>
              <span className="panel-icon">
                <i className="fas fa-book"></i>
              </span>
              <span style={{fontSize: '13px'}}>{wallet.publicKey}</span>
            </a>
          )
        })}
        <div className="panel-block">
          <button className="button is-primary is-outlined is-fullwidth" onClick={() => this.props.changeView(View.create)}>
            Add Wallet
          </button>
        </div>
      </nav>
    )
  }
}

