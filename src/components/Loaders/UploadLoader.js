import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants';
import {translate} from "../../redux/reducers/languageReducer";

export default class UploadLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: this.props.progress
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.progress) {
      this.setState({ progress: nextProps.progress });
    }
  }

  render() {
    const { large, progress } = this.props;
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
              {translate('pages.xchat.uploading')}
          </Text>
        </View>
      </View>
    );
  }
}
