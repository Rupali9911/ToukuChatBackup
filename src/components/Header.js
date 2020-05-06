import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Icons, Colors} from '../constants';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {isIconLeft, title, onBackPress} = this.props;
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
        <View></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  isIconLeft: PropTypes.bool,
  title: PropTypes.string,

  /**
   * Callbacks
   */
  onBackPress: PropTypes.func,
};

Header.defaultProps = {
  title: '',
  isIconLeft: true,
  onBackPress: null,
};
