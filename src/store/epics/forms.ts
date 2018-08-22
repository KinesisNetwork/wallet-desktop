import { filter, ignoreElements, map } from 'rxjs/operators'
import { isActionOf } from 'typesafe-actions'

import { invalidForm } from '@actions'
import { RootEpic } from '@store';

export const invalidForm$: RootEpic = (action$, _, { formAlert }) =>
  action$.pipe(
    filter(isActionOf(invalidForm)),
    map(({ payload: { message, key } }) => formAlert(message, key)),
    ignoreElements(),
  )
