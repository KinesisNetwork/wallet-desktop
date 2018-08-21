import React from 'react';
import { Alert, ActivityIndicator, StyleSheet, Text, View, ScrollView } from 'react-native'
import { getActiveWallet } from './helpers/wallets';
import { BackNav } from './Navigation';
import * as StellarSdk from 'js-kinesis-sdk'
import * as _ from 'lodash'
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { AppState } from './store/options/index'

interface StateProps {
  appState: AppState,
  navigation: any
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

interface DispatchProps {
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({})

type TransactionsProps = StateProps & DispatchProps

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

export interface IState {
  transactions: HumanTransactions[]
  currentPage: any
  lastPage: boolean
  recentlyLoaded: boolean,
  loading: boolean
}

const defaultState = { transactions: [], lastPage: false, currentPage: undefined, recentlyLoaded: false, loading: false }
export class TransactionsState extends React.Component<TransactionsProps, IState> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Account Transactions' navigation={opt.navigation} />
    }
  }
  constructor (props: any) {
    super(props)
    this.state = _.cloneDeep(defaultState)
  }

  async componentDidMount() {
    await this.transactionPage()
  }

  // To ensure we don't trigger the scroll event multiple times, we will force a wait of
  // 10 seconds before we consider loading more docs
  // public handleScroll () {
  //   const ele: any = document.getElementById('transactions')
  //   const triggerLoad = ele.scrollHeight - ele.scrollTop <= ele.clientHeight + 250
  //   if (triggerLoad && !this.state.lastPage && !this.state.recentlyLoaded) {
  //     this.setState({recentlyLoaded: true})
  //     this.transactionPage()

  //     setTimeout(() => this.setState({recentlyLoaded: false}), 3000)
  //   }
  // }

  public reloadTrasactions() {
    this.setState(_.cloneDeep(defaultState), () => {this.transactionPage()})
  }

  public async componentWillReceiveProps(nextProps: TransactionsProps) {
    let currentWalletIndex = _.get(nextProps, 'appState.activeWalletIndex', null)
    let newWalletIndex = _.get(this.props, 'appState.activeWalletIndex', null)
    if (currentWalletIndex !== newWalletIndex && newWalletIndex !== null) {
      this.setState(_.cloneDeep(defaultState), () => {this.transactionPage()})
    }
  }

  // TODO: Hook this up to a next page button that is hidden if lastPage === true
  async transactionPage (): Promise<void> {
    this.setState({loading: true})
    StellarSdk.Network.use(new StellarSdk.Network(this.props.appState.connection.networkPassphrase))
    const server = new StellarSdk.Server(this.props.appState.connection.horizonServer, {allowHttp: true})

    // Load 2 pages of records at a time, initializing if we do not yet have transactions
    try {
      const currentPage = this.state.currentPage
        ? this.state.currentPage
        : await server.transactions().forAccount(getActiveWallet(this.props.appState).publicKey).order('desc').call()

      const nextPage = await currentPage.next()

      if (nextPage.records.length === 0) {
        this.setState({lastPage: true})
      }

      const records = currentPage.records.concat(nextPage.records)

      const transactions = _.flatten(await Promise.all(records.map(async (r: any) => {
        const operations = await r.operations()
        return operations.records.map((o: any) => {
          return {
            txId: r.id,
            txType: StellarTxType[o.type_i],
            txData: this.determineTxData(o),
            date: new Date(r.created_at),
            memo: r.memo,
            fee: _.round(r.fee_paid * 0.0000001, 8)
          }
        })
      })))
      this.setState({loading: false, transactions: this.state.transactions.concat(transactions as any), currentPage: nextPage})
    } catch (e) {
      this.setState({loading: false})
      Alert.alert(
        'Oops!',
        `An error occured: ${JSON.stringify(e.message)}`,
        [
          {text: 'OK', onPress: _.noop},
        ],
        { cancelable: false }
      )
    }

  }

  public renderTransactions (t: any, i: number) {
      const dynamicKeys = Object.keys(t.txData)
      return (
        <View key={i} style={{marginBottom: 80}}>
          <View>
            <Text style={[styles.labelFont, styles.labelHeader]}>{t.txType}</Text>
          </View>
          <View>
            <View>
              <Text style={[styles.labelFont, styles.labelHeader]}>Tx Id</Text>
              <Text style={styles.labelFont}>{t.txId}</Text>
            </View>
            <View>
              <Text style={[styles.labelFont, styles.labelHeader]}>Message</Text>
              <Text style={styles.labelFont}>{t.memo}</Text>
            </View>
            <View>
              <Text style={[styles.labelFont, styles.labelHeader]}>Date</Text>
              <Text style={styles.labelFont}>{t.date.toISOString()}</Text>
            </View>
            <View>
              <Text style={[styles.labelFont, styles.labelHeader]}>Fee</Text>
              <Text style={styles.labelFont}>{t.fee}</Text>
            </View>
            {
              dynamicKeys.map((d, k) => {
                return t.txData[d] && (
                  <View key={k}>
                    <Text style={[styles.labelFont, styles.labelHeader]}>{d}</Text>
                    <Text style={styles.labelFont}>{t.txData[d]}</Text>
                  </View>
                )
              })
            }
          </View>
        </View>
      )
  }

  determineTxData (operation: any) {
    switch(operation.type) {
      case 'create_account':
        return {
          'Funder': operation.funder,
          'Starting Balance': operation.starting_balance,
          'Account Created': operation.account
        }
      case 'payment':
        return {
          'Asset Type': operation.asset_type === 'native' ? 'Kinesis' : operation.asset_type,
          'From': operation.from,
          'To': operation.to,
          'Amount': operation.amount
        }
      case 'set_options':
        return {
          'Signer Key': operation.signer_key,
          'Signer Weight': operation.signer_weight,
          'Master Key Weight': operation.master_key_weight,
          'Low Threshold': operation.low_threshold,
          'Mid Threshold': operation.med_threshold,
          'High Threshold': operation.high_threshold,
          'Home Domain': operation.home_domain,
          'Set Flags': operation.set_flags_s,
          'Clear Flags': operation.clear_flags_s,
        }
      default:
        return operation
    }
  }

  render() {
    return (
      <ScrollView style={styles.mainContent}>
        {this.state.loading ? (
          <View style={{flex: 1}}>
            <ActivityIndicator size="large" color="yellow" />
            <Text style={[styles.labelFont, {textAlign: 'center', marginTop: 10}]}>Loading Transactions</Text>
          </View>
        ) : (
          this.state.transactions.map((t, i) => this.renderTransactions(t, i))
        )}
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
    marginBottom: 15
  }
});
export const Transactions = connect(mapStateToProps, mapDispatchToProps)(TransactionsState)
