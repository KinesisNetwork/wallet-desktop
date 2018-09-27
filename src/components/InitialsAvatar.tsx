import { AvatarSize } from '@types'
import * as React from 'react'

interface Props {
  name: string
  size: string
}

class InitialsAvatar extends React.Component<Props> {
  render() {
    return (
      <div
        className={`image ${this.avatarSize(this.props.size).image} has-background-grey is-flex`}
        style={{ justifyContent: 'center', alignItems: 'center', borderRadius: '100px' }}
      >
        <span
          className={`has-text-grey-light ${this.avatarSize(this.props.size).font} is-uppercase`}
        >
          {this.getInitials()}
        </span>
      </div>
    )
  }

  private avatarSize = (size: string) => {
    switch (size) {
      case AvatarSize.small:
        return { image: 'is-32x32', font: 'is-size-6' }
        break
      case AvatarSize.large:
      default:
        return { image: 'is-64x64', font: 'is-size-3' }
    }
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
