import { getInitials } from '@services/accounts'
import * as React from 'react'

interface Props {
  name: string
}

class InitialsAvatar extends React.Component<Props> {
  render() {
    return (
      <div
        className="image is-64x64 has-background-grey is-flex"
        style={{ justifyContent: 'center', alignItems: 'center', borderRadius: '100px' }}
      >
        <span className="has-text-grey-light is-size-3 is-uppercase">
          {getInitials(this.props.name)}
        </span>
      </div>
    )
  }
}

export { InitialsAvatar }
