import * as actions from '@actions'
import { ActionsUnion } from 'typesafe-actions'

export type RootAction = ActionsUnion<typeof actions>

type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<K, V> ? T : never
export type GetAction<K extends RootAction['type']> = DiscriminateUnion<RootAction, 'type', K>
