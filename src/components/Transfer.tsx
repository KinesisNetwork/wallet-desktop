import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet } from '../helpers/wallets';
const StellarSdk = require('stellar-sdk')

// let rootAccount = 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H'
// let rootSecret = 'SDHOAMBNLGCE2MV5ZKIVZAQD3VCLGP53P3OBSBI6UN5L5XZI5TKHFQL4'
// GBFKKLA2BNMR2Q6MSQZWO5ZECDUL4TM3M6ZCWH2IVXTP2XSGY5IHVNPS, SCL2WJCPPNLSKCROIA3PV4W3N4NI5UIBO4Q35EUC7HH6WEJCEGZANE3M
// GAFRGE3S4Y5V32RCDTOHI5IOSXKBUZ6RKOVEXRLRPEQZ54FHHDHA4CH7, SBBFSKLTWIFPVQK6O4EC6A6AXJ4UM2IQCBZVOI2T2AOPWMIJ3G4GGZ65
export class Transfer extends React.Component<{appState: AppState, account: any}, {targetAddress: string, transferAmount: number}> {
  constructor (props) {
    super(props)
    this.state = {targetAddress: '', transferAmount: 0}
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network('Test SDF Network ; September 2015'))
  }

  public async transferKinesis (targetAddress: string, amount: string) {
    const account = new StellarSdk.Account(getActiveWallet(this.state.appState).publicKey, this.props.account.sequence)

    const paymentTransaction = new StellarSdk.TransactionBuilder(account)
      .addOperation(StellarSdk.Operation.payment({
        destination: targetAddress,
        asset: StellarSdk.Asset.native(),
        amount: amount
      }))
      .build()

    paymentTransaction.sign(StellarSdk.Keypair.fromSecret(this.props.appState.privateKey))

    try {
      const server = new StellarSdk.Server(this.props.appState.serverLocation, {allowHttp: true})
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
