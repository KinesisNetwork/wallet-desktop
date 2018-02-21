import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet } from '../helpers/wallets'

export class DeletePresentation extends React.Component<{appState: AppState, deleteW: Function}, {}> {
  constructor (props) {
    super(props)
  }

  render() {
    return (
      <div>
        <button type='submit' className='button is-danger' style={{width: '100%', maxWidth: '200px', marginTop: '15px'}} onClick={() => this.props.deleteW(getActiveWallet(this.props.appState).publicKey)} >
          <i className='fa fa-trash-alt fa-lg' style={{marginRight: '6px'}}></i> Delete Wallet
        </button>
      </div>
    )
  }
}
