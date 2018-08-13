import { selectWallet, setAccountPage } from '@actions';
import { RootAction } from '@store'
import { AccountPage } from '@types';
import { accountPage, AccountPageState } from '../accountPage'

const state = <AccountPageState><any>{
  accountPage: 'default'
}

describe('AccountPage reducer', () => {
  it('default state', () => {
    const nextState = accountPage(undefined, {} as RootAction)
    expect(nextState).toEqual({ accountPage: AccountPage.dashboard })
  })

  it('setAccountPage', () => {
    const nextState = accountPage(state, setAccountPage(AccountPage.sign))

    expect(nextState).toEqual({ accountPage: AccountPage.sign })
  })

  it('selectWallet', () => {
    const nextState = accountPage(state, selectWallet({
      publicKey: 'publicKey',
      encryptedPrivateKey: 'encryptedPrivateKey',
      accountName: 'accountName'
    }))

    expect(nextState).toEqual({ accountPage: AccountPage.dashboard })
  })
})
