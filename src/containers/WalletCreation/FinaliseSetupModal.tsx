import * as React from 'react'

interface Props {
  isActive: boolean
  closeModal: (() => any)
  handleConfirm: () => any
}
class FinaliseSetupModal extends React.Component<Props> {
  state = {
    noServer: false,
    recovery: false,
  }
  render() {
    return (
      <div className={`modal ${this.props.isActive ? 'is-active' : ''}`}>
        <div className="modal-background" />
        <div className="modal-content">
          <article className="message">
            <div className="message-header">
              <span className="icon is-medium has-text-danger">
                <i className="fal fa-2x fa-exclamation-circle" />
              </span>
              <span className="title is-marginless">Do not lose your recovery phrase</span>
              <button className="delete" aria-label="close" onClick={this.props.closeModal} />
            </div>
            <div className="message-body">
              <div className="content">
                <p>
                  <strong>Your recovery phrase is your last line of defense.</strong>
                </p>
                <p>
                  <a>Learn more</a>
                </p>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    type="checkbox"
                    className="is-checkradio"
                    name="no-server"
                    id="no-server"
                    onChange={() => this.setState({ noServer: !this.state.noServer })}
                  />
                  <label htmlFor="no-server">
                    I understand that my wallet and Kinesis are held securely on this device and not
                    on any servers.
                  </label>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input
                    type="checkbox"
                    className="is-checkradio"
                    name="recovery"
                    id="recovery"
                    checked={this.state.recovery}
                    onChange={() => this.setState({ recovery: !this.state.recovery })}
                  />
                  <label htmlFor="recovery">
                    I understand if this application is deleted or moved to another device, my
                    recovery phrase is the only way I can recover my wallet.
                  </label>
                </div>
              </div>
              <div className="field is-grouped is-grouped-right">
                <div className="control">
                  <button className="button is-text" onClick={this.props.closeModal}>
                    Back
                  </button>
                </div>
                <div className="control">
                  <button
                    className="button is-primary"
                    disabled={!this.state.noServer || !this.state.recovery}
                    onClick={this.props.handleConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    )
  }
}

export { FinaliseSetupModal }
