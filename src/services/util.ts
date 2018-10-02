import { ImageSize } from '@types'

export function renderAmount(amount: string | number) {
  return Number(amount).toLocaleString(undefined, {
    useGrouping: true,
  })
}

export function setImageSize(size: ImageSize) {
  switch (size) {
    case ImageSize.small:
      return { image: 'is-32x32', font: 'is-size-6' }
      break
    case ImageSize.large:
      return { image: 'is-128x128', font: 'is-size-1' }
      break
    case ImageSize.medium:
    default:
      return { image: 'is-64x64', font: 'is-size-3' }
  }
}

export function validateAmount(amount: string) {
  return /^[0-9]+(\.)?([0-9]{1,5})?$/.test(amount)
}
