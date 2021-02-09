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
// http://ec2-34-252-132-75.eu-west-1.compute.amazonaws.com:8000
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
    [Currency.KEM]: {
      endpoint: 'https://kem-testnet.kinesisgroup.io',
      passphrase: 'KEM UAT',
    },
  },
  [ConnectionStage.mainnet]: {
    [Currency.KAU]: {
      endpoint: 'https://kau-mainnet.kinesisgroup.io',
      passphrase: 'Kinesis Live',
    },
    [Currency.KAG]: {
      endpoint: 'https://kag-mainnet.kinesisgroup.io',
      passphrase: 'Kinesis KAG Live',
    },
    [Currency.KEM]: {
      endpoint: 'https://kem-mainnet.kinesisgroup.io',
      passphrase: 'KEM LIVE',
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
