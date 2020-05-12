import React, {Component} from 'react';
import {View, Image} from 'react-native';
import PropTypes from 'prop-types';
import {Images} from '../constants';

export default class RoundedImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {source, size} = this.props;
    return (
      <View style={{width: size, height: size, borderRadius: size / 2}}>
        <Image
          source={source}
          style={{width: size, height: size, borderRadius: size / 2}}
        />
      </View>
    );
  }
}

RoundedImage.propTypes = {
  source: PropTypes.any,
  size: PropTypes.number,
};

RoundedImage.defaultProps = {
  source: Images.image_default_profile,
  size: 73,
};
