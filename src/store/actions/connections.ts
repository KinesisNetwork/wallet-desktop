import { Connection, ConnectionStage, Currency, FormUpdate } from '@types'
import { buildAction } from 'typesafe-actions'

export const selectConnectedCurrency = buildAction('SELECT_CONNECTION_CURRENCY').payload<Currency>()
export const selectConnectedStage = buildAction('SELECT_CONNECTION_STAGE').payload<
  ConnectionStage
>()
export const selectUpdatingCurrency = buildAction('SELECT_CONNECTION_CURRENCY_FOR_UPDATE').payload<
  Currency
>()
export const handleConnectionFormChange = buildAction('UPDATE_CONNECTION_FORM').payload<
  FormUpdate<Connection> & { currentStage: ConnectionStage; currentCurrency: Currency }
>()
export const selectForEditConnection = buildAction('SELECT_FOR_EDIT_CONNECTION').payload<
  'endpoint' | 'passphrase'
>()
export const stopEditingConnection = buildAction('STOP_EDITING_CONNECTION').empty()
