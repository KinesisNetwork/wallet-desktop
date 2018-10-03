import { Currency, ImageSize } from '@types'
import * as React from 'react'

import * as kagLogo from '@icons/kag-icon.svg'
import * as kauLogo from '@icons/kau-icon.svg'
import { setImageSize } from '@services/util'

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
            <img src={props.currency === Currency.KAU ? kauLogo : kagLogo} className="is-rounded" />
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
