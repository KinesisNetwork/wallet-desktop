import * as React from 'react'
import { Transaction } from 'stellar-sdk'
import * as swal from 'sweetalert'
import { AppState, View } from '../../app'
import { TransactionView } from './Transaction'

export interface IState {
  serializedTransaction: string
  transaction: Transaction | null
}

export interface IProps {
  appState: AppState,
  changeView: () => void,
}

export class MultiSigTransfer extends React.Component<IProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      serializedTransaction: 'AAAAAMWEYznj3jiBHIC85L3DsUiTY6fIP6L4Kdlv/Xnx2V96AAAH0AAAAKgAAAACAAAAAAAAAAEAAAAAAAAAAQAAAAAAAAABAAAAAKy46XIaZR8wg8C/l3elIHPw7Z8IrdbXI1EHjuLCXikOAAAAAAAAAAAO5rKAAAAAAAAAAAHx2V96AAAAQMU0kayrJV/vNfp4VLtsuG6WCnhrK3ikLUCmFaDToq/DLG58Dqbg+i8vql301uesQ08UCURXJuOSixoC4ZpNGws=',
      transaction: null,
    }
  }

  private setTransaction = (value: string) => {
    this.setState({ serializedTransaction: value })
  }

  private loadTransaction = () => {
    try {
      const loadedTransaction = new Transaction(this.state.serializedTransaction)
      this.setState({ transaction: loadedTransaction })
    } catch (e) {
      swal('Oops!', 'Invalid transaction string', 'error')
    }
  }

  render() {
    return (
      <div>
        <section className='section'>
          <div className='field has-addons has-addons-centered'>
            <div className='control'>
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
        </section>
        <section className='section'>
          <div>
            {
              this.state.transaction
                ? <TransactionView transaction={this.state.transaction} />
                : <p>No Transaction loaded</p>
            }
          </div>
        </section>
      </div>
    )
  }
}
