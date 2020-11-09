import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  Clipboard,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

import {channelInfoStyles} from './styles';
import {globalStyles} from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {Images, Icons, Fonts, SocketEvents, Colors} from '../../constants';
import Button from '../../components/Button';
import {ListLoader} from '../../components/Loaders';
import Toast from '../../components/Toast';
import RoundedImage from '../../components/RoundedImage';
import {getImage, eventService} from '../../utils';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {
  getChannelDetails,
  unfollowChannel,
  followChannel,
} from '../../redux/reducers/channelReducer';
import {ConfirmationModal, AffilicateModal} from '../../components/Modals';
import AsyncStorage from '@react-native-community/async-storage';

class ChannelInfo extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      channelImagePath: {},
      channelData: [],
      showConfirmationModal: false,
      showAffiliateModal: false,
      tabBarItem: [
        {
          id: 1,
          title: 'chat',
          icon: Icons.icon_chat,
          action: () => this.OnBackAction(),
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
          action: () => this.props.navigation.navigate('ChannelTimeline'),
        },
      ],
    };
    this.isUnfollowing = false;
  }

  async OnBackAction() {
    await AsyncStorage.removeItem('channelData');
    this.props.navigation.goBack();
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});

    this.events = eventService.getMessage().subscribe((message) => {
      // if (
      //   message.text.data.type ===
      //     SocketEvents.REMOVE_CHANNEL_MEMBER_ADMIN_SIDE &&
      //   message.text.data.message_details.user_id === this.props.userData.id &&
      //   message.text.data.message_details.channel_id ===
      //     this.props.currentChannel.id
      // ) {
      //   alert('channel unfollowed');
      // }
      // if (
      //   message.text.data.type === SocketEvents.REMOVE_MEMBER_FROM_CHANNEL &&
      //   message.text.data.message_details.user_id === this.props.userData.id &&
      //   message.text.data.message_details.channel_id ===
      //     this.props.currentChannel.id
      // ) {
      //   // alert('channel unfollowed');
      // }
    });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    this.getChannelDetails();
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
    this.events.unsubscribe();
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  getChannelDetails() {
    this.props
      .getChannelDetails(
        this.props.navigation.state.params.channelItem.channel_id,
      )
      .then((res) => {
        this.setState({channelData: res});
      })
      .catch((err) => {
        Toast.show({
          title: 'Touku',
          text: 'Something went wrong!',
          type: 'primary',
        });
        this.props.navigation.goBack();
      });
  }

  onFollowUnfollow() {
    if (this.state.channelData.is_member) {
      this.setState({showConfirmationModal: true});
    } else {
      let data = {
        channel_id: this.props.currentChannel.id,
        referral_code: 'ISGLGA2V',
        user_id: this.props.userData.id,
      };
      this.props
        .followChannel(data)
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: this.props.currentChannel.name,
              text: translate('pages.xchat.toastr.AddedToNewChannel'),
              type: 'positive',
            });
            this.getChannelDetails();
          }
        })
        .catch((err) => {
          Toast.show({
            title: 'Touku',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    }
  }

  onCancel = () => {
    this.toggleConfirmationModal();
  };

  onConfirm = () => {
    if (this.isUnfollowing) {
      return;
    }
    this.isUnfollowing = true;
    let user = {
      user_id: this.props.userData.id,
    };
    this.props
      .unfollowChannel(this.props.currentChannel.id, user)
      .then(async (res) => {
        if (res.status === true) {
          await this.toggleConfirmationModal();
          this.props.navigation.popToTop();
        }
        return;
      })
      .catch((err) => {
        console.log('ChannelInfo -> onConfirm -> err', err);
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
        this.isUnfollowing = false;
        this.toggleConfirmationModal();
      });
  };

  toggleConfirmationModal = () => {
    this.setState((prevState) => ({
      showConfirmationModal: !prevState.showConfirmationModal,
    }));
  };

  toggleAffiliateModal = () => {
    this.setState((prevState) => ({
      showAffiliateModal: !prevState.showAffiliateModal,
    }));
  };

  onClose = () => {
    this.toggleAffiliateModal();
  };

  onCopyAffilation = (url) => {
    Clipboard.setString(url);
    this.toggleAffiliateModal();
  };

  render() {
    const {
      channelData,
      tabBarItem,
      orientation,
      showConfirmationModal,
      showAffiliateModal,
    } = this.state;
    const {channelLoading, currentChannel, userData} = this.props;

    const channelCountDetails = [
      {
        id: 1,
        title: 'posts',
        count: channelData.post,
      },
      {
        id: 2,
        title: 'followers',
        count: channelData.members,
      },
      {
        id: 3,
        title: 'vip',
        count: channelData.vip,
      },
    ];

    //console.log('currentChannel', currentChannel, '++++++++++++++', channelData)
    return (
      <View
        // source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            isCentered
            onBackPress={() => this.props.navigation.goBack()}
            title="Channel Info"
          />
          {!channelLoading ? (
            <KeyboardAwareScrollView
              contentContainerStyle={channelInfoStyles.mainContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <LinearGradient
                start={{x: 0.1, y: 0.7}}
                end={{x: 0.8, y: 0.3}}
                locations={[0.1, 0.5, 1]}
                colors={['#c13468', '#ee2e3b', '#fa573a']}
                style={channelInfoStyles.channelImageContainer}>
                <ImageBackground
                  style={channelInfoStyles.channelCoverContainer}
                  source={getImage(channelData.cover_image)}>
                  <View
                    style={channelInfoStyles.updateBackgroundContainer}></View>
                  <View style={channelInfoStyles.channelInfoContainer}>
                    <View style={channelInfoStyles.imageContainer}>
                      <View style={channelInfoStyles.imageView}>
                        {/* <View style={channelInfoStyles.imageView}> */}
                        {!channelData.channel_picture ? (
                          <View
                            style={[
                              {height: '100%', width: '100%'},
                              {
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: Colors.white,
                              },
                            ]}>
                            <Text
                              style={[
                                globalStyles.bigSemiBoldText,
                                {color: Colors.black},
                              ]}>
                              {channelData.name &&
                                channelData.name.trim().charAt(0).toUpperCase()}
                              {/* {secondUpperCase} */}
                            </Text>
                          </View>
                        ) : (
                          <RoundedImage
                            source={getImage(channelData.channel_picture)}
                            style={channelInfoStyles.profileImage}
                            isRounded={false}
                            resizeMode={'cover'}
                            size={'100%'}
                          />
                        )}
                        {/* </View> */}
                      </View>
                    </View>
                    <View style={channelInfoStyles.detailView}>
                      <View
                        style={channelInfoStyles.changeChannelContainer}
                        // onPress={() => this.toggleChannelBusinessMenu()}
                      >
                        <Text
                          style={channelInfoStyles.channelNameText}
                          numberOfLines={1}>
                          {channelData.name}
                        </Text>
                      </View>
                      <View
                        style={channelInfoStyles.changeChannelContainer}
                        // onPress={() => this.toggleChannelBusinessMenu()}
                      >
                        <Text
                          style={channelInfoStyles.channelNameText}
                          numberOfLines={1}>
                          {channelData.channel_status
                            ? channelData.channel_status === ''
                              ? '-'
                              : channelData.channel_status
                            : '-'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={channelInfoStyles.channelInfoDetail}>
                    <View style={channelInfoStyles.channelDetailStatus}>
                      {channelCountDetails.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={channelInfoStyles.detailStatusItem}>
                            <Text
                              style={channelInfoStyles.detailStatusItemCount}>
                              {item.count}
                            </Text>
                            <Text
                              style={channelInfoStyles.detailStatusItemName}>
                              {translate(`pages.xchat.${item.title}`)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                    <View style={channelInfoStyles.channelDetailButton}>
                      <Button
                        title={
                          channelData.is_member
                            ? translate('pages.xchat.unfollow')
                            : translate('pages.xchat.follow')
                        }
                        type={'transparent'}
                        height={30}
                        onPress={() => this.onFollowUnfollow()}
                      />
                    </View>
                  </View>
                </ImageBackground>
              </LinearGradient>
              <View style={channelInfoStyles.tabBar}>
                {tabBarItem.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={channelInfoStyles.tabItem}
                      onPress={item.action}
                      activeOpacity={item.title === 'about' ? 1 : 0}>
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
                        ]}>
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
                <Text style={channelInfoStyles.aboutText}>
                  {currentChannel.description}
                </Text>
              </View>
              {channelData.is_vip && (
                <React.Fragment>
                  <View style={channelInfoStyles.about}>
                    <Text style={channelInfoStyles.aboutHeading}>
                      {translate('pages.xchat.vipFeature')}
                    </Text>
                    <Text style={channelInfoStyles.aboutText}>
                      {channelData.vip_description}
                    </Text>
                  </View>
                  {/*<View style={channelInfoStyles.followerDetails}>*/}
                  {/*<Text*/}
                  {/*style={{fontFamily: Fonts.extralight, marginRight: 5}}>*/}
                  {/*{translate('pages.xchat.affiliateRewardText')}*/}
                  {/*</Text>*/}
                  {/*<Text style={channelInfoStyles.detailText}>1 %</Text>*/}
                  {/*</View>*/}
                </React.Fragment>
              )}

              <View style={channelInfoStyles.buttonContainer}>
                {/*<Button*/}
                {/*isRounded={false}*/}
                {/*type={'primary'}*/}
                {/*title={translate('pages.xchat.affiliate')}*/}
                {/*onPress={this.toggleAffiliateModal}*/}
                {/*/>*/}
                {channelData.is_vip &&
                  channelData.subscription_type === 'member' && (
                    <Button
                      isRounded={false}
                      type={'primary'}
                      title={translate('pages.xchat.vip')}
                      onPress={() => {}}
                    />
                  )}
              </View>
              {channelData.is_vip &&
                channelData.subscription_type === 'member' && (
                  <View style={channelInfoStyles.followerDetails}>
                    <Text
                      style={{fontFamily: Fonts.extralight, marginRight: 5}}>
                      {translate('pages.xchat.vipMonth')}
                    </Text>
                    <Text style={channelInfoStyles.detailText}>
                      {channelData.monthly_vip_fee} TP
                    </Text>
                  </View>
                )}
            </KeyboardAwareScrollView>
          ) : (
            <ListLoader large />
          )}
          <ConfirmationModal
            visible={showConfirmationModal}
            onCancel={this.onCancel.bind(this)}
            onConfirm={this.onConfirm.bind(this)}
            orientation={orientation}
            isLoading={this.isUnfollowing}
            title={translate('pages.xchat.toastr.areYouSure')}
            message={translate('pages.xchat.toLeaveThisChannel')}
          />
          <AffilicateModal
            orientation={orientation}
            visible={showAffiliateModal}
            onCancel={this.onClose}
            onConfirm={this.onCopyAffilation}
            title={translate('pages.xchat.invitation')}
            url={`https://www.touku.net/#/channels/${
              currentChannel.id
            }/${userData.referral_link.split('/').pop()}`}
            buttonText={translate('common.copy')}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    channelLoading: state.channelReducer.loading,
    currentChannel: state.channelReducer.currentChannel,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  getChannelDetails,
  unfollowChannel,
  followChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelInfo);
