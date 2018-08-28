jest.mock('@services/kinesis', () => ({
  getFeeInKinesis: (connection, amount) => `${connection} ${amount}`,
}))

import { mapStateToProps } from '@containers/TransferForm'
import { RootState } from '@store'

describe('TransferForm', () => {
  it('mapStateToProps with active wallet', () => {
    const state = <RootState>(<any>{
      accounts: {
        accountsMap: {
          'wallet-public-key': {
            isUnlocked: true,
            publicKey: 'wallet-public-key',
            balance: 'accountBalance',
          },
        },
      },
      connections: {
        currentConnection: 'currentConnection',
      },
      passwords: {
        currentInput: 'password-input',
        livePasswords: {
          'wallet-public-key': { privateKey: 'private-key' },
        },
      },
      payees: {
        payeesList: ['aPayee'],
      },
      transfer: {
        form: { formKey1: 'formValue1' },
        isTransferring: 'isTransferring',
      },
      wallets: {
        activeWallet: { publicKey: 'wallet-public-key' },
        walletList: [{ publicKey: 'another-public-key', accountName: 'another' }],
      },
      other: 'unused',
    })

    const { getFee, ...rest } = mapStateToProps(state)

    expect(rest).toEqual({
      formKey1: 'formValue1',
      isTransferring: 'isTransferring',
      isWalletUnlocked: true,
      accountBalance: 'accountBalance',
      payees: ['aPayee', { name: 'another', publicKey: 'another-public-key' }],
      publicKey: 'wallet-public-key',
      connection: 'currentConnection',
    })
    expect(getFee(10)).toEqual('currentConnection 10')
  })

  it('mapStateToProps with locked account', () => {
    const state = <RootState>(<any>{
      wallets: {
        activeWallet: {
          publicKey: 'wallet-public-key',
        },
        walletList: [{ publicKey: 'another-public-key', accountName: 'another' }],
      },
      accounts: {
        accountsMap: {
          'wallet-public-key': {
            isUnlocked: false,
          },
        },
      },
      connections: { currentConnection: 'currentConnection' },
      passwords: { livePasswords: {} },
      payees: { payeesList: [] },
      transfer: { form: {}, isTransferring: 'isTransferring' },
      other: 'unused',
    })

    const { getFee, ...rest } = mapStateToProps(state)

    expect(rest).toEqual({
      accountBalance: undefined,
      publicKey: 'wallet-public-key',
      connection: 'currentConnection',
      isTransferring: 'isTransferring',
      isWalletUnlocked: false,
      payees: [{ name: 'another', publicKey: 'another-public-key' }],
    })
  })
})
