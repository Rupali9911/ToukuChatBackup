import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import {Colors, Fonts} from '../constants';
import {globalStyles} from '../styles';

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getGradientColors() {
    switch (this.props.type) {
      case 'primary':
        return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
      case 'transparent':
        return ['rgba(0,0,0, 0.4)', 'rgba(0,0,0, 0.4)', 'rgba(0,0,0, 0.4)'];
      default:
        return [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];
    }
  }

  getBorderColor() {
    switch (this.props.type) {
      case 'primary':
        return 'transparent';
      case 'transparent':
        return Colors.primary;
      default:
        return 'transparent';
    }
  }

  render() {
    const {title, onPress} = this.props;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <LinearGradient
          start={{x: 0.1, y: 0.7}}
          end={{x: 0.5, y: 0.8}}
          locations={[0.1, 0.6, 1]}
          colors={this.getGradientColors()}
          style={[styles.linearGradient, {borderColor: this.getBorderColor()}]}>
          <Text style={globalStyles.normalLightText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    height: 45,
    borderRadius: 45 / 2,
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

  type: PropTypes.oneOf(['primary', 'transparent']),

  /**
   * StyleSheet props
   */
  borderColor: PropTypes.string,

  /**
   * Callbacks
   */
  onPress: PropTypes.func,
};

Button.defaultProps = {
  type: 'primary',
  title: 'Submit',
  disabled: false,
  loading: false,
  onPress: null,
};
