import { combineEpics, Epic } from 'redux-observable'

import { formAlert, generalFailureAlert, generalSuccessAlert } from '@helpers/alert'
import { loadAccount } from '@services/accounts'
import { sendAnalyticsEvent } from '@services/analytics'
import { decryptWithPassword, encryptWithPassword } from '@services/encryption'
import {
  getFeeInKinesis,
  getMinBalanceInKinesis,
  getNextTransactionPage,
  getTransactionErrorMessage,
  getTransactions,
  isValidPublicKey,
} from '@services/kinesis'
import { createKinesisTransfer, submitSignedTransaction } from '@services/transfer'

import { getActiveAccount, getCurrentConnection, getLoginState } from '@selectors'
import {
  generateMnemonic,
  getKeypairFromMnemonic,
  getKeypairFromSecret,
} from '@services/passphrase'
import * as epics from './epics'
import { RootAction } from './root-action'
import { RootState } from './root-reducer'

export const epicDependencies = {
  createKinesisTransfer,
  formAlert,
  generalFailureAlert,
  generalSuccessAlert,
  getActiveAccount,
  getLoginState,
  getCurrentConnection,
  getTransactionErrorMessage,
  getTransactions,
  loadAccount,
  submitSignedTransaction,
  decryptWithPassword,
  generateMnemonic,
  getKeypairFromMnemonic,
  getKeypairFromSecret,
  encryptWithPassword,
  isValidPublicKey,
  sendAnalyticsEvent,
  getNextTransactionPage,
  getFeeInKinesis,
  getMinBalanceInKinesis,
}

export type EpicDependencies = typeof epicDependencies

export type RootEpic = Epic<RootAction, RootAction, RootState, EpicDependencies>
export const rootEpic = combineEpics<RootEpic>(...Object.values(epics))
