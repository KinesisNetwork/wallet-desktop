import * as React from 'react'

import { setImageSize } from '@services/util'
import { ImageSize } from '@types'

interface Props {
  name: string
  size: ImageSize
}

class InitialsAvatar extends React.Component<Props> {
  render() {
    const setAvatarClasses = setImageSize(this.props.size)
    return (
      <div
        className={`image ${setAvatarClasses.image} has-background-grey is-flex`}
        style={{ justifyContent: 'center', alignItems: 'center', borderRadius: '100px' }}
      >
        <span className={`has-text-grey-light ${setAvatarClasses.font} is-uppercase`}>
          {this.getInitials()}
        </span>
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
