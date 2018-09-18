import { RootState } from '@store'
import * as React from 'react'
import { connect } from 'react-redux'

const mapStateToProps = ({ notifier }: RootState) => ({
  message: notifier.message,
  type: notifier.type,
  visible: notifier.visible
})

type Props = ReturnType<typeof mapStateToProps>

const NotifierComponent: React.SFC<Props> = (props) => {
  return (
    <div className={`notification is-${props.type} has-text-centered`} style={{borderRadius: 0, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 100}} hidden={!props.visible}>
      {props.message}
    </div>
  )
}

export const Notifier = connect(mapStateToProps)(NotifierComponent)
