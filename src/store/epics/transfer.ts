import { replace } from 'connected-react-router'
import { from, merge, of } from 'rxjs'
import {
  catchError,
  debounceTime,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import {
  insufficientFunds,
  publicKeyValidation,
  showNotification,
  targetPayeeAccountExist,
  targetPayeeAccountNotExist,
  transactionFailed,
  transactionRequest,
  transactionSuccess,
  transferRequest,
  updateContactForm,
  updateFee,
  updateMinimumBalance,
  updateRemainingBalance,
  updateTransferForm,
} from '@actions'
import { getActiveAccount } from '@selectors'
import { RootEpic } from '@store'
import { GoogleAnalyticsAction, GoogleAnalyticsLabel, NotificationType, RootRoutes } from '@types'

export const amountCalculations$: RootEpic = (
  action$,
  state$,
  {
    getCurrentConnection,
    getFeeInKinesis,
    getMinBalanceInKinesis,
    getBaseReserveInKinesis,
    isValidPublicKey,
  },
) => {
  const amountUpdate$ = action$.pipe(
    filter(isActionOf(updateTransferForm)),
    filter(({ payload: { field } }) => field === 'amount'),
    map(({ payload: { newValue } }) => parseFloat(newValue) || 0),
    debounceTime(200),
  )

  const accountBalanceConnectionState$ = state$.pipe(
    map(({ accounts, connections, wallet }) => {
      const { balance } = accounts.accountInfo
      const currentConnection = getCurrentConnection(connections)
      const activeAccount = getActiveAccount(wallet)

      return {
        activeAccount,
        balance,
        currentConnection,
      }
    }),
  )

  const amountUpdateWithState$ = amountUpdate$.pipe(
    withLatestFrom(accountBalanceConnectionState$),
    map(([amount, { activeAccount, balance, currentConnection }]) => ({
      amount,
      activeAccount,
      balance,
      currentConnection,
    })),
  )

  const fee$ = amountUpdateWithState$.pipe(
    switchMap(({ amount, currentConnection }) => from(getFeeInKinesis(currentConnection, amount))),
  )
  const updateFee$ = fee$.pipe(map(updateFee))

  const minBalance$ = amountUpdateWithState$.pipe(
    switchMap(({ activeAccount, currentConnection }) =>
      from(getMinBalanceInKinesis(currentConnection, activeAccount)),
    ),
  )
  const updateMinimumBalance$ = minBalance$.pipe(map(updateMinimumBalance))

  // Ensure we have the latest fee when calculating the remainingBalance
  const remainingBalance$ = fee$.pipe(
    withLatestFrom(amountUpdateWithState$),
    map(([fee, { amount, balance }]) => balance - (Number(fee) + amount)),
  )
  const updateRemainingBalance$ = remainingBalance$.pipe(map(updateRemainingBalance))

  const insufficientFunds$ = remainingBalance$.pipe(
    withLatestFrom(minBalance$),
    map(([remainingBalance, minBalance]) => remainingBalance < minBalance),
  )

  const getBaseReserveInKinesis$ = insufficientFunds$.pipe(
    withLatestFrom(accountBalanceConnectionState$),
    switchMap(([, { currentConnection }]) => getBaseReserveInKinesis(currentConnection)),
  )

  const updateInsufficientFunds$ = insufficientFunds$.pipe(
    withLatestFrom(getBaseReserveInKinesis$, state$),
    map(
      ([
        isInsufficientFunds,
        baseReserveInKinesis,
        {
          connections: { currentCurrency },
          transfer: {
            targetPayeeIsExisted,
            formData: { amount, targetPayee },
          },
        },
      ]) => {
        const minimumReserve = 2 * baseReserveInKinesis
        if (
          isValidPublicKey(targetPayee) &&
          !targetPayeeIsExisted &&
          Number(amount) < minimumReserve
        ) {
          return insufficientFunds(
            `The transfer amount of this transaction must be at least ${minimumReserve} ${currentCurrency}`,
          )
        }
        if (isInsufficientFunds) {
          return insufficientFunds('Insufficient funds')
        }
        return insufficientFunds('')
      },
    ),
  )

  return merge(updateFee$, updateMinimumBalance$, updateRemainingBalance$, updateInsufficientFunds$)
}

export const publicKeyValidation$: RootEpic = (action$, _, { isValidPublicKey }) =>
  action$.pipe(
    filter(isActionOf(updateContactForm)),
    filter(({ payload: { field } }) => field === 'address'),
    map(action => publicKeyValidation(isValidPublicKey(action.payload.newValue))),
  )

export const checkTargetPayeeAccountExist$: RootEpic = (
  action$,
  state$,
  { isValidPublicKey, loadAccount, getCurrentConnection },
) =>
  action$.pipe(
    filter(isActionOf(updateTransferForm)),
    filter(({ payload: { field } }) => field === 'targetPayee'),
    filter(({ payload: { newValue } }) => isValidPublicKey(newValue)),
    withLatestFrom(state$),
    switchMap(([{ payload: { newValue } }, { connections }]) =>
      from(loadAccount(newValue, getCurrentConnection(connections))).pipe(catchError(e => of(e))),
    ),
    map(e => {
      if (!!e.message && e.message === 'Account does not exist on the network') {
        return targetPayeeAccountNotExist()
      }
      return targetPayeeAccountExist()
    }),
  )

export const checkContactAccountExist$: RootEpic = (
  action$,
  state$,
  { isValidPublicKey, loadAccount, getCurrentConnection },
) =>
  action$.pipe(
    filter(isActionOf(updateContactForm)),
    filter(({ payload: { field } }) => field === 'address'),
    filter(({ payload: { newValue } }) => isValidPublicKey(newValue)),
    withLatestFrom(state$),
    switchMap(([{ payload: { newValue } }, { connections }]) =>
      from(loadAccount(newValue, getCurrentConnection(connections))).pipe(catchError(e => of(e))),
    ),
    map(e => {
      if (!!e.message && e.message === 'Account does not exist on the network') {
        return targetPayeeAccountNotExist()
      }
      return targetPayeeAccountExist()
    }),
  )

export const updateTransferFormFromValidationResult$: RootEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf([targetPayeeAccountNotExist, targetPayeeAccountExist])),
    withLatestFrom(state$),
    map(([_, { transfer: { formData: { amount } } }]) => {
      return updateTransferForm({ field: 'amount', newValue: amount })
    }),
  )

