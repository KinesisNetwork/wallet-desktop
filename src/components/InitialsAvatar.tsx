import * as React from 'react'

import { setImageSize } from '@services/util'
import { ImageSize } from '@types'

interface Props {
  name: string
  size: ImageSize
}

class InitialsAvatar extends React.Component<Props> {
  render() {
    const { image: imageSize, font: fontSize } = setImageSize(this.props.size)
    return (
      <div
        className={`image ${imageSize} has-background-grey is-flex`}
        style={{ justifyContent: 'center', alignItems: 'center', borderRadius: '100px' }}
      >
        <span className={`has-text-grey-light ${fontSize} is-uppercase`}>{this.getInitials()}</span>
      </div>
    )
  }

  private getInitials = () =>
    this.props
      .name!.split(' ')
      .map(word => word.substring(0, 1))
      .reduce(
        (initials, curr, i, names) =>
          i === names.length - 1 && i !== 0 ? initials + curr : initials,
      )
}

export { InitialsAvatar }
