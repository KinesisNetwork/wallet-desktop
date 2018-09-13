import * as React from 'react'
import { connect } from 'react-redux'

import { RootState } from '@store'
import { HasAccount } from './HasAccount'
import { NoAccount } from './NoAccount'

import * as logo from 'logo2.svg'

const mapStateToProps = (state: RootState) => ({
  hasAccount: !!state.wallet.persisted.encryptedPassphrase,
})

type Props = ReturnType<typeof mapStateToProps>

const WelcomeScreenPresentation: React.SFC<Props> = props => (
  <div className="section">
    <div className="container">
      <div className="columns is-mobile is-centered">
        <div className="column is-two-fifths-fullhd is-half-desktop is-three-fifths-tablet is-four-fifths-mobile">
          <header className="u-margin-bottom-lg-1">
            <div className="vertical-spaced level is-mobile">
              <figure className="has-text-centered u-margin-bottom-xl">
                <img src={logo} alt="Kinesis logo" style={{ maxWidth: '60%' }} />
              </figure>
              <div className="heading">
                <h2 className="is-size-5-mobile is-size-4-tablet is-size-2-desktop has-text-weight-semibold has-text-grey-lighter">
                  Welcome to the
                </h2>
                <h1 className="is-size-3-mobile is-size-2-tablet is-size-1-desktop has-text-weight-bold has-text-primary">
                  future of money
                </h1>
              </div>
            </div>
          </header>
          {props.hasAccount ? <HasAccount {...props} /> : <NoAccount />}
        </div>
      </div>
    </div>
  </div>
)

const ConnectedWelcomeScreen = connect(mapStateToProps)(WelcomeScreenPresentation)

export { ConnectedWelcomeScreen as WelcomeScreen }
