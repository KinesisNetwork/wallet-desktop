import { mapStateToProps } from '@containers/TransferForm'
import { RootState } from '@store'
import { ConnectionStage, Currency, Payee } from '@types'
import { DeepPartial } from 'redux'

describe('TransferForm', () => {
  const connection = { endpoint: '', passphrase: '' }
  const connections = {
    connections: {
      [ConnectionStage.testnet]: {
        [Currency.KAU]: connection,
      },
    },
    currentCurrency: Currency.KAU,
    currentStage: ConnectionStage.testnet,
  }
  it('mapStateToProps with active wallet', () => {
    const payee: Payee = { name: 'aPayee1', publicKey: 'asdf' }
    const state: DeepPartial<RootState> = {
      accounts: {
        accountInfo: { balance: 0 },
      },
      passwords: {
        currentInput: 'password-input',
        livePasswords: {
          'wallet-public-key': { privateKey: 'private-key' },
        },
      },
      connections,
      payees: {
        payeesList: [payee],
      },
      transfer: {
        form: { amount: 'formValue1' },
        isTransferring: true,
      },
      wallets: {
        activeWallet: { publicKey: 'wallet-public-key' },
        walletList: [{ publicKey: 'another-public-key', accountName: 'another' }],
      },
    }

    const { getFee, ...rest } = mapStateToProps(state as RootState)

    expect(rest).toEqual({
      amount: 'formValue1',
      isTransferring: true,
      isWalletUnlocked: true,
      accountBalance: 0,
      payees: [payee, { name: 'another', publicKey: 'another-public-key' }],
      publicKey: 'wallet-public-key',
      connection,
    })
  })

  it('mapStateToProps with locked account', () => {
    const state: DeepPartial<RootState> = {
      wallets: {
        activeWallet: {
          publicKey: 'wallet-public-key',
        },
        walletList: [{ publicKey: 'another-public-key', accountName: 'another' }],
      },
      connections,
      accounts: {
        accountInfo: { balance: 0 },
      },
      passwords: { livePasswords: {} },
      payees: { payeesList: [] },
      transfer: { form: {}, isTransferring: true },
    }

    const { getFee, ...rest } = mapStateToProps(state as RootState)

    expect(rest).toEqual({
      accountBalance: 0,
      publicKey: 'wallet-public-key',
      connection,
      isTransferring: true,
      isWalletUnlocked: false,
      payees: [{ name: 'another', publicKey: 'another-public-key' }],
    })
  })
})
