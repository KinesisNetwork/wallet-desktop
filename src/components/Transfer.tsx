import * as React from 'react'
import { AppState } from '../app'
import { getActiveWallet, getPrivateKey } from '../helpers/wallets';
const StellarSdk = require('stellar-sdk')

export class Transfer extends React.Component<{appState: AppState}, {targetAddress: string, transferAmount: number}> {
  constructor (props) {
    super(props)
    this.state = {targetAddress: '', transferAmount: 0}
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network('Test SDF Network ; September 2015'))
  }

  public async transferKinesis (targetAddress: string, amount: string) {
    const server = new StellarSdk.Server(this.props.appState.serverLocation, {allowHttp: true})
    const account = await server.loadAccount(getActiveWallet(this.props.appState).publicKey)
    const sequencedAccount = new StellarSdk.Account(getActiveWallet(this.props.appState).publicKey, account.sequence)

    const paymentTransaction = new StellarSdk.TransactionBuilder(sequencedAccount)
      .addOperation(StellarSdk.Operation.payment({
        destination: targetAddress,
        asset: StellarSdk.Asset.native(),
        amount: amount
      }))
      .build()

    paymentTransaction.sign(StellarSdk.Keypair.fromSecret(getPrivateKey(this.props.appState, getActiveWallet(this.props.appState))))

    try {
      const transactionResult = await server.submitTransaction(paymentTransaction)
      console.log(transactionResult)
    } catch (e) {
      // If this is the error, it means the account has not yet been created
      if (e.data.extras.result_codes.operations[0] === 'op_no_destination') {
        // If we get the correct error, we try call account creation
        const newAccountTransaction = new StellarSdk.TransactionBuilder(sequencedAccount)
          .addOperation(StellarSdk.Operation.createAccount({
            destination: targetAddress,
            startingBalance: amount
          }))
          .build()

        newAccountTransaction.sign(StellarSdk.Keypair.fromSecret(getPrivateKey(this.props.appState, getActiveWallet(this.props.appState))))
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
    this.setState({targetAddress: ev.target.value})
  }

  public handleAmount(ev) {
    this.setState({transferAmount: ev.target.value})
  }

  render() {
    return (
      <div>
        <h1 className='sub-heading primary-font'>Transfer Kinesis</h1>
        <form onSubmit={(ev) => this.handleSubmit(ev)}>
          <label className='label'>Target Account</label>
          <input className='input' onChange={(ev) => this.handleAddress(ev)} type='text' />
          <label className='label'>Amount</label>
          <input className='input' onChange={(ev) => this.handleAmount(ev)} type='text' />
          <button type='submit' className='button' style={{marginTop: '8px', width: '100%'}}>
              <i className='fa fa-arrow-circle-right fa-lg' style={{marginRight:'6px'}} ></i> Transfer
          </button>
        </form>
      </div>
    )
  }
}
