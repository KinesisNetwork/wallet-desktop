import * as React from 'react'
import { AppState, View } from '../app'
const StellarBase = require('stellar-sdk')
const xdr = require('js-xdr')
const StellarSdk = require('stellar-sdk')
const server = new StellarSdk.Server('https://stellar-local.abx.com', {allowHttp: true})

// let rootAccount = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H'
// let rootSecret = 'SDHOAMBNLGCE2MV5ZKIVZAQD3VCLGP53P3OBSBI6UN5L5XZI5TKHFQL4'
// GBFKKLA2BNMR2Q6MSQZWO5ZECDUL4TM3M6ZCWH2IVXTP2XSGY5IHVNPS, SCL2WJCPPNLSKCROIA3PV4W3N4NI5UIBO4Q35EUC7HH6WEJCEGZANE3M
// GAFRGE3S4Y5V32RCDTOHI5IOSXKBUZ6RKOVEXRLRPEQZ54FHHDHA4CH7, SBBFSKLTWIFPVQK6O4EC6A6AXJ4UM2IQCBZVOI2T2AOPWMIJ3G4GGZ65
export class Dashboard extends React.Component<{appState: AppState, changeView: Function}, {account: any, kinesisBalance: number, accountActivated: boolean, targetAddress: string, transferAmount: number}> {
  constructor (props) {
    super(props)
    this.state = { account: null, kinesisBalance: 0, accountActivated: true }
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network('Test SDF Network ; September 2015'))

    try {
      const account = await server.loadAccount(this.props.appState.publicKey)
      const kinesisBalance = account.balances.filter(b => b.asset_type === 'native')[0].balance
      this.setState({account, kinesisBalance})
    } catch (e) {
      this.setState({accountActivated: false})
    }
  }

  public async transferKinesis (targetAddress: string, amount: string) {
    const account = new StellarSdk.Account(this.props.appState.publicKey, this.state.account.sequence)

    const paymentTransaction = new StellarBase.TransactionBuilder(account)
      .addOperation(StellarBase.Operation.payment({
        destination: targetAddress,
        asset: StellarBase.Asset.native(),
        amount: amount
      }))
      .build()

    paymentTransaction.sign(StellarSdk.Keypair.fromSecret(this.props.appState.privateKey))

    try {
      const transactionResult = await server.submitTransaction(paymentTransaction)
      console.log(transactionResult)
    } catch (e) {
      // If this is the error, it means the account has not yet been created
      if (e.data.extras.result_codes.operations[0] === 'op_no_destination') {
        // If we get the correct error, we try call account creation
        const newAccountTransaction = new StellarSdk.TransactionBuilder(account)
          .addOperation(StellarSdk.Operation.createAccount({
            destination: targetAddress,
            startingBalance: amount
          }))
          .build()

        newAccountTransaction.sign(StellarSdk.Keypair.fromSecret(this.props.appState.privateKey))
        const newAccountResult = await server.submitTransaction(newAccountTransaction)
        console.log(newAccountResult)
      }
    }
  }

  public handleSubmit(e) {
    e.preventDefault()
    this.transferKinesis(this.state.targetAddress, this.state.transferAmount.toString())
  }

  public handleAddress(ev) {
    console.log(ev.target.value)
    this.setState({targetAddress: ev.target.value})
  }

  public handleAmount(ev) {
    this.setState({transferAmount: ev.target.value})
  }

  render() {
    return (
      <div>
        <p>Public Key: {this.props.appState && this.props.appState.publicKey}</p>
        <p>Private Key: {this.props.appState.privateKey}</p>
        <p>Account activated: {JSON.stringify(this.state.accountActivated)}</p>
        <p>Kinesis Balance: {this.state.kinesisBalance}</p>
        <h1>Transfer Kinesis</h1>
        <form onSubmit={(ev) => this.handleSubmit(ev)}>
          <label>Target Account</label>
          <input onChange={(ev) => this.handleAddress(ev)} type='text' />
          <label>Amount</label>
          <input onChange={(ev) => this.handleAmount(ev)} type='number' />
          <input className='button' type='submit' />
        </form>
      </div>
    )
  }
}
