import { FormAlert, UpdateFormField } from '@types'
import { createStandardAction } from 'typesafe-actions'

export const invalidForm = createStandardAction('INVALID_FORM')<FormAlert>()
export const updateFormField = createStandardAction('UPDATE_FORM_FIELD')<UpdateFormField>()
