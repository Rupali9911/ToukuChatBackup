// Library imports
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {Menu} from 'react-native-paper';

// Local imports
import {Icons, Images} from '../../../constants';
import {globalStyles} from '../../../styles';
import {isIphoneX} from '../../../utils';

// Components imports
import ChannelHeader from './components/ChannelHeader';
import FriendHeader from './components/FriendHeader';
import MenuIcons from './components/MenuIcons';
import MoreIcon from './components/MoreIcon';

// Stylsheet import
import styles from './styles';

/**
 * Chat header component
 */
export default class ChatHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      visible: false,
    };
  }

  // Open the three doted menu
  _openMenu = () => this.setState({visible: true});

  // Close the three doted menu
  _closeMenu = () => this.setState({visible: false});

  /**
   * --- DEPRECATED USE ---
   * Set intial orientation in state
   */
  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  // Add orientation listener
  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  // Sets orientation in state
  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  // Navigation to friend profile
  handleFriendNav = () => {
    const {disableFriendNotes, navigation} = this.props;
    if (!disableFriendNotes) {
      navigation.navigate('FriendNotes');
    }
  };

  // Navigation to channel or group profile
  handleChannelOrGroupNav = () => {
    const {type, navigation} = this.props;
    if (type === 'channel') {
      navigation.navigate('ChannelInfo');
    } else if (type === 'group') {
      navigation.navigate('GroupDetails');
    }
  };

  // Menu item press action
  handleMenuItemPress = (item) => {
    item.onPress();
    this._closeMenu();
  };

  render() {
    const {
      title,
      description,
      type,
      onBackPress,
      image,
      menuItems,
      isPined,
      chatType,
      currentChannel,
      orientation,
    } = this.props;

    const containerStyle = [
      styles.container,
      {
        paddingTop:
          orientation === 'PORTRAIT'
            ? Platform.OS === 'ios'
              ? isIphoneX()
                ? 50
                : 30
              : 40
            : Platform.OS === 'ios'
            ? 20
            : 40,
      },
    ];

    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          source={Images.header_bg_small}
          style={styles.singleFlex}
          resizeMode={'cover'}>
          <View style={containerStyle}>
            <View style={styles.subContainer}>
              <TouchableOpacity
                onPress={onBackPress}
                hitSlop={styles.touchArea}>
                <Image
                  source={Icons.icon_back}
                  style={globalStyles.smallIcon}
                />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                {type === 'friend' ? (
                  <FriendHeader
                    image={image}
                    title={title}
                    handleNavigation={this.handleFriendNav}
                  />
                ) : (
                  <ChannelHeader
                    description={description}
                    followers={currentChannel && currentChannel.show_followers}
                    handleChannelOrGroupNav={this.handleChannelOrGroupNav}
                    image={image}
                    title={title}
                  />
                )}
              </View>
            </View>
            <View>
              <Menu
                style={styles.menuContainer}
                visible={this.state.visible}
                onDismiss={this._closeMenu}
                anchor={<MoreIcon handleMenuPress={this._openMenu} />}>
                {menuItems &&
                  menuItems.map((item, index) => {
                    return (
                      <Menu.Item
                        key={index}
                        icon={() => <MenuIcons item={item} isPined={isPined} />}
                        onPress={() => this.handleMenuItemPress(item)}
                        title={
                          item.pinUnpinItem ? `${chatType}` : `${item.title}`
                        }
                        titleStyle={styles.menuTitleStyle}
                      />
                    );
                  })}
              </Menu>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

/**
 * Chat header prop types
 */
ChatHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOf(['channel', 'group', 'friend']),
  image: PropTypes.any,
  onBackPress: PropTypes.func,
  onRightIconPress: PropTypes.func,
};

/**
 * Chat header default props
 */
ChatHeader.defaultProps = {
  title: 'Title',
  description: 'Description',
  type: 'channel',
  image: null,
  onBackPress: null,
  onRightIconPress: null,
};
