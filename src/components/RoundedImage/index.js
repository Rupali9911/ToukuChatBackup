import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Colors, Images} from '../../constants';
import {ImageLoader} from '../Loaders';
import styles from './styles';

export default class RoundedImage extends Component {
  render() {
    const {
      style,
      source,
      size,
      clickable,
      onClick,
      color,
      isRounded,
      isBadge,
      isOnline,
      resizeMode,
      borderSize,
      borderColor,
      showPlayButton,
    } = this.props;

    const imageLoaderStyle = [
      {
        width: size,
        height: size,
        borderRadius: isRounded ? size / 2 : 0,
        tintColor: color,
        resizeMode: resizeMode,
        borderWidth: borderSize,
        borderColor: borderColor,
      },
      styles.imageLoaderStyle,
    ];

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={!clickable}
        onPress={onClick}
        style={
          style || {
            width: size,
            height: size,
            borderRadius: size / 2,
          }
        }>
        <ImageLoader
          style={imageLoaderStyle}
          source={source}
          showPlayButton={showPlayButton ? true : false}
        />
        {isBadge && (
          <View style={styles.badgeContainer}>
            <View
              style={[
                {
                  backgroundColor: isOnline ? Colors.green : Colors.danger,
                },
                styles.badgeSubContainer,
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

RoundedImage.propTypes = {
  source: PropTypes.any,
  size: PropTypes.any,
  clickable: PropTypes.bool,
  isRounded: PropTypes.bool,
  isBadge: PropTypes.bool,
  isOnline: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.any,
  resizeMode: PropTypes.string,
  borderSize: PropTypes.number,
  borderColor: PropTypes.string,
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
  borderSize: 0,
  borderColor: Colors.primary,
};
