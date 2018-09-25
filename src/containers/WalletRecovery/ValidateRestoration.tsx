import { replace } from 'connected-react-router'
import { easing, tween } from 'popmotion'
import * as React from 'react'
import { connect } from 'react-redux'

import { RootRoutes, WalletRecoverRoutes } from '@types'

const mapStateToProps = () => ({})
const mapDispatchToProps = {
  nextPage: () => replace(RootRoutes.recover.concat(WalletRecoverRoutes.fourth))
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
interface State {
  progress: number,
  progressText: string
}

const progressAnimation = tween({ to: 100, duration: 5000, ease: easing.anticipate }) 

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
    this.setState({ progressText: 'Wallet restored!' })
    this.timeout = setTimeout(() => this.props.nextPage(), 500)
  }

  componentWillUnmount() {
    clearInterval(this.timeout) 
  }

  render() {
    const { progress, progressText } = this.state
    return (
      <div className="section">
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-content">
            <progress className="progress is-success" value={progress} max={100}>{progress}%</progress>
            <article className="message is-success">
              <div className="message-body has-text-centered">
                <div className="content">
                  <span className="title has-text-grey-darker">{progressText}</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    )
  }
}

const ValidateRestoration = connect(mapStateToProps, mapDispatchToProps)(ValidateRestorationPresentation)

export { ValidateRestoration }