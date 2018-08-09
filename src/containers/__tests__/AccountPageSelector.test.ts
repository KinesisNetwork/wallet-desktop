import { RootState } from '@store'
import { mapStateToProps } from '../AccountPageSelector'

describe('AccountPageSelector', () => {
  it('mapStateToProps', () => {
    const state = <RootState> <any> {
      accountPage: {
        accountPage: 'props',
      },
      other: 'unused',
    }

    const result = mapStateToProps(state)

    expect(result).toEqual({ accountPage: 'props' })
  })
})
