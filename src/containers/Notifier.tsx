import { clearNotification } from '@actions'
import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ notifier }: RootState) => ({ ...notifier })

const mapDispatchToProps = { clearNotification }

interface OwnProps {
  handleTransitionEnd: () => void
  isHidden: boolean
}

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>

const NotifierComponent: React.SFC<Props & OwnProps> = props => (
  <div
    className={`notification notifier is-${props.type} has-text-centered`}
    style={{
      opacity: props.visible ? 1 : 0,
      right: props.visible ? '20px' : '-500px',
      zIndex: props.isHidden ? -999 : 100,
    }}
    onTransitionEnd={props.handleTransitionEnd}
  >
    <button className="delete" onClick={props.clearNotification} tabIndex={-1} />
    {props.message}
  </div>
)

class NotifierWrapper extends React.Component<Props, { isHidden: boolean }> {
  state = { isHidden: false }

  public componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.setState({ isHidden: false })
    }
  }

  public handleTransitionEnd = () => {
    if (!this.props.visible) {
      this.setState({ isHidden: true })
    }
  }

  render() {
    return (
      <NotifierComponent
        {...this.props}
        handleTransitionEnd={this.handleTransitionEnd}
        isHidden={this.state.isHidden}
      />
    )
  }
}

export const Notifier = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotifierWrapper)
