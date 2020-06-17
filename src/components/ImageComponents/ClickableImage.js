import React, {Component} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import {Images, Colors} from '../../constants';

export default class ClickableImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {source, size, color, resizeMode, onPress} = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            resizeMode: resizeMode,
            tintColor: color,
          }}
        />
      </TouchableOpacity>
    );
  }
}

ClickableImage.propTypes = {
  source: PropTypes.any,
  size: PropTypes.any,
  color: PropTypes.string,
  resizeMode: PropTypes.string,
  onPress: PropTypes.func,
};

ClickableImage.defaultProps = {
  source: Images.image_default_profile,
  size: 60,
  color: Colors.white,
  resizeMode: 'contain',
  onPress: null,
};
