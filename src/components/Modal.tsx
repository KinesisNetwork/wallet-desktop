import * as React from 'react'

let onboarding
if (process.env.IS_WEB) {
  onboarding = require('../onboarding_stickers_Artboard.svg')
}

export const Modal: React.SFC = () => (
  <main className="modal is-active">
    <div className="modal-background" />
    <section className="modal-content has-background-grey-dark section" style={{ width: '60rem' }}>
      <h1 className="is-size-3 has-text-weight-semibold has-text-grey-lighter has-text-centered" style={{ letterSpacing: '1px', marginBottom: '3rem' }}>
        Your new wallet is now active
      </h1>
      <div className="columns is-vcentered" style={{ marginBottom: '3rem' }}>
        <div className="column">
          <div className="content has-text-grey-lighter has-text-weight-semibold is-size-5">
            <p style={{ letterSpacing: '3px' }}>Buy Kinesis from the exchange and store it in your wallet.</p>
            <p style={{ letterSpacing: '3px' }}>Kinesis is the world's most stable currency, backed 1:1 against gold (KAU) and silver (KAG) bullion.</p>
            <a href="#" className="is-link is-size-6">Learn more</a>
          </div>
        </div>
        <div className="column">
          <figure className="image is-4by3">
            <img src={onboarding ? onboarding : './onboarding_stickers_Artboard.svg'} className="" />
          </figure>
        </div>
      </div>
      <div className="is-pulled-right">
        <button className="button has-text-grey-darker is-uppercase is-primary">OK</button>
      </div>
    </section>
  </main>
)
