import { Currency } from '@types'

export const cropPublicKey = (publicKey: string) => {
  const firstPart = publicKey.slice(0, 17)
  const lastPart = publicKey.slice(-4)
  return `${firstPart}...${lastPart}`
}

export const addMetalColour = (currency: string) => {
  if (currency === Currency.KAU) {
    return 'has-text-primary'
  } else if (currency === Currency.KAG) {
    return 'has-text-grey-light'
  } else {
    return 'has-text-kem'
  }
}
