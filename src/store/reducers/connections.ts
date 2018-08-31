import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

import {
  handleConnectionFormChange,
  selectForEditConnection,
  stopEditingConnection,
} from '@actions'
import { RootAction } from '@store'
import { Connection, ConnectionStage, Currency } from '@types'

const DEFAULT_CONNECTIONS: Connections = {
  [ConnectionStage.testnet]: {
    [Currency.KAU]: {
      endpoint: 'https://kau-testnet.kinesisgroup.io',
      passphrase: 'Kinesis UAT',
    },
    [Currency.KAG]: {
      endpoint: 'https://kag-testnet.kinesisgroup.io',
      passphrase: 'Kinesis KAG UAT',
    },
  },
}

type Connections = { [S in ConnectionStage]?: { [C in Currency]: Connection } }

interface UpdateConnections {
  selectedCurrency: Currency
  isEditing: 'endpoint' | 'passphrase' | null
}

export interface ConnectionsState {
  currentStage: ConnectionStage
  currentCurrency: Currency
  connections: Connections
  updating: UpdateConnections
}

const updating = combineReducers<UpdateConnections, RootAction>({
  isEditing: (state = null, action) => {
    switch (action.type) {
      case getType(selectForEditConnection):
        return action.payload
      case getType(stopEditingConnection):
        return null
      default:
        return state
    }
  },
  selectedCurrency: (state = Currency.KAU) => state,
})

export const connections = combineReducers<ConnectionsState, RootAction>({
  updating,
  currentCurrency: (state = Currency.KAU) => state,
  currentStage: (state = ConnectionStage.testnet) => state,
  connections: (state = DEFAULT_CONNECTIONS, action) =>
    action.type === getType(handleConnectionFormChange)
      ? {
          [action.payload.currentStage]: {
            [action.payload.currentCurrency]: {
              [action.payload.field]: action.payload.newValue,
              ...state[action.payload.currentStage]![action.payload.currentCurrency],
            },
            ...state[action.payload.currentStage],
          },
          ...state,
        }
      : state,
})
