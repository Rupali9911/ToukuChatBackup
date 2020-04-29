import React, {Component} from 'react';
import {View, Text, StatusBar} from 'react-native';
import Routes from './src/navigation';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar barStyle="light-content" translucent />
        <Routes />
      </View>
    );
  }
}
