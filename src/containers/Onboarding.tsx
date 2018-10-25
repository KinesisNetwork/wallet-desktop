import * as React from 'react'
import { connect } from 'react-redux'

import { closeModal, completeOnBoarding } from '@actions'
import { Modal } from '@components/Modal'
import * as onboarding from '@images/onboarding_stickers_Artboard.svg'
import { RootState } from '@store'

const mapStateToProps = ({ modals, settings }: RootState) => ({
  isModalActive: modals.modalDisplay,
  hasOnBoarded: settings.onBoarding,
})

const mapDispatchToProps = {
  closeModal,
  completeOnBoarding,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

export class OnboardingPresentation extends React.Component<Props> {
  closeModal = () => {
    this.props.closeModal()
    this.props.completeOnBoarding()
  }

  render() {
    const { hasOnBoarded, isModalActive } = this.props

    return (
      <Modal hasBackground={true} isActive={isModalActive && !hasOnBoarded}>
        <div className="box">
          <h1 className="title is-2 has-text-primary is-uppercase has-text-centered">
            Your new wallet is now active
          </h1>
          <div className="columns is-vcentered">
            <div className="column">
              <div className="content has-text-grey-lighter is-size-4">
                <p>Buy Kinesis from the exchange and store it in your wallet.</p>
                <p>
                  Kinesis is the world's most stable currency, backed 1:1 against gold (KAU) and
                  silver (KAG) bullion.
                </p>
                <a
                  className="is-link is-size-6"
                  href="https://youtu.be/moDBJCemGTM"
                  target="_blank"
                >
                  Learn more
                </a>
              </div>
            </div>
            <div className="column">
              <figure className="image is-4by3">
                <img
                  src={onboarding ? onboarding : './onboarding_stickers_Artboard.svg'}
                  className=""
                />
              </figure>
            </div>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button className="button is-primary" onClick={this.closeModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

const Onboarding = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnboardingPresentation)

export { Onboarding }
