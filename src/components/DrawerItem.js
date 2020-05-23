import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import {globalStyles} from '../styles';
import {Icons, Colors} from '../constants';

export default class DrawerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {onPress, disabled, item, title, icon} = this.props;
    return (
      <TouchableOpacity
        disabled={item.disabled}
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <View>
          <Image source={icon} style={globalStyles.iconStyle} />
        </View>
        <View>
          <Text
            style={[
              globalStyles.smallLightText,
              {
                color: item.disabled
                  ? '#ccc'
                  : item.selected
                  ? Colors.indigo
                  : Colors.white,
                marginStart: 10,
              },
            ]}>
            {title}
          </Text>
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
