import { showNotification, updateAccountName } from '@actions'
import { EditableText } from '@components/EditableText'
import { Sign } from '@containers/Sign'
import { getActiveAccount } from '@selectors'
import { RootState } from '@store'
import { NotificationType } from '@types'
import * as copy from 'copy-to-clipboard'
import * as React from 'react'
import { connect } from 'react-redux'

export const mapStateToProps = ({ wallet }: RootState) => ({
  activeAccount: getActiveAccount(wallet),
  accountNames: wallet.accounts.map(a => a.name),
})

const mapDispatchToProps = { showNotification, updateAccountName }

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>

export class AccountPanelComponent extends React.Component<
  Props,
  { isToggled: boolean; copied: boolean; isEditing: boolean; name: string }
> {
  constructor(props) {
    super(props)
    this.state = {
      isToggled: false,
      copied: false,
      isEditing: false,
      name: this.props.activeAccount.name,
    }
  }

  public toggleAdvanced = () => this.setState({ isToggled: !this.state.isToggled })

  public onChange = ev => this.setState({ name: ev.target.value })

  public onStopEditing = () => {
    const existingAccountWithName = this.props.accountNames.find(name => this.state.name === name)
    if (existingAccountWithName && this.props.activeAccount.name !== this.state.name) {
      this.props.showNotification({
        type: NotificationType.error,
        message: 'Account name must be unique',
      })
      return
    }

    this.setState({ isEditing: !this.state.isEditing })

    if (this.props.activeAccount.name === this.state.name) {
      return
    }

    this.props.updateAccountName({
      existingName: this.props.activeAccount.name,
      newName: this.state.name,
    })
    this.props.showNotification({
      type: NotificationType.success,
      message: 'Account name successfully updated',
    })
  }

  public toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing })

  public render() {
    return (
      <div className="box has-background-grey" style={{ position: 'relative' }}>
        <div className="has-text-centered">
          <div className="level">
            <div className="level-item">
              <EditableText
                isEditing={this.state.isEditing}
                value={this.state.name}
                onChangeHandler={this.onChange}
                onStartEditing={this.toggleIsEditing}
                onStopEditing={this.onStopEditing}
                opts={{ isLarge: true }}
              />
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div
              className="tooltip is-tooltip-top"
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
            <button
              className="button is-inline-flex is-text"
              style={{ position: 'absolute', right: 0, bottom: 0 }}
              onClick={this.toggleAdvanced}
            >
              <span>Advanced</span>
              <span
                className={`icon is-small`}
                style={{
                  transition: 'transform .25s ease-in-out',
                  transform: this.state.isToggled ? 'rotate(180deg)' : '',
                }}
              >
                <i className={`fal fa-lg fa-angle-down`} />
              </span>
            </button>
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
    setTimeout(() => this.setState({ copied: false }), 5000)
  }
}

export const AccountPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountPanelComponent)
