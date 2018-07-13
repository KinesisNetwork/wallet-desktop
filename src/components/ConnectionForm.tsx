import { kebabCase, startCase } from 'lodash'
import * as React from 'react'

import { InputField } from '@components/InputField'
import { formAlert } from '@helpers/alert'
import { InputError } from '@helpers/errors'
import { Connection, FormUpdate } from '@types'

export interface Props extends Connection {
  addConnection: (conn: Connection) => any
  handleConnectionFormChange: (update: FormUpdate<Connection>) => any
}

export class ConnectionForm extends React.Component<Props> {
  constructor(props) {
    super(props)
  }

  handleSubmit = (ev) => {
    ev.preventDefault()
    try {
      this.validateProps()
      this.props.addConnection(this.props)
    } catch (e) {
      formAlert(e.message, e.key)
    }
  }

  validateProps = () => {
    this.checkValidEntry('name')
    this.checkValidEntry('horizonURL')
    this.checkValidEntry('networkPassphrase')
  }

  checkValidEntry = (key: keyof Connection) => {
    if (!this.props[key]) {
      throw new InputError(`${startCase(key)} is required`, `input-connection-${kebabCase(key)}`)
    }
  }

  render() {
    const {
      handleConnectionFormChange: handleChange,
      name,
      horizonURL,
      networkPassphrase,
    } = this.props
    return (
      <section className='section'>
        <div>
          <span className='icon is-large'>
            <i className='fas fa-plug' />
          </span>
          <h1 className='title is-4 heading primary-font'>
            Add New Connection
          </h1>
        </div>
        <form onSubmit={this.handleSubmit}>
          <InputField
            label='Connection Name'
            value={name}
            id='connection-name'
            onChangeHandler={(newValue) => handleChange({ field: 'name', newValue })}
          />
          <InputField
            label='Horizon URL'
            value={horizonURL}
            id='connection-horizon-url'
            onChangeHandler={(newValue) => handleChange({ field: 'horizonURL', newValue })}
          />
          <InputField
            label='Network Passphrase'
            value={networkPassphrase}
            id='connection-network-passphrase'
            onChangeHandler={(newValue) => handleChange({ field: 'networkPassphrase', newValue })}
          />
          <div className='field'>
            <div className='control is-expanded'>
              <button className='button is-fullwidth' type='submit'>
                Add Connection
              </button>
            </div>
          </div>
        </form>
      </section>
    )
  }
}
