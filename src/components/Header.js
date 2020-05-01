import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import LanguageSelector from './LanguageSelector';
import {Icons, Colors} from '../constants';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isChecked,
      isIconLeft,
      title,
      onBackPress,
      onLanguageSelectPress,
    } = this.props;
    return (
      <View style={styles.container}>
        {isIconLeft ? (
          <TouchableOpacity onPress={onBackPress}>
            <Image source={Icons.icon_back} style={styles.backIcon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backIcon} />
        )}
        <View>
          <Text style={styles.titleTxt}>{title}</Text>
        </View>
        <LanguageSelector
          isChecked={isChecked}
          onPress={onLanguageSelectPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  titleTxt: {
    color: Colors.black,
    fontSize: 20,
  },
});

Header.propTypes = {
  isChecked: PropTypes.bool,
  isIconLeft: PropTypes.bool,
  title: PropTypes.string,

  /**
   * Callbacks
   */
  onBackPress: PropTypes.func,
  onLanguageSelectPress: PropTypes.func,
};

Header.defaultProps = {
  title: '',
  isChecked: false,
  isIconLeft: true,
  onBackPress: null,
  onLanguageSelectPress: null,
};
