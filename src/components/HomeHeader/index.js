import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import {Divider, Menu} from 'react-native-paper';
import {Colors, Icons, Images} from '../../constants';
import {globalStyles} from '../../styles';
import {isIphoneX} from '../../utils';
import {SearchInput} from '../TextInputs';
import styles from './styles';

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
      currentRouteName,
    } = this.props;

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          source={isSearchBar ? Images.header_bg : Images.header_bg_small}
          style={styles.singleFlex}
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
            <View style={styles.divider} />
            {/*{isDrawer ? (*/}
            {/*<HamburgerIcon />*/}
            {/*) : (*/}
            {/*<View style={globalStyles.iconStyle} />*/}
            {/*)}*/}
            {/*</View>*/}
            <View style={styles.titleContainer}>
              <Text style={[globalStyles.normalRegularText, styles.titleText]}>
                {title}
              </Text>
            </View>
            <View style={styles.contentSubContainer}>
              {isSortOptions && (
                <Menu
                  style={styles.menuStyle}
                  visible={this.state.visible}
                  onDismiss={this._closeMenu}
                  anchor={
                    <TouchableOpacity
                      style={styles.upActionContainer}
                      onPress={this._openMenu}
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                      <Image
                        source={Icons.icon_triangle_up}
                        style={styles.upIcon}
                      />
                      <Image
                        source={Icons.icon_triangle_up}
                        style={styles.anotherUpIcon}
                      />
                    </TouchableOpacity>
                  }>
                  {menuItems &&
                    menuItems.map((item, index) => {
                      const menuItemTitle = [
                        styles.menuItemTitle,
                        {color: item.isSorted ? 'white' : 'black'},
                      ];

                      return item.isSorted ? (
                        <>
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
                              style={styles.menuItem}
                              key={index}
                              onPress={() => {
                                item.onPress();
                                this._closeMenu();
                              }}
                              title={`${item.title}`}
                              titleStyle={menuItemTitle}
                            />
                          </LinearGradient>
                          <Divider />
                        </>
                      ) : (
                        <>
                          <Menu.Item
                            style={styles.menuItem}
                            key={index}
                            onPress={() => {
                              item.onPress();
                              this._closeMenu();
                            }}
                            title={`${item.title}`}
                            titleStyle={menuItemTitle}
                          />
                          <Divider />
                        </>
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

HomeHeader.propTypes = {
  isDrawer: PropTypes.bool,
  title: PropTypes.string,
};

HomeHeader.defaultProps = {
  title: '',
  isDrawer: true,
  onBackPress: null,
};
