import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet } from '../helpers/wallets'
const StellarSdk = require('stellar-sdk')
import * as _ from 'lodash'

export interface HumanTransactions {
  txId: string
  txType: StellarTxType
  txData: any
  fee: number
  date: Date
  memo: string
  signatures: string[]
}

export enum StellarTxType {
  'Create Account' = 0,
  'Payment' = 1,
  'Path Payment' = 2,
  'Manage Offer' = 3,
  'Create Passive Offer' = 4,
  'Set Options' = 5,
  'Change Trust' = 6,
  'Allow Trust' = 7,
  'Account Merge' = 8,
  'Inflation' = 9,
  'Manage Data' = 10
}

export class Transactions extends React.Component<{appState: AppState}, {transactions: HumanTransactions[], currentPage: any, lastPage: boolean}> {
  constructor (props) {
    super(props)
    this.state = { transactions: [], lastPage: false, currentPage: undefined }
  }

  async componentDidMount() {
    await this.transactionPage()
  }

  // TODO: Hook this up to a next page button that is hidden if lastPage === true
  async transactionPage (): HumanTransactions[] {
    StellarSdk.Network.use(new StellarSdk.Network('Test SDF Network ; September 2015'))
    const server = new StellarSdk.Server(this.props.appState.serverLocation, {allowHttp: true})

    // Load 2 pages of records at a time, initializing if we do not yet have transactions
    const currentPage = this.state.currentPage
      ? this.state.currentPage
      : await server.transactions().forAccount(getActiveWallet(this.props.appState).publicKey).call()

    const nextPage = await currentPage.next()

    if (nextPage.records.length === 0) {
      this.setState({lastPage: true})
    }

    const records = currentPage.records.concat(nextPage.records)

    const transactions = _.flatten(await Promise.all(records.map(async (r) => {
      const operations = await r.operations()
      return operations._embedded.records.map(o => {
        return {
          txId: r.id,
          txType: StellarTxType[o.type_i],
          txData: this.determineTxData(o),
          date: new Date(r.created_at),
          fee: r.fee_paid * 0.0000001
        }
      })
    })))

    this.setState({transactions, currentPage: nextPage})
  }

  public renderTransactions () {
    return this.state.transactions.map(t => {
      const dynamicKeys = Object.keys(t.txData)
      return (
        <article className='message'>
          <div>
            <p style={{marginBottom: '4px'}}>{t.txType}</p>
          </div>
          <div className='message-body'>
            <table className='transaction-list'>
              <tbody>
                <tr>
                  <td>Tx Id</td>
                  <td>{t.txId}</td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>{t.date.toISOString()}</td>
                </tr>
                <tr>
                  <td>Fee</td>
                  <td>{t.fee}</td>
                </tr>
                {
                  dynamicKeys.map(d => {
                    return  (
                      <tr>
                        <td>{d}</td>
                        <td>{t.txData[d]}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </article>
      )
    })
  }

  determineTxData (operation: any) {
    const ref = {
      [StellarTxType['Create Account']]: {
        'Funder': operation.funder,
        'Starting Balance': operation.starting_balance,
        'Account Created': operation.account
      },
      [StellarTxType['Payment']]: {
        'Asset Type': operation.asset_type === 'native' ? 'Kinesis' : operation.asset_type,
        'From': operation.from,
        'To': operation.to,
        'Amount': operation.amount
      },
    }

    return ref[operation.type_i]
  }

  render() {
    return (
      <div style={{height: '100%', display: 'table-row'}}>
        <div style={{margin: '0px 45px 0px 60px', position: 'relative', height: '100%'}}>
          <div className="scrollable" >
            { this.renderTransactions() }
          </div>
        </div>
      </div>
    )
  }
}
