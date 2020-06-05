import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {globalStyles} from '../../styles';
import {Colors, Images} from '../../constants';
import RoundedImage from '../RoundedImage';

export default class NoData extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {title, imageAvailable} = this.props;
    return (
      <View
        style={{
          flex: 1,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {imageAvailable ? (
          <RoundedImage source={Images.image_gallery} size={70} />
        ) : null}
        <Text style={[globalStyles.smallRegularText, {color: Colors.black}]}>
          {title}
        </Text>
      </View>
    );
  }
}
