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
  [publicKey: string]: {
    timestamp: Date
    password: string
  }
}

export interface ViewParams {
  walletIndex: number
}

export interface CreateWalletForm {
  readonly accountName: string
  readonly publicKey: string
  readonly privateKey: string
  readonly password: string
  readonly passwordVerify: string
}

export interface Account {
  readonly balance: string
  readonly isUnlocked: boolean
}
