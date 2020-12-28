export enum SignBehaviour {
  sign = 'Sign',
  verify = 'Verify',
  signTransaction = 'Sign Transaction',
}

export enum CreateWalletFormView {
  select,
  generate,
  import,
}

export enum TransferView {
  transfer,
  addPayee,
}

export enum Currency {
  KAU = 'KAU',
  KAG = 'KAG',
  KEM = 'KEM',
}

export enum ConnectionStage {
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export enum RootRoutes {
  dashboard = '/dashboard',
  contacts = '/contacts',
  settings = '/settings',
  create = '/create',
  importAccount = '/import-account',
  recover = '/recover',
  exchange = '/exchange',
}

export enum WalletCreationRoutes {
  first = '/naming',
  second = '/passphrase',
  third = '/check',
}

export enum WalletCreationModals {
  none,
  passwordConfirm,
  encrypting,
}

export enum WalletRecoverRoutes {
  first = '/passphrase',
  second = '/validate',
  third = '/naming',
}

export enum NotificationType {
  info = 'info',
  warning = 'warning',
  error = 'danger',
  success = 'success',
}

export enum AddressDisplay {
  account,
  payee,
}

export enum ImageSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

export enum GoogleAnalyticsLabel {
  transferFund = 'Funds transferred from wallet',
  copyAddress = 'Kinesis address copied',
  addAccount = 'Added account',
  importAccount = 'Imported account',
}

export enum GoogleAnalyticsAction {
  transfer = 'transfer',
  click = 'click',
}
