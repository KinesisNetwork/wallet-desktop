import * as React from 'react'

export const ExchangePage: React.SFC = () => (
  <div className="has-text-grey-dark">
    <h1
      className="title is-size-1 has-text-weight-bold has-text-grey-dark has-text-centered"
      style={{ letterSpacing: '1px' }}
    >
      Kinesis Exchange is coming soon
    </h1>
    <div className="columns is-vcentered">
      <div className="column is-3 has-text-centered">
        <div className="level">
          <div className="level-item">
            <span className="icon is-large">
              <i className="fal fa-9x fa-alarm-clock" />
            </span>
          </div>
        </div>
      </div>
      <div className="column">
        <div
          className="content is-size-4 has-text-left has-text-weight-semibold"
          style={{ letterSpacing: '2px' }}
        >
          <p>You will soon be able to buy and sell Kinesis from within your wallet.</p>
          <p>
            In the meantime, you still have the option to{' '}
            <a href="https://mint-demo.abx.com" target="_blank">
              mint bullion to gain Kinesis
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
)
