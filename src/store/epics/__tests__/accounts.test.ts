import { showNotification, updateAccountName } from '@actions'
import { NotificationType } from '@types'
import { accountNameUpdate } from '../accounts'
import { epicTest } from './helpers'

jest.mock('../../../services/analytics', () => ({ sendAnalyticsEvent: () => null }))

describe('Accounts epic', () => {
  it('accountNameUpdate triggers success notification', async () => {
    const nameUpdate = { existingName: 'name', newName: 'newName' }

    await epicTest({
      epic: accountNameUpdate,
      expectedActions: [
        showNotification({
          type: NotificationType.success,
          message: 'Account name successfully updated',
        }),
      ],
      inputActions: [updateAccountName(nameUpdate)],
    })
  })
})
