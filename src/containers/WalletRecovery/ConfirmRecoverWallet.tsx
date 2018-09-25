import { push, replace } from 'connected-react-router'
import * as React from 'react'
import { connect } from 'react-redux'

import { RootRoutes, WalletRecoverRoutes } from '@types'

const mapStateToProps = () => ({})
const mapDispatchToProps = {
  goBack: () => replace(RootRoutes.dashboard),
  nextPage: () => push(RootRoutes.recover + WalletRecoverRoutes.second),
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
interface State {
  confirmUseRecoveryPhrase: boolean
  confirmRestorePassword: boolean
}
class ConfirmRecoverWalletPresentation extends React.Component<Props, State> {
  state = {
    confirmUseRecoveryPhrase: false,
    confirmRestorePassword: false,
  }
  
  handleCheckChange = (field: keyof State, value: boolean) => {
    this.setState(prevState => ({ ...prevState, [field]: value }))
  }

  render() {
    const { goBack, nextPage } = this.props
    return (
      <div className="section">
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-content">
            <article className="message">
              <div className="message-header">
                <span className="icon is-large has-text-danger ">
                  <i className="fal fa-2x fa-exclamation-circle" />
                </span>
                <span className="title is-marginless">Forgot your password?</span>
                <button className="delete" aria-label="close" onClick={goBack} />
              </div>
              <div className="message-body">
                <div className="content">
                  <p>
                    For security reasons we do not store your wallet password anywhere. The wallet's unique recovery phrase is required to restore it. <a href="#">Learn more</a>
                  </p>
                </div>
                <div className="field">
                  <div className="control">
                    <input
                      checked={this.state.confirmUseRecoveryPhrase}
                      className="is-checkradio"
                      id="recovery-phrase"
                      name="recovery-phrase"
                      onChange={ev => this.handleCheckChange('confirmUseRecoveryPhrase', ev.target.checked)}
                      type="checkbox"
                    />
                    <label htmlFor="recovery-phrase">I understand that the only way to restore a wallet is by using its unique recovery phrase.</label>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <input
                      checked={this.state.confirmRestorePassword}
                      className="is-checkradio"
                      id="password"
                      name="password"
                      onChange={ev => this.handleCheckChange('confirmRestorePassword', ev.target.checked)}
                      type="checkbox"
                    />
                    <label htmlFor="password">I understand that if I continue, the wallet password will no longer work until it has been restored.</label>
                  </div>
                </div>

                <div className="field is-grouped is-grouped-right">
                  <div className="control">
                    <button className="button is-text" onClick={goBack}>
                      Back
                    </button>
                  </div>
                  <div className="control">
                    <button
                      className="button is-primary"
                      disabled={!(this.state.confirmRestorePassword && this.state.confirmUseRecoveryPhrase)}
                      onClick={nextPage}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    )
  }
}

const ConfirmRecoverWallet = connect(mapStateToProps, mapDispatchToProps)(ConfirmRecoverWalletPresentation)

export { ConfirmRecoverWallet, ConfirmRecoverWalletPresentation }