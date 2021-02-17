import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  Clipboard,
  Linking,
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
import {
  getImage,
  eventService,
  showToast,
  normalize,
  onPressHyperlink,
  wait,
} from '../../utils';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {
  getChannelDetails,
  unfollowChannel,
  followChannel,
  subscribeAsVip,
    setCurrentChannel
} from '../../redux/reducers/channelReducer';
import {ConfirmationModal, AffilicateModal} from '../../components/Modals';
import AsyncStorage from '@react-native-community/async-storage';
import HyperLink from 'react-native-hyperlink';
import PostCard from '../../components/PostCard';
import {getChannelTimeline} from '../../redux/reducers/timelineReducer';
import {getChannelsById} from "../../storage/Service";
import {store} from "../../redux/store";
import NavigationService from "../../navigation/NavigationService";

class ChannelInfo extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      channelImagePath: {},
      channelData: [],
      showConfirmationModal: false,
      showVipConfirmationModal: false,
      showPurchaseTPConfirmation: false,
      showAffiliateModal: false,
      isLoading: false,
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
          action: () => {
            this.setState({isTimeline: false, activeIndex: 1});
          },
        },
        {
          id: 3,
          title: 'timeline',
          icon: Icons.icon_timeline,
          action: () => this.setState({isTimeline: true, activeIndex: 2}),
          // this.props.navigation.navigate('ChannelTimeline', {
          //   ChannelTimelineId: this.props.navigation.state.params
          //     ? this.props.navigation.state.params.channelItem.channel_id
          //     : this.props.currentChannel.id,
          // }),
        },
      ],
      isTimeline:
        this.props.navigation.state.params &&
        this.props.navigation.state.params.isTimeline
          ? true
          : false,
      activeIndex:
        this.props.navigation.state.params &&
        this.props.navigation.state.params.isTimeline
          ? 2
          : 1,
      posts: [],
    };
    this.isUnfollowing = false;
    this.isFollowing = false;
    this.isVipLoading = false;
  }

  async OnBackAction() {
      await AsyncStorage.removeItem('channelData');
    let channelData = this.state.channelData
      await AsyncStorage.removeItem('channelData');
      if (this.props.navigation.state.params && this.props.navigation.state.params.channelItem.channel_id) {
          let channelObj = getChannelsById(this.props.navigation.state.params.channelItem.channel_id);
          if (channelObj.length > 0) {
              store.dispatch(setCurrentChannel(channelObj[0]));
              NavigationService.navigate('ChannelChats');
          }
      }else{
          this.props.navigation.goBack();
      }
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
    this.getCurrentChannelTimeline();
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
        this.props.navigation.state.params
          ? this.props.navigation.state.params.channelItem.channel_id
          : this.props.currentChannel.id,
      )
      .then((res) => {
        console.log('details',res);
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

  onFollowUnfollow = async () => {
    if (this.state.channelData.is_member) {
      this.setState({showConfirmationModal: true});
    } else {
      if (this.isFollowing) {
        return;
      }
      this.isFollowing = true;
      await this.setState({
        isLoading: true,
      });
      let data = {
        channel_id: this.props.navigation.state.params
          ? this.props.navigation.state.params.channelItem.channel_id
          : this.props.currentChannel.id,
        referral_code: this.props.navigation.state.params
          ? this.props.navigation.state.params.channelItem.referral
          : 'ISGLGA2V',
        user_id: this.props.userData.id,
      };
      this.props
        .followChannel(data)
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: this.props.navigation.state.params
                ? this.props.navigation.state.params.channelItem.channel_name
                : this.props.currentChannel.name,
              text: translate('pages.xchat.toastr.AddedToNewChannel'),
              type: 'positive',
            });
            this.getChannelDetails();
          }
          this.isFollowing = false;
          this.setState({
            isLoading: false,
          });
        })
        .catch((err) => {
          Toast.show({
            title: 'Touku',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
          this.isFollowing = false;
          this.setState({
            isLoading: false,
          });
        });
    }
  };

  onCancel = () => {
    this.toggleConfirmationModal();
  };

  onConfirm = async () => {
    if (this.isUnfollowing) {
      return;
    }
    this.isUnfollowing = true;
    await this.setState({
      isLoading: true,
    });
    let user = {
      user_id: this.props.userData.id,
    };
    this.props
      .unfollowChannel(
        this.props.navigation.state.params
          ? this.props.navigation.state.params.channelItem.channel_id
          : this.props.currentChannel.id,
        user,
      )
      .then(async (res) => {
        console.log('res', res);

        if (res.status === true) {
          await this.toggleConfirmationModal();
          this.isUnfollowing = false;
          this.setState({
            isLoading: false,
          });
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
        this.setState({
          isLoading: false,
        });
        this.toggleConfirmationModal();
      });
  };

  onCloseVipConfirmation = () => {
    this.toggleVipConfirmationModal();
  }

  onConfirmVipConfirmation = () => {
    const {userData} = this.props;
    const {channelData} = this.state;
    if(userData.total_tp<channelData.monthly_vip_fee){
      this.toggleVipConfirmationModal();
      wait(500).then(()=>{
        this.togglePurchaseTPConfirmationModal();
      })
      return;
    }

    let data = {
      channel_id: this.props.navigation.state.params
          ? this.props.navigation.state.params.channelItem.channel_id
          : this.props.currentChannel.id,
      invitation_code: this.props.navigation.state.params
          ? this.props.navigation.state.params.channelItem.referral
          : 'ISGLGA2V',
    }

    this.props.subscribeAsVip(data)
      .then((res) => {
        console.log(res);
        if(res && res.status){
          this.toggleVipConfirmationModal();
          Toast.show({
            title: this.props.navigation.state.params
              ? this.props.navigation.state.params.channelItem.channel_name
              : this.props.currentChannel.name,
            text: translate('pages.xchat.toastr.AddedToNewChannel'),
            type: 'positive',
          });
          this.getChannelDetails();
        }
      }).catch((err) => {
        console.log(err);
        this.toggleVipConfirmationModal();
      });

  }

  onClosePurchaseTPConfirmation = () => {
    this.togglePurchaseTPConfirmationModal();
  }

  onConfirmPurchaseTPCOnfirmation = () => {
    this.togglePurchaseTPConfirmationModal();
  }

  toggleConfirmationModal = () => {
    this.setState((prevState) => ({
      showConfirmationModal: !prevState.showConfirmationModal,
    }));
  };

  toggleVipConfirmationModal = () => {
    this.setState((prevState) => ({
      showVipConfirmationModal: !prevState.showVipConfirmationModal,
    }));
  };

  togglePurchaseTPConfirmationModal = () => {
    this.setState((prevState) => ({
      showPurchaseTPConfirmation: !prevState.showPurchaseTPConfirmation,
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

  copyCode(data) {
    Clipboard.setString(data);
    showToast(
      translate('pages.setting.referralLink'),
      translate('pages.setting.toastr.linkCopiedSuccessfully'),
      'positive',
    );
  }

  //#region Timeline function
  getCurrentChannelTimeline = (lastId) => {
    // console.log('data', this.props.navigation.state.params.ChannelTimelineId);

    let channel_id = this.props.navigation.state.params
      ? this.props.navigation.state.params.channelItem.channel_id
      : this.props.currentChannel.id;

    getChannelTimeline(channel_id, lastId)
      .then((res) => {
        if (res.load_more) {
          const posts = [...this.state.posts, ...res.posts];
          this.setState({posts, isLoading: false});
        }
        if (res.load_more === false && this.noMorePosts !== true) {
          this.noMorePosts = true;
          const posts = [...this.state.posts, ...res.posts];
          this.setState({posts, isLoading: false});
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  onMomentumScrollBegin = () => {
    this.doUpdate = false;
  };

  onEndReached = (info) => {
    const {posts} = this.state;
    const lastPost = posts[posts.length - 1];
    if (!this.doUpdate && this.lastPostId !== lastPost.id) {
      this.doUpdate = true;
      this.lastPostId = lastPost.id;
      this.getCurrentChannelTimeline(lastPost.id);
    }
  };
  //#endregion

  render() {
    const {
      channelData,
      tabBarItem,
      orientation,
      showConfirmationModal,
      showVipConfirmationModal,
      showPurchaseTPConfirmation,
      showAffiliateModal,
      isTimeline,
      posts,
      activeIndex,
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

    const cahnnel_id = this.props.navigation.state.params
      ? this.props.navigation.state.params.channelItem.channel_id
      : this.props.currentChannel.id;
    let tmpReferralCode = userData.referral_link;
    const arrLink = tmpReferralCode.split('/');
    let referralCode = '';
    if (arrLink.length > 0) {
      referralCode = arrLink[arrLink.length - 1];
    }

    const followCode =
      cahnnel_id + referralCode + String(currentChannel.id).length;

    console.log('current channel', followCode);
    // console.log('currentChannel', currentChannel, '++++++++++++++', channelData)

    return (
      <View
        // source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            isCentered
            onBackPress={() => this.props.navigation.goBack()}
            title= {translate('pages.xchat.channelInfo')}
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
                  <LinearGradient
                    colors={['rgba(255, 98, 165, 0.8)', 'rgba(0,0,0,0)']}
                    start={{x: 0, y: 1}}
                    end={{x: 0, y: 0}}
                    style={[
                      {position: 'absolute', width: '100%', height: '100%'},
                    ]}></LinearGradient>

                  {/* <View
                    style={channelInfoStyles.updateBackgroundContainer}></View> */}
                  <View style={channelInfoStyles.channelInfoContainer}>
                    <View
                      style={[
                        channelInfoStyles.imageContainer,
                        {alignItems: 'center'},
                      ]}>
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
                          style={[
                            channelInfoStyles.channelNameText,
                            {fontSize: 13},
                          ]}
                          numberOfLines={1}>
                          {channelData.channel_status
                            ? channelData.channel_status === ''
                              ? '-'
                              : channelData.channel_status
                            : '-'}
                        </Text>
                      </View>
                      <View
                        style={channelInfoStyles.changeChannelContainer}
                        // onPress={() => this.toggleChannelBusinessMenu()}
                      >
                        <Text
                          style={[
                            channelInfoStyles.channelNameText,
                            {fontSize: 14},
                          ]}
                          numberOfLines={1}>
                          {translate('pages.invitation.referralOneField3')}
                        </Text>
                        <Text
                          style={[
                            channelInfoStyles.channelNameText,
                            {fontSize: 14, textDecorationLine: 'underline'},
                          ]}
                          numberOfLines={1}
                          onPress={() => this.copyCode(followCode)}>
                          {followCode}
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
                        height={28}
                        onPress={() => this.onFollowUnfollow()}
                        loading={this.isFollowing}
                        fontType={'normalRegular15Text'}
                        borderColor={Colors.gradient_3}
                      />
                    </View>
                  </View>
                </ImageBackground>
              </LinearGradient>

              <View style={channelInfoStyles.tabBar}>
                {tabBarItem.map((item, index) => {
                  if (item.title === 'chat' && !this.state.channelData.is_member ){return null} else{
                    return (
                      <TouchableOpacity
                        key={index}
                        style={channelInfoStyles.tabItem}
                        onPress={item.action}
                        activeOpacity={activeIndex == index ? 1 : 0}>
                        <Image
                          source={item.icon}
                          style={[
                            channelInfoStyles.tabIamge,
                            {
                              opacity: activeIndex == index ? 1 : 0.5,
                            },
                          ]}
                          resizeMode={'center'}
                        />
                        <Text
                          style={[
                            channelInfoStyles.tabTitle,
                            {
                              fontFamily: Fonts.regular,
                            },
                          ]}>
                          {translate(`pages.xchat.${item.title}`)}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  // if (!this.props.navigation.state.params) {
                  //   return (
                  //     <TouchableOpacity
                  //       key={index}
                  //       style={channelInfoStyles.tabItem}
                  //       onPress={item.action}
                  //       activeOpacity={activeIndex == index ? 1 : 0}>
                  //       <Image
                  //         source={item.icon}
                  //         style={[
                  //           channelInfoStyles.tabIamge,
                  //           {
                  //             opacity: activeIndex == index ? 1 : 0.5,
                  //           },
                  //         ]}
                  //         resizeMode={'center'}
                  //       />
                  //       <Text
                  //         style={[
                  //           channelInfoStyles.tabTitle,
                  //           {
                  //             fontFamily: Fonts.regular,
                  //           },
                  //         ]}>
                  //         {translate(`pages.xchat.${item.title}`)}
                  //       </Text>
                  //     </TouchableOpacity>
                  //   );
                  // }
                })}
              </View>
              {isTimeline ? (
                <View style={{padding: normalize(15)}}>
                  {this.state.isLoading ? (
                    <ListLoader justifyContent={'flex-start'} />
                  ) : (
                    <PostCard
                      posts={posts}
                      isTimeline={true}
                      useFlatlist={true}
                      isChannelTimeline={true}
                      onMomentumScrollBegin={this.onMomentumScrollBegin}
                      onEndReached={this.onEndReached}
                    />
                  )}
                </View>
              ) : (
                <View>
                  <View style={channelInfoStyles.about}>
                    <Text style={channelInfoStyles.aboutHeading}>
                      {translate('pages.xchat.about')}
                    </Text>
                    <HyperLink
                      onPress={(url, text) => {
                        onPressHyperlink(url);
                      }}
                      linkStyle={{
                        color: 'blue',
                        textDecorationLine: 'underline',
                      }}>
                      <Text style={channelInfoStyles.aboutText}>
                        {channelData.description}
                      </Text>
                    </HyperLink>

                    {/* <TouchableOpacity
                  style={{justifyContent: 'center', alignItems: 'center'}}
                  onPress={() => this.onFollowUnfollow()}>
                  <LinearGradient
                    start={{x: 0.1, y: 0.7}}
                    end={{x: 0.5, y: 0.2}}
                    locations={[0.1, 0.6, 1]}
                    colors={[
                      Colors.gradient_3,
                      Colors.gradient_2,
                      Colors.gradient_1,
                    ]}
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      width: '60%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 15,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: 'white',
                        fontFamily: Fonts.light,
                      }}>
                      {channelData.is_member
                        ? translate('pages.xchat.unfollow')
                        : translate('pages.xchat.follow')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity> */}
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
                      {/*style={{fontFamily: Fonts.regular, marginRight: 5}}>*/}
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
                    {channelData.is_vip && channelData.subscription_type !== 'vip' && (
                        <Button
                          isRounded={false}
                          type={'primary'}
                          title={translate('pages.xchat.vip')}
                          onPress={() => {
                            this.toggleVipConfirmationModal()
                          }}
                        />
                      )}
                  </View>
                  {channelData.is_vip && channelData.subscription_type !== 'vip' && (
                      <View style={channelInfoStyles.followerDetails}>
                        <Text
                          style={{fontFamily: Fonts.regular, marginRight: 5}}>
                          {translate('pages.xchat.vipMonth')}
                        </Text>
                        <Text style={channelInfoStyles.detailText}>
                          {channelData.monthly_vip_fee} TP
                        </Text>
                      </View>
                    )}
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
          <ConfirmationModal
            visible={showVipConfirmationModal}
            onCancel={this.onCloseVipConfirmation.bind(this)}
            onConfirm={this.onConfirmVipConfirmation.bind(this)}
            orientation={orientation}
            isLoading={this.isVipLoading}
            title={channelData.name}
            message={translate('pages.xchat.vipMemberText')}
            confirmText={translate('pages.xchat.joinVip')}
          />
          <ConfirmationModal
            visible={showPurchaseTPConfirmation}
            onCancel={this.onClosePurchaseTPConfirmation.bind(this)}
            onConfirm={this.onConfirmPurchaseTPCOnfirmation.bind(this)}
            orientation={orientation}
            isLoading={this.isVipLoading}
            title={translate('pages.xchat.joinVip')}
            message={translate('pages.xchat.toastr.insufficientTPBalance')}
            confirmText={translate('pages.xchat.purchase')}
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
  subscribeAsVip,
    setCurrentChannel
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelInfo);
