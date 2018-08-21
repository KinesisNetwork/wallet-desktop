import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, TextInput, Text, View } from 'react-native'
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import StellarBase from 'js-kinesis-sdk'
import { Header } from './Navigation';
import { encryptPrivateKey } from './services/encryption';
import { addNewWallet, retrieveWallets } from './services/wallet_persistance';
import { OptionActionCreators, NotificationActionCreators } from './store/root-actions'
import { AppState, Wallet } from './store/options'
import { NotificationState } from './store/notification'
import { Routes } from './Routing';

const ACCOUNT_CREATION_ERROR = 'Account Creation Failed'

enum AccountFields {
  accountName = 'accountName',
  privateKey = 'privateKey',
  publicKey = 'publicKey',
  password = 'password',
  passwordVerify = 'passwordVerify',
  fieldErrors = 'fieldErrors',
  hasError = 'hasError',
}

enum AccountFieldTitles {
  accountName = 'Account Name',
  privateKey = 'Private Key',
  publicKey = 'Public Key',
  password = 'Account Password',
  passwordVerify = 'Repeat Account Password',
  fieldErrors = 'fieldErrors',
  hasError = 'hasError',
}

enum AccountFieldErrors {
  accountName = 'Please provide an account name',
  privateKey = 'Please provide a valid private key',
  publicKey = 'Please provide a valid public key',
  password = 'Please supply a password',
  passwordVerify = 'Please ensure both passwords match',
}

type AccountView = 'import' | 'generate'
type AccountProps = StateProps & DispatchProps

interface StateProps {
  appState: AppState,
  navigation: any,
  notification: NotificationState,
}

interface DispatchProps {
  setWalletList: Function,
  setActiveWalletIndex: Function,
  showNotification: Function,
}

interface CreateAccountProps extends StateProps, DispatchProps {
  accountView: AccountView,
}

interface AccountState {
  privateKey: string,
  publicKey: string,
  password: string,
  passwordVerify: string,
  accountName: string,
  hasError: boolean,
  fieldErrors: any,
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({
  setWalletList: async (walletList: Wallet[]) => {
    dispatch(OptionActionCreators.setWalletList.create(walletList))
  },
  setActiveWalletIndex: async (index: number) => {
    dispatch(OptionActionCreators.setActiveWalletIndex.create(index))
  },
  showNotification: (payload: { type: string, message: string }) => {
    dispatch(NotificationActionCreators.showNotification.create(payload))
  },
})

const defaultState: AccountState = {
  privateKey: '',
  publicKey: '',
  password: '',
  passwordVerify: '',
  accountName: '',
  hasError: false,
  fieldErrors: {},
}

export class CreateAccount extends React.Component<CreateAccountProps, AccountState> {

  public state = {
    ...defaultState
  }

  public async componentDidMount() {
    const wallets = await retrieveWallets()
    this.props.setWalletList(wallets)
  }

  public generate = (): boolean => {

    const { accountName, password, passwordVerify } = this.state
    const [validName, validPassword] = [
      this.validateField({ field: AccountFields.accountName, condition: accountName, message: AccountFieldErrors.accountName }),
      this.verifyPassword(password, passwordVerify),
    ]

    if (validName && validPassword) {
      const accountKeys = StellarBase.Keypair.random()
      const [accountKey, privateKey]: any = [accountKeys.publicKey(), accountKeys.secret()]
      this.addNewWallet(accountKey, privateKey, password, accountName)
      this.props.showNotification({ type: 'success', message: 'Account created'})

      return true
    }

    this.props.showNotification({ type: 'error', message: ACCOUNT_CREATION_ERROR })

    return false
  }

