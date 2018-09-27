import * as React from 'react'

import { removeContact } from '@actions'
import { InitialsAvatar } from '@components/InitialsAvatar'
import { RootState } from '@store'
import { Contact } from '@types'
import { connect } from 'react-redux'

const ContactCard: React.SFC<Contact & typeof mapDispatchToProps> = props => (
  <div className="box" style={{ position: 'relative' }}>
    <button
      className="delete"
      onClick={() => props.removeContact({ address: props.address })}
      style={{ position: 'absolute', top: '10px', right: '10px' }}
    />
    <div className="level">
      <div className="level-left">
        <div className="level-item">
          <InitialsAvatar name={props.name} size="large" />
        </div>
        <div className="level-item">
          <h3 className="subtitle">{props.name}</h3>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <h6 className="subtitle is-6">{props.address}</h6>
        </div>
      </div>
    </div>
  </div>
)

const mapStateToProps = (state: RootState) => ({
  contactList: state.contacts.contactList,
})

const mapDispatchToProps = {
  removeContact,
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps
const ContactListPresentation: React.SFC<Props> = props => (
  <React.Fragment>
    {props.contactList.map(c => (
      <ContactCard {...c} removeContact={props.removeContact} key={c.name} />
    ))}
  </React.Fragment>
)

const ConnectedContactList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactListPresentation)

export { ConnectedContactList as ContactList }
