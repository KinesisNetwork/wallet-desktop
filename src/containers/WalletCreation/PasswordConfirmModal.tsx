import * as React from 'react'
import { Link } from 'react-router-dom'

import { Modal } from '@components/Modal'
import { RootRoutes, WalletCreationRoutes } from '@types'

interface ModalProps {
  isActive: boolean
  closeModal: () => any
}
export const PasswordConfirmModal: React.SFC<ModalProps> = ({ closeModal, isActive }) => (
  <Modal hasBackground={true} isActive={isActive}>
    <article className="message">
      <div className="message-header">
        <span className="icon is-medium has-text-warning ">
          <i className="fal fa-2x fa-exclamation-circle" />
        </span>
        <span className="title is-marginless">Keep your password safe</span>
        <button className="delete" aria-label="close" onClick={closeModal} />
      </div>
      <div className="message-body">
        <div className="content">
          <p>
            For security reasons we do not store your password anywhere. This means that if you
            forget your password we cannot reset it for you.
          </p>
          <p>
            <a href="mailto:marketing@kinesis.money?subject=Keep%20your%20password%20safe%20learn%20more%20request&bcc=it@kinesis.money">
              Learn more
            </a>
          </p>
        </div>
        <div className="field is-grouped is-grouped-right">
          <div className="control">
            <button className="button is-text" onClick={closeModal}>
              Back
            </button>
          </div>
          <div className="control">
            <Link
              to={RootRoutes.create + WalletCreationRoutes.second}
              className="button is-primary"
              onClick={closeModal}
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </article>
  </Modal>
)
