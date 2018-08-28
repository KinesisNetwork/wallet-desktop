import { FormAlert } from '@types'
import { buildAction } from 'typesafe-actions'

export const invalidForm = buildAction('INVALID_FORM').payload<FormAlert>()
