import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Clipboard } from 'react-native'
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
let IoniconsIcon = require('react-native-vector-icons/Ionicons').default;

import { BackNav } from './Navigation';
import { Routes } from './Routing'
import { OptionActionCreators } from './store/root-actions'
import { AppState, Wallet } from './store/options/index'

interface StateProps {
  appState: AppState,
  navigation: any
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

interface DispatchProps {
  setActiveWalletIndex: (index: number) => any
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({
  setActiveWalletIndex: async (index: number) => {
    dispatch(OptionActionCreators.setActiveWalletIndex.create(index))
  }
})

type WalletListProps = StateProps & DispatchProps

export class WalletListState extends React.Component<WalletListProps, {}> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Account' navigation={opt.navigation} />
    }
  }

  render() {
    return (
      <View style={styles.drawerContent}>
        <ScrollView style={{flex: 1}}>
          { this.props.appState.walletList.map((wallet: Wallet, index: number) =>
            <TouchableOpacity
              key={wallet.publicKey}
              onPress={() => {
                this.props.setActiveWalletIndex(index)
                this.props.navigation.navigate(Routes.dashboardScreen)
              }}
              style={styles.accountButton}
            >
              <View style={{flex: 1}}>
                <Text style={styles.accountButtonText}>
                  {wallet.accountName}
                </Text>
              </View>
              <IoniconsIcon
                style={{margin: 8}}
                name='ios-arrow-forward-outline'
                size={21}
                color='#d1edff'
              />
            </TouchableOpacity>
          )}
        </ScrollView>
        <TouchableOpacity onPress={() => this.props.navigation.navigate(Routes.accountScreen)} style={styles.addAccountButton}>
          <Text style={{color: 'yellow'}}>Add Account</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#2e4458',
  },
  accountButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#354f67',
    marginTop: 0,
    marginBottom: 4,
    padding: 12
  },
  accountButtonText: {
    margin: 8,
    color: 'white',
    fontSize: 14
  },
  addAccountButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: 'yellow',
    margin: 12,
    padding: 8,
  },
  dropdownContainer: {
    flex: 1,
    backgroundColor: 'white',
  }
});

export const WalletList = connect(mapStateToProps, mapDispatchToProps)(WalletListState)
