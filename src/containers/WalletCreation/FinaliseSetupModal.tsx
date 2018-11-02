import * as React from 'react'

import { Modal } from '@components/Modal'

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
      <Modal hasBackground={true} isActive={this.props.isActive}>
        <article className="message">
          <div className="message-header">
            <span className="icon is-medium has-text-warning">
              <i className="fal fa-2x fa-exclamation-circle" />
            </span>
            <span className="title is-marginless">Do not lose your recovery phrase</span>
            <button className="delete" aria-label="close" onClick={this.props.closeModal} />
          </div>
          <div className="message-body">
            <div className="content">
              <p>
                <strong>Your recovery phrase is your last line of defense.</strong>{' '}
                <a href="mailto:marketing@kinesis.money?subject=Recovery%20phrase%20learn%20more%20request&bcc=it@kinesis.money">
                  Learn more
                </a>
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
      </Modal>
    )
  }
}

export { FinaliseSetupModal }
