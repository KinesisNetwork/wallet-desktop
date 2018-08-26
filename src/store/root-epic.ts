import { values } from 'lodash'
import { combineEpics, Epic } from 'redux-observable'

import { generalFailureAlert, generalSuccessAlert } from '@helpers/alert'
import { loadAccount } from '@services/accounts'
import { decryptPrivateKey } from '@services/encryption'
import { getTransactionErrorMessage } from '@services/kinesis'
import { createKinesisTransfer, submitSignedTransaction } from '@services/transfer'

import * as epics from './epics'
import { RootAction } from './root-action'
import { RootState } from './root-reducer'
import { getActiveKeys, getCurrentConnection } from './selectors'

export const epicDependencies = {
  createKinesisTransfer,
  generalFailureAlert,
  generalSuccessAlert,
  getCurrentConnection,
  getActiveKeys,
  getTransactionErrorMessage,
  loadAccount,
  submitSignedTransaction,
  decryptPrivateKey,
}

export type EpicDependencies = typeof epicDependencies

export type RootEpic = Epic<RootAction, RootAction, RootState, EpicDependencies>
export const rootEpic = combineEpics<RootEpic>(...values(epics))
