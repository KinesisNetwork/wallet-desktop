import { RootState } from '@store'
import { mapStateToProps } from '../ConnectionSelector'

describe('ConnectionSelector mapStateToProps', () => {
  it('with valid currentConnection', () => {
    const state = <RootState> <any> {
      connections: {
        connectionList: [
          {horizonURL: 'a-url'},
          {horizonURL: 'current-url'},
        ],
        currentConnection: {
          horizonURL: 'current-url',
        },
      },
      other: 'unused',
    }

    const result = mapStateToProps(state)

    expect(result).toEqual({
      connections: [
        {horizonURL: 'a-url'},
        {horizonURL: 'current-url'},
      ],
      activeConnection: 1,
    })
  })

  it('with currentConnection not in connectionList', () => {
    const state = <RootState> <any> {
      connections: {
        connectionList: [
          {horizonURL: 'a-url'},
          {horizonURL: 'another-url'},
        ],
        currentConnection: {
          horizonURL: 'non-existant-url',
        },
      },
      other: 'unused',
    }

    const result = mapStateToProps(state)

    expect(result).toEqual({
      connections: [
        {horizonURL: 'a-url'},
        {horizonURL: 'another-url'},
      ],
      activeConnection: -1,
    })
  })
})
