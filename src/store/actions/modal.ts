import { buildAction } from 'typesafe-actions'

export const closeModal = buildAction('CLOSE_MODAL').empty()
export const completeOnBoarding = buildAction('COMPLETE_ONBOARDING').empty()
