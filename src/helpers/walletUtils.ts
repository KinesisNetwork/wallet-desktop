export const getInitials = (walletName: string): string => {
  const [firstName, surName] = walletName.split(' ')
  const firstInitial = firstName.charAt(0)
  const secondInitial = surName ? surName.charAt(0) : ''
  return `${firstInitial}${secondInitial}`.toUpperCase()
}

export const cropPublicKey = (publicKey: string) => {
  const firstPart = publicKey.slice(0, 17)
  const lastPart = publicKey.slice(-4)
  return `${firstPart}...${lastPart}`
}

