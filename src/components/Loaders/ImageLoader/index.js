// Library imports
import PropTypes from 'prop-types';
import React from 'react';
import {Image, ImageBackground, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Local imports
import {Colors, Images} from '../../../constants';

// StyleSheet import
import styles from './styles';

/**
 * Image loader component
 */
class ImageLoader extends React.Component {
  static propTypes = {
    isShowActivity: PropTypes.bool,
  };

  static defaultProps = {
    isShowActivity: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isError: false,
    };
  }

  // When image is loaded
  onLoadEnd() {
    this.setState({
      isLoaded: true,
    });
  }

  // When an image encounter errors
  onError() {
    this.setState({
      isError: true,
    });
  }

  render() {
    const {
      style,
      source,
      resizeMode,
      borderRadius,
      backgroundColor,
      children,
      placeholderSource,
      placeholderStyle,
      customImagePlaceholderDefaultStyle,
      showPlayButton,
    } = this.props;

    return (
      <ImageBackground
        onLoadEnd={this.onLoadEnd.bind(this)}
        onError={this.onError.bind(this)}
        style={[styles.backgroundImage, style]}
        source={source ? source : ''}
        resizeMode={resizeMode}
        borderRadius={borderRadius}>
        {this.state.isLoaded && !this.state.isError ? (
          children
        ) : (
          <View
            style={[
              styles.viewImageStyles,
              {borderRadius: borderRadius},
              backgroundColor ? {backgroundColor: backgroundColor} : {},
            ]}>
            {this.props.isShowActivity &&
            !this.state.isError &&
            source !== null ? (
              <Image
                style={
                  placeholderStyle
                    ? placeholderStyle
                    : [
                        styles.imagePlaceholderStyles,
                        customImagePlaceholderDefaultStyle,
                      ]
                }
                source={
                  placeholderSource ? placeholderSource : Images.image_loader
                }
              />
            ) : null}
          </View>
        )}
        {this.props.children && (
          <View style={styles.viewChildrenStyles}>{this.props.children}</View>
        )}
        {source
          ? showPlayButton && (
              <View style={styles.playButtonContainer}>
                <FontAwesome name="play" size={15} color={Colors.white} />
              </View>
            )
          : null}
      </ImageBackground>
    );
  }
}

export default ImageLoader;
