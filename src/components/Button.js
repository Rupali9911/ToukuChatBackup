import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import {Colors, Fonts} from '../constants';
import {globalStyles} from '../styles';
import {connect} from 'react-redux';

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
        return ['rgba(0,0,0, 0.4)', 'rgba(0,0,0, 0.4)', 'rgba(0,0,0, 0.4)'];
      case 'translucent':
        return ['transparent', 'transparent', 'transparent'];
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
      fontType,
      type,
    } = this.props;
    return (
      <TouchableOpacity
        disabled={disabled}
        activeOpacity={1}
        onPress={loading ? null : onPress}>
        <LinearGradient
          start={type === 'primaryNew' ? {x: 0.2, y: 0.7} : {x: 0.1, y: 0.7}}
          end={type === 'primaryNew' ? {x: 0.95, y: 0.8} : {x: 0.5, y: 0.8}}
          locations={type === 'primaryNew' ? [0.1, 0.9, 1] : [0.1, 0.6, 1]}
          colors={this.getGradientColors()}
          style={[
            styles.linearGradient,
            {
              height: height,
              borderRadius: isRounded ? (Platform.isPad ? 55 / 2 : 45 / 2) : 4,
              borderColor: this.getBorderColor(),
              opacity: disabled ? 0.5 : 1,
            },
          ]}>
          {loading ? (
            <View style={{paddingHorizontal: 5}}>
              <ActivityIndicator
                size={'small'}
                color={this.getIndicatorColor()}
              />
            </View>
          ) : (
              Platform.OS === 'ios' ?
            <TextInput
                pointerEvents="none"
                editable={false}
                style={[
                this.getFont(),
                {
                  color: this.getTitleColor()
                },
              ]}>
              {title}
            </TextInput>
                  :
                  <Text
                      style={[
                          this.getFont(),
                          {
                              color: this.getTitleColor(),
                          },
                      ]}>
                      {title}
                  </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
});

Button.propTypes = {
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

Button.defaultProps = {
  height: Platform.isPad ? 55 : 45,
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

export default connect(mapStateToProps, mapDispatchToProps)(Button);
