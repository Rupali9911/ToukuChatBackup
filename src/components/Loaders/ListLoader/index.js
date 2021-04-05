import React, {Component} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Colors} from '../../../constants';
import styles from './styles';

export default class ListLoader extends Component {
  render() {
    const {large, justifyContent} = this.props;
    return (
      <View
        style={[
          styles.container,
          {justifyContent: justifyContent || 'center'},
        ]}>
        <ActivityIndicator
          color={Colors.primary}
          size={large ? 'large' : 'small'}
        />
      </View>
    );
  }
}
