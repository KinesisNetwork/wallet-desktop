import * as React from 'react'
import { ActivityIndicator, Alert, TouchableOpacity, ScrollView, StyleSheet, TextInput, Text, View } from 'react-native'
import * as _ from 'lodash'
import { getActiveWallet } from './helpers/wallets'
import { isPaymentMultiSig } from './helpers/accounts';
import { BackNav } from './Navigation';
import { decryptPrivateKey } from './services/encryption';
let StellarSdk = require('js-kinesis-sdk')
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { AppState } from './store/options/index'
const stroopsInLumen: number = 10000000

interface StateProps {
  appState: AppState,
  navigation: any
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

interface DispatchProps { }

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({})

type TransferProps = StateProps & DispatchProps

export interface State {
  targetAddress: string
  transferAmount: string
  memo: string
  loading: boolean
  password: string
  decryptedPrivateKey: string
}

export class TransferState extends React.Component<TransferProps, State> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Account Transfer' navigation={opt.navigation} />
    }
  }
  constructor (props: any) {
    super(props)
    this.state = {targetAddress: '', loading: false, memo: '', transferAmount: '', password: '', decryptedPrivateKey: ''}
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network(this.props.appState.connection.networkPassphrase))
  }

  public async unlockWallet() {
    let decryptedPrivateKey = decryptPrivateKey(getActiveWallet(this.props.appState).encryptedPrivateKey, this.state.password)
    if (decryptedPrivateKey) {
      this.setState({decryptedPrivateKey})
    } else {
      Alert.alert(
        'Invalid Password',
        'To perform a transfer please enter the correct password.',
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
    }
  }

  public handlePassword(password: any) {
    this.setState({password})
  }

  public async transferKinesis (targetAddress: string, amount: string): Promise<any> {
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
      Alert.alert(
        'Oops!',
        'Your account does not have any funds to send money with.',
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
      return false
    }

    const needMoreSigners = isPaymentMultiSig(account)

    const sequencedAccount = new StellarSdk.Account(getActiveWallet(this.props.appState).publicKey, account.sequence)

    try {
      // We attempt to look up the target account. If this throws an error, we create
      // the account instead of transfering
      await server.loadAccount(targetAddress)
    } catch (e) {
      if (Number(amount) < currentBaseReserve) {
        Alert.alert(
          'Oops!',
          `You are transfering to an account without any funds. The minimum transfer required is ${currentBaseReserve} Kinesis.`,
          [
            {text: 'OK', onPress: _.noop},
          ],
          { cancelable: false }
        )
        return false
      }

      const willCreate = await new Promise((res, rej) => {
        Alert.alert(
          'Continue with transfer?',
          `
           The account that you are transfering with does not have any funds yet, are you sure you want to continue?
           The fee will be ${totalFeeLumens} Kinesis
          `,
          [
            {text: 'Cancel', onPress: () => res(false), style: 'cancel'},
            {text: 'OK', onPress: () => res(true)},
          ],
          { cancelable: true }
        )
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

      newAccountTransaction.sign(StellarSdk.Keypair.fromSecret(this.state.decryptedPrivateKey))

      if (needMoreSigners) {
        Alert.alert(
          'Oops!',
          `The mobile wallet does not currently support multi sig.`,
          [
            {text: 'OK', onPress: _.noop},
          ],
          { cancelable: false }
        )
        return false
      }

      try {
        await server.submitTransaction(newAccountTransaction)
        Alert.alert(
          'Success!',
          `Successfully submitted the transaction.`,
          [
            {text: 'OK', onPress: _.noop},
          ],
          { cancelable: false }
        )
      } catch (e) {
        let opCode = _.get(e, 'data.extras.result_codes.operations[0]', _.get(e, 'message', 'Unkown Error'))
        Alert.alert(
          'Oops!',
          `An error occurred while submitting the transaction to the network: ${opCode}`,
          [
            {text: 'OK', onPress: _.noop},
          ],
          { cancelable: false }
        )
      }

      return
    }

    let paymentTransaction
    try {
      paymentTransaction = new StellarSdk.TransactionBuilder(sequencedAccount, {fee: String(totalFeeStroops)})
        .addOperation(StellarSdk.Operation.payment({
          destination: targetAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        }))
        .addMemo(StellarSdk.Memo.text(this.state.memo))
        .build()

      paymentTransaction.sign(StellarSdk.Keypair.fromSecret(this.state.decryptedPrivateKey))

      if (needMoreSigners) {
        Alert.alert(
          'Oops!',
          `The mobile wallet does not currently support multi sig.`,
          [
            {text: 'OK', onPress: _.noop},
          ],
          { cancelable: false }
        )
        return false
      }
    } catch (e) {
      Alert.alert(
        'Oops!',
        `This transaction is invalid: ${_.capitalize(e.message)}.`,
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
      return false
    }

    const continueTransfer = await new Promise((res, rej) => {
      Alert.alert(
        'Continue with transfer?',
        `
          Once submitted, the transaction can not be reverted! The fee will be ${totalFeeLumens} Kinesis
        `,
        [
          {text: 'Cancel', onPress: () => res(false), style: 'cancel'},
          {text: 'OK', onPress: () => res(true)},
        ],
        { cancelable: true }
      )
    })

    if (!continueTransfer) {
      return
    }

    try {
      await server.submitTransaction(paymentTransaction)
      Alert.alert(
        'Success!',
        `Successfully submitted the transaction.`,
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
    } catch (e) {
      let opCode = _.get(e, 'data.extras.result_codes.operations[0]', _.get(e, 'message', 'Unkown Error'))
      Alert.alert(
        'Oops!',
        `An error occurred while submitting the transaction to the network: ${opCode}`,
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
      return
    }
  }

  public async handleSubmit() {
    if (this.state.loading) {
      return false
    }
    if (!this.state.targetAddress) {
      Alert.alert(
        'Oops!',
        `A target public key is required to transfer funds`,
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
      return this.focusElement('transfer-public-key')
    }
    if (!this.state.transferAmount) {
      Alert.alert(
        'Oops!',
        `A transfer amount is required to transfer funds`,
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
      return this.focusElement('transfer-amount')
    }

    if (!this.state.decryptedPrivateKey) {
      Alert.alert(
        'Oops!',
        `Please unlock your account to transfer funds`,
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
      return this.focusElement('wallet-password')
    }
    this.setState({loading: true}, () => {
      this.transferKinesis(this.state.targetAddress, this.state.transferAmount)
        .then(() => {
          this.setState({loading: false})
        }, () => {
          this.setState({loading: false})
        })
    })
  }

  private focusElement = (id: string): void => {
    return _.noop()
  }

  public handleAddress(text: any) {
    this.setState({targetAddress: text})
  }

  public async handleMemo(text: string) {
    const memo = text
    if (memo.length >= 25) {
      Alert.alert(
        'Oops!',
        `The message field must be fewer than 25 characters long`,
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
    }
    this.setState({memo: memo})
  }

  public handleAmount(text: string) {
    this.setState({transferAmount: text})
  }

  render() {
    return (
      <TransferPresentation
        appState={this.props.appState}
        handleAddress={this.handleAddress.bind(this)}
        handlePassword={this.handlePassword.bind(this)}
        unlockWallet={this.unlockWallet.bind(this)}
        handleAmount={this.handleAmount.bind(this)}
        handleSubmit={this.handleSubmit.bind(this)}
        handleMemo={this.handleMemo.bind(this)}
        targetAddress={this.state.targetAddress}
        transferAmount={this.state.transferAmount}
        memo={this.state.memo}
        password={this.state.password}
        privateKey={this.state.decryptedPrivateKey}
        loading={this.state.loading}
      />
    )
  }
}

export class TransferPresentation extends React.Component<{
  appState: AppState,
  handleAddress: Function,
  handlePassword: Function,
  unlockWallet: Function,
  handleAmount: Function,
  handleSubmit: Function,
  handleMemo: Function,
  targetAddress: string,
  password: string,
  privateKey: string,
  transferAmount?: any,
  memo?: string,
  loading: boolean
}, {}> {
  constructor (props: any) {
    super(props)
  }

  render() {
    let buttonColor = this.props.loading ? 'grey' : 'yellow'
    return (
      <ScrollView style={styles.mainContent}>
        <View>
          {(this.props.privateKey) ? (
            <View>
              <Text style={styles.labelFont}>Target Account</Text>
              <TextInput value={this.props.targetAddress} style={styles.textInput} onChangeText={(text: string) => this.props.handleAddress(text)} />
              <Text style={styles.labelFont}>Amount</Text>
              <TextInput value={this.props.transferAmount} keyboardType='numeric' style={styles.textInput} onChangeText={(text: string) => this.props.handleAmount(text)} />
              <Text style={styles.labelFont}>Message (Optional)</Text>
              <TextInput value={this.props.memo} style={styles.textInput} onChangeText={(text) => this.props.handleMemo(text)} />
              <TouchableOpacity onPress={() => this.props.handleSubmit()} style={{
                flexDirection: 'row', justifyContent: 'center', alignContent: 'center', borderWidth: 1, padding: 8, borderColor: buttonColor
              }}>
                <Text style={{color: buttonColor}}>Transfer</Text>
              </TouchableOpacity>
              {this.props.loading && (
                <View style={{marginTop: 20}}>
                  <ActivityIndicator size="large" color="yellow" />
                  <Text style={[styles.labelFont, {textAlign: 'center', marginTop: 10}]}>Processing Transaction.</Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              <Text style={styles.labelFont}>Password</Text>
              <TextInput value={this.props.password} style={styles.textInput} secureTextEntry={true} onChangeText={(text) => this.props.handlePassword(text)} />
              <TouchableOpacity onPress={() => this.props.unlockWallet()} style={{
                flexDirection: 'row', justifyContent: 'center', alignContent: 'center', borderWidth: 1, padding: 8, borderColor: 'yellow'
              }}>
                <Text style={{color: 'yellow'}}>Unlock</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#1f2d3b',
    padding: 15,
  },
  labelFont: {
    color: '#d1edff',
    marginBottom: 5
  },
  labelHeader: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10
  },
  textInput: {
    backgroundColor: '#d1edff',
    marginBottom: 15,
    padding: 12
  }
});

export const Transfer = connect(mapStateToProps, mapDispatchToProps)(TransferState)
