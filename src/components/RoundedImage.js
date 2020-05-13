import React, {Component} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {Images} from '../constants';

export default class RoundedImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {source, size, clickable, onClick, color, isRounded} = this.props;
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
          }}
        />
      </TouchableOpacity>
    );
  }
}

RoundedImage.propTypes = {
  source: PropTypes.any,
  size: PropTypes.number,
  clickable: PropTypes.bool,
  isRounded: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.any,
};

RoundedImage.defaultProps = {
  source: Images.image_default_profile,
  size: 73,
  clickable: false,
  isRounded: true,
  onClick: null,
  color: null,
};
