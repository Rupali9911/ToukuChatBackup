import React, {Component} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Colors} from '../../constants';

export default class ListLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{padding: 15}}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }
}
