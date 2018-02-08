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

const defaultState = { transactions: [], lastPage: false, currentPage: undefined, recentlyLoaded: false }
export class Transactions extends React.Component<{appState: AppState}, {transactions: HumanTransactions[], currentPage: any, lastPage: boolean, recentlyLoaded: boolean}> {
  constructor (props) {
    super(props)
    this.state = _.cloneDeep(defaultState)
  }

  async componentDidMount() {
    await this.transactionPage()
  }

  // To ensure we don't trigger the scroll event multiple times, we will force a wait of
  // 10 seconds before we consider loading more docs
  public handleScroll () {
    const ele: any = document.getElementById('transactions')
    const triggerLoad = ele.scrollHeight - ele.scrollTop <= ele.clientHeight + 100
    if (triggerLoad && !this.state.lastPage && !this.state.recentlyLoaded) {
      console.log('loading!')
      this.setState({recentlyLoaded: true})
      this.transactionPage()

      setTimeout(() => this.setState({recentlyLoaded: false}), 3000)
    }
  }

  public reloadTrasactions() {
    this.setState(_.cloneDeep(defaultState), () => {this.transactionPage()})
  }

  public async componentWillReceiveProps(nextProps: {appState: AppState}) {
    let currentWalletIndex = _.get(nextProps, 'appState.viewParams.walletIndex', null)
    let newWalletIndex =_.get(this.props, 'appState.viewParams.walletIndex', null)
    if (currentWalletIndex !== newWalletIndex && newWalletIndex !== null) {
      this.setState(_.cloneDeep(defaultState), () => {this.transactionPage()})
    }
  }

  // TODO: Hook this up to a next page button that is hidden if lastPage === true
  async transactionPage (): HumanTransactions[] {
    StellarSdk.Network.use(new StellarSdk.Network(this.props.appState.connection.networkPassphrase))
    const server = new StellarSdk.Server(this.props.appState.connection.horizonServer, {allowHttp: true})

    // Load 2 pages of records at a time, initializing if we do not yet have transactions
    const currentPage = this.state.currentPage
      ? this.state.currentPage
      : await server.transactions().forAccount(getActiveWallet(this.props.appState).publicKey).order('desc').call()

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
          fee: _.round(r.fee_paid * 0.0000001, 8)
        }
      })
    })))

    this.setState({transactions: this.state.transactions.concat(transactions), currentPage: nextPage})
  }

  public renderTransactions () {
    return this.state.transactions.map((t: any, i: number) => {
      const dynamicKeys = Object.keys(t.txData)
      return (
        <article className='message' key={i}>
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
                  dynamicKeys.map((d, k) => {
                    return  (
                      <tr key={k}>
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

    if (ref[operation.type_i]) {
      return ref[operation.type_i]
    } else {
      // If we havent wrapped the operation type in human view, we just return the entire object
      return operation
    }
  }

  render() {
    return (
        <div style={{height: '450px', display: 'table-row' }}>
          <div style={{margin: '0px 45px 0px 60px', position: 'relative', height: '100%'}}>
            <div onScroll={() => this.handleScroll()} className="scrollable" id='transactions' >
              { this.renderTransactions() }
            </div>
          </div>
        </div>
    )
  }
}
