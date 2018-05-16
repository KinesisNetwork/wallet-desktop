import { View } from '@types'
import { buildAction } from 'typesafe-actions'

export const changeView = buildAction('CHANGE_VIEW').payload<View>()
