import * as copy from 'copy-to-clipboard'
import * as React from 'react'
import { connect } from 'react-redux'

import { updateAccountName } from '@actions'
import { EditableText } from '@components/EditableText'
import { Sign } from '@containers/Sign'
import { getActiveAccount } from '@selectors'
import { sendAnalyticsEvent } from '@services/analytics'
import { RootState } from '@store'
import { GoogleAnalyticsAction, GoogleAnalyticsLabel } from '@types'

export const mapStateToProps = ({ wallet }: RootState) => ({
  activeAccount: getActiveAccount(wallet),
  accountNames: wallet.accounts.map(a => a.name),
})

const mapDispatchToProps = { updateAccountName }

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>
interface State {
  copied: boolean
  errorText: string
  hasError: boolean
  isEditing: boolean
  isToggled: boolean
  name: string
}

enum ValidationType {
  length = 'length',
  unique = 'unique',
}

export class AccountPanelComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      copied: false,
      errorText: '',
      hasError: false,
      isEditing: false,
      isToggled: false,
      name: props.activeAccount.name,
    }
  }

  public componentDidUpdate(prevProps) {
    if (this.props.activeAccount.name !== prevProps.activeAccount.name) {
      this.setState({ name: this.props.activeAccount.name })
    }
  }

  public toggleAdvanced = () => this.setState({ isToggled: !this.state.isToggled })

  public handleChange = ev => {
    const { value: name } = ev.target
    const errorText = this.validateInput(name, ValidationType.length)

    this.setState({ name, hasError: Boolean(errorText), errorText })
  }

  public handleStopEditing = () => {
    const { activeAccount } = this.props
    const { name } = this.state
    const trimmedName = name.trim()

    const errorText = this.validateInput(name, ValidationType.unique)

    if (errorText) {
      this.setState({ errorText, hasError: Boolean(errorText) })
      return
    }

    this.setState({ isEditing: !this.state.isEditing })

    if (activeAccount.name === trimmedName || this.state.hasError) {
      return
    }

    this.props.updateAccountName({
      existingName: activeAccount.name,
      newName: trimmedName,
    })
  }

  public toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing })

  public validateInput = (input: string, type: ValidationType) => {
    const { accountNames, activeAccount } = this.props
    const trimmedInput = input.trim()

    if (type === ValidationType.length) {
      return trimmedInput.length === 0 || input.length > 20
        ? 'Account name must be between 1 and 20 characters in length'
        : ''
    }
    if (type === ValidationType.unique) {
      const accountNameExists = accountNames.includes(trimmedInput)

      return accountNameExists && activeAccount.name !== trimmedInput
        ? `Account with name "${trimmedInput}" already exists`
        : ''
    }
    return ''
  }

  public render() {
    return (
      <div className="box has-background-grey" style={{ position: 'relative' }}>
        <div className="has-text-centered">
          <div className="level">
            <div className="level-item">
              <div className="field">
                <EditableText
                  hasError={this.state.hasError}
                  isEditing={this.state.isEditing}
                  value={this.state.name}
                  onChangeHandler={this.handleChange}
                  onStartEditing={this.toggleIsEditing}
                  onStopEditing={this.handleStopEditing}
                  opts={{ isLarge: true }}
                />
                <p className="help is-danger">{this.state.errorText}</p>
              </div>
            </div>
            <div className="level-right" style={{ position: 'relative' }}>
              <div className="level-item">
                <button
                  className="button is-inline-flex is-text"
                  style={{ position: 'absolute', right: 0, bottom: 0 }}
                  onClick={this.toggleAdvanced}
                >
                  <span>Advanced</span>
                  <span
                    className="icon is-small"
                    style={{
                      transition: 'transform .25s ease-in-out',
                      transform: this.state.isToggled ? 'rotate(180deg)' : '',
                    }}
                  >
                    <i className="fal fa-lg fa-angle-down" />
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="buttons is-centered">
            <div
              className="tooltip is-tooltip-top level-item"
              data-tooltip={this.state.copied ? 'Copied!' : 'Copy Public Address'}
            >
              <button
                className="button is-primary is-outlined has-icons-right"
                onClick={this.copyPublicKey}
              >
                <span>{this.props.activeAccount.keypair.publicKey()}</span>
                <span className="icon is-right">
                  <i className="fal  fa-copy" />
                </span>
              </button>
            </div>
          </div>
        </div>
        <div
          className="expandable box has-background-grey"
          style={{ transform: this.state.isToggled ? 'scaleY(1)' : 'scaleY(0)' }}
        >
          <Sign />
        </div>
      </div>
    )
  }

  private copyPublicKey = () => {
    this.setState({ copied: true })
    copy(this.props.activeAccount.keypair.publicKey())
    sendAnalyticsEvent({
      action: GoogleAnalyticsAction.click,
      label: GoogleAnalyticsLabel.copyAddress,
    })
    setTimeout(() => this.setState({ copied: false }), 5000)
  }
}

export const AccountPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountPanelComponent)