  public importKeys = (): boolean => {
    const { accountName, password, passwordVerify, privateKey, publicKey } = this.state

    const validPublicKey = this.validateField({ field: AccountFields.publicKey, condition: publicKey, message: AccountFieldErrors.publicKey })
    const validPrivateKey = this.validateField({ field: AccountFields.privateKey, condition: privateKey, message: AccountFieldErrors.privateKey })
    const validName = this.validateField({ field: AccountFields.accountName, condition: accountName, message: AccountFieldErrors.accountName })
    const validPassword = this.verifyPassword(password, passwordVerify)

    const criteria = [ validPublicKey, validPrivateKey, validName, validPassword ]

    if (criteria.every(c => c)) {
      this.addNewWallet(publicKey, privateKey, password, accountName)
      this.props.showNotification({ type: 'success', message: 'Account imported'})

      return true
    }

    this.props.showNotification({ type: 'error', message: ACCOUNT_CREATION_ERROR })

    return false
  }

  private addNewWallet = async (accountKey: string, privateKey: string, password: string, accountName: string): Promise<void> => {
    const { navigation, setActiveWalletIndex, setWalletList } = this.props
    const encryptedPrivateKey = encryptPrivateKey(privateKey, password)
    const walletList = await addNewWallet(accountKey, encryptedPrivateKey, accountName)

    setWalletList(walletList)
    setActiveWalletIndex(0)
    this.setState({...defaultState}, () => {
      navigation.navigate(Routes.dashboardScreen)
    })
  }

  private validateField = ({ condition, field, message }: { condition: string | boolean, field: string, message: string }): boolean => {
    if (!condition) {
      this.setState(state => ({
        ...state,
        [AccountFields.hasError]: true,
        [AccountFields.fieldErrors]: {
          ...state.fieldErrors,
          [field]: message
        }
      }) )
      return false
    }

    this.setState(({ fieldErrors, ...otherState }) => {
      delete fieldErrors[field]

      return {
        ...otherState,
        [AccountFields.hasError]: false,
        fieldErrors
      }
    })

    return true
  }

  private verifyPassword = (password: string, passwordVerify: string): boolean => {
    const validPassword = this.validateField({ field: AccountFields.password, condition: password, message: AccountFieldErrors.password })
    return validPassword && this.validateField({ field: AccountFields.passwordVerify, condition: password === passwordVerify, message: AccountFieldErrors.passwordVerify })
  }

  public handleStateFieldUpdate = (field: keyof AccountState) => (value: string): void => {
    this.setState(currentState => ({
      ...currentState,
      [field]: value
    }) )
  }

