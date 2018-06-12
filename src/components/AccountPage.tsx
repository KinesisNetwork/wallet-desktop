import { enumStringValues } from '@helpers/enumStringValues'
import { AccountPage } from '@types'
import * as React from 'react'

export interface Props {
  accountPage: AccountPage
  setAccountPage: (act: string) => any
}

export interface State {
  isDropped: boolean
}

export class AccountPageSelector extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = { isDropped: false }
  }

  handleSet = (accountAction: string) => {
    this.props.setAccountPage(accountAction)
    this.setState({ isDropped: !this.state.isDropped })
  }

  dropdownItems = () => {
    const accountActionVals = enumStringValues(AccountPage)
    return accountActionVals.map((accountAction) => {
      return (
        <a
          key={accountAction}
          className={`dropdown-item ${this.props.accountPage === accountAction && 'is-active'}`}
          onClick={() => this.handleSet(accountAction)}
        >
          {accountAction}
        </a>
      )
    })
  }

  render() {
    return (
      <div className={`dropdown ${this.state.isDropped && 'is-active'}`} style={{width: '100%'}}>
        <div className='dropdown-trigger' style={{width: '100%'}}>
          <button
            className='button is-fullwidth'
            aria-haspopup='true'
            aria-controls='dropdown-menu'
            onClick={() => this.setState({isDropped: !this.state.isDropped})}
          >
            <span>Advanced</span>
            <span className='icon'>
              <i className='fa fa-cogs' aria-hidden='true' />
            </span>
          </button>
        </div>
        <div className='dropdown-menu' id='dropdown-menu' role='menu' style={{width: '100%'}}>
          <div className='dropdown-content'>
            {this.dropdownItems()}
          </div>
        </div>
      </div>
    )
  }
}
