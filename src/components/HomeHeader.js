import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ImageBackground,
} from 'react-native';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';

import {Icons, Colors, Images, Fonts} from '../constants';
import HamburgerIcon from './HamburgerIcon';
import {isIphoneX} from '../utils';
import {globalStyles} from '../styles';
import {Menu, Divider} from 'react-native-paper';
import {SearchInput} from './TextInputs';
import LinearGradient from 'react-native-linear-gradient';

export default class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      visible: false,
    };
  }

  _openMenu = () => this.setState({visible: true});

  _closeMenu = () => this.setState({visible: false});

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  render() {
    const {
      isDrawer,
      title,
      isSortOptions,
      menuItems,
      onChangeText,
      onIconRightClick,
      onCanclePress,
      navigation,
      isSearchBar,
      onDeletePress,
      onDeleteConfrimPress,
      isDeleteVisible,
      isVisibleButton,
      countObject,
        currentRouteName
    } = this.props;

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          source={isSearchBar ? Images.header_bg : Images.header_bg_small}
          style={{flex: 1}}
          resizeMode="cover">
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
            ]}>
            <View style={{flex: 0.1}} />
            {/*{isDrawer ? (*/}
            {/*<HamburgerIcon />*/}
            {/*) : (*/}
            {/*<View style={globalStyles.iconStyle} />*/}
            {/*)}*/}
            {/*</View>*/}
            <View style={{flex: 0.8, alignItems: 'center'}}>
              <Text
                style={[
                  globalStyles.normalRegularText,
                  {fontWeight: '300', fontSize: 18, color: Colors.white},
                ]}>
                {title}
              </Text>
            </View>
            <View
              style={{
                flex: 0.1,
                alignItems: 'flex-end',
              }}>
              {isSortOptions && (
                <Menu
                  style={{marginTop: 30}}
                  visible={this.state.visible}
                  onDismiss={this._closeMenu}
                  anchor={
                    <TouchableOpacity
                      style={{paddingHorizontal: 10, paddingVertical: 5}}
                      onPress={this._openMenu}
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
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
                          transform: [{rotate: '180deg'}],
                        }}
                      />
                    </TouchableOpacity>
                  }>
                  {menuItems &&
                    menuItems.map((item, index) => {
                      return item.isSorted ? (
                        <React.Fragment>
                          <LinearGradient
                            colors={[
                              Colors.gradient_3,
                              Colors.gradient_2,
                              Colors.gradient_1,
                            ]}
                            useAngle={true}
                            angle={247.32}
                            angleCenter={{x: 0.5, y: 0.5}}>
                            <Menu.Item
                              style={{height: 35, width: 200}}
                              key={index}
                              onPress={() => {
                                item.onPress();
                                this._closeMenu();
                              }}
                              title={`${item.title}`}
                              titleStyle={{
                                fontFamily: Fonts.nunitoSansRegular,
                                fontSize: 14,
                                fontWeight: '300',
                                color: item.isSorted ? 'white' : 'black',
                              }}
                            />
                          </LinearGradient>
                          <Divider />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Menu.Item
                            style={{height: 35, width: 200}}
                            key={index}
                            onPress={() => {
                              item.onPress();
                              this._closeMenu();
                            }}
                            title={`${item.title}`}
                            titleStyle={{
                              fontFamily: Fonts.nunitoSansRegular,
                              fontSize: 14,
                              fontWeight: '300',
                              color: item.isSorted ? 'white' : 'black',
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
          {isSearchBar && (
            <SearchInput
              onChangeText={onChangeText}
              navigation={navigation}
              onIconRightClick={onIconRightClick}
              title={title}
              onDeletePress={onDeletePress}
              onCanclePress={onCanclePress}
              onDeleteConfrimPress={onDeleteConfrimPress}
              isDeleteVisible={isDeleteVisible}
              isVisibleButton={isVisibleButton}
              countObject={countObject}
              currentRouteName={currentRouteName}
            />
          )}
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: Colors.home_header,
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
