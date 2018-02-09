import * as React from 'react'
import * as _ from 'lodash'
import { AppState } from '../app'
import { getActiveWallet, getPrivateKey, getActivePrivateKey } from '../helpers/wallets';
import * as swal from 'sweetalert'
const StellarSdk = require('stellar-sdk')

export class Transfer extends React.Component<{appState: AppState, transferComplete: Function, transferInitialised: Function}, {targetAddress: string, transferAmount?: any, loading: boolean}> {
  constructor (props) {
    super(props)
    this.state = {targetAddress: '', loading: false}
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network(this.props.appState.connection.networkPassphrase))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps && this.props.appState.viewParams.walletIndex !== nextProps.appState.viewParams.walletIndex) {
      this.setState({targetAddress: '', transferAmount: ''})
    }
  }

  public async transferKinesis (targetAddress: string, amount: string) {
    const server = new StellarSdk.Server(this.props.appState.connection.horizonServer, {allowHttp: true})
    // Get the most recent ledger to determine the correct baseFee
    const mostRecentLedger = await server.ledgers().order('desc').call()
    console.log(mostRecentLedger)
    const currentBaseFeeInStroops = mostRecentLedger.records[0].base_fee_in_stroops
      ? mostRecentLedger.records[0].base_fee_in_stroops
      : mostRecentLedger.records[0].base_fee

    const currentBaseReserveInStroops = mostRecentLedger.records[0].base_reserve_in_stroops
      ? mostRecentLedger.records[0].base_reserve_in_stroops
      : mostRecentLedger.records[0].base_reserve

    const currentBaseFee = _.round(currentBaseFeeInStroops * 0.0000001, 8)

    // The multiplier is defined here: https://www.stellar.org/developers/guides/concepts/fees.html
    const currentBaseReserve = 2 * _.round(currentBaseReserveInStroops * 0.0000001, 8)

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
      await server.loadAccount(targetAddress)
    } catch (e) {
      if (this.state.transferAmount < currentBaseReserve) {
        swal('Oops!', `You are transfering to an account without any funds. The minimum transfer required is ${currentBaseReserve} Kinesis`, 'error')
        return
      }

      const willCreate = await swal({
        title: `Continue with transfer?`,
        text: `The account that you are transfering with does not have any funds yet, are you sure you want to continue? The fee will be ${currentBaseFee} Kinesis`,
        icon: `warning`,
        dangerMode: true,
        buttons: true
      })

      if (!willCreate) {
        return
      }

      this.props.transferInitialised()

      // If we get the correct error, we try call account creation
      const newAccountTransaction = new StellarSdk.TransactionBuilder(sequencedAccount, {fee: currentBaseFeeInStroops})
        .addOperation(StellarSdk.Operation.createAccount({
          destination: targetAddress,
          startingBalance: amount
        }))
        .build()

      newAccountTransaction.sign(StellarSdk.Keypair.fromSecret(getPrivateKey(this.props.appState, getActiveWallet(this.props.appState))))

      try {
        await server.submitTransaction(newAccountTransaction)
        swal('Success!', 'Successfully submitted transaction', 'success')
      } catch (e) {
        let opCode = _.get(e, 'data.extras.result_codes.operations[0]', _.get(e, 'message', 'Unkown Error'))
        console.error('Error occured submitting transaction', e)
        swal('Oops!', `An error occurred while submitting the transaction to the network: ${opCode}`, 'error')
      }

      this.props.transferComplete()
      return
    }

    let paymentTransaction
    try {
      paymentTransaction = new StellarSdk.TransactionBuilder(sequencedAccount, {fee: currentBaseFeeInStroops})
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
      text: `Once submitted, the transaction can not be reverted! The fee will be ${currentBaseFee} Kinesis`,
      icon: 'warning',
      dangerMode: true,
      buttons: true
    })

    if (!continueTransfer) {
      return
    }

    try {
      this.props.transferInitialised()
      await server.submitTransaction(paymentTransaction)
      swal('Success!', 'Successfully submitted transaction', 'success')
    } catch (e) {
      let opCode = _.get(e, 'data.extras.result_codes.operations[0]', _.get(e, 'message', 'Unkown Error'))
      console.error('Error occured submitting transaction', e)
      swal('Oops!', `An error occurred while submitting the transaction to the network: ${opCode}`, 'error')
    }

    this.props.transferComplete()
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
        {
          this.state.loading ? (
            <Loader />
          ) : (
            <div>
              <h1 className='sub-heading primary-font'>Transfer Kinesis</h1>
              <form onSubmit={(ev) => this.handleSubmit(ev)}>
                <label className='label'>Target Account</label>
                <input id='transfer-public-key' value={this.state.targetAddress} className='input' onChange={(ev) => this.handleAddress(ev)} type='text' />
                <label className='label'>Amount</label>
                <input id='transfer-amount' value={this.state.transferAmount} className='input' onChange={(ev) => this.handleAmount(ev)} type='text' />
                <button type='submit' className='button' style={{marginTop: '8px', width: '100%'}}>
                    <i className='fa fa-arrow-circle-right fa-lg' style={{marginRight:'6px'}} ></i> Transfer
                </button>
              </form>
            </div>
          )
        }
      </div>
    )
  }
}
