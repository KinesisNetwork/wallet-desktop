import * as React from 'react'
import { AppState, View, Wallet } from '../app'
import * as _ from 'lodash'

export class WalletList extends React.Component<{appState: AppState, changeView: Function, setWalletList: Function}, undefined> {
  constructor (props) {
    super(props)
  }

  render() {
    let activeIndex = _.get(this.props, 'appState.viewParams.walletIndex', null)
    return (
      <nav className="panel"style={{ marginLeft: '25px', marginRight: '16px', marginTop: '35px' }}>
        <p className="panel-heading wallet-heading" style={{fontFamily: 'Open Sans'}}>
         Wallets
        </p>
        { _.map(this.props.appState.walletList, (wallet: Wallet, index) => {
          let style = (index === activeIndex) ? { backgroundColor: 'rgb(63, 89, 115)', fontWeight: 'bold' } : {}
          return (
            <a key={index} onClick={() => this.props.changeView(View.dashboard, { walletIndex: index })} className="panel-block" style={style} >
              <span className="panel-icon">
                <i className="fas fa-book"></i>
              </span>
              <span className='info' style={{overflow: 'hidden'}}>{wallet.publicKey}</span>
            </a>
          )
        })}
        <div className="panel-block">
          <button className="button is-primary is-outlined is-fullwidth" style={{fontSize: '14px'}} onClick={() => this.props.changeView(View.create)}>
            Add Wallet
          </button>
        </div>
      </nav>
    )
  }
}

