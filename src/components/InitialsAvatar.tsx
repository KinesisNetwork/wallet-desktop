import * as React from 'react'

import { setImageSize } from '@services/transfer'
import { ImageSize } from '@types'

interface Props {
  name: string
  size: ImageSize
}

class InitialsAvatar extends React.Component<Props> {
  render() {
    return (
      <div
        className={`image ${setImageSize(this.props.size).image} has-background-grey is-flex`}
        style={{ justifyContent: 'center', alignItems: 'center', borderRadius: '100px' }}
      >
        <span className={`has-text-grey-light ${setImageSize(this.props.size).font} is-uppercase`}>
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
