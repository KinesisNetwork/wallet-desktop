import { RootRoutes, WalletCreationRoutes } from '@types'
import * as React from 'react'
import { Link } from 'react-router-dom'

interface ModalProps {
  isActive: boolean
  closeModal: () => any
}
export const PasswordConfirmModal: React.SFC<ModalProps> = props => (
  <div className={`modal ${props.isActive ? 'is-active' : ''}`}>
    <div className="modal-background" />
    <div className="modal-content">
      <article className="message">
        <div className="message-header">
          <span className="icon is-medium has-text-danger ">
            <i className="fal fa-2x fa-info-circle" />
          </span>
          <span className="title is-marginless">Keep your password safe</span>
          <button className="delete" aria-label="close" onClick={props.closeModal} />
        </div>
        <div className="message-body">
          <div className="content">
            <p>
              For security reasons, we do not store your password anywhere. This means, if you
              forget your password, we cannot reset it for you.
            </p>
            <p>
              <a>Learn more</a>
            </p>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button className="button is-text" onClick={props.closeModal}>
                Back
              </button>
            </div>
            <div className="control">
              <Link
                to={RootRoutes.create + WalletCreationRoutes.second}
                className="button is-primary"
                onClick={props.closeModal}
              >
                Continue
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
)
