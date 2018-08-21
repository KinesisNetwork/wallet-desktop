import React from 'react';
import { Alert, TouchableOpacity, ScrollView, StyleSheet, Button, TextInput, Text, View, ActivityIndicator } from 'react-native'
import { getActiveWallet } from './helpers/wallets';
import { BackNav } from './Navigation';
import { decryptPrivateKey } from './services/encryption';
let { NavigationActions } = require('react-navigation')
let StellarSdk = require('js-kinesis-sdk')
let IoniconsIcon = require('react-native-vector-icons/Ionicons').default;
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { AppState, Wallet } from './store/options'
import * as _ from 'lodash'
import { OptionActionCreators, NotificationActionCreators } from './store/root-actions'
import { deleteWallet } from './services/wallet_persistance';


interface StateProps {
  appState: AppState,
  navigation: any
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

interface DispatchProps {
  setWalletList: Function,
  setActiveWalletIndex: Function,
  showNotification: Function,
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({
  showNotification: (payload: { type: string, message: string }) => {
    dispatch(NotificationActionCreators.showNotification.create(payload))
  },
  setWalletList: async (walletList: Wallet[]) => {
    dispatch(OptionActionCreators.setWalletList.create(walletList))
  },
  setActiveWalletIndex: async (index: number) => {
    dispatch(OptionActionCreators.setActiveWalletIndex.create(index))
  },
})

type BalanceProps = StateProps & DispatchProps

export class BalancesState extends React.Component<BalanceProps, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Account Balances' navigation={opt.navigation} />
    }
  }

  state = {
    account: null,
    accountActivated: false,
    accountName: '',
    decryptedPrivateKey: '',
    kinesisBalance: 0,
    password: '',
  }

  componentDidMount() {
    this.loadBalances(this.props)
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props !== nextProps) {
      this.loadBalances(nextProps)
    }
  }

  public async unlockWallet() {
    let decryptedPrivateKey = decryptPrivateKey(getActiveWallet(this.props.appState).encryptedPrivateKey, this.state.password)
    if (decryptedPrivateKey) {
      this.setState({decryptedPrivateKey})
    } else {
      Alert.alert(
        'Invalid Password',
        'To view your private key, please enter the correct password.',
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

  public requestDeleteWallet = (wallet: Wallet) => {
    Alert.alert(
      'Delete Wallet',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => _.noop, style: 'cancel'},
        {text: 'Delete', onPress: () => {
          this.props.showNotification({ type: 'none', message: <ActivityIndicator /> })
          this.deleteWallet(wallet)
        }, style: 'destructive'},
      ]
    )
  }

  public deleteWallet = async (wallet: Wallet) => {
    const walletList = await deleteWallet(wallet.publicKey)
    this.props.setWalletList(walletList)
    this.props.setActiveWalletIndex(0)
    this.props.showNotification({ type: 'success', message: 'Wallet Deleted' })
    this.props.navigation.dispatch(NavigationActions.back())
  }

  public async loadBalances(props: any) {
    try {
      const server = new StellarSdk.Server(props.appState.connection.horizonServer, {allowHttp: true})
      const account = await server.loadAccount(getActiveWallet(props.appState).publicKey)
      console.warn(account)
      const kinesisBalance = Number(account.balances.filter((b: any) => b.asset_type === 'native')[0].balance)
      this.setState({account, kinesisBalance, accountActivated: true})
    } catch (e) {
      console.warn(e.message)
      this.setState({accountActivated: false, kinesisBalance: 0})
    }
  }

  render() {
    return (
      <BalancesPresentation
        deleteWallet={this.requestDeleteWallet}
        handlePassword={this.handlePassword.bind(this)}
        unlockWallet={this.unlockWallet.bind(this)}
        appState={this.props.appState}
        accountName={this.state.accountName}
        privateKey={this.state.decryptedPrivateKey}
        password={this.state.password}
        kinesisBalance={this.state.kinesisBalance}
        accountActivated={this.state.accountActivated}
      />
    )
  }

}

export class BalancesPresentation extends React.Component<{
  appState: AppState,
  handlePassword: Function,
  unlockWallet: Function,
  deleteWallet: (wallet: Wallet) => void,
  accountName: string,
  password: string,
  privateKey: string,
  kinesisBalance: number,
  accountActivated: boolean
}, {}> {
  constructor (props: any) {
    super(props)
  }

  render() {
    let activeWallet = getActiveWallet(this.props.appState) || {}
    return (
      <ScrollView style={styles.mainContent}>
        <View style={{paddingBottom: 60}}>
          <Text style={[styles.labelFont, styles.labelHeader]}>Account Name: </Text>
          <Text style={styles.labelFont}>{activeWallet.accountName}</Text>
          <Text style={[styles.labelFont, styles.labelHeader]}>Public Key: </Text>
          <Text selectable={true} style={styles.labelFont}>{activeWallet.publicKey}</Text>
          <Text style={[styles.labelFont, styles.labelHeader]}>Reveal Private Key:</Text>

          {(this.props.privateKey) ? (
            <Text selectable={true} style={styles.labelFont}>{this.props.privateKey}</Text>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TextInput secureTextEntry={true} placeholder='Password' value={this.props.password} style={[styles.textInput, {flex: 4}]} onChangeText={(text) => this.props.handlePassword(text)} />
              <TouchableOpacity style={{borderLeftWidth: 1, borderLeftColor: 'black', flex:1, backgroundColor: 'yellow', marginBottom: 15, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.props.unlockWallet()}>
                <IoniconsIcon style={{margin: 8}} name='ios-arrow-forward-outline' size={21} color='black' />
              </TouchableOpacity>
            </View>
          )}

          <View>
            <Text style={[styles.labelFont, styles.labelHeader]}>Account activated: </Text>
            <Text selectable={true} style={styles.labelFont}>{this.props.accountActivated ? 'Yes' : 'No'}</Text>
          </View>
          <View>
            <Text style={[styles.labelFont, styles.labelHeader]}>Kinesis Balance: </Text>
            <Text selectable={true} style={styles.labelFont}>{this.props.kinesisBalance}</Text>
          </View>
          <View>
            <Button
              title='Delete wallet'
              color='crimson'
              onPress={() => this.props.deleteWallet(activeWallet)}
              accessibilityLabel='Delete selected wallet'
            />
          </View>

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
    marginBottom: 15
  }
});
export const Balances = connect(mapStateToProps, mapDispatchToProps)(BalancesState)
