import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'
import { Routes } from './Routing';
let { NavigationActions } = require('react-navigation')
let IoniconsIcon = require('react-native-vector-icons/Ionicons').default;
let SimpleLineIconsIcon = require('react-native-vector-icons/SimpleLineIcons').default;

export class BackNav extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <View style={[styles.headerContent, {paddingHorizontal: 5}]}>
        <TouchableOpacity
          style={{position: 'absolute', zIndex: 3, paddingLeft: 20, paddingRight: 30}}
          onPress={ () => this.props.navigation.dispatch(NavigationActions.back()) }>
          <IoniconsIcon name='ios-arrow-back-outline' size={21} color='#d1edff' />
        </TouchableOpacity>
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row'
        }}>
          <Text style={{fontWeight:'bold', fontSize: 15, color:'#d1edff' }}>{this.props.title.toUpperCase()}</Text>
        </View>
      </View>
    );
  }
}

export class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <View style={styles.headerContent}>
        <View style={[styles.headerNavSections, {flexDirection: 'row', justifyContent: 'flex-start'}]}>
          <TouchableOpacity style={styles.headerNavButtons} onPress={() => this.props.navigation.navigate(Routes.walletScreen)}>
            <SimpleLineIconsIcon name='wallet' size={22} color='#d1edff' />
          </TouchableOpacity>
        </View>
        <View style={[styles.headerNavSections, {alignItems: 'center'}]}>
          <Image source={require('../images/logo.png')} style={{ tintColor: '#d1edff', width: 35, height: 28, marginTop: 12, marginBottom: 12 }} />
        </View>
        <View style={[styles.headerNavSections, {flexDirection: 'row', justifyContent: 'flex-end'}]}>
          <TouchableOpacity style={styles.headerNavButtons} onPress={() => this.props.navigation.navigate(Routes.accountScreen)}>
            <SimpleLineIconsIcon name='user-follow' size={22} color='#d1edff' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerNavButtons} onPress={() => this.props.navigation.navigate(Routes.settingsScreen)}>
            <SimpleLineIconsIcon name='options-vertical' size={22} color='#d1edff' />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#2b3e50',
  },
  headerContent: {
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: '#2b3e50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerNavSections: {
    flex: 1,
  },
  headerNavButtons: {
    padding: 8
  }
});
