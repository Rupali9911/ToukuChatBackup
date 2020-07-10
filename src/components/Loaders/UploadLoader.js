import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants';

export default class UploadLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { large } = this.props;
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'rgba(108, 117, 125, 0.8)',
          height: '100%',
          width: '100%',
          alignSelf: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator
            color={Colors.primary}
            size={large ? 'large' : 'small'}
          />
          <Text style={{ color: Colors.white, marginTop: 10 }}>
            Uploading...
          </Text>
        </View>
      </View>
    );
  }
}
