export const calculateUnlockTime = (timestamp: Date) => {
  const LOCKED_PERIOD_IN_MINUTES = 1
  return timestamp.valueOf() + LOCKED_PERIOD_IN_MINUTES * 60 * 1000
}
