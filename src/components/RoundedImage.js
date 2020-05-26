import React, {Component} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Images, Colors} from '../constants';

export default class RoundedImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      source,
      size,
      clickable,
      onClick,
      color,
      isRounded,
      isBadge,
      isOnline,
      resizeMode,
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!clickable}
        onPress={onClick}
        style={{width: size, height: size, borderRadius: size / 2}}>
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            borderRadius: isRounded ? size / 2 : 0,
            tintColor: color,
            resizeMode: resizeMode,
          }}
        />
        {isBadge ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: Colors.white,
              top: 5,
              right: 0,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: isOnline ? Colors.green : Colors.danger,
              }}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }
}

RoundedImage.propTypes = {
  source: PropTypes.any,
  size: PropTypes.number,
  clickable: PropTypes.bool,
  isRounded: PropTypes.bool,
  isBadge: PropTypes.bool,
  isOnline: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.any,
  resizeMode: PropTypes.string,
};

RoundedImage.defaultProps = {
  source: Images.image_default_profile,
  size: 73,
  clickable: false,
  isRounded: true,
  isBadge: false,
  isOnline: false,
  onClick: null,
  color: null,
  resizeMode: 'cover',
};
