import { Keypair, Server, Transaction } from 'js-kinesis-sdk'
import { get } from 'lodash'
import * as React from 'react'
import * as swal from 'sweetalert'
import { AppState } from '../../app'
import { getActivePrivateKey } from '../../helpers/wallets'
import { TransactionView } from './Transaction'

export interface State {
  serializedTransaction: string
  transaction: Transaction | null
}

export interface Props {
  appState: AppState
  transactionSubmit: () => void
  transactionFinish: () => void
  updateTransferView: (view: 'payment') => void
}

export class MultiSigTransfer extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      serializedTransaction: '',
      transaction: null,
    }
  }

  private setTransaction = (value: string) => {
    this.setState({ serializedTransaction: value })
  }

  private loadTransaction = () => {
    try {
      const loadedTransaction = new Transaction(this.state.serializedTransaction)
      console.log(loadedTransaction)
      this.setState({ transaction: loadedTransaction })
    } catch (e) {
      swal('Oops!', 'Invalid transaction string', 'error')
    }
  }

  private focusElement = (id: string) => {
    const element = document.getElementById(id)
    return element && element.focus()
  }

  private signTransaction = async (transaction: Transaction) => {
    const privateKey = getActivePrivateKey(this.props.appState)
    if (!privateKey) {
      await swal('Oops!', 'Please unlock your account sign the transaction', 'error')
      return this.focusElement('wallet-password')
    }
    const continueTransfer = await swal({
      title: 'Confirm Signature',
      text: 'Are you sure you want to sign this transaction?',
      icon: 'warning',
      buttons: true,
    })
    if (!continueTransfer) { return }
    transaction.sign(Keypair.fromSecret(getActivePrivateKey(this.props.appState)))
    try {
      this.props.transactionSubmit()
      const server = new Server(this.props.appState.connection.horizonServer, {allowHttp: true})
      await server.submitTransaction(transaction)
      this.props.updateTransferView('payment')
    } catch (e) {
      const opCode = get(e, 'data.extras.result_codes.operations[0]', get(e, 'message', 'Unkown Error'))
      console.error('Error occured submitting transaction', e)
      await swal('Oops!', `An error occurred while submitting the transaction to the network: ${opCode}`, 'error')
    } finally {
      this.props.transactionFinish()
    }
  }

  private viewTransaction = (transaction: Transaction) => (
    <div>
      <div className='field is-grouped'>
        <div className='control is-expanded'>
          <button className='button is-fullwidth is-success' onClick={() => this.signTransaction(transaction)}>
            <span className='icon is-small'>
              <i className='fa fa-pencil-alt'/>
            </span>
            <span>Sign Transaction</span>
          </button>
        </div>
      </div>
      <TransactionView transaction={transaction} />
    </div>
  )

  render() {
    return (
      <div>
        <h1 className='sub-heading primary-font'>Sign Multisignature Transaction</h1>
        <div className='field is-grouped'>
          <div className='control is-expanded'>
            <div className='field has-addons has-addons-centered'>
              <div className='control is-expanded'>
                <input
                  className='input'
                  value={this.state.serializedTransaction}
                  onChange={(e) => this.setTransaction(e.currentTarget.value)}
                />
              </div>
              <div className='control'>
                <button
                  type='button is-info'
                  className='button'
                  onClick={() => this.loadTransaction()}
                >Load Transaction</button>
              </div>
            </div>
          </div>
          <div className='control'>
            <button className='button' onClick={() => this.props.updateTransferView('payment')}>
              <span className='icon'>
                <i className='fa fa-arrow-left'/>
              </span>
            </button>
          </div>
        </div>
        { this.state.transaction && this.viewTransaction(this.state.transaction) }
      </div>
    )
  }
}
