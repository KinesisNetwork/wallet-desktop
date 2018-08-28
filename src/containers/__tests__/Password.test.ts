import { RootState } from '@store'
import { mapStateToProps } from '../Password'

describe('Password', () => {
  it('mapStateToProps with unlocked account', () => {
    const state = <RootState>(<any>{
      wallets: {
        activeWallet: {
          publicKey: 'wallet-public-key',
        },
      },
      accounts: {
        accountsMap: {
          'wallet-public-key': {
            isUnlocked: true,
          },
        },
      },
      passwords: {
        currentInput: 'password-input',
        livePasswords: {
          'wallet-public-key': {
            privateKey: 'private-key',
          },
        },
      },
      other: 'unused',
    })

    const result = mapStateToProps(state)

    expect(result).toEqual({
      activePublicKey: 'wallet-public-key',
      decryptedPrivateKey: 'private-key',
      isAccountUnlocked: true,
      password: 'password-input',
    })
  })

  it('mapStateToProps with locked account', () => {
    const state = <RootState>(<any>{
      wallets: {
        activeWallet: {
          publicKey: 'wallet-public-key',
        },
      },
      accounts: {
        accountsMap: {
          'wallet-public-key': {
            isUnlocked: false,
          },
        },
      },
      passwords: {
        currentInput: '',
        livePasswords: {},
      },
      other: 'unused',
    })

    const result = mapStateToProps(state)

    expect(result).toEqual({
      activePublicKey: 'wallet-public-key',
      decryptedPrivateKey: null,
      isAccountUnlocked: false,
      password: '',
    })
  })
})
