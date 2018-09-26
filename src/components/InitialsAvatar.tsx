import * as React from 'react'

interface Props {
  name?: string
  icon?: string
  size: string
  fontSize: string
}

class InitialsAvatar extends React.Component<Props> {
  render() {
    return (
      <div
        className={`image is-${this.props.size}x${this.props.size} has-background-grey is-flex`}
        style={{ justifyContent: 'center', alignItems: 'center', borderRadius: '100px' }}
      >
        <span className={`has-text-grey-light is-size-${this.props.fontSize} is-uppercase`}>
          {this.props.name
            ? this.getInitials()
            : this.props.icon && <i className={`fal ${this.props.icon}`} />}
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
