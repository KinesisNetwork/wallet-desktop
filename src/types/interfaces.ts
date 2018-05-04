export interface Wallet {
  publicKey: string
  encryptedPrivateKey: string
  accountName: string
}

export interface Connection {
  horizonServer: string
  connectionName: string
  networkPassphrase: string
}

export interface PasswordMap {
  [accountId: string]: {
    timestamp: number
    password: string
  }
}

export interface ViewParams {
  walletIndex: number
}
