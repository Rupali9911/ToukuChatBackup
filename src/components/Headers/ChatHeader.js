import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import RoundedImage from '../RoundedImage';
import {Icons, Colors, Images, Fonts} from '../../constants';
import {isIphoneX, getImage, getAvatar, normalize} from '../../utils';
import {globalStyles} from '../../styles';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {Menu} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ChatHeader extends Component {
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
      description,
      type,
      onBackPress,
      onRightIconPress,
      image,
      menuItems,
      navigation,
      isPined,
      chatType,
      currentChannel,
    } = this.props;
    // var matches = title.match(/\b(\w)/g);
    // var firstChars = matches.join('');
    // var secondUpperCase = firstChars.charAt(1).toUpperCase();
    console.log('group_picture', image);
    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          source={Images.header_bg_small}
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
            <View style={styles.subContainer}>
              <TouchableOpacity
                onPress={onBackPress}
                hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}>
                <Image
                  source={Icons.icon_back}
                  style={globalStyles.smallIcon}
                />
              </TouchableOpacity>
              {type === 'friend' ? (
                <View style={styles.subContainer}>
                  <View style={{marginHorizontal: 10}}>
                    <TouchableOpacity
                      onPress={() => {
                        if (!this.props.disableFriendNotes) {
                          navigation.navigate('FriendNotes');
                        }
                      }}>
                      <RoundedImage size={40} source={getAvatar(image)} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}>
                    <Text
                      numberOfLines={1}
                      onPress={() => {
                        if (!this.props.disableFriendNotes) {
                          navigation.navigate('FriendNotes');
                        }
                      }}
                      style={[
                        globalStyles.normalRegularText15,
                        {
                          fontSize: Platform.isPad
                            ? normalize(7.5)
                            : normalize(12),
                        },
                      ]}>
                      {title}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.subContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('type', type);
                      if (type === 'channel') {
                        navigation.navigate('ChannelInfo');
                      }
                    }}>
                    {image === null &&
                    image === '' &&
                    typeof image === undefined ? (
                      <LinearGradient
                        start={{x: 0.1, y: 0.7}}
                        end={{x: 0.5, y: 0.2}}
                        locations={[0.1, 0.6, 1]}
                        colors={[
                          Colors.gradient_1,
                          Colors.gradient_2,
                          Colors.gradient_3,
                        ]}
                        style={styles.squareImage}>
                        <Text style={globalStyles.normalRegularText15}>
                          {title.indexOf(' ') === -1
                            ? title.charAt(0).toUpperCase()
                            : title.charAt(0).toUpperCase() +
                              title
                                .charAt(title.indexOf(' ') + 1)
                                .toUpperCase()}
                          {/* {secondUpperCase} */}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={{marginHorizontal: 10}}>
                        <RoundedImage
                          source={getAvatar(image)}
                          isRounded={false}
                          size={Platform.isPad ? 50 : 40}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.normalRegularText15,
                        {
                          fontSize: Platform.isPad
                            ? normalize(8.5)
                            : normalize(12),
                        },
                      ]}
                      onPress={() => {
                        if (type === 'channel') {
                          navigation.navigate('ChannelInfo');
                        }
                      }}>
                      {title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallRegularText,
                        {
                          fontSize: Platform.isPad
                            ? normalize(5.5)
                            : normalize(10),
                        },
                      ]}>
                      {description}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <View>
              <Menu
                style={{marginTop: 30}}
                visible={this.state.visible}
                onDismiss={this._closeMenu}
                anchor={
                  <TouchableOpacity
                    onPress={this._openMenu}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                    <Image
                      source={Icons.icon_dots}
                      style={globalStyles.smallIcon}
                    />
                  </TouchableOpacity>
                }>
                {menuItems &&
                  menuItems.map((item, index) => {
                    return (
                      <Menu.Item
                        key={index}
                        icon={() =>
                          item.title ===
                          translate('pages.changeDisplayName') ? (
                            <Image
                              source={item.icon}
                              style={globalStyles.smallIcon}
                            />
                          ) : !item.isLocalIcon ? (
                            item.pinUnpinItem ? (
                              <MaterialCommunityIcon
                                name={isPined ? 'pin-off' : 'pin'}
                                size={18}
                                color={Colors.black}
                              />
                            ) : item.icon === 'sticky-note' ||
                              item.icon === 'id-card' ||
                              item.icon === 'times-circle' ? (
                              <FontAwesome
                                name={item.icon}
                                size={16}
                                color={Colors.black}
                              />
                            ) : (
                              <FontAwesome5
                                name={item.icon}
                                size={16}
                                color={Colors.black}
                              />
                            )
                          ) : (
                            <Image
                              source={item.icon}
                              style={globalStyles.smallIcon}
                            />
                          )
                        }
                        onPress={() => {
                          item.onPress();
                          this._closeMenu();
                        }}
                        title={
                          item.pinUnpinItem ? `${chatType}` : `${item.title}`
                        }
                        titleStyle={{
                          marginLeft: -25,
                          marginTop: -3,
                          fontSize: 16,
                          fontWeight: '200',
                        }}
                      />
                    );
                  })}
              </Menu>

              {/* <RoundedImage
            isRounded={false}
            size={18}
            source={Icons.icon_dots}
            clickable={true}
            onClick={onRightIconPress}
            resizeMode={'contain'}
          /> */}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    // backgroundColor: Colors.home_header,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  squareImage: {
    width: Platform.isPad ? 50 : 40,
    height: Platform.isPad ? 50 : 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});

ChatHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOf(['channel', 'group', 'friend']),
  image: PropTypes.any,
  /**
   * Callbacks
   */
  onBackPress: PropTypes.func,
  onRightIconPress: PropTypes.func,
};

ChatHeader.defaultProps = {
  title: 'Title',
  description: 'Description',
  type: 'channel',
  image: null,
  onBackPress: null,
  onRightIconPress: null,
};
