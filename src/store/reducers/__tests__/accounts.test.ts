import { AccountResponse } from 'js-kinesis-sdk'

import { accountLoadSuccess } from '@actions'
import { RootAction } from '@store'
import { accounts } from '../accounts'

describe('Accounts reducer', () => {
  const account = <AccountResponse>(<any>{
    account_id: 'existing_account_id',
    balances: [{ balance: 5, asset_type: 'native' }],
  })

  it('default state', () => {
    const nextState = accounts(undefined, {} as RootAction)
    expect(nextState).toEqual({
      isAccountLoading: false,
      accountInfo: { balance: 0 },
    })
  })

  it('accountLoadSuccess', () => {
    const nextState = accounts(undefined, accountLoadSuccess(account))

    expect(nextState).toEqual({
      accountInfo: { balance: 5 },
      isAccountLoading: false,
    })
  })
})
