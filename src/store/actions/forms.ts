import { FormAlert } from '@types'
import { buildAction } from 'typesafe-actions'

export const invalidForm = buildAction('INVALID_FORM').payload<FormAlert>()

interface UpdateFormField {
  formName: string
  formField: string
  fieldValue: string
}

export const updateFormField = buildAction('UPDATE_FORM_FIELD').payload<UpdateFormField>()
