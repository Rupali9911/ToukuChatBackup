import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Image} from 'react-native';
import {Icons} from '../constants';
import {globalStyles} from '../styles';

class HamburgerIcon extends Component {
  render() {
    return (
      <TouchableOpacity
        style={{
          width: 44,
          height: 44,
          marginLeft: 20,
        }}
        onPress={() => {
          this.props.navigation.toggleDrawer();
        }}>
        <Image source={Icons.icon_menu} style={globalStyles.iconStyle} />
      </TouchableOpacity>
    );
  }
}
export default withNavigation(HamburgerIcon);
