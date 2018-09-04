import { ActionsObservable, StateObservable } from 'redux-observable'
import { epicDependencies, EpicDependencies } from '../../root-epic'
import { RootState } from '../../root-reducer'

import { RootAction, RootEpic } from '@store'
import { DeepPartial } from 'redux'
import { Subject } from 'rxjs'
import { toArray } from 'rxjs/operators'

const stateInput$ = new Subject<RootState>()
const state$ = new StateObservable<RootState>(stateInput$, undefined as any)

type MockDependencies = Partial<Record<keyof EpicDependencies, jest.Mock>>

type IEpicTest = (
  params: {
    epic: RootEpic
    inputActions: RootAction[]
    expectedActions?: RootAction[]
    state?: DeepPartial<RootState>
    dependencies?: MockDependencies
  },
) => Promise<RootAction[]>

export const mockServices = (services: MockDependencies) => ({ ...epicDependencies, ...services })

export const epicTest: IEpicTest = ({
  epic,
  inputActions,
  expectedActions,
  state,
  dependencies = {},
}) => {
  stateInput$.next(state as RootState)

  const action$ = ActionsObservable.from(inputActions)

  return epic(action$, state$, mockServices(dependencies))
    .pipe(toArray())
    .toPromise()
    .then(actualActions => {
      if (expectedActions !== undefined) {
        expect(actualActions).toEqual(expectedActions)
      }
      return actualActions
    })
}
