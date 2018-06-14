import * as React from 'react'

import { Connection } from '@types'

export interface Props {
  connections: Connection[]
  activeConnection: number
  selectConnection: (conn: Connection) => any
}

export class ConnectionSelector extends React.Component<Props> {
  constructor(props) {
    super(props)
  }

  renderConnections = () => {
    return this.props.connections.map((conn, i) => {
      const isActive = this.props.activeConnection === i
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
        <div>
          <span className='icon is-large'>
            <i className='fas fa-wifi' />
          </span>
          <h1 className='title is-4 heading primary-font'>Select a Network</h1>
        </div>
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
            <strong>{connection.name}</strong>
            <p>
              {connection.horizonURL}<br />
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
