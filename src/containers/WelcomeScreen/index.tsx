import * as React from 'react'
import { connect } from 'react-redux'

import { RootState } from '@store'
import { HasAccount } from './HasAccount'
import { NoAccount } from './NoAccount'

const mapStateToProps = (state: RootState) => ({
  hasAccount: !!state.wallet.persisted.encryptedPassphrase,
})

type Props = ReturnType<typeof mapStateToProps>

const WelcomeScreenPresentation: React.SFC<Props> = props => (
  <React.Fragment>
    <div className="heading has-text-centered">
      <h2 className="is-size-5-mobile is-size-4-tablet is-size-2-desktop has-text-weight-semibold has-text-grey-lighter">
        Welcome to the
      </h2>
      <h1 className="is-size-3-mobile is-size-2-tablet is-size-1-desktop has-text-weight-bold has-text-primary">
        future of money
      </h1>
    </div>
    <section className="section">
      {props.hasAccount ? <HasAccount {...props} /> : <NoAccount />}
    </section>
  </React.Fragment>
)

const ConnectedWelcomeScreen = connect(mapStateToProps)(WelcomeScreenPresentation)

export { ConnectedWelcomeScreen as WelcomeScreen }
