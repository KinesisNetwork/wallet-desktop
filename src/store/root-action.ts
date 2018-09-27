import { REHYDRATE } from 'redux-persist'
import { ActionType } from 'typesafe-actions'

import * as actions from './actions'
import { RootState } from './root-reducer'

export interface RehydrateAction {
  type: typeof REHYDRATE
  payload: RootState
  key: string
}

export type RootAction = ActionType<typeof actions> | RehydrateAction
export type GetAction<K extends RootAction['type']> = DiscriminateUnion<RootAction, 'type', K>
type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<K, V> ? T : never
