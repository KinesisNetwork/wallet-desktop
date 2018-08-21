import React from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native'
let Ionicon = require('react-native-vector-icons/Ionicons').default;
import { NotificationState, StatusTypes } from './store/notification'
import { NotificationActionCreators } from './store/root-actions'

const statusTypeStyle = {
  [StatusTypes.info]: 'blue',
  [StatusTypes.error]: 'crimson',
  [StatusTypes.success]: 'green',
  [StatusTypes.none]: '#2e4458',
}

interface NotificationProps extends NotificationState {
  clearNotification: () => any
}

class Notification extends React.Component<NotificationProps, {}> {

  state = {
    alertVisible: false
  }

  public timeout: any

  public componentWillReceiveProps(nextProps: NotificationProps) {
    if (nextProps.message) this.handleShow()
  }

  private handleShow = (): void => {
    this.setState(() => ({ alertVisible: true }))
    this.timeout = setTimeout(() => this.handleDismiss(), 2000)
  }

  private handleDismiss = (): void => {
    this.props.clearNotification()
    this.setState(() => ({ alertVisible: false }))
    if (this.timeout) { clearTimeout(this.timeout) }
  }

  render() {
    return (
      this.state.alertVisible ?
        <View style={styles.notificationWrapper}>
          <Ionicon.Button
            onPress={this.handleDismiss}
            backgroundColor={statusTypeStyle[this.props.type]}
            name={'ios-information-circle-outline'}
            size={18}
          >
            <Text style={styles.notificationText}>{this.props.message}</Text>
          </Ionicon.Button>
        </View>
      : null
    )
  }
}

const styles = StyleSheet.create({
  notificationWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    height: 65,
    width: '100%',
    elevation: 2,
    zIndex: 2,
    flex: 1,
    alignItems: 'center',
  },
  notificationText: {
    color: 'white'
  },
})

export default connect((state: any) => ({
  message: state.notification.message,
  type: state.notification.type
}), (dispatch) => ({
  clearNotification: () => {
    dispatch(NotificationActionCreators.clearNotification.create())
  }
}))(Notification)
