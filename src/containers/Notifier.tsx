import { clearNotification } from '@actions'
import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ notifier }: RootState) => ({ ...notifier })

const mapDispatchToProps = { clearNotification }

type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>

const NotifierComponent: React.SFC<Props> = props => (
  <div
    className={`notification notifier is-${props.type} has-text-centered`}
    style={{ opacity: props.visible ? 1 : 0, right: props.visible ? '20px' : '-500px' }}
  >
    <button className="delete" onClick={props.clearNotification} tabIndex={-1} />
    {props.message}
  </div>
)

export const Notifier = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotifierComponent)
