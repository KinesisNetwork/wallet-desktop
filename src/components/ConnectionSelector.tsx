import * as React from 'react'

import { Connection } from '@types'

export interface Props {
  connections: Connection[]
  currentlySelected: number
  selectConnection: (conn: Connection) => any
}

export class ConnectionSelector extends React.Component<Props> {
  constructor(props) {
    super(props)
  }

  renderConnections = () => {
    return this.props.connections.map((conn, i) => {
      const isActive = this.props.currentlySelected === i
      return (
        <ConnectionButton
          key={i}
          connection={conn}
          isActive={isActive}
          selectConnection={this.props.selectConnection}
        />
      )
    })
  }

  render() {
    return (
      <section className='section'>
        <h1 className='sub-heading primary-font'>Select a Network</h1>
        {this.renderConnections()}
      </section>
    )
  }
}

interface ConnectionButtonProps {
  connection: Connection
  isActive: boolean
  selectConnection: (conn: Connection) => any
}

class ConnectionButton extends React.Component<ConnectionButtonProps> {
  constructor(props) {
    super(props)
  }

  handleClick = (ev) => {
    ev.preventDefault()
    this.props.selectConnection(this.props.connection)
  }

  render() {
    const { connection, isActive } = this.props
    return (
      <a className='level' onClick={this.handleClick}>
        <div className='level-left has-text-left'>
            <div className='content'>
              <strong>{connection.connectionName}</strong>
              <p>
                {connection.horizonServer}<br/>
                {connection.networkPassphrase}
              </p>
            </div>
        </div>
        <div className='level-right'>
          {isActive && <span className='icon has-text-success'><i className='fas fa-check-circle' /></span>}
        </div>
      </a>
    )
      }
    }
