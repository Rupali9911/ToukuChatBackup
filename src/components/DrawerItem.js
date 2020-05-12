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
    const {onPress, disabled, item} = this.props;
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
          <Image
            source={item.tab_icon}
            style={[
              globalStyles.iconStyle,
              {tintColor: item.selected ? Colors.primary : Colors.white},
            ]}
          />
        </View>
        <View>
          <Text
            style={[
              globalStyles.smallLightText,
              {
                color: item.selected ? Colors.primary : Colors.white,
                marginStart: 10,
              },
            ]}>
            {item.tab_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

DrawerItem.propTypes = {
  item: PropTypes.any,
  disabled: PropTypes.bool,
  /**
   * Callbacks
   */
  onPress: PropTypes.func,
};

DrawerItem.defaultProps = {
  item: {
    tab_id: 1,
    tab_name: 'Tab Name',
    tab_icon: Icons.icon_home_active,
    selected: false,
  },
  disabled: false,
  onPress: null,
};
