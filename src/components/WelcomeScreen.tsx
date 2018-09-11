import { InputField } from '@components/InputField';
import * as React from 'react'

// tslint:disable-next-line:no-empty-interface
export interface Props {
  password?: string
  hasAccount?: boolean
  isPasswordCorrect?: boolean
}

let logo
let avatar
if (process.env.IS_WEB) {
  logo = require('../logo2.svg')
  avatar = require('../Avatar.svg')
}

export const WelcomeScreen: React.SFC<Props> = ({
  hasAccount = true
}) => (
    <div className="container" style={{ maxWidth: '540px' }}>
      <header className="has-text-centered" style={{ marginTop: '3.5em' }}>
        <figure>
          <img src={logo} alt="Kinesis logo" />
        </figure>
        <div className="is-uppercase has-text-left" style={{ marginTop: '3.5em' }}>
          <h2 className="is-size-3 has-text-weight-semibold has-text-grey-lighter">Welcome to the</h2>
          <h1 className="is-size-1 has-text-weight-bold has-text-primary">future of money</h1>
        </div>
      </header>
      {hasAccount ? <HasAccount password='' /> : <NoAccount />}
    </div >
  )

export const HasAccount: React.SFC<Props> = ({
  password,
  isPasswordCorrect = false
}) => (
    <div>
      <section className="has-text-left level-left" style={{ marginTop: '3.5em' }}>
        <figure className="image is-64x64 is-inline-block">
          <img src={avatar} alt="User avatar" className="is-rounded" />
        </figure>
        <span className="is-size-1 has-text-weight-bold has-text-grey-lighter" style={{ marginLeft: '1em' }}>Sam B</span>
      </section>
      <section style={{ marginTop: '2.5em' }}>
        <form>
          <div className="field is-grouped" style={{ alignItems: 'flex-end' }}>
            <InputField
              id="password"
              value=""
              label="Password"
              hasButton={true}
              onChangeHandler={newValue => newValue}
              isPasswordCorrect={isPasswordCorrect}
            />
            <div className="control" style={{ marginBottom: '0.25rem' }}>
              <button
                className="button is-primary is-uppercase has-text-grey-darker"
                disabled={!password}
              >Login</button>
            </div>
          </div>
        </form>
        {!isPasswordCorrect && <p className="is-size-7 has-text-danger">Password is incorrect</p>}
      </section>
      <section className="has-text-centered" style={{ marginTop: '2.5em' }}>
        <span className="has-text-grey-lighter">Forgot your password?</span>
        <a href="#" className="is-link" style={{ marginLeft: '0.75rem' }}>Restore your wallet</a>
      </section>
    </div>
  )

export const NoAccount: React.SFC<any> = () => (
  <div>
    <div className="control has-text-centered" style={{ marginTop: '3.5rem' }}>
      <button className="button is-primary is-uppercase has-text-grey-darker is-large">Begin</button>
    </div>
    <section className="has-text-centered" style={{ marginTop: '2.5em' }}>
      <span className="has-text-grey-lighter">Already have Kinesis?</span>
      <a href="#" className="is-link" style={{ marginLeft: '0.75rem' }}>Restore an existing wallet</a>
    </section>
    <section className="has-text-centered is-size-7" style={{ marginTop: '2.5em' }}>
      <span className="has-text-grey-lighter">Why choose Kinesis?</span>
      <a href="#" className="is-link" style={{ marginLeft: '5px' }}>Learn more</a>
    </section>
  </div>
)
