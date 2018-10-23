import * as React from 'react'
import SVG from 'react-inlinesvg'

import { setImageSize } from '@services/util'
import { Currency, ImageSize } from '@types'
import * as kagLogo from 'images/kag-icon.svg'
import * as kauLogo from 'images/kau-icon.svg'

interface Props {
  currency: string
  size: ImageSize
  title?: string
}

export const CurrencyLogo: React.SFC<Props> = props => {
  return (
    <React.Fragment>
      <div className="level">
        <div className="level-item">
          <figure className={`image ${setImageSize(props.size).image}`}>
            <SVG src={props.currency === Currency.KAU ? kauLogo : kagLogo} />
          </figure>
        </div>
      </div>
      {props.title && (
        <div className="level" style={{ letterSpacing: '2px' }}>
          <div className="level-item">
            <h1 className="title has-text-weight-bold is-uppercase">{props.title}</h1>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
