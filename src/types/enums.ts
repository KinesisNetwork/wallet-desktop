export enum WalletView {
  create,
  settings,
  dashboard,
  payees,
}

export enum AccountPage {
  dashboard = 'Transfer',
  sign = 'Sign & Verify',
}

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
  addressBook = '/address-book',
  settings = '/settings',
  create = '/create',
}

export enum WalletCreationRoutes {
  first = '/naming',
  second = '/passphrase',
  third = '/check',
}
