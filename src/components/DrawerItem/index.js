import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import {globalStyles} from '../../styles';
import {Icons, Colors} from '../../constants';
import styles from './styles';

export default class DrawerItem extends Component {
  render() {
    const {onPress, item, title, icon} = this.props;

    const titleText = [
      globalStyles.smallLightText,
      {
        color: item.disabled
          ? '#ccc'
          : item.selected
          ? Colors.indigo
          : Colors.white,
      },
      styles.title,
    ];
    return (
      <TouchableOpacity
        disabled={item.disabled}
        onPress={onPress}
        style={styles.actionContainer}>
        <View>
          <Image source={icon} style={globalStyles.iconStyle} />
        </View>
        <View>
          <Text style={titleText}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

DrawerItem.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.any,
  item: PropTypes.any,
  disabled: PropTypes.bool,
  /**
   * Callbacks
   */
  onPress: PropTypes.func,
};

DrawerItem.defaultProps = {
  title: 'Tab Name',
  icon: Icons.icon_home_active,
  item: {
    tab_id: 1,
    tab_name: 'Tab Name',
    tab_icon: Icons.icon_home_active,
    selected: false,
    disabled: false,
  },
  disabled: false,
  onPress: null,
};
