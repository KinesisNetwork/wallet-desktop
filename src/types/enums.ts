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
