import { RootState } from '@store'
import { CreateWalletFormView } from '@types'
import { mapStateToProps } from '../CreateWallet'

describe('CreateWallet', () => {
  it('mapStateToProps', () => {
    const state = <RootState> <any> {
      createWallet: {
        form: {
          aFormKey: 'aFormValue',
        },
        formView: CreateWalletFormView.generate,
      },
      other: 'unused',
    }

    const result = mapStateToProps(state)

    expect(result).toEqual({
      aFormKey: 'aFormValue',
      activeView: CreateWalletFormView.generate,
    })
  })
})
