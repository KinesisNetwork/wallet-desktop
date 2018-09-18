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
  accountNames: wallet.accounts.map(a => a.name)
})

const mapDispatchToProps = { showNotification, updateAccountName }

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>

export class AccountPanelComponent extends React.Component<Props, { isToggled: boolean, copied: boolean, isEditing: boolean, name: string }> {
  constructor(props) {
    super(props)
    this.state = { isToggled: false, copied: false, isEditing: false, name: this.props.activeAccount.name }
  }

  public toggleAdvanced = () => this.setState({isToggled: !this.state.isToggled})

  public onChange = (ev) => this.setState({name: ev.target.value})

  public onStopEditing = () => {
    const existingAccountWithName = this.props.accountNames.find(name => this.state.name === name)
    if (existingAccountWithName && this.props.activeAccount.name !== this.state.name) {
      this.props.showNotification({type: NotificationType.error, message: 'Account name must be unique'})
      return
    }

    if (this.props.activeAccount.name === this.state.name) {
      return
    }

    this.setState({isEditing: !this.state.isEditing})
    this.props.updateAccountName({existingName: this.props.activeAccount.name, newName: this.state.name})
    this.props.showNotification({type: NotificationType.success, message: 'Account name successfully updated'})
  }

  public toggleIsEditing = () => this.setState({isEditing: !this.state.isEditing})

  public render() {
    return (
      <div className='section'>
        <div className='container'>
          <div className='card' style={{ borderRadius: '5px' }}>
            <div className='card-content'>
              <div className='has-text-centered'>
                <div className='level'>
                  <div className='level-item'>
                    <EditableText
                      isEditing={this.state.isEditing}
                      value={this.state.name}
                      onChangeHandler={this.onChange}
                      onStartEditing={this.toggleIsEditing}
                      onStopEditing={this.onStopEditing}
                      opts={{isLarge: true}}
                      />
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <div className='tooltip is-tooltip-top' data-tooltip={this.state.copied ? 'Copied!' : 'Copy Public Address' }>
                    <button className='button is-primary is-outlined' onClick={this.copyPublicKey}>
                      {this.props.activeAccount.keypair.publicKey()}
                      &nbsp;
                      <i className='far fa-copy' />
                    </button>
                  </div>
                  <button className='button inline-button' style={{ position: 'absolute', right: 0, bottom: 0 }} onClick={this.toggleAdvanced}>
                    <span>Advanced</span>
                    <span className={`icon is-small ${this.state.isToggled === false && 'is-hidden'}`}>
                      <i className='fa fa-angle-up'/>
                    </span>
                    <span className={`icon is-small ${this.state.isToggled && 'is-hidden'}`}>
                      <i className='fa fa-angle-down' />
                    </span>
                  </button>
                </div>
              </div>
              <div className='expandable' style={{height: this.state.isToggled ? '400px' : '0'}}>
                <Sign />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private copyPublicKey = () => {
    this.setState({copied: true})
    copy(this.props.activeAccount.keypair.publicKey())
    setTimeout(() => this.setState({copied: false}), 5000)
  }
}



export const AccountPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountPanelComponent)
