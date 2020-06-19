import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';

import { Icons, Colors } from '../constants';
import HamburgerIcon from './HamburgerIcon';
import { isIphoneX } from '../utils';
import { globalStyles } from '../styles';
import { Menu, Divider } from 'react-native-paper';

export default class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      visible: false,
    };
  }

  _openMenu = () => this.setState({ visible: true });

  _closeMenu = () => this.setState({ visible: false });

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  render() {
    const { isDrawer, title, isSortOptions, menuItems } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop:
              this.state.orientation === 'PORTRAIT'
                ? Platform.OS === 'ios'
                  ? isIphoneX()
                    ? 50
                    : 30
                  : 40
                : Platform.OS === 'ios'
                ? 20
                : 40,
          },
        ]}
      >
        <View style={{ flex: 0.1 }}>
          {isDrawer ? (
            <HamburgerIcon />
          ) : (
            <View style={globalStyles.iconStyle} />
          )}
        </View>
        <View style={{ flex: 0.8, alignItems: 'center' }}>
          <Text style={[globalStyles.normalRegularText, {fontWeight: '300',fontSize: 16}]}>{title}</Text>
        </View>
        <View
          style={{
            flex: 0.1,
            alignItems: 'flex-end',
          }}
        >
          {isSortOptions && (
            <Menu
              style={{ marginTop: 30 }}
              visible={this.state.visible}
              onDismiss={this._closeMenu}
              anchor={
                <TouchableOpacity onPress={this._openMenu}>
                  <Image
                    source={Icons.icon_triangle_up}
                    style={{
                      width: 10,
                      height: 7,
                    }}
                  />
                  <Image
                    source={Icons.icon_triangle_up}
                    style={{
                      marginTop: 3,
                      width: 10,
                      height: 7,
                      transform: [{ rotate: '180deg' }],
                    }}
                  />
                </TouchableOpacity>
              }
            >
              {menuItems &&
                menuItems.map((item, index) => {
                  return (
                    <React.Fragment>
                      <Menu.Item
                        key={index}
                        onPress={() => {
                          item.onPress();
                          this._closeMenu();
                        }}
                        title={`${item.title}`}
                        titleStyle={{
                          fontSize: 16,
                          fontWeight: '200',
                        }}
                      />
                      <Divider />
                    </React.Fragment>
                  );
                })}
            </Menu>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.home_header,
  },
});

HomeHeader.propTypes = {
  isDrawer: PropTypes.bool,
  title: PropTypes.string,
};

HomeHeader.defaultProps = {
  title: '',
  isDrawer: true,
  onBackPress: null,
};
