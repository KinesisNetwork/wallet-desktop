export interface AppState {
  walletList: Wallet[],
  activeWalletIndex: number,
  passwordMap: PasswordMap,
  connection: Connection,
  allConnections: Connection[]
}

export interface PasswordMap {
  [accountId: string]: {
    timestamp: number,
    password: string
  }
}

export interface ViewParams {
  walletIndex?: number
}

export interface Wallet {
  publicKey: string,
  encryptedPrivateKey: string,
  accountName: string,
}

export interface Connection {
  horizonServer: string,
  connectionName: string,
  networkPassphrase: string
}

// This should most certainly be part of react state
//

export * from './action'
export * from './reducer'
