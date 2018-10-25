import { RootState } from '@store'
import { ConnectionStage, RootRoutes } from '@types'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

type Props = ReturnType<typeof mapStateToProps>
const TestnetBannerPresentation: React.SFC<Props> = props =>
  props.isTestnet ? (
    <div className="notification is-info is-radiusless is-marginless">
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <span className="icon is-medium">
              <i className="fal fa-lg fa-info" />
            </span>
          </div>
          <div className="level-item">
            <span className="is-uppercase">You are on a test network.</span>
          </div>
          <div className="level-item">
            <span>
              This network is for testing only; any funds shown, received, or transferred hold no
              value.
            </span>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <Link to={RootRoutes.settings} className="button is-text">
              <span className="icon">
                <i className="fal fa-lg fa-sliders-v" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : null

const mapStateToProps = (state: RootState) => ({
  isTestnet: state.connections.currentStage === ConnectionStage.testnet,
})

const TestnetBanner = connect(mapStateToProps)(TestnetBannerPresentation)

export default TestnetBanner
