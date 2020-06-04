import React, { Component, Fragment } from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { channelInfoStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import { Images, Icons, Colors, Fonts } from '../../constants';
import { getImage } from '../../utils';
import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getUserProfile } from '../../redux/reducers/userReducer';
import {
  getUserChannels,
  createNewChannel,
} from '../../redux/reducers/channelReducer';
import { getUserGroups } from '../../redux/reducers/groupReducer';
import { getUserFriends } from '../../redux/reducers/friendReducer';
import Button from '../../components/Button';
const { width, height } = Dimensions.get('window');

class ChannelInfo extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      channelImagePath: {},
      channelData: [
        {
          id: 1,
          title: 'posts',
          count: 10,
        },
        {
          id: 2,
          title: 'followers',
          count: 10,
        },
        {
          id: 3,
          title: 'vip',
          count: 2,
        },
      ],
      tabBarItem: [
        {
          id: 1,
          title: 'chat',
          icon: Icons.icon_chat,
          action: () => this.props.navigation.goBack(),
        },
        {
          id: 2,
          title: 'about',
          icon: Icons.icon_setting,
          action: () => {},
        },
        {
          id: 3,
          title: 'timeline',
          icon: Icons.icon_timeline,
          action: () => this.props.navigation.navigate('Timeline'),
        },
      ],
    };
  }

  componentWillMount() {
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
    const { tabBarItem, channelData } = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HeaderWithBack
            isCentered
            onBackPress={() => this.props.navigation.goBack()}
            title="Channel Info"
          />
          <KeyboardAwareScrollView
            contentContainerStyle={channelInfoStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <LinearGradient
              start={{ x: 0.1, y: 0.7 }}
              end={{ x: 0.8, y: 0.3 }}
              locations={[0.1, 0.5, 1]}
              colors={['#c13468', '#ee2e3b', '#fa573a']}
              style={channelInfoStyles.channelImageContainer}
            >
              <ImageBackground
                style={channelInfoStyles.channelCoverContainer}
                // source={setSelectedBgItem.url}
              >
                <View
                  style={channelInfoStyles.updateBackgroundContainer}
                ></View>
                <View style={channelInfoStyles.channelInfoContainer}>
                  <View style={channelInfoStyles.imageContainer}>
                    <View style={channelInfoStyles.imageView}>
                      <Image
                        // source={getImage(this.state.channelImagePath.uri)}
                        resizeMode={'cover'}
                        style={channelInfoStyles.profileImage}
                      />
                    </View>
                  </View>
                  <View style={channelInfoStyles.detailView}>
                    <View
                      style={channelInfoStyles.changeChannelContainer}
                      // onPress={() => this.toggleChannelBusinessMenu()}
                    >
                      <Text
                        style={channelInfoStyles.channelNameText}
                        numberOfLines={1}
                      >
                        {translate('pages.xchat.channelName')}
                      </Text>
                    </View>
                    <View
                      style={channelInfoStyles.changeChannelContainer}
                      // onPress={() => this.toggleChannelBusinessMenu()}
                    >
                      <Text
                        style={channelInfoStyles.channelNameText}
                        numberOfLines={1}
                      >
                        {translate('pages.xchat.status')}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={channelInfoStyles.channelInfoDetail}>
                  <View style={channelInfoStyles.channelDetailStatus}>
                    {channelData.map((item, index) => {
                      return (
                        <View style={channelInfoStyles.detailStatusItem}>
                          <Text style={channelInfoStyles.detailStatusItemCount}>
                            {item.count}
                          </Text>
                          <Text style={channelInfoStyles.detailStatusItemName}>
                            {translate(`pages.xchat.${item.title}`)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={channelInfoStyles.channelDetailButton}>
                    <Button
                      title={translate('pages.xchat.unfollow')}
                      type={'transparent'}
                      height={30}
                      onPress={() => alert('unfollow')}
                    />
                  </View>
                </View>
              </ImageBackground>
            </LinearGradient>
            <View style={channelInfoStyles.tabBar}>
              {tabBarItem.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={channelInfoStyles.tabItem}
                    onPress={item.action}
                  >
                    <Image
                      source={item.icon}
                      style={[
                        channelInfoStyles.tabIamge,
                        {
                          opacity: item.title === 'about' ? 1 : 0.5,
                        },
                      ]}
                      resizeMode={'center'}
                    />
                    <Text
                      style={[
                        channelInfoStyles.tabTitle,
                        {
                          fontFamily:
                            item.title === 'about'
                              ? Fonts.regular
                              : Fonts.extralight,
                        },
                      ]}
                    >
                      {translate(`pages.xchat.${item.title}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={channelInfoStyles.about}>
              <Text style={channelInfoStyles.aboutHeading}>
                {translate('pages.xchat.about')}
              </Text>
            </View>
            <View style={channelInfoStyles.buttonContainer}>
              <Button
                isRounded={false}
                type={'primary'}
                title={translate('pages.xchat.affiliate')}
                onPress={() => alert('Affiliate')}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ImageBackground>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    channelLoading: state.channelReducer.loading,
    userFriends: state.friendReducer.userFriends,
    friendLoading: state.friendReducer.loading,
  };
};

const mapDispatchToProps = {
  getUserProfile,
  getUserChannels,
  getUserGroups,
  getUserFriends,
  createNewChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelInfo);
