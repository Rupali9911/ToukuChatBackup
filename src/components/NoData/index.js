import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {globalStyles} from '../../styles';
import {Colors, Images} from '../../constants';
import RoundedImage from '../RoundedImage';

export default class NoData extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {title, imageAvailable, source, imageColor, style, textStyle} = this.props;
    return (
      <View
        style={[{
          flex: 1,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'center',
        },style]}>
        {imageAvailable ? (
          <Image
            source={source}
            style={{
              width: 70,
              height: 70,
              resizeMode: 'contain',
              tintColor: imageColor,
            }}
          />
        ) : null}
        <Text
          style={[
            globalStyles.smallRegularText,
            {color: Colors.gray_dark, marginTop: 10},textStyle
          ]}>
          {title}
        </Text>
      </View>
    );
  }
}
