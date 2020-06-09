import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import Orientation from 'react-native-orientation';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

import RoundedImage from '../RoundedImage';
import {Icons, Colors, Images, Fonts} from '../../constants';
import {isIphoneX, getImage, getAvatar} from '../../utils';
import {globalStyles} from '../../styles';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {Menu} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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

  componentWillMount() {
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
    } = this.props;
    var matches = title.match(/\b(\w)/g);
    var firstChars = matches.join('');
    var secondUpperCase = firstChars.charAt(1).toUpperCase();
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
        ]}>
        <View style={styles.subContainer}>
          <TouchableOpacity onPress={onBackPress}>
            <Image source={Icons.icon_back} style={globalStyles.smallIcon} />
          </TouchableOpacity>
          {type === 'friend' ? (
            <View style={styles.subContainer}>
              <View style={{marginHorizontal: 10}}>
                <RoundedImage size={40} source={getAvatar(image)} />
              </View>
              <Text style={globalStyles.normalRegularText}>{title}</Text>
            </View>
          ) : (
            <View style={styles.subContainer}>
              {image != null && image != '' && typeof image != undefined ? (
                <View style={{marginHorizontal: 10}}>
                  <RoundedImage
                    source={getAvatar(image)}
                    isRounded={false}
                    size={40}
                  />
                </View>
              ) : (
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
                  <Text style={globalStyles.normalRegularText}>
                    {title.charAt(0).toUpperCase()}
                    {/* {secondUpperCase} */}
                  </Text>
                </LinearGradient>
              )}
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                <Text numberOfLines={1} style={globalStyles.normalRegularText}>
                  {title}
                </Text>
                <Text numberOfLines={1} style={globalStyles.smallRegularText}>
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
              <TouchableOpacity onPress={this._openMenu}>
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
                    icon={() => (
                      <FontAwesome5
                        name={item.icon}
                        size={16}
                        color={Colors.black}
                      />
                    )}
                    onPress={() => {
                      item.onPress();
                      this._closeMenu();
                    }}
                    title={`${item.title}`}
                    titleStyle={{
                      marginLeft: -25,
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.home_header,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  squareImage: {
    width: 40,
    height: 40,
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
