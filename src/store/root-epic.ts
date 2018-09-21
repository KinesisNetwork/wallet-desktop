import { values } from 'lodash'
import { combineEpics, Epic } from 'redux-observable'

import { formAlert, generalFailureAlert, generalSuccessAlert } from '@helpers/alert'
import { loadAccount } from '@services/accounts'
import { decryptWithPassword, encryptWithPassword } from '@services/encryption'
import { getTransactionErrorMessage, getTransactions, isValidPublicKey } from '@services/kinesis'
import { createKinesisTransfer, submitSignedTransaction } from '@services/transfer'

import {
  generateMnemonic,
  getKeypairFromMnemonic,
  getKeypairFromSecret,
} from '@services/passphrase'
import * as epics from './epics'
import { withPolling } from './epics/utils'
import { RootAction } from './root-action'
import { RootState } from './root-reducer'
import { getCurrentConnection } from './selectors'

export const epicDependencies = {
  createKinesisTransfer,
  formAlert,
  generalFailureAlert,
  generalSuccessAlert,
  getCurrentConnection,
  getTransactionErrorMessage,
  getTransactions,
  loadAccount,
  submitSignedTransaction,
  withPolling,
  decryptWithPassword,
  generateMnemonic,
  getKeypairFromMnemonic,
  getKeypairFromSecret,
  encryptWithPassword,
  isValidPublicKey
}

export type EpicDependencies = typeof epicDependencies

export type RootEpic = Epic<RootAction, RootAction, RootState, EpicDependencies>
export const rootEpic = combineEpics<RootEpic>(...values(epics))
