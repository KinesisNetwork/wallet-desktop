import { values } from 'lodash'
import { combineEpics, Epic } from 'redux-observable'

import { generalFailureAlert, generalSuccessAlert } from '@helpers/alert'
import { loadAccount } from '@services/accounts'
import { getTransactionErrorMessage, getTransactions } from '@services/kinesis'
import { createKinesisTransfer, submitSignedTransaction } from '@services/transfer'

import * as epics from './epics'
import { withPolling } from './epics/utils'
import { RootAction } from './root-action'
import { RootState } from './root-reducer'
import { getActiveKeys, getCurrentConnection } from './selectors'

export const epicDependencies = {
  createKinesisTransfer,
  generalFailureAlert,
  generalSuccessAlert,
  getActiveKeys,
  getCurrentConnection,
  getTransactionErrorMessage,
  getTransactions,
  loadAccount,
  submitSignedTransaction,
  withPolling,
}

export type EpicDependencies = typeof epicDependencies

export type RootEpic = Epic<RootAction, RootAction, RootState, EpicDependencies>
export const rootEpic = combineEpics<RootEpic>(...values(epics))
