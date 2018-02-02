import * as React from 'react'
import { AppState, View } from '../app'
import * as _ from 'lodash'

export class WalletList extends React.Component<{appState: AppState, changeView: Function}, undefined> {
  constructor (props) {
    super(props)
  }


  render() {
    return (
      <div>
      { _.map(this.props.appState.walletList, (wallet) => {
          return (
            <div>
            {wallet.publicKey}
            </div>
          )
        })}
      </div>
    )
  }
}

