import * as React from 'react'

import { ContactForm } from '@containers/Contacts/ContactForm'
import { ContactList } from '@containers/Contacts/ContactList'
import { RouteComponentProps } from 'react-router'

interface State {
  formIsVisible: boolean
}
class ContactsStateful extends React.Component<RouteComponentProps<any>, State> {
  state: State = {
    formIsVisible: false,
  }

  render() {
    return <Contacts {...this.state} showForm={this.showForm} hideForm={this.hideForm} />
  }

  hideForm = () => this.setState({ formIsVisible: false })
  showForm = () => this.setState({ formIsVisible: true })
}

interface Props extends State {
  showForm: () => any
  hideForm: () => any
}

const Contacts: React.SFC<Props> = props => (
  <React.Fragment>
    <div className="level">
      <div className="level-left">
        <p className="subtitle has-text-grey-lighter">Contacts</p>
      </div>
      <div className="level-right">
        <button className="button" onClick={props.showForm}>
          <span className="icon">
            <i className="fal fa-lg fa-plus" />
          </span>
        </button>
      </div>
    </div>
    <hr className="has-background-grey-lighter" />
    {props.formIsVisible && <ContactForm hideForm={props.hideForm} />}
    <ContactList />
  </React.Fragment>
)

export { ContactsStateful as Contacts }