  render() {
    return (
      <CreateAccountPresentation
        accountName={this.state.accountName}
        accountView={this.props.accountView}
        appState={this.props.appState}
        generate={this.generate}
        fieldErrors={this.state.fieldErrors}
        handleStateFieldUpdate={this.handleStateFieldUpdate}
        hasError={this.state.hasError}
        importKeys={this.importKeys}
        password={this.state.password}
        passwordVerify={this.state.passwordVerify}
        privateKey={this.state.privateKey}
        publicKey={this.state.publicKey}
      />
    )
  }
}

interface AccountPresentationProps {
  accountName: string,
  accountView: AccountView,
  appState: AppState,
  fieldErrors: any,
  generate: () => void,
  importKeys: () => void,
  handleStateFieldUpdate: (field: string) => (value: any) => void,
  hasError: boolean,
  password: string,
  passwordVerify: string,
  privateKey: string,
  publicKey: string,
}

export const CreateAccountPresentation: React.SFC<AccountPresentationProps> = ({
  accountName,
  accountView,
  fieldErrors,
  generate,
  handleStateFieldUpdate,
  hasError,
  importKeys,
  password,
  passwordVerify,
  publicKey,
  privateKey
}) => (
  <ScrollView style={StyleSheet.flatten([styles.mainContent, hasError && styles.mainContentError])}>
  {(accountView === 'generate') && (
    <View style={styles.panelContent}>
      <Text style={styles.labelFont}>{AccountFieldTitles.accountName}</Text>
      <TextInput underlineColorAndroid={'transparent'} value={accountName} style={styles.textInput} onChangeText={handleStateFieldUpdate(AccountFields.accountName)} />
      <Text style={styles.errorText}>{fieldErrors[AccountFields.accountName]}</Text>

      <Text style={styles.labelFont}>{AccountFieldTitles.password}</Text>
      <TextInput underlineColorAndroid={'transparent'} value={password} style={styles.textInput} onChangeText={handleStateFieldUpdate(AccountFields.password)} secureTextEntry />
      <Text style={styles.errorText}>{fieldErrors[AccountFields.password]}</Text>

      <Text style={styles.labelFont}>{AccountFieldTitles.passwordVerify}</Text>
      <TextInput underlineColorAndroid={'transparent'} value={passwordVerify} style={styles.textInput} onChangeText={handleStateFieldUpdate(AccountFields.passwordVerify)} secureTextEntry />
      <Text style={styles.errorText}>{fieldErrors[AccountFields.passwordVerify]}</Text>

      <TouchableOpacity onPress={() => generate()} style={styles.createAccountButton}>
        <Text style={styles.createAccountButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  )}
  {(accountView === 'import') && (
    <View style={styles.panelContent}>
      <Text style={styles.labelFont}>{AccountFieldTitles.accountName}</Text>
      <TextInput value={accountName} style={styles.textInput} onChangeText={handleStateFieldUpdate(AccountFields.accountName)} />
      <Text style={styles.errorText}>{fieldErrors[AccountFields.accountName]}</Text>

      <Text style={styles.labelFont}>{AccountFieldTitles.password}</Text>
      <TextInput value={password} style={styles.textInput} onChangeText={handleStateFieldUpdate(AccountFields.password)} secureTextEntry />
      <Text style={styles.errorText}>{fieldErrors[AccountFields.password]}</Text>

      <Text style={styles.labelFont}>{AccountFieldTitles.passwordVerify}</Text>
      <TextInput value={passwordVerify} style={styles.textInput} onChangeText={handleStateFieldUpdate(AccountFields.passwordVerify)} secureTextEntry />
      <Text style={styles.errorText}>{fieldErrors[AccountFields.passwordVerify]}</Text>

      <Text style={styles.labelFont}>{AccountFieldTitles.publicKey}</Text>
      <TextInput value={publicKey} style={styles.textInput} onChangeText={handleStateFieldUpdate(AccountFields.publicKey)} />
      <Text style={styles.errorText}>{fieldErrors[AccountFields.publicKey]}</Text>

      <Text style={styles.labelFont}>{AccountFieldTitles.privateKey}</Text>
      <TextInput value={privateKey} style={styles.textInput} onChangeText={handleStateFieldUpdate(AccountFields.privateKey)} />
      <Text style={styles.errorText}>{fieldErrors[AccountFields.privateKey]}</Text>

      <TouchableOpacity onPress={importKeys} style={styles.createAccountButton}>
        <Text style={styles.createAccountButtonText}>Import Account</Text>
      </TouchableOpacity>
    </View>
  )}
  </ScrollView>
)

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#1f2d3b',
    borderColor: '#1f2d3b',
    borderWidth: 1,
    padding: 15,
  },
  mainContentError: {
    borderColor: 'crimson',
    marginTop: 5,
  },
  labelFont: {
    color: '#d1edff',
    marginBottom: 5,
    marginTop: 4
  },
  textInput: {
    backgroundColor: '#d1edff',
    marginBottom: 10,
    padding: 12,
  },
  errorText: {
    color: 'crimson',
    paddingBottom: 0,
  },
  panelContent: {
    flex: 1,
    padding: 15,
  },
  createAccountButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    padding: 8,
    borderColor: 'yellow',
    marginTop: 10,
  },
  createAccountButtonText: {
    color: 'yellow'
  },
});

class GenerateAccountWrapper extends React.Component<AccountProps, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <Header navigation={opt.navigation} />
    }
  }

  render() {
    return (<CreateAccount {...this.props} accountView='generate' />)
  }
}

class ImportAccountWrapper extends React.Component<AccountProps, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <Header navigation={opt.navigation} />
    }
  }

  render() {
    return (<CreateAccount {...this.props} accountView='import' />)
  }
}

export const ImportAccount = connect(mapStateToProps, mapDispatchToProps)(ImportAccountWrapper)
export const GenerateAccount = connect(mapStateToProps, mapDispatchToProps)(GenerateAccountWrapper)
