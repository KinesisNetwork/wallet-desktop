import { SignProps } from '@containers'
import { enumStringValues } from '@helpers/enumStringValues'
import { SignBehaviour } from '@types'
import * as React from 'react'

export class Sign extends React.Component<SignProps> {
  constructor(props: SignProps) {
    super(props)
  }

  tabs = () => {
    const behaviourOpts = enumStringValues(SignBehaviour)
    return behaviourOpts.map((b) => {
      return (
        <li
          key={b}
          className={`${this.props.focus === b && 'is-active'}`}
          onClick={() => this.props.changeSignFocus(b)}
        >
          <a>
            <span>{b}</span>
          </a>
        </li>
      )
    })
  }

  render() {
    return (
      <div>
        <div className='tabs'>
          <ul>{this.tabs()}</ul>
        </div>
      </div>
    )
  }
}
