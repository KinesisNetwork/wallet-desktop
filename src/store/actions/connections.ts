import { Connection, ConnectionStage, Currency, FormUpdate } from '@types'
import { createAction, createStandardAction } from 'typesafe-actions'

export const selectConnectedCurrency = createStandardAction('SELECT_CONNECTION_CURRENCY')<
  Currency
>()
export const selectConnectedStage = createStandardAction('SELECT_CONNECTION_STAGE')<
  ConnectionStage
>()
export const selectUpdatingCurrency = createStandardAction('SELECT_CONNECTION_CURRENCY_FOR_UPDATE')<
  Currency
>()
export const handleConnectionFormChange = createStandardAction('UPDATE_CONNECTION_FORM')<
  FormUpdate<Connection> & { currentStage: ConnectionStage; currentCurrency: Currency }
>()
export const selectForEditConnection = createStandardAction('SELECT_FOR_EDIT_CONNECTION')<
  'endpoint' | 'passphrase'
>()
export const stopEditingConnection = createAction('STOP_EDITING_CONNECTION')
