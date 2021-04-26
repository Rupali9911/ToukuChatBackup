import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {Colors} from '../../constants';
import {globalStyles} from '../../styles';
import {normalize} from '../../utils';
import styles from './styles';

class SecondaryButton extends Component {
  getGradientColors() {
    switch (this.props.type) {
      case 'primary':
        return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
      case 'primaryNew':
        return [
          Colors.header_gradient_3,
          Colors.header_gradient_2,
          Colors.header_gradient_1,
        ];
      case 'secondary':
        return [Colors.gray, Colors.gray, Colors.gray];
      case 'transparent':
        return ['rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.2)', 'rgba(0,0,0, 0.2)'];
      case 'translucent':
        return ['transparent', 'transparent', 'transparent'];
      case 'custom':
        return this.props.colors;
      default:
        return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
    }
  }

  getBorderColor() {
    switch (this.props.type) {
      case 'primary':
        return 'transparent';
      case 'primaryNew':
        return 'transparent';
      case 'secondary':
        return 'transparent';
      case 'transparent':
        return Colors.primary;
      case 'translucent':
        return Colors.gradient_3;
      default:
        return 'transparent';
    }
  }

  getIndicatorColor() {
    switch (this.props.type) {
      case 'primary':
        return Colors.white;
      case 'primaryNew':
        return Colors.white;
      case 'transparent':
        return Colors.primary;
      case 'translucent':
        return Colors.primary;
      default:
        return Colors.white;
    }
  }

  getTitleColor() {
    switch (this.props.type) {
      case 'primary':
        return Colors.white;
      case 'primaryNew':
        return Colors.white;
      case 'secondary':
        return Colors.black;
      case 'transparent':
        return Colors.white;
      case 'translucent':
        return Colors.gradient_2;
      default:
        return Colors.white;
    }
  }

  getFont() {
    switch (this.props.fontType) {
      case 'normalRegularText':
        return globalStyles.normalRegularText;
      case 'smallRegularText':
        return globalStyles.smallLightText;
      case 'bigSemiBoldText':
        return globalStyles.bigSemiBoldText;
      case 'normalRegular22Text':
        return globalStyles.normalRegular22Text;
      case 'normalRegular15Text':
        return globalStyles.normalRegular15Text;
      default:
        return globalStyles.normalRegularText;
    }
  }

  render() {
    const {
      title,
      onPress,
      loading,
      isRounded,
      height,
      disabled,
      fontSize,
      borderColor,
      leftIcon,
      containerStyle,
    } = this.props;

    const container = [
      styles.linearGradient,
      {
        height,
        borderRadius: isRounded ? (Platform.isPad ? 55 / 2 : 45 / 2) : 4,
        borderColor: borderColor ? borderColor : this.getBorderColor(),
        opacity: disabled ? 0.5 : 1,
      },
      styles.container,
      leftIcon ? styles.row : {},
      containerStyle && containerStyle,
    ];

    return (
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={1}
        onPress={loading ? null : onPress}>
        <View style={container}>
          {leftIcon}
          {loading ? (
            <View style={styles.loadingContianer}>
              <ActivityIndicator
                size={'small'}
                color={this.getIndicatorColor()}
              />
            </View>
          ) : (
            <Text
              style={[
                this.getFont(),
                {
                  color: this.getTitleColor(),
                },
                styles.titleText,
                fontSize && {fontSize: fontSize},
              ]}>
              {title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

SecondaryButton.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  isRounded: PropTypes.bool,

  type: PropTypes.oneOf(['primary', 'secondary', 'transparent', 'translucent']),

  /**
   * StyleSheet props
   */
  borderColor: PropTypes.string,
  height: PropTypes.any,

  /**
   * Callbacks
   */
  onPress: PropTypes.func,
  fontType: PropTypes.oneOf(['normalRegularText', 'smallRegularText']),
};

SecondaryButton.defaultProps = {
  height: Platform.isPad ? normalize(55) : normalize(40),
  type: 'primary',
  title: 'Submit',
  disabled: false,
  loading: false,
  isRounded: true,
  onPress: null,
  fontType: 'normalRegularText',
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SecondaryButton);
