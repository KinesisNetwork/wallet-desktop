import { mapStateToProps } from '@containers/TransferForm'
import { RootState } from '@store'
import { ConnectionStage, Currency, Payee } from '@types'
import { Keypair } from 'js-kinesis-sdk'
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
    const keypair = Keypair.random()
    const payee: Payee = { name: 'aPayee1', publicKey: 'asdf' }
    const state: DeepPartial<RootState> = {
      accounts: {
        accountInfo: { balance: 0 },
      },
      passwords: {
        currentInput: 'password-input',
      },
      connections,
      payees: {
        payeesList: [payee],
      },
      transfer: {
        formData: { amount: 'formValue1' },
        isTransferring: true,
      },
      wallets: {
        activeWallet: { publicKey: 'wallet-public-key' },
        walletList: [{ publicKey: 'another-public-key', accountName: 'another' }],
      },
      wallet: {
        accounts: [{ keypair, name: 'x' }],
        persisted: {
          activeAccount: 0,
        },
      },
    }

    const { getFee, ...rest } = mapStateToProps(state as RootState)

    expect(rest).toEqual({
      amount: 'formValue1',
      isTransferring: true,
      isWalletUnlocked: true,
      accountBalance: 0,
      payees: [payee, { name: 'another', publicKey: 'another-public-key' }],
      publicKey: keypair.publicKey(),
      connection,
    })
  })

  it('mapStateToProps with locked account', () => {
    const keypair = Keypair.random()
    const state: DeepPartial<RootState> = <any>{
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
      wallet: {
        accounts: [{ keypair, name: 'x' }],
        persisted: {
          activeAccount: 0,
        },
      },
    }

    const { getFee, ...rest } = mapStateToProps(state as RootState)

    expect(rest).toEqual({
      accountBalance: 0,
      publicKey: keypair.publicKey(),
      connection,
      isTransferring: true,
      isWalletUnlocked: true,
      payees: [{ name: 'another', publicKey: 'another-public-key' }],
    })
  })
})
