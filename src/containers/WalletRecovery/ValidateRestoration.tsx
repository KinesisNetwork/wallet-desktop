import { replace } from 'connected-react-router'
import { easing, tween } from 'popmotion'
import * as React from 'react'
import { connect } from 'react-redux'

import { Modal } from '@components/Modal'
import { RootRoutes, WalletRecoverRoutes } from '@types'

const mapStateToProps = () => ({})
const mapDispatchToProps = {
  nextPage: () => replace(RootRoutes.recover.concat(WalletRecoverRoutes.third)),
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
interface State {
  progress: number
  progressText: string
}

const progressAnimation = tween({ to: 100, duration: 2500, ease: easing.anticipate })

class ValidateRestorationPresentation extends React.Component<Props, State> {
  state = {
    progress: 0,
    progressText: 'Restoring wallet...',
  }

  timeout: NodeJS.Timer

  componentDidMount() {
    progressAnimation.start({
      update: this.updateProgress,
      complete: this.completeProgress,
    })
  }

  updateProgress = (progress): void => {
    this.setState({ progress })
  }

  completeProgress = (): void => {
    this.setState({ progressText: 'Wallet imported!' })
    this.timeout = setTimeout(() => this.props.nextPage(), 750)
  }

  componentWillUnmount() {
    clearInterval(this.timeout)
  }

  render() {
    const { progress, progressText } = this.state
    return (
      <Modal hasBackground={true} isActive={true}>
        <progress className="progress is-success is-radiusless" value={progress} max={100} />
        <article className="message is-success is-radiusless">
          <div className="message-body has-text-centered is-radiusless">
            <div className="content">
              <span className="title has-text-grey-darker">{progressText}</span>
            </div>
          </div>
        </article>
      </Modal>
    )
  }
}

const ValidateRestoration = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValidateRestorationPresentation)

export { ValidateRestoration }
