import { closeModal, completeOnBoarding } from '@actions'
import { RootState } from '@store';
import * as React from 'react'
import { connect } from 'react-redux'

import * as onboarding from '@images/onboarding_stickers_Artboard.svg'

const mapStateToProps = (state: RootState) => ({
  isModalActive: state.modals.modalDisplay,
  hasOnBoarded: state.settings.onBoarding
})

const mapDispatchToProps = {
  closeModal,
  completeOnBoarding
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

export class OnboardingPresentation extends React.Component<Props> {
  closeModal = () => {
    this.props.closeModal()
    this.props.completeOnBoarding()
  }

  render() {
    return (
      <main className={`modal ${this.props.isModalActive && !this.props.hasOnBoarded ? 'is-active' : ''}`}>
        <div className="modal-background" />
        <section className="modal-content has-background-grey-dark section" style={{ borderRadius: '5px', width: '60rem' }}>
          <h1
            className="is-size-3 has-text-weight-semibold has-text-grey-lighter has-text-centered u-margin-bottom-lg-2"
            style={{ letterSpacing: '1px' }}
          >
            Your new wallet is now active
          </h1>
          <div className="columns is-vcentered u-margin-bottom-lg-2">
            <div className="column">
              <div className="content has-text-grey-lighter has-text-weight-semibold is-size-5">
                <p style={{ letterSpacing: '3px' }}>Buy Kinesis from the exchange and store it in your wallet.</p>
                <p style={{ letterSpacing: '3px' }}>Kinesis is the world's most stable currency, backed 1:1 against gold (KAU) and silver (KAG) bullion.</p>
                <a className="is-link is-size-6">Learn more</a>
              </div>
            </div>
            <div className="column">
              <figure className="image is-4by3">
                <img src={onboarding ? onboarding : './onboarding_stickers_Artboard.svg'} className="" />
              </figure>
            </div>
          </div>
          <div className="is-pulled-right">
            <button
              className="button has-text-grey-darker is-uppercase is-primary"
              onClick={() => this.closeModal()}
            >OK</button>
          </div>
        </section>
      </main>
    )
  }
}

const ConnectedOnboardingPresentation = connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingPresentation)

export { ConnectedOnboardingPresentation as Onboarding }
