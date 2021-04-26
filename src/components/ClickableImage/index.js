// Library imports
import React, {Component} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';

// Local imports
import {Images, Colors} from '../../constants';

/**
 * Image with click functionality component
 */
export default class ClickableImage extends Component {
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

/**
 * Component prop types
 */
ClickableImage.propTypes = {
  source: PropTypes.any,
  size: PropTypes.any,
  color: PropTypes.string,
  resizeMode: PropTypes.string,
  onPress: PropTypes.func,
};

/**
 * Component default props
 */
ClickableImage.defaultProps = {
  source: Images.image_default_profile,
  size: 60,
  color: Colors.white,
  resizeMode: 'contain',
  onPress: null,
};
