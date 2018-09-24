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
        <span className="has-text-grey-light is-size-3 is-uppercase">{this.getInitials()}</span>
      </div>
    )
  }

  private getInitials = () =>
    this.props.name
      .split(' ')
      .map(word => word.substring(0, 1))
      .reduce(
        (initials, curr, i, names) =>
          i === names.length - 1 && i !== 0 ? initials + curr : initials,
      )
}

export { InitialsAvatar }
