import { Action, ActionCreators } from './action'
import { AppState, Connection } from './index'

const defaultConnections: Connection[] = [{
  horizonServer: 'https://stellar-local.abx.com',
  networkPassphrase: 'Test SDF Network ; September 2015',
  connectionName: 'Local Development Network'
}, {
  horizonServer: 'https://kinesis-uat-oceania.abx.com',
  networkPassphrase: 'Kinesis UAT',
  connectionName: 'Kinesis UAT Network'
}, {
  horizonServer: 'https://horizon-testnet.stellar.org/',
  networkPassphrase: 'Test SDF Network ; September 2015',
  connectionName: 'Stellar Test Network'
}]

const defaultState: AppState = {
  walletList: [],
  activeWalletIndex: 0,
  passwordMap: {},
  connection: defaultConnections[0],
  allConnections: defaultConnections
}

export function options (state: AppState = defaultState, action: Action): AppState {
  switch (action.type) {
    case ActionCreators.changeConnection.type:
      return { ...state, connection: action.payload }
    case ActionCreators.setWalletList.type:
      return { ...state, walletList: action.payload }
    case ActionCreators.setActiveWalletIndex.type:
      return { ...state, activeWalletIndex: action.payload }
    default:
      return state
  }
}
