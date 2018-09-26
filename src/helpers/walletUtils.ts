import { Currency } from '@types'

export const cropPublicKey = (publicKey: string) => {
  const firstPart = publicKey.slice(0, 17)
  const lastPart = publicKey.slice(-4)
  return `${firstPart}...${lastPart}`
}

export const addMetalColour = (currency: string) => {
  return currency === Currency.KAU ? 'has-text-primary' : 'has-text-grey-light'
}
