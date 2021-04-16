// Library imports
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

// Local imports
import {Icons} from '../../../constants';

// Stylesheet imports
import styles from './styles';

/**
 * Header with back navigation only
 */
export default class BackHeader extends Component {
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
      </View>
    );
  }
}

/**
 * Header prop types
 */
BackHeader.propTypes = {
  isIconLeft: PropTypes.bool,
  title: PropTypes.string,
  onBackPress: PropTypes.func,
};

/**
 * Header deault props
 */
BackHeader.defaultProps = {
  title: '',
  isIconLeft: true,
  onBackPress: null,
};
