import { AccountResponse } from 'js-kinesis-sdk'

import { accountLoadSuccess } from '@actions/accounts'
import { RootAction } from '@store'
import { accounts, AccountsState } from '../accounts'

const balance = 'balance'

const state = <AccountsState> <any> {
  accountsMap: {
    'existing_account_id': {
      id: 'existing_id',
      other: 'existing value'
    }
  }
}

describe('Accounts reducer', () => {
  const account = <AccountResponse> <any> {
    account_id: 'existing_account_id',
    balances: [ { balance, asset_type: 'native' } ],
  }

  it('default state', () => {
    const nextState = accounts(undefined, {} as RootAction)
    expect(nextState).toEqual({
      accountsMap: {},
      isAccountLoading: false
    })
  })

  it('accountLoadSuccess', () => {
    const nextState = accounts(state, accountLoadSuccess(account))

    expect(nextState).toEqual({
      accountsMap: {
        [account.account_id]: {
          id: 'existing_id',
          balance,
          other: 'existing value'
        }
      },
      isAccountLoading: false,
    })
  })

  it('accountLoadSuccess without native balance', () => {
    const nonNativeAccount = <AccountResponse> <any> {
      account_id: 'existing_account_id',
      balances: [ { balance, asset_type: 'non-native' } ],
    }

    let nextState

    expect(() => nextState = accounts(state, accountLoadSuccess(nonNativeAccount))).toThrow()
    expect(nextState).toEqual(undefined)
  })
})
