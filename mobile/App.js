import React from 'react'
import SplashScreen from 'react-native-splash-screen'
import './shim.js'
console.disableYellowBox = true

import Routes from './build/Routing'

export default class App extends React.Component {
  componentDidMount() {
    SplashScreen.hide()
  }

  render() {
    return <Routes />
  }
}
