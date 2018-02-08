import * as React from 'react'
import * as _ from 'lodash'
import { AppState } from '../app'
import { getActiveWallet, getPrivateKey, getActivePrivateKey } from '../helpers/wallets';
import * as swal from 'sweetalert'
const StellarSdk = require('stellar-sdk')

export class Transfer extends React.Component<{appState: AppState, transferComplete: Function}, {targetAddress: string, transferAmount: number}> {
  constructor (props) {
    super(props)
    this.state = {targetAddress: '', transferAmount: 0}
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network(this.props.appState.connection.networkPassphrase))
  }

  public async transferKinesis (targetAddress: string, amount: string) {
    const server = new StellarSdk.Server(this.props.appState.connection.horizonServer, {allowHttp: true})
    let account

    try {
      account = await server.loadAccount(getActiveWallet(this.props.appState).publicKey)
    } catch (e) {
     return swal('Oops!', 'Your account does not have any funds to send money with', 'error')
    }

    const sequencedAccount = new StellarSdk.Account(getActiveWallet(this.props.appState).publicKey, account.sequence)

    try {
      // We attempt to look up the target account. If this throws an error, we create
      // the account instead of transfering
      await server.loadAccount(getActiveWallet(targetAddress).publicKey)
    } catch (e) {
      const willCreate = await swal({
        title: "Continue with transfer?",
        text: "The account that you are transfering with does not have any funds yet, are you sure you want to continue?",
        icon: "warning",
        dangerMode: true,
        buttons: true
      })

      if (!willCreate) {
        return
      }

      // If we get the correct error, we try call account creation
      const newAccountTransaction = new StellarSdk.TransactionBuilder(sequencedAccount)
        .addOperation(StellarSdk.Operation.createAccount({
          destination: targetAddress,
          startingBalance: amount
        }))
        .build()

      newAccountTransaction.sign(StellarSdk.Keypair.fromSecret(getPrivateKey(this.props.appState, getActiveWallet(this.props.appState))))
      await server.submitTransaction(newAccountTransaction)
      swal('Success!', 'Successfully submitted transaction', 'success')
      this.props.transferComplete()

      return
    }

    let paymentTransaction
    try {
      paymentTransaction = new StellarSdk.TransactionBuilder(sequencedAccount)
        .addOperation(StellarSdk.Operation.payment({
          destination: targetAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount
        }))
        .build()

      paymentTransaction.sign(StellarSdk.Keypair.fromSecret(getPrivateKey(this.props.appState, getActiveWallet(this.props.appState))))
    } catch (e) {
      return swal('Oops!', `This transaction is invalid: ${_.capitalize(e.message)}.`, 'error')
    }

    const continueTransfer = await swal({
      title: 'Continue with transfer?',
      text: 'Once submitted, the transaction can not be reverted!',
      icon: 'warning',
      dangerMode: true,
      buttons: true
    })

    if (!continueTransfer) {
      return
    }

    try {
      await server.submitTransaction(paymentTransaction)
      swal('Success!', 'Successfully submitted transaction', 'success')
      this.props.transferComplete()
    } catch (e) {
      let opCode = _.get(e, 'data.extras.result_codes.operations[0]', _.get(e, 'message', 'Unkown Error'))
      console.error('Error occured submitting transaction', e)
      swal('Oops!', `An error occurred while submitting the transaction to the network: ${opCode}`, 'error')
    }
  }

  public async handleSubmit(e) {
    e.preventDefault()
    if (!this.state.targetAddress) {
      await swal('Oops!', 'A target public key is required to transfer funds', 'error')
      return document.getElementById('transfer-public-key').focus();
    }
    if (!this.state.transferAmount) {
      await swal('Oops!', 'A transfer amount is required to transfer funds', 'error')
      return document.getElementById('transfer-amount').focus();
    }

    let privateKey = getActivePrivateKey(this.props.appState)
    if (!privateKey) {
      await swal('Oops!', 'Please unlock your account to transfer funds', 'error')
      return document.getElementById('wallet-password').focus();
    }
    this.transferKinesis(this.state.targetAddress, this.state.transferAmount)
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
          <input id='transfer-public-key' className='input' onChange={(ev) => this.handleAddress(ev)} type='text' />
          <label className='label'>Amount</label>
          <input id='transfer-amount' className='input' onChange={(ev) => this.handleAmount(ev)} type='text' />
          <button type='submit' className='button' style={{marginTop: '8px', width: '100%'}}>
              <i className='fa fa-arrow-circle-right fa-lg' style={{marginRight:'6px'}} ></i> Transfer
          </button>
        </form>
      </div>
    )
  }
}
