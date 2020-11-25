import React, {Component} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {Colors} from '../../constants';

export default class ListLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {large, justifyContent} = this.props;
    return (
      <View
        style={{
          flex: 1,
          padding: 15,
          alignItems: 'center',
          justifyContent: justifyContent || 'center',
        }}>
        <ActivityIndicator
          color={Colors.primary}
          size={large ? 'large' : 'small'}
        />
      </View>
    );
  }
}
