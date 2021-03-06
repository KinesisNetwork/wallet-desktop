import { RootRoutes } from '@types'
import * as React from 'react'
import { Link } from 'react-router-dom'

export const NoAccount: React.SFC<any> = () => (
  <main className="has-text-centered">
    <div className="u-margin-bottom-lg-2">
      <Link to={RootRoutes.create} className="button is-primary is-large">
        Begin
      </Link>
    </div>
    <section className="u-margin-bottom-sm-2">
      <span className="has-text-grey-lighter">Already have Kinesis?</span>
      <Link to={RootRoutes.recover} className="is-link u-margin-left-sm-1">
        Import an existing wallet
      </Link>
    </section>
    <section className="is-size-7">
      <span className="has-text-grey-lighter">Why choose Kinesis?</span>
      <a className="is-link u-margin-left-xxs" href="https://youtu.be/moDBJCemGTM" target="_blank">
        Learn more
      </a>
    </section>
  </main>
)