export const transferRequest$: RootEpic = (
  action$,
  state$,
  { createKinesisTransfer, getCurrentConnection },
) =>
  action$.pipe(
    filter(isActionOf(transferRequest)),
    map(({ payload }) => payload),
    withLatestFrom(state$),
    exhaustMap(([request, state]) =>
      from(
        createKinesisTransfer(
          getActiveAccount(state.wallet).keypair.secret(),
          getCurrentConnection(state.connections),
          request,
        ),
      ).pipe(
        map(transactionRequest),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSubmission$: RootEpic = (
  action$,
  state$,
  { getCurrentConnection, submitSignedTransaction },
) =>
  action$.pipe(
    filter(isActionOf(transactionRequest)),
    withLatestFrom(state$),
    mergeMap(([{ payload }, { transfer }]) =>
      from(submitSignedTransaction(getCurrentConnection(state$.value.connections), payload)).pipe(
        map(() => transactionSuccess(transfer.formData)),
        catchError(err => of(transactionFailed(err))),
      ),
    ),
  )

export const transactionSuccess$: RootEpic = (action$, state$, { sendAnalyticsEvent }) =>
  action$.pipe(
    filter(isActionOf(transactionSuccess)),
    withLatestFrom(state$),
    tap(([{ payload: { amount, fee } }, { connections }]) =>
      sendAnalyticsEvent({
        action: GoogleAnalyticsAction.transfer,
        category: connections.currentCurrency,
        label: `${GoogleAnalyticsLabel.transferFund} success`,
        value: (Number(amount) + Number(fee)).toFixed(5),
      }),
    ),
    mergeMap(() =>
      merge(
        of(replace(RootRoutes.dashboard) as any),
        of(
          showNotification({
            type: NotificationType.success,
            message: 'Transaction submitted successfully!',
          }),
        ),
      ),
    ),
  )

export const transactionFailed$: RootEpic = (action$, state$, { sendAnalyticsEvent }) =>
  action$.pipe(
    filter(isActionOf(transactionFailed)),
    withLatestFrom(state$),
    tap(([_, { connections }]) =>
      sendAnalyticsEvent({
        action: GoogleAnalyticsAction.transfer,
        category: connections.currentCurrency,
        label: `${GoogleAnalyticsLabel.transferFund} failure`,
      }),
    ),
    mergeMap(([{ payload }]) =>
      merge(
        of(replace(RootRoutes.dashboard) as any),
        of(
          showNotification({
            type:
              payload.name === 'HorizonError' ? NotificationType.warning : NotificationType.error,
            message: payload.message || 'Transaction error.',
          }),
        ),
      ),
    ),
  )
