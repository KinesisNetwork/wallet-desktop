import * as React from 'react'

import { InitialsAvatar } from '@components/InitialsAvatar'
import { RootState } from '@store'
import { Contact } from '@types'
import { connect } from 'react-redux'

const ContactCard: React.SFC<Contact> = props => (
  <div className="box">
    <div className="level">
      <div className="level-left">
        <div className="level-item">
          <InitialsAvatar name={props.name} />
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
  contacts: state.contacts.contactList,
})

type Props = ReturnType<typeof mapStateToProps>
const ContactListPresentation: React.SFC<Props> = props => (
  <React.Fragment>{props.contacts.map(c => <ContactCard {...c} key={c.name} />)}</React.Fragment>
)

const ConnectedContactList = connect(mapStateToProps)(ContactListPresentation)

export { ConnectedContactList as ContactList }
