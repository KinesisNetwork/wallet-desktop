import { ActionsObservable, StateObservable } from 'redux-observable'
import { of } from 'rxjs/observable/of'
import { toArray } from 'rxjs/operators'

import { invalidForm } from '@actions/forms'
import { FormAlert } from '@types';
import { RootState } from '../../root-reducer';
import { invalidForm$ } from '../forms'

describe('invalidForm$', () => {
  it('calls formAlert', (done) => {
    const formAlertParam: FormAlert = {
      message: 'Error',
      key: 'input-field'
    }
    const action$ = ActionsObservable.from([
      invalidForm(formAlertParam)
    ])
    const state$: StateObservable<RootState> = <any>of(null)
    const formAlert = jest.fn(() => Promise.resolve())

    invalidForm$(action$, state$, { formAlert })
      .pipe(toArray())
      .subscribe((actions) => {
        expect(actions).toEqual([])
        expect(formAlert).toHaveBeenCalled()
        done()
      })
  })
})
