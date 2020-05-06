import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import {authenticationStyles} from './styles';
import {Colors} from '../../constants';

export default class Authentication extends Component {
  constructor() {
    super();
    this.authenticateUser();
  }

  authenticateUser = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <View style={authenticationStyles.container}>
        <SafeAreaView>
          <ActivityIndicator color={Colors.primary} />
          <StatusBar barStyle="light-content" />
        </SafeAreaView>
      </View>
    );
  }
}
