import { buildAction } from 'typesafe-actions'
import { View } from '@types'

export const changeView = buildAction('CHANGE_VIEW').payload<View>()
