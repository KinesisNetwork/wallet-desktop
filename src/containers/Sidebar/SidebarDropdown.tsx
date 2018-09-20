import * as React from 'react'

interface InjectedDropdownProps {
  isExpanded: boolean
  handleToggle: () => void
}
interface Props {
  children(props: InjectedDropdownProps): JSX.Element
}
interface State {
  isExpanded: boolean
}
export class SidebarDropdown extends React.PureComponent<Props, State> {
  state = { isExpanded: false }

  handleToggle = () => {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }))
  }

  render() {
    const { isExpanded } = this.state
    return (
      <div className="sidebar-dropdown tile is-child">
        <div className={`dropdown ${isExpanded ? 'is-active' : ''}`}>
          {this.props.children({ isExpanded, handleToggle: this.handleToggle })}
        </div>
      </div>
    )
  }
}

