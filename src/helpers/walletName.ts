export const getInitials = (walletName: string): string => {
  const [firstName, surName] = walletName.split(' ')
  const firstInitial = firstName.charAt(0)
  const secondInitial = surName ? surName.charAt(0) : ''
  return `${firstInitial}${secondInitial}`.toUpperCase()
}
