import { ActionsUnion } from 'typesafe-actions'
import * as actions from './actions'
export type RootAction = ActionsUnion<typeof actions>
