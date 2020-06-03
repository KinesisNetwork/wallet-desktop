import { combineReducers } from 'redux'
import { getType } from 'typesafe-actions'

import {
  handleConnectionFormChange,
  selectConnectedCurrency,
  selectConnectedStage,
  selectForEditConnection,
  selectUpdatingCurrency,
  stopEditingConnection,
} from '@actions'
import { RootAction } from '@store'
import { Connection, ConnectionStage, Currency } from '@types'

const DEFAULT_CONNECTIONS: Connections = {
  [ConnectionStage.testnet]: {
    [Currency.KAU]: {
      endpoint: 'https://kau-testnet-oceania.kinesisgroup.io',
      passphrase: 'Kinesis UAT',
    },
    [Currency.KAG]: {
      endpoint: 'https://kag-testnet-oceania.kinesisgroup.io',
      passphrase: 'Kinesis KAG UAT',
    },
  },
  [ConnectionStage.mainnet]: {
    [Currency.KAU]: {
      endpoint: 'https://kau-mainnet-oceania.kinesisgroup.io',
      passphrase: 'Kinesis Live',
    },
    [Currency.KAG]: {
      endpoint: 'https://kag-mainnet-oceania.kinesisgroup.io',
      passphrase: 'Kinesis KAG Live',
    },
  },
}

type Connections = { [S in ConnectionStage]: { [C in Currency]: Connection } }

interface UpdateConnections {
  selectedCurrency: Currency
  isEditing: keyof Connection | null
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
  selectedCurrency: (state = Currency.KAU, action) =>
    action.type === getType(selectUpdatingCurrency) ? action.payload : state,
})

export const connections = combineReducers<ConnectionsState, RootAction>({
  updating,
  currentCurrency: (state = Currency.KAU, action) =>
    action.type === getType(selectConnectedCurrency) ? action.payload : state,
  currentStage: (state = ConnectionStage.mainnet, action) =>
    action.type === getType(selectConnectedStage) ? action.payload : state,
  connections: (state = DEFAULT_CONNECTIONS, action) =>
    action.type === getType(handleConnectionFormChange)
      ? {
          ...state,
          [action.payload.currentStage]: {
            ...state[action.payload.currentStage],
            [action.payload.currentCurrency]: {
              ...state[action.payload.currentStage][action.payload.currentCurrency],
              [action.payload.field]: action.payload.newValue,
            },
          },
        }
      : state,
})
