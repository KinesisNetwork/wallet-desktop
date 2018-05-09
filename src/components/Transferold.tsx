import * as React from 'react'
import * as _ from 'lodash'
import { getActiveWallet, getPrivateKey, getActivePrivateKey } from '@helpers/wallets'
import { TransferPresentation } from './TransferPresentation';
import * as StellarSdk from 'js-kinesis-sdk'
import { isPaymentMultiSig, showMultiSigTransaction } from '../helpers/accounts';
const stroopsInLumen: number = 10000000

export interface Props {
  appState: AppState
  transferComplete: () => void
  transferInitialised: () => void
}

export interface State {
  targetAddress: string
  transferAmount: string
  memo: string
  loading: boolean
}

export class Transfer extends React.Component<Props, State> {
  constructor (props) {
    super(props)
    this.state = {targetAddress: '', loading: false, memo: '', transferAmount: ''}
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network(this.props.appState.connection.networkPassphrase))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps && this.props.appState.viewParams.walletIndex !== nextProps.appState.viewParams.walletIndex) {
      this.setState({targetAddress: '', transferAmount: '', memo: ''})
    }
  }

  public async transferKinesis (targetAddress: string, amount: string) {
    const server = new StellarSdk.Server(this.props.appState.connection.horizonServer, {allowHttp: true})
    // Get the most recent ledger to determine the correct baseFee
    const mostRecentLedger = await server.ledgers().order('desc').call()
    const currentBaseFeeInStroops = mostRecentLedger.records[0].base_fee_in_stroops
      ? mostRecentLedger.records[0].base_fee_in_stroops
      : mostRecentLedger.records[0].base_fee

    const currentBaseReserveInStroops = mostRecentLedger.records[0].base_reserve_in_stroops
      ? mostRecentLedger.records[0].base_reserve_in_stroops
      : Number(mostRecentLedger.records[0].base_reserve)
    const currentTransactionPercent = (mostRecentLedger.records[0].base_percentage_fee || 0) / 10000 //(convert from basis points to percent)

    // The multiplier is defined here: https://www.stellar.org/developers/guides/concepts/fees.html
    const currentBaseReserve = _.round(currentBaseReserveInStroops * 0.0000001, 8) * 2
    const currentBaseFee = _.round(currentBaseFeeInStroops * 0.0000001, 8)
    const percentFee = _.round(Number(amount) * currentTransactionPercent, 8)
    const totalFeeLumens = _.round(percentFee + currentBaseFee, 8)
    const totalFeeStroops = _.round((percentFee * stroopsInLumen) + currentBaseFeeInStroops)

    let account

    try {
      account = await server.loadAccount(getActiveWallet(this.props.appState).publicKey)
    } catch (e) {
      return swal('Oops!', 'Your account does not have any funds to send money with', 'error')
    }

    const needMoreSigners = isPaymentMultiSig(account)

    const sequencedAccount = new StellarSdk.Account(getActiveWallet(this.props.appState).publicKey, account.sequence)

    try {
      // We attempt to look up the target account. If this throws an error, we create
      // the account instead of transfering
      await server.loadAccount(targetAddress)
    } catch (e) {
      if (Number(amount) < currentBaseReserve) {
        swal('Oops!', `You are transfering to an account without any funds. The minimum transfer required is ${currentBaseReserve} Kinesis`, 'error')
        return
      }

      const willCreate = await swal({
        title: `Continue with transfer?`,
        text: `
          The account that you are transfering with does not have any funds yet, are you sure you want to continue?
          The total fee will be ${totalFeeLumens} Kinesis
        `,
        icon: `warning`,
        dangerMode: true,
        buttons: true
      })

      if (!willCreate) {
        return
      }


      // If we get the correct error, we try call account creation
      let newAccountTransaction = new StellarSdk.TransactionBuilder(sequencedAccount, {fee: String(totalFeeStroops)})
        .addOperation(StellarSdk.Operation.createAccount({
          destination: targetAddress,
          startingBalance: amount,
        }))
      .addMemo(StellarSdk.Memo.text(this.state.memo))
      .build()

      newAccountTransaction.sign(StellarSdk.Keypair.fromSecret(getPrivateKey(this.props.appState, getActiveWallet(this.props.appState))))

      if (needMoreSigners) {
        return showMultiSigTransaction(newAccountTransaction)
      }

      try {
        this.props.transferInitialised()
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

    let paymentTransaction: StellarSdk.Transaction
    try {
      paymentTransaction = new StellarSdk.TransactionBuilder(sequencedAccount, {fee: String(totalFeeStroops)})
        .addOperation(StellarSdk.Operation.payment({
          destination: targetAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        }))
        .addMemo(StellarSdk.Memo.text(this.state.memo))
        .build()

      paymentTransaction.sign(StellarSdk.Keypair.fromSecret(getPrivateKey(this.props.appState, getActiveWallet(this.props.appState))))

      if (needMoreSigners) {
        return showMultiSigTransaction(paymentTransaction)
      }
    } catch (e) {
      return swal('Oops!', `This transaction is invalid: ${_.capitalize(e.message)}.`, 'error')
    }

    const continueTransfer = await swal({
      title: 'Continue with transfer?',
      text: `Once submitted, the transaction can not be reverted! The fee will be ${totalFeeLumens} Kinesis`,
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
      return this.focusElement('transfer-public-key')
    }
    if (!this.state.transferAmount) {
      await swal('Oops!', 'A transfer amount is required to transfer funds', 'error')
      return this.focusElement('transfer-amount')
    }

    let privateKey = getActivePrivateKey(this.props.appState)
    if (!privateKey) {
      await swal('Oops!', 'Please unlock your account to transfer funds', 'error')
      return this.focusElement('wallet-password')
    }
    this.transferKinesis(this.state.targetAddress, this.state.transferAmount)
  }

  private focusElement = (id: string): void => {
    const element = document.getElementById(id)
    if (element !== null) {
      return element.focus()
    }
  }

  public handleAddress(ev) {
    this.setState({targetAddress: ev.target.value})
  }

  public async handleMemo(ev) {
    const memo = ev.target.value
    if (memo.length >= 25) {
      return await swal('Oops!', 'The message field must be fewer than 25 characters long', 'error')
    }
    this.setState({memo: memo})
  }

  public handleAmount(ev) {
    this.setState({transferAmount: ev.target.value})
  }

  render() {
    return (
      <TransferPresentation
        appState={this.props.appState}
        transferComplete={this.props.transferComplete}
        transferInitialised={this.props.transferInitialised}
        handleAddress={this.handleAddress.bind(this)}
        handleAmount={this.handleAmount.bind(this)}
        handleSubmit={this.handleSubmit.bind(this)}
        handleMemo={this.handleMemo.bind(this)}
        targetAddress={this.state.targetAddress}
        transferAmount={this.state.transferAmount}
        memo={this.state.memo}
        loading={this.state.loading}
      />
    )
  }
}
