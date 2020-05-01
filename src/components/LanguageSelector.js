import React, {Component} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Colors, Icons} from '../constants';

export default class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {isChecked, onPress, onOtherLanguagePress} = this.props;
    if (isChecked) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.checkedIconContainer}
            onPress={onPress}>
            <Image
              source={Icons.icon_language_select}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkedIconContainer}
            onPress={onOtherLanguagePress}>
            <Image
              source={Icons.icon_language_select}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity style={styles.uncheckedIconContainer} onPress={onPress}>
        <Image source={Icons.icon_language_select} style={styles.iconStyle} />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 10,
    position: 'absolute',
    right: 0,
    top: -13,
    overflow: 'hidden',
    display: 'flex',
  },
  checkedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0,
    borderColor: Colors.primary,
    marginBottom: 5,
  },
  uncheckedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0,
    borderColor: Colors.primary,
    margin: 6,
    position: 'absolute',
    right: 0,
  },
  iconStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'contain',
  },
});

LanguageSelector.propTypes = {
  isChecked: PropTypes.bool,
  /**
   * Callbacks
   */
  onPress: PropTypes.func,
  onOtherLanguagePress: PropTypes.func,
};

LanguageSelector.defaultProps = {
  isChecked: false,
  onPress: null,
  onOtherLanguagePress: null,
};
