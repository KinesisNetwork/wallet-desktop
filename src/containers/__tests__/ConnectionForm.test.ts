import { RootState } from '@store'
import { mapStateToProps } from '../ConnectionForm'

it('ConnectionForm mapStateToProps', () => {
  const state = <RootState> <any> {
    connections: {
      form: 'props',
    },
    other: 'unused',
  }

  const result = mapStateToProps(state)

  expect(result).toEqual('props')
})
