import { EditableText } from '@components/EditableText'
import { Sign } from '@containers/Sign'
import { getActiveAccount } from '@selectors'
import { RootState } from '@store'
import * as copy from 'copy-to-clipboard'
import * as React from 'react'
import { connect } from 'react-redux'

export const mapStateToProps = ({ wallet }: RootState) => ({
  activeAccount: getActiveAccount(wallet),
})

const mapDispatchToProps = {}

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>

class AccountPanelComponent extends React.Component<Props, { isToggled: boolean, copied: boolean, isEditing: boolean }> {
  public state = { isToggled: false, copied: false, isEditing: false }
  public toggleAdvanced = () => this.setState({isToggled: !this.state.isToggled})

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
                      value={this.props.activeAccount.name}
                      onChangeHandler={() => true}
                      onStartEditing={() => this.setState({isEditing: !this.state.isEditing})}
                      onStopEditing={() => this.setState({isEditing: !this.state.isEditing})}
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
