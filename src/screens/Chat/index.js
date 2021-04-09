import React, {Component} from 'react';
import {View, ImageBackground, FlatList, Platform} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createFilter} from 'react-native-search-filter';
import {withNavigationFocus} from 'react-navigation';

import {Images, languageArray, SocketEvents} from '../../constants';
import {SearchInput} from '../../components/TextInputs';
import {getAvatar, eventService, realmToPlainObject, getUserName} from '../../utils';
import {
  ChannelListItem,
  FriendListItem,
  GroupListItem,
} from '../../components/ListItems';
import NoData from '../../components/NoData';
import {ListLoader} from '../../components/Loaders';

import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {
  setI18nConfig,
  translate,
  setAppLanguage,
} from '../../redux/reducers/languageReducer';

import {
  getUserProfile,
  getMissedSocketEventsById,
  setToukuPoints,
  updateUserProfileImage
} from '../../redux/reducers/userReducer';
import {
  getUserConfiguration,
  updateConfiguration,
  updateUserBackgroundImage,
  updateUserDisplayName
} from '../../redux/reducers/configurationReducer';
import {
  setCommonChatConversation,
  setDeleteChat,
  setSwipeItem
} from '../../redux/reducers/commonReducer';
import {
  getUserChannels,
  getFollowingChannels,
  setCurrentChannel,
  getMoreFollowingChannels,
  getLocalFollowingChannels,
  setChannelConversation,
  readAllChannelMessages,
  updateCurrentChannel,
  checkLoginBonusOfChannel,
  getLoginBonusOfChannel,
  selectRegisterJackpot,
  pinChannel,
  unpinChannel,
} from '../../redux/reducers/channelReducer';
import {setFriendRequest,setAcceptedRequest} from '../../redux/reducers/addFriendReducer';
import {
  getUserGroups,
  setCurrentGroup,
  getLocalUserGroups,
  updateUnreadGroupMsgsCounts,
  setGroupConversation,
  setCurrentGroupMembers,
  getGroupMembers,
  setCurrentGroupDetail,
  getGroupDetail,
  markGroupConversationRead,
  deleteChat,
  pinGroup,
  unpinGroup,
} from '../../redux/reducers/groupReducer';
import {getFriendRequest} from '../../redux/reducers/addFriendReducer';
import {
  getUserFriends,
  getFriendRequests,
  setCurrentFriend,
  updateCurrentFriendAvtar,
  updateCurrentFriendDisplayName,
  updateCurrentFriendBackgroundImage,
  updateUnreadFriendMsgsCounts,
  getUserFriendsSuccess,
  setUserFriends,
  setFriendConversation,
  markFriendMsgsRead,
  unFriendUser,
    addFriendByReferralCode,
  pinFriend,
  unpinFriend,
} from '../../redux/reducers/friendReducer';
import SingleSocket from '../../helpers/SingleSocket';
import BulkSocket from '../../helpers/BulkSocket';
import {
  getChannels,
  updateMessageById,
  deleteMessageById,
  setMessageUnsend,
  getChannelsById,
  getChannelChatConversationById,
  setChannelChatConversation,
  updateChannelLastMsg,
  updateFriendsUnReadCount,
  setFriendChatConversation,
  updateFriendLastMsg,
  updateFriendMessageById,
  getLocalUserFriend,
  updateFriendLastMsgWithoutCount,
  deleteFriendMessageById,
  setFriendMessageUnsend,
  getLocalUserFriends,
  updateFriendOnlineStatus,
  updateFriendAvtar,
  updateFriendDisplayName,
  getUserFriend,
  updateConversationUserAvtar,
  updateFriendTypingStatus,
  getGroups,
  setGroups,
  updateGroup,
  setFriendRequests,
  deleteFriendRequest,
  setChannels,
  deleteGroupById,
  removeGroupById,
  deleteGroupMessageById,
  deleteAllGroupMessageByGroupId,
  UpdateGroupDetail,
  getGroupsById,
  updateLastMsgGroups,
  updateLastMsgTimestamp,
  updateLastMsgGroupsWithoutCount,
  updateUnReadCount,
  updateGroupMessageById,
  setGroupMessageUnsend,
  setGroupLastMessageUnsend,
  setGroupChatConversation,
  updateChannelUnReadCountById,
  updateReadByChannelId,
  removeUserFriends,
  updateFriendStatus,
  handleRequestAccept,
  getLocalFriendRequests,
  deleteChannelById,
  deleteChannelConversationById,
  updateChannelTotalMember,
  updateChannelLastMsgWithOutCount,
  getFriendChatConversationById,
  getGroupChatConversationById,
  updateLastEventId,
  updateAllFriendMessageRead,
  updateGroupnReadCount,
  updateChannelDetails,
  multipleData,
  updateUserFriendsWhenPined,
  updateUserFriendsWhenUnpined,
  updateGroupsWhenPined,
  updateGroupsWhenUnpined,
  updateChannelsWhenPined,
  updateChannelsWhenUnpined,
  multipleDeleteChatConversation,
  updateFriendProfileData
} from '../../storage/Service';
import {updateTrendTimeline} from '../../redux/reducers/timelineReducer';
import Toast from '../../components/Toast';
import NavigationService from '../../navigation/NavigationService';
import {
  ConfirmationModal,
  ChangePassModal,
  ChangeEmailModal,
} from '../../components/Modals';
import PasswordConfirmationModal from '../../components/Modals/PasswordConfirmationModal';
import EmailConfirmationModal from '../../components/Modals/EmailConfirmationModal';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-community/async-storage";
import BonusModal from "../../components/Modals/BonusModal";
import { SwipeItem } from '../../components/Swipeable';

let channelId = [];
let friendId = [];
let groupId = [];
let deleteObj = null;
let count = 0;

class Chat extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      searchText: '',
      showDropdown: false,
      isLoading: true,
      commonConversation: [],
      sortBy: this.props.userConfig.sort_by,
      reload: true,
      isVisible: false,
      isUncheck: true,
      isDeleteVisible: false,
      isSetPasswordVisible: false,
      isChangePassModalVisible: false,
      isDeleteLoading: false,
      commonChatsData: this.props.commonChat,
      countChat: 0,
      bonusModal: false,
      bonusXP: 0,
      // sortOptions: [
      //   {
      //     title: translate('pages.xchat.timeReceived'),
      //     onPress: () => this.shotListBy('time'),
      //   },
      //   {
      //     title: translate('pages.xchat.unreadMessages'),
      //     onPress: () => this.shotListBy('unread'),
      //   },
      //   {
      //     title: translate('pages.setting.name'),
      //     onPress: () => this.shotListBy('name'),
      //   },
      // ],
    };
    this.SingleSocket = SingleSocket.getInstance();
    this.BulkSocket = BulkSocket.getInstance();
  }

  _showingSwipeButton = null;

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  async UNSAFE_componentWillMount() {
    console.log('UNSAFE_componentWillMount called')
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
    // await eventService.subscribe();
    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });

    let isSocketCalled = false;

    this.props.getUserProfile().then((res) => {
      if (res) {
        console.log('user_profile', res);
        if (res.id) {
          console.log('user_id_from_res', this.props.userData.id);

          if (!isSocketCalled) this.SingleSocket.create({user_id: res.id});

          if (!res.email) {
            // this.setState({isSetEmailVisible: true});
          } else {
            this.setState({isSetPasswordVisible: !res.is_have_password});
          }
        }
      }
    });

    if (this.props.userData.id && !isSocketCalled) {
      console.log('user_id', this.props.userData.id);
      isSocketCalled = true;
      this.SingleSocket.create({user_id: this.props.userData.id});
    }
    this.BulkSocket.create();

    Orientation.addOrientationListener(this._orientationDidChange);
    // this.getFollowingChannels();
    // this.getUserGroups();
    // this.getUserFriends();
    // this.setCommonConversation();
    this.props.getUserConfiguration().then(async (res) => {
      console.log('res from configuration', res)
       await AsyncStorage.setItem('is_bonus_opened', JSON.stringify(res.is_bonus_opened));

      if(res && !res.is_bonus_opened){
        this.checkHasLoginBonus();
      }

      this.setState({
        sortBy: res.sort_by,
      });
      setI18nConfig(res.language);

      let filteredArray = languageArray.filter(
        (item) => item.language_name === res.language,
      );
      if (filteredArray.length > 0) {
        this.props.setAppLanguage(filteredArray[0]);
        setI18nConfig(filteredArray[0].language_name);
      }
      // this.props.getFriendRequest();

      let channelLoadingStatus = true;
      let groupLoadingStatus = true;
      let userLoadingStatus = true;

      this.props.getUserFriends().then((res) => {
        // this.setCommonConversation();
        userLoadingStatus = false;
        this.props.setCommonChatConversation().then(async () => {
          if (this.props.commonChat.length) {
            this.setState({
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading:
                channelLoadingStatus || groupLoadingStatus || userLoadingStatus,
            });
          }
        });
      });

      this.props.getUserGroups().then((res) => {
        // this.setCommonConversation();
        groupLoadingStatus = false;
        this.props.setCommonChatConversation().then(async () => {
          if (this.props.commonChat.length) {
            this.setState({
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading:
                channelLoadingStatus || groupLoadingStatus || userLoadingStatus,
            });
          }
        });
      });

      this.props.getFollowingChannels().then((res) => {
        // this.setCommonConversation();
        console.log('channel_api_response', res);
        channelLoadingStatus = false;
        this.props.setCommonChatConversation().then(async () => {
          if (this.props.commonChat.length) {
            this.setState({
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading:
                channelLoadingStatus || groupLoadingStatus || userLoadingStatus,
            });
          }
        });
      });
    });
  }

  async componentDidMount() {
      console.log('componentDidMount called')
    // this.props.getUserProfile();
    // this.SingleSocket.create({user_id: this.props.userData.id});
    Orientation.addOrientationListener(this._orientationDidChange);

    // this.getFollowingChannels();
    // this.getUserGroups();
    // this.getUserFriends();
    // this.setCommonConversation();
    // this.props.getUserConfiguration().then((res) => {
    //   console.log('getUserConfiguration ----->>>>>>>> ', res);
    //   setI18nConfig(res.language);

    //   let filteredArray = languageArray.filter(
    //     (item) => item.language_name === res.language,
    //   );
    //   console.log('filteredArray', filteredArray);
    //   if (filteredArray.length > 0) {
    //     this.props.setAppLanguage(filteredArray[0]);
    //     setI18nConfig(filteredArray[0].language_name);
    //   }
    //   this.props.getFriendRequest();

    //   this.props.getFollowingChannels().then((res) => {
    //     console.log('Chat -> componentDidMount -> getFollowingChannels', res);
    //     this.props.getUserGroups().then((res) => {
    //       console.log('Chat -> componentDidMount -> getUserGroups', res);
    //       this.props.getUserFriends().then((res) => {
    //         console.log('Chat -> componentDidMount -> getUserFriends', res);
    //         // console.log('friends', res);
    //         this.setCommonConversation();
    //       });
    //     });
    //   });
    // });

    // Realm.open({}).then(realm => {
    //   console.log("Realm is located at: " + realm.path);
    // });

    // this.props.getUserChannels();
    // await this.props.getFollowingChannels().then((res) => {
    //   this.props.getFriendRequests().then((res) => {
    //     this.props.getUserConfiguration().then((res) => {
    //       this.getCommonChat();
    //     });
    //   });
    // });

    // this.getCommonChat();
    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      async () =>
        setTimeout(() => {
          this.forceUpdate();
        }, 100),
    );

    this.focusListener = this.props.navigation.addListener(
      'willFocus',
      async () =>
        setTimeout(() => {
          this.addFriendByReferralCode()
        }, 2000),
    );

    this.willBlurfocusListener = this.props.navigation.addListener(
      'willBlur',
      () => {
        console.log('focus change');
        this.header && this.header._closeMenu();
        this.header && this.header._closeOption();
      },
    );

  }

  componentWillUnmount() {
    // this.SingleSocket && this.SingleSocket.closeSocket();
    this.events.unsubscribe();
      this.focusListener.remove();
  }

  checkHasLoginBonus = () => {
    this.props
      .checkLoginBonusOfChannel()
      .then((res) => {
        console.log('checkLoginBonusOfChannel', res);
        if (res && !res.status) {
          this.getLoginBonus();
        }
      })
      .catch((err) => {
        console.log('checkLoginBonusOfChannel_error', err);
      });
  };

  getLoginBonus = () => {
    this.props
      .getLoginBonusOfChannel()
      .then(async(res) => {
        console.log('getLoginBonusOfChannel', res);
        if (res) {
          this.setState({bonusXP: res.amount, bonusModal: true});
        }
      })
      .catch((err) => {
        console.log('getLoginBonusOfChannel_error', err);
      });
  };

  async addFriendByReferralCode(){
      const invitationCode = await AsyncStorage.getItem('invitationCode');
      // console.log('invitationCode onfocus', invitationCode)
      if (invitationCode) {
          let data = {invitation_code: invitationCode};
          this.props.addFriendByReferralCode(data).then((res) => {
              AsyncStorage.removeItem('invitationCode');
          });
      }
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  // updateData = async () => {
  //   console.log('Chat -> updateData -> updateData');
  //   await this.props.getFollowingChannels().then((res) => {
  //     this.props.getFriendRequests().then((res) => {
  //       // this.props.getUserConfiguration().then((res) => {
  //       this.getUpdatedCommonChat();
  //       // });
  //     });
  //   });
  // };

  // updateGroupData = async () => {
  //   await this.props.getUserGroups().then((res) => {
  //     this.getUpdatedCommonChat();
  //   });
  // };

  getUserGroups = () => {
    this.props.getUserGroups().then((res) => {
      this.props.setCommonChatConversation();
    });
  };

  setCommonConversation = () => {
    this.props.setCommonChatConversation().then(async () => {
      // await this.setState({
      //   isLoading: false,
      // });
    });
  };

  checkEventTypes(message) {
    //console.log(JSON.stringify(message));
    console.log(
      'checkEventTypes -> message.text.data.type',
      // message.text.data.type,
      // this.props.currentRouteName,
      JSON.stringify(message),
    );
    if (message.text.data.socket_event_id) {
      updateLastEventId(message.text.data.socket_event_id);
    }
    switch (message.text.data.type) {
      case SocketEvents.USER_ONLINE_STATUS:
        this.setFriendsOnlineStatus(message);
        break;
      case SocketEvents.FRIEND_TYPING_MESSAGE:
        // this.setFriendsTypingStatus(message);
        break;
      case SocketEvents.CHECK_IS_USER_ONLINE:
        // this.checkIsUserOnline(message);
        break;
      case SocketEvents.READ_ALL_MESSAGE_CHANNEL_CHAT:
        this.readAllMessageChannelChat(message);
        break;
      case SocketEvents.READ_ALL_MESSAGE_CHANNEL_SUBCHAT:
        this.readAllMessageChannelSubChat(message);
        break;
      case SocketEvents.MESSAGE_IN_FOLLOWING_CHANNEL:
        this.messageInFollowingChannel(message);
        break;
      case SocketEvents.MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL:
        // this.getFollowingChannels(message);
        this.multipleMessageInFollowingChannel(message);
        break;
      case SocketEvents.MESSAGE_EDITED_IN_FOLLOWING_CHANNEL:
        this.messageUpdateInFollowingChannel(message);
        break;
      case SocketEvents.DELETE_MESSAGE_IN_FOLLOWING_CHANNEL:
        this.messageDeleteInFollowingChannel(message);
        break;
      case SocketEvents.DELETE_MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL:
        this.multipleMessageDeleteInFollowingChannel(message);
        break;
      case SocketEvents.UNSENT_MESSAGE_IN_FOLLOWING_CHANNEL:
        this.messageUnsentInFollowingChannel(message);
        break;
      case SocketEvents.ADD_CHANNEL_MEMBER:
        this.onAddChannelMemmber(message);
        break;
      case SocketEvents.REMOVE_CHANNEL_MEMBER:
        this.onRemoveChannelMember(message);
        break;
      case SocketEvents.MEMBER_REMOVED_FROM_CHANNEL_COUNT:
        this.onChannelMemberRemoveCount(message);
        break;
      case SocketEvents.READ_ALL_MESSAGE_FRIEND_CHAT:
        this.readAllMessageFriendChat(message);
        break;
      case SocketEvents.NEW_MESSAGE_IN_FREIND:
        this.onNewMessageInFriend(message);
        break;
      case SocketEvents.MESSAGE_EDITED_IN_FRIEND:
        this.onEditMessageInFriend(message);
        break;
      case SocketEvents.DELETE_MESSAGE_IN_FRIEND:
        this.onDeleteMessageInFriend(message);
        break;
      case SocketEvents.DELETE_MULTIPLE_MESSAGE_IN_FRIEND:
        this.onDeleteMultipleMessageInFriend(message);
        break;
      case SocketEvents.UNSENT_MESSAGE_IN_FRIEND:
        this.onUnsentMessageInFriend(message);
        break;
      case SocketEvents.UNFRIEND:
        this.unFriendUser(message);
        break;
      case SocketEvents.REMOVE_FRIEND:
        this.updateFriendStatus(message);
        break;
      case SocketEvents.DELETE_FRIEND_OBJECT:
        this.deleteFriendObject(message);
        break;
      case SocketEvents.READ_ALL_MESSAGE_GROUP_CHAT:
        this.readAllMessageGroupChat(message);
        break;
      case SocketEvents.NEW_MESSAGE_IN_GROUP:
        this.onNewMessageInGroup(message);
        break;
      case SocketEvents.MESSAGE_EDIT_FROM_GROUP:
        this.editMessageFromGroup(message);
        break;
      case SocketEvents.DELETE_MESSAGE_IN_GROUP:
        this.onDeleteMessageInGroup(message);
        break;
      case SocketEvents.DELETE_MULTIPLE_MESSAGE_IN_GROUP:
        this.onDeleteMultipleMessageInGroup(message);
        break;
      case SocketEvents.UNSENT_MESSAGE_FROM_GROUP:
        this.UnsentMessageFromGroup(message);
        break;
      case SocketEvents.CREATE_NEW_GROUP:
        this.onCreateNewGroup(message);
        break;
      case SocketEvents.DELETE_GROUP:
        this.onDeleteGroup(message);
        break;
      case SocketEvents.ADD_GROUP_MEMBER:
        this.onAddGroupMember(message);
        break;
      case SocketEvents.MUTE_GROUP:
        this.onMuteGroup(message);
        break;
      case SocketEvents.REMOVE_GROUP_MEMBER:
        this.onRemoveGroupMember(message);
        break;
      case SocketEvents.GROUP_MEMBER_TO_ADMIN:
        this.onMemberTypeUpdate(message);
        break;
      case SocketEvents.CLEAR_GROUP_CHAT:
        this.onRemoveGroupFromList(message);
        break;
      case SocketEvents.EDIT_GROUP_DETAIL:
        this.onUpdateGroupDetail(message);
        break;
      case SocketEvents.FRIEND_REQUEST_CANCELLED:
        deleteFriendRequest(message.text.data.message_details.user_id);
        this.props.setFriendRequest();
        break;
      case SocketEvents.NEW_FRIEND_REQUEST:
        this.onNewFriendRequest(message);
        break;
      case SocketEvents.FRIEND_REQUEST_ACCEPTED:
        this.onAcceptFriendReuqest(message);
        break;
      case SocketEvents.FRIEND_REQUEST_REJECTED:
        deleteFriendRequest(message.text.data.message_details.user_id);
        this.props.setFriendRequest();
        break;
      case SocketEvents.UPDATE_READ_COUNT_IN_GROUP:
        this.onUpdateGroupReadCount(message);
        break;
      case SocketEvents.UPLOAD_AVTAR:
        this.updateUserAvtar(message);
        break;
      case SocketEvents.UPDATE_CHANNEL_DETAIL:
        this.updateChannelDetail(message);
        break;
      case SocketEvents.CREATE_NEW_CHANNEL:
        // this.createNewChannel(message);   // not required at app end
        break;
      case SocketEvents.FRIEND_DISPLAY_NAME_DATA:
        this.onFriendDisplayNameUpdate(message);
        break;
      case SocketEvents.DELETE_MULTIPLE_CHATS:
        this.deleteMultipleChat(message);
        break;
      case SocketEvents.MESSAGE_EDITED_IN_THREAD:
        break;
      case SocketEvents.DELETE_MESSAGE_IN_THREAD:
        break;
      case SocketEvents.UNSENT_MESSAGE_IN_THREAD:
        break;
      case SocketEvents.MULTIPLE_MESSAGE_IN_THREAD:
        break;
      case SocketEvents.ADD_CHANNEL_ADMIN:
        break;
      case SocketEvents.READ_ALL_MESSAGE_CHANNEL_SUBCHAT:
        break;
      case SocketEvents.PINED_FRIEND:
        this.onPinFriend(message);
        break;
      case SocketEvents.UNPINED_FRIEND:
        this.onUnpinFriend(message);
        break;
      case SocketEvents.PINED_GROUP:
        this.onPinGroup(message);
        break;
      case SocketEvents.UNPINED_GROUP:
        this.onUnpinGroup(message);
        break;
      case SocketEvents.PINED_CHANNEL:
        this.onPinChannel(message);
        break;
      case SocketEvents.UNPINED_CHANNEL:
        this.onUnpinChannel(message);
      case SocketEvents.UPDATING_USER_TP:
        this.onUpdateUserTP(message);
        break;
      case SocketEvents.UPDATE_USER_PROFILE:
        this.onUserProfileUpdate(message);
        break;
    }
  }

  updateChannelDetail(message) {
    console.log(
      'updateChannelDetail -> message.text.data.message_details',
      message.text.data.message_details,
    );
    const {currentChannel} = this.props;
    if (message.text.data.type === SocketEvents.UPDATE_CHANNEL_DETAIL) {
      updateChannelDetails(
        message.text.data.message_details.id,
        message.text.data.message_details,
      );
      this.props.getLocalFollowingChannels().then(() => {
        this.props.setCommonChatConversation();
      });

      if (
        this.props.currentRouteName == 'ChannelChats' ||
        (this.props.currentRouteName == 'ChannelInfo' &&
          currentChannel &&
          message.text.data.message_details.id == currentChannel.id)
      ) {
        this.props.updateCurrentChannel(message.text.data.message_details);
      }
    }
  }
  updateUserAvtar(message) {
    const {userData, currentFriend} = this.props;
    if (message.text.data.type === SocketEvents.UPLOAD_AVTAR) {
      // if (userData.id === message.text.data.message_details.user_id) {
      //   this.props.getUserProfile();
      //   return;
      // }
      var user = getLocalUserFriend(message.text.data.message_details.user_id);
      if (user && user.length > 0) {
        updateFriendAvtar(
          message.text.data.message_details.user_id,
          message.text.data.message_details,
        );
        this.props.getUserFriends().then((res) => {
          this.setCommonConversation();
        });
      }
      if (currentFriend.user_id === message.text.data.message_details.user_id) {
        this.props.updateCurrentFriendAvtar(message.text.data.message_details);
        this.getLocalFriendConversation();
      }
      if(userData.id === message.text.data.message_details.user_id){
        let user_data = userData;
        user_data['avatar'] = message.text.data.message_details.avatar
        this.props.updateUserProfileImage(user_data);
      }
    }
  }
  //Set Friend's online status with socket event
  setFriendsOnlineStatus(message) {
    const {userFriends} = this.props;
    if (message.text.data.type === SocketEvents.USER_ONLINE_STATUS) {
      var user = getLocalUserFriend(message.text.data.message_details.user_id);
      if (user && user.length > 0) {
        if (
          message.text.data.message_details.status === 'online' &&
          !user[0].is_online
        ) {
          updateFriendOnlineStatus(
            message.text.data.message_details.user_id,
            true,
          );
          this.props.setUserFriends().then((res) => {
            this.props.setCommonChatConversation();
          });
        } else if (
          message.text.data.message_details.status === 'offline' &&
          user[0].is_online
        ) {
          updateFriendOnlineStatus(
            message.text.data.message_details.user_id,
            false,
          );
          this.props.getUserFriends().then((res) => {
            this.setCommonConversation();
          });
        }
      }
    }
  }

  deleteMultipleChat = async (message) => {
    console.log('message2', message);
    let commonData = [...this.props.commonChat];

    // channel
    if (
      message.text.data.message_details.channel_ids &&
      message.text.data.message_details.channel_ids.length > 0
    ) {
      message.text.data.message_details.channel_ids.map(
        (channelItem, index) => {
          let commonData1 = commonData.filter(
            (item) => item.id === channelItem,
          );
          if (commonData1.length > 0) {
            multipleData('channel', commonData1);
          }
        },
      );
    }

    // friend
    if (
      message.text.data.message_details.friend_ids &&
      message.text.data.message_details.friend_ids.length > 0
    ) {
      message.text.data.message_details.friend_ids.map((friendItem, index) => {
        let commonData2 = commonData.filter(
          (item) => item.friend === friendItem,
        );
        if (commonData2.length > 0) {
          multipleData('friend', commonData2);
        }
      });
    }

    // group
    if (
      message.text.data.message_details.group_ids &&
      message.text.data.message_details.group_ids.length > 0
    ) {
      message.text.data.message_details.group_ids.map((groupItem, index) => {
        let commonData3 = commonData.filter(
          (item) => item.group_id === groupItem,
        );
        if (commonData3.length > 0) {
          multipleData('groupItem', commonData3);
        }
      });
    }

    await this.props.getLocalFollowingChannels();
    await this.props.setUserFriends();
    this.props.getLocalUserGroups().then((res) => {
      this.props.setCommonChatConversation();
    });
  };

  //Set Friend's typing status with socket event
  setFriendsTypingStatus(message) {
    const {userFriends} = this.props;
    if (message.text.data.type === SocketEvents.FRIEND_TYPING_MESSAGE) {
      var user = getLocalUserFriend(
        message.text.data.message_details.sender_user_id,
      );
      if (user && user.length > 0) {
        if (message.text.data.message_details.status === 'typing') {
          updateFriendTypingStatus(
            message.text.data.message_details.sender_user_id,
            true,
          );
        } else {
          updateFriendTypingStatus(
            message.text.data.message_details.sender_user_id,
            false,
          );
        }
        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
      }
    }
  }

  //Read Friend's all messages with socket event
  readAllMessageFriendChat(message) {
    const {userFriends, currentFriend} = this.props;
    let detail = message.text.data.message_details;
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_FRIEND_CHAT) {
      let unread_counts = 0;
      var user = getLocalUserFriend(
        message.text.data.message_details.friend_id,
      );
      if (
        this.props.currentRouteName == 'FriendChats' &&
        currentFriend.friend === message.text.data.message_details.friend_id &&
        currentFriend.user_id === message.text.data.message_details.read_by
      ) {
        updateAllFriendMessageRead(currentFriend.friend);
        this.getLocalFriendConversation();
      }
      if (user && user.length > 0) {

        let array = this.props.acceptedRequest;
        const index = array.indexOf(user.user_id);
        if (index > -1) {
          array.splice(index, 1);
        }
        this.props.setAcceptedRequest(array);

        if (
          user[0].friend == detail.friend_id &&
          detail.read_by === this.props.userData.id
        ) {
          // userFriends[i].unread_msg =
          //   message.text.data.message_details.read_count;

          // unread_counts =
          //   unread_counts + message.text.data.message_details.read_count;

          updateFriendsUnReadCount(detail.friend_id, 0);

          this.props.updateUnreadFriendMsgsCounts(unread_counts);

          // this.props.getMissedSocketEventsById(
          //   message.text.data.socket_event_id,
          // );
          // this.getUserFriends();
          this.props.setUserFriends().then((res) => {
            this.props.setCommonChatConversation();
          });
        }
      }
    }
  }

  readAllMessageChannelChat(message) {
    const {followingChannels} = this.props;
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_CHANNEL_CHAT) {
      var channel = getChannelsById(
        message.text.data.message_details.channel_id,
      );
      if (channel && channel.length > 0) {
        // followingChannels[i].unread_msg =
        //   message.text.data.message_details.read_count;
        updateChannelUnReadCountById(
          message.text.data.message_details.channel_id,
          0,
        );
        // this.props.getMissedSocketEventsById(
        //   message.text.data.socket_event_id,
        // );
        // this.getFollowingChannels();
        this.props.getLocalFollowingChannels().then((res) => {
          this.props.setCommonChatConversation();
        });
      }
    }
  }

  readAllMessageChannelSubChat(message) {
    const {followingChannels, currentChannel} = this.props;
    if (
      message.text.data.type === SocketEvents.READ_ALL_MESSAGE_CHANNEL_SUBCHAT
    ) {
      var channel = getChannelsById(
        message.text.data.message_details.channel_id,
      );
      if (channel && channel.length > 0) {
        updateReadByChannelId(message.text.data.message_details.channel_id, 0);
        this.props.getLocalFollowingChannels().then((res) => {
          this.props.setCommonChatConversation();
        });

        if (
          this.props.currentRouteName == 'ChannelChats' &&
          currentChannel &&
          message.text.data.message_details.channel_id == currentChannel.id
        ) {
          this.getLocalChannelConversations();
        }
      }
    }
  }

  //Mark as Read Group Chat
  readAllMessageGroupChat(message) {
    const {userGroups} = this.props;
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_GROUP_CHAT) {
      let unread_counts = 0;
      var result = getGroupsById(message.text.data.message_details.group_id);
      let a = Array.from(result);
      let group = realmToPlainObject(a);
      // let group = result.toJSON();
      if (group && group.length > 0) {
        // userGroups[i].unread_msg =
        //   message.text.data.message_details.read_count;

        // unread_counts =
        //   unread_counts + message.text.data.message_details.read_count;

        updateUnReadCount(message.text.data.message_details.group_id, 0);

        this.props.updateUnreadGroupMsgsCounts(unread_counts);

        // this.props.getMissedSocketEventsById(
        //   message.text.data.socket_event_id,
        // );
        this.props.getLocalUserGroups().then((res) => {
          this.props.setCommonChatConversation();
        });
        // this.getUserGroups();
      }
    }
  }

  //Friend is Typing
  friendIsTyping(message) {
    const {userFriends} = this.props;
    if (message.text.data.message_details.type === 'personal') {
      for (var i in userFriends) {
        if (
          userFriends[i].user_id ==
            message.text.data.message_details.sender_user_id &&
          this.props.userData.id ==
            message.text.data.message_details.receiver_user_id
        ) {
          if (message.text.data.message_details.status === 'typing') {
            userFriends[i].is_typing = true;
          } else {
            userFriends[i].is_typing = false;
          }
          break;
        }
      }
    } else {
      for (var i in userFriends) {
        userFriends[i].is_typing = false;
      }
    }
  }

  //New Message in Group
  onNewMessageInGroup(message) {
    const {userGroups, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.NEW_MESSAGE_IN_GROUP) {
      console.log(
        'onNewMessageInGroup -> message.text.data.message_details',
        message.text.data.message_details,
      );
      var result = getGroupsById(message.text.data.message_details.group_id);
      let a = Array.from(result);
      let group = realmToPlainObject(a);
      // let group = result.toJSON();
      if (group && group.length > 0) {
        // this.getUserGroups();

        var item = message.text.data.message_details.unread_msg.filter(
          (item) => {
            return item.user__id === this.props.userData.id;
          },
        );

        let unreadCount = item.length > 0 ? item[0].unread_count : 0;

        setGroupChatConversation([message.text.data.message_details]);
        if (
            (this.props.currentRouteName == 'GroupChats' || this.props.currentRouteName == 'GroupDetails') &&
          currentGroup &&
          message.text.data.message_details.group_id == currentGroup.group_id
        ) {
          this.getLocalGroupConversation();
          this.markGroupMsgsRead();
          unreadCount = 0;
          this.SingleSocket.sendMessage(
            JSON.stringify({
              type: SocketEvents.UPDATE_READ_COUNT_IN_GROUP,
              data: {
                group_id: this.props.currentGroup.group_id,
              },
            }),
          );
        }

        if (message.text.data.message_details.message_body.type !== 'update') {
          updateLastMsgGroups(
            message.text.data.message_details.group_id,
            message.text.data.message_details,
            unreadCount,
          );
        } else {
          updateLastMsgTimestamp(
            message.text.data.message_details.group_id,
            message.text.data.message_details.timestamp,
            unreadCount,
          );
        }

        // updateGroup(message.text.data.message_details).then(() => {
        //   console.log('onNewMessageInGroup -> updateGroup');
        this.props.getLocalUserGroups().then((res) => {
          this.props.setCommonChatConversation();
        });
        // });
      }
    }
  }

  editMessageFromGroup(message) {
    const {userGroups, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.MESSAGE_EDIT_FROM_GROUP) {
      var result = getGroupsById(message.text.data.message_details.group_id);
      let a = Array.from(result);
      let group = realmToPlainObject(a);
      // let group = result.toJSON();
      if (group && group.length > 0) {
        updateGroupMessageById(message.text.data.message_details.msg_id);
        console.log('checking group', group);
        if (group[0].last_msg_id == message.text.data.message_details.msg_id) {
          updateLastMsgGroups(
            message.text.data.message_details.group_id,
            message.text.data.message_details,
            group[0].unread_msg,
          );
        }
        this.props.getLocalUserGroups().then((res) => {
          this.props.setCommonChatConversation();
        });
      }
      if (
        this.props.currentRouteName == 'GroupChats' &&
        currentGroup &&
        message.text.data.message_details.group_id == currentGroup.group_id
      ) {
        updateGroupMessageById(
          message.text.data.message_details.msg_id,
          message.text.data.message_details.message_body,
        );
        this.getLocalGroupConversation();
      }
    }
  }

  UnsentMessageFromGroup(message) {
    const {userGroups, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.UNSENT_MESSAGE_FROM_GROUP) {
      var result = getGroupsById(message.text.data.message_details.group_id);
      let a = Array.from(result);
      let group = realmToPlainObject(a);
      // let group = result.toJSON();
      if (group && group.length > 0) {
        setGroupMessageUnsend(message.text.data.message_details.msg_id);
        if (group[0].last_msg_id == message.text.data.message_details.msg_id) {
          setGroupLastMessageUnsend(message.text.data.message_details.group_id);
        }
        this.props.getLocalUserGroups().then((res) => {
          this.props.setCommonChatConversation();
        });
      }
      if (
        this.props.currentRouteName == 'GroupChats' &&
        currentGroup &&
        message.text.data.message_details.group_id == currentGroup.group_id
      ) {
        this.getLocalGroupConversation();
      }
    }
  }

  //Update group count
  onUpdateGroupReadCount(message) {
    console.log('onUpdateGroupReadCount -> onUpdateGroupReadCount');
    const {currentGroup} = this.props;
    let detail = message.text.data.message_details;
    if (message.text.data.type === SocketEvents.UPDATE_READ_COUNT_IN_GROUP) {
      if (
        this.props.currentRouteName == 'GroupChats' &&
        currentGroup.group_id === detail.group_id
      ) {
        const messageids = detail.message_ids;

        const message_ids = Object.entries(messageids);

        for (const value of message_ids) {
          updateGroupnReadCount(parseInt(value[0]), parseInt(value[1]));
        }
        this.getLocalGroupConversation();
      }
    }
  }

  //Message in Following Channel
  messageInFollowingChannel(message) {
    const {userData, followingChannels, currentChannel} = this.props;
    console.log('message_data', JSON.stringify(message));
    if (message.text.data.type === SocketEvents.MESSAGE_IN_FOLLOWING_CHANNEL) {
      var channel = getChannelsById(message.text.data.message_details.channel);
      if (channel && channel.length > 0) {
        if (
          message.text.data.message_details.to_user != null &&
          message.text.data.message_details.to_user.id == userData.id
        ) {
          // this.getFollowingChannels();
          var result = getChannelsById(
            message.text.data.message_details.channel,
          );

          var channels = [];

          result.map((item) => {
            channels.push(item);
          });
          setChannelChatConversation([message.text.data.message_details]);
          if (
            this.props.currentRouteName == 'ChannelChats' &&
            currentChannel &&
            message.text.data.message_details.channel == currentChannel.id
          ) {
            this.getLocalChannelConversations();
            updateChannelLastMsg(
              message.text.data.message_details.channel,
              message.text.data.message_details,
              channels[0].unread_msg,
            );
            this.markChannelMsgsRead();
          } else {
            updateChannelLastMsg(
              message.text.data.message_details.channel,
              message.text.data.message_details,
              channels[0].unread_msg + 1,
            );
          }
          this.props.getLocalFollowingChannels().then((res) => {
            this.props.setCommonChatConversation();
          });
        } else if (
          message.text.data.message_details.from_user.id == userData.id
        ) {
          // this.getFollowingChannels();
          var result = getChannelsById(
            message.text.data.message_details.channel,
          );

          var channels = [];

          result.map((item) => {
            channels.push(item);
          });
          setChannelChatConversation([message.text.data.message_details]);
          updateChannelLastMsg(
            message.text.data.message_details.channel,
            message.text.data.message_details,
            channels[0].unread_msg,
          );
          this.props.getLocalFollowingChannels().then((res) => {
            this.props.setCommonChatConversation();
          });

          if (
            this.props.currentRouteName == 'ChannelChats' &&
            currentChannel &&
            message.text.data.message_details.channel == currentChannel.id
          ) {
            this.getLocalChannelConversations();
          }
        }
      }
    }
  }

  //Multiple Message in Following Channel
  multipleMessageInFollowingChannel(message) {
    const {userData, followingChannels, currentChannel} = this.props;
    console.log('message_data', JSON.stringify(message));
    if (
      message.text.data.type ===
        SocketEvents.MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL &&
      message.text.data.message_details.length > 0
    ) {
      var channelUpdated = getChannelsById(
        message.text.data.message_details[
          message.text.data.message_details.length - 1
        ].channel,
      );
      if (
        channelUpdated[0].last_msg &&
        message.text.data.message_details[
          message.text.data.message_details.length - 1
        ].id === channelUpdated[0].last_msg.id
      ) {
        return;
      }
      for (let item of message.text.data.message_details) {
        var channel = getChannelsById(item.channel);
        if (channel && channel.length > 0) {
          var result = getChannelsById(item.channel);
          var channels = [];
          result.map((item) => {
            channels.push(item);
          });
          setChannelChatConversation([item]);
          updateChannelLastMsg(item.channel, item, channels[0].unread_msg + 1);
        }
        if (
          this.props.currentRouteName == 'ChannelChats' &&
          currentChannel &&
          item.channel == currentChannel.id
        ) {
          this.getLocalChannelConversations();
        }
      }
      this.props.getLocalFollowingChannels().then(() => {
        this.props.setCommonChatConversation();
      });
    }
  }

  messageUpdateInFollowingChannel(message) {
    const {userData, followingChannels, currentChannel} = this.props;
    if (
      message.text.data.type ===
      SocketEvents.MESSAGE_EDITED_IN_FOLLOWING_CHANNEL
    ) {
      var channel = getChannelsById(message.text.data.message_details.channel);
      if (channel && channel.length > 0) {
        var result = getChannelsById(message.text.data.message_details.channel);
        var channels = [];
        result.map((item) => {
          channels.push(item);
        });
        updateMessageById(
          message.text.data.message_details.id,
          message.text.data.message_details.message_body,
        );
        if (channels[0].last_msg.id == message.text.data.message_details.id) {
          updateChannelLastMsgWithOutCount(
            message.text.data.message_details.channel,
            message.text.data.message_details,
          );
        }
        this.props.getLocalFollowingChannels().then(() => {
          this.props.setCommonChatConversation();
        });
      }
      if (
        this.props.currentRouteName == 'ChannelChats' &&
        currentChannel &&
        message.text.data.message_details.channel == currentChannel.id
      ) {
        let editMessageId = message.text.data.message_details.id;
        let msgText = message.text.data.message_details.message_body;
        let msgType = message.text.data.message_details.msg_type;
        updateMessageById(editMessageId, msgText, msgType);
        this.getLocalChannelConversations();
      }
    }
  }

  messageDeleteInFollowingChannel(message) {
    const {userData, followingChannels, currentChannel} = this.props;
    if (
      message.text.data.type ===
      SocketEvents.DELETE_MESSAGE_IN_FOLLOWING_CHANNEL
    ) {
      var result = getChannelsById(message.text.data.message_details.channel);
      var channels = [];
      result.map((item) => {
        channels.push(item);
      });
      deleteMessageById(message.text.data.message_details.id);
      if (channels[0].last_msg.id == message.text.data.message_details.id) {
        var chats = getChannelChatConversationById(
          message.text.data.message_details.channel,
        );
        var array = [];
        for (let chat of chats) {
          array = [...array, chat];
        }
        console.log('updated_last_messgae', JSON.stringify(array[0]));
        updateChannelLastMsgWithOutCount(
          message.text.data.message_details.channel,
          array[0],
        );
      }
      this.props.getLocalFollowingChannels().then(() => {
        this.props.setCommonChatConversation();
      });
    }

    if (
      currentChannel &&
      message.text.data.message_details.channel == currentChannel.id
    ) {
      let chat = getChannelChatConversationById(currentChannel.id);
      this.props.setChannelConversation(chat);
    }
  }

  multipleMessageDeleteInFollowingChannel(message) {
    const {userData, followingChannels, currentChannel} = this.props;
    if (
      message.text.data.type ===
      SocketEvents.DELETE_MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL
    ) {
      message.text.data.message_details.map((item) => {
        if (item.deleted_for.includes(this.props.userData.id)) {
          let result = getChannelsById(item.channel);
          let channels = [];
          let a = Array.from(result);
          channels = realmToPlainObject(a);
          // channels = result.toJSON();
          deleteMessageById(item.id);
          if (channels[0].last_msg && channels[0].last_msg.id == item.id) {
            var chats = getChannelChatConversationById(item.channel);
            var array = [];
            array = realmToPlainObject(chats);
            // array = chats.toJSON();

            if (array.length > 0) {
              updateChannelLastMsgWithOutCount(item.channel, array[0]);
            } else {
              updateChannelLastMsgWithOutCount(item.channel, null);
            }

            this.props.getLocalFollowingChannels().then(() => {
              this.props.setCommonChatConversation();
            });
          }
          if (currentChannel && item.channel == currentChannel.id) {
            let chat = getChannelChatConversationById(currentChannel.id);
            let conversations = realmToPlainObject(chat);
            // this.props.setChannelConversation(chat.toJSON());
            this.props.setChannelConversation(conversations);
          }
        }
      });
    }
  }

  messageUnsentInFollowingChannel(message) {
    const {userData, followingChannels, currentChannel} = this.props;
    if (
      message.text.data.type ===
      SocketEvents.UNSENT_MESSAGE_IN_FOLLOWING_CHANNEL
    ) {
      var result = getChannelsById(message.text.data.message_details.channel);
      var channels = [];
      result.map((item) => {
        channels.push(item);
      });
      setMessageUnsend(message.text.data.message_details.id);
      if (channels[0].last_msg.id == message.text.data.message_details.id) {
        var chats = getChannelChatConversationById(
          message.text.data.message_details.channel,
        );
        var array = [];
        for (let chat of chats) {
          array = [...array, chat];
        }
        updateChannelLastMsgWithOutCount(
          message.text.data.message_details.channel,
          array[0],
        );
      }
      this.props.getLocalFollowingChannels().then(() => {
        this.props.setCommonChatConversation();
      });
      if (
        this.props.currentRouteName == 'ChannelChats' &&
        currentChannel &&
        message.text.data.message_details.channel == currentChannel.id
      ) {
        this.getLocalChannelConversations();
      }
    }
  }

  onAddChannelMemmber(message) {
    if (message.text.data.type === SocketEvents.ADD_CHANNEL_MEMBER) {
      setChannels([message.text.data.message_details]);
      // updateChannelUnReadCountById(message.text.data.message_details.id, 1);

      let array = this.props.trendTimline;
      this.props.trendTimline.map((item, index)=>{
        if(item.channel_id === message.text.data.message_details.id){
          let changeItem = item;
          changeItem.is_following = true;
          array.splice(index,1,changeItem);
          return;
        }
      });

      this.props.updateTrendTimeline(array);

      this.props.getLocalFollowingChannels().then((res) => {
        this.props.setCommonChatConversation();
      });
    }
  }

  createNewChannel(message) {
    if (message.text.data.type === SocketEvents.CREATE_NEW_CHANNEL) {
      setChannels([message.text.data.message_details]);
      // updateChannelUnReadCountById(message.text.data.message_details.id, 1);
      this.props.getLocalFollowingChannels().then((res) => {
        this.props.setCommonChatConversation();
      });
    }
  }

  //On Remove Channel Member
  onRemoveChannelMember(message) {
    if (
      message.text.data.type === SocketEvents.REMOVE_CHANNEL_MEMBER &&
      message.text.data.message_details.user_id === this.props.userData.id
    ) {
      deleteChannelById(message.text.data.message_details.channel_id);
      deleteChannelConversationById(
        message.text.data.message_details.channel_id,
      );
      this.props.getLocalFollowingChannels().then((res) => {
        this.props.setCommonChatConversation();
      });

      let array = this.props.trendTimline;
      this.props.trendTimline.map((item, index)=>{
        if(item.channel_id === message.text.data.message_details.channel_id){
          let changeItem = item;
          changeItem.is_following = false;
          array.splice(index,1,changeItem);
          return;
        }
      });

      this.props.updateTrendTimeline(array);

      // for (var i in this.props.followingChannels) {
      //   if (message.text.data.message_details.channel_id === i.id) {
      //     alert('channel unfollowed');
      //     break;
      //   }
      // }
    }
  }

  onChannelMemberRemoveCount(message) {
    if (
      message.text.data.type ===
        SocketEvents.MEMBER_REMOVED_FROM_CHANNEL_COUNT &&
      message.text.data.message_details.user_id === this.props.userData.id
    ) {
      updateChannelTotalMember(message.text.data.message_details.channel_id);
      this.props.getLocalFollowingChannels().then(() => {
        this.props.setCommonChatConversation();
      });
    }
  }

  //New Message in Friend
  onNewMessageInFriend(message) {
    const {userFriends, currentFriend, userData} = this.props;

    if (message.text.data.type === SocketEvents.NEW_MESSAGE_IN_FREIND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getUserFriends();
        setFriendChatConversation([message.text.data.message_details]);
        updateFriendLastMsg(
          message.text.data.message_details.to_user.id,
          message.text.data.message_details,
          false,
        );
        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
        if (
          (this.props.currentRouteName == 'FriendChats' || this.props.currentRouteName == 'FriendNotes')  &&
          currentFriend &&
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          this.getLocalFriendConversation();
          this.markFriendMsgsRead();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        setFriendChatConversation([message.text.data.message_details]);

        if (
          (this.props.currentRouteName == 'FriendChats' || this.props.currentRouteName == 'FriendNotes') &&
          currentFriend &&
          message.text.data.message_details.from_user.id ==
            currentFriend.user_id
        ) {
          this.getLocalFriendConversation();
          updateFriendLastMsg(
            message.text.data.message_details.from_user.id,
            message.text.data.message_details,
            false,
          );
          this.markFriendMsgsRead();
        } else {
          updateFriendLastMsg(
            message.text.data.message_details.from_user.id,
            message.text.data.message_details,
            true,
          );
        }
        // this.getUserFriends();
        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
      }
    }
  }

  onFriendDisplayNameUpdate = (message) => {
    const {userFriends, currentFriend, userData} = this.props;
    if (message.text.data.type === SocketEvents.FRIEND_DISPLAY_NAME_DATA) {
      var user = getUserFriend(message.text.data.message_details.friend_id);
      if (user && user.length > 0) {
        updateFriendDisplayName(
          user[0].user_id,
          message.text.data.message_details,
        );
        this.props.getUserFriends().then((res) => {
          this.setCommonConversation();
        });
      }
      if (
        currentFriend.friend === message.text.data.message_details.friend_id
      ) {
        console.log('message.text.data.message_details', message.text.data.message_details)
        this.props.updateCurrentFriendDisplayName(
          message.text.data.message_details,
        );
      }
    }
  };

  getLocalFriendConversation = () => {
    let chat = getFriendChatConversationById(this.props.currentFriend.friend);
    if (chat.length) {
      let conversations = [];
      conversations = realmToPlainObject(chat);
      // conversations = chat.toJSON();
      // chat.map((item, index) => {
      //   let i = {
      //     created: item.created,
      //     deleted_for: item.deleted_for,
      //     friend: item.friend,
      //     from_user: item.from_user,
      //     id: item.id,
      //     is_edited: item.is_edited,
      //     is_read: item.is_read,
      //     is_unsent: item.is_unsent,
      //     local_id: item.local_id,
      //     message_body: item.message_body,
      //     msg_type: item.msg_type,
      //     reply_to: item.reply_to,
      //     thumbnail: item.thumbnail,
      //     to_user: item.to_user,
      //     updated: item.updated,
      //   };
      //   conversations = [...conversations, i];
      // });
      this.props.setFriendConversation(conversations);
    }
  };

  //Edit Message in Friend
  onEditMessageInFriend(message) {
    const {userFriends, currentFriend, userData} = this.props;

    if (message.text.data.message_details.from_user.id == userData.id) {
      // this.getUserFriends();
      let editMessageId = message.text.data.message_details.id;
      let newMessageText = message.text.data.message_details.message_body;
      let messageType = message.text.data.message_details.msg_type;
      updateFriendMessageById(editMessageId, newMessageText, messageType);
      if (
        this.props.currentRouteName == 'FriendChats' &&
        currentFriend &&
        message.text.data.message_details.to_user.id == currentFriend.user_id
      ) {
        this.getLocalFriendConversation();
      }
      var users = getLocalUserFriend(
        message.text.data.message_details.to_user.id,
      );

      var array = [];

      for (let u of users) {
        array = [...array, u];
      }

      if (
        array.length > 0 &&
        array[0].last_msg_id == message.text.data.message_details.id
      ) {
        updateFriendLastMsgWithoutCount(
          message.text.data.message_details.to_user.id,
          message.text.data.message_details,
        );
        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
      }
    } else if (message.text.data.message_details.to_user.id == userData.id) {
      let editMessageId = message.text.data.message_details.id;
      let newMessageText = message.text.data.message_details.message_body;
      let messageType = message.text.data.message_details.msg_type;
      updateFriendMessageById(editMessageId, newMessageText, messageType);
      if (
        this.props.currentRouteName == 'FriendChats' &&
        currentFriend &&
        message.text.data.message_details.from_user.id == currentFriend.user_id
      ) {
        this.getLocalFriendConversation();
      }
      var users = getLocalUserFriend(
        message.text.data.message_details.from_user.id,
      );

      var array = [];

      for (let u of users) {
        array = [...array, u];
      }

      if (
        array.length > 0 &&
        array[0].last_msg_id == message.text.data.message_details.id
      ) {
        updateFriendLastMsgWithoutCount(
          message.text.data.message_details.from_user.id,
          message.text.data.message_details,
        );
        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
      }
    }
  }

  onDeleteMessageInFriend(message) {
    const {userFriends, currentFriend, userData} = this.props;
    if (message.text.data.type === SocketEvents.DELETE_MESSAGE_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // var users = getLocalUserFriend(
        //   message.text.data.message_details.to_user.id,
        // );
        // var array = [];
        // for (let u of users) {
        //   array = [...array, u];
        // }
        // deleteFriendMessageById(message.text.data.message_details.id);
        // if (array[0].last_msg.id == message.text.data.message_details.id) {
        //   var chats = getFriendChatConversationById(
        //     message.text.data.message_details.channel,
        //   );
        //   var array = [];
        //   for (let chat of chats) {
        //     array = [...array, chat];
        //   }
        //   console.log('updated_last_messgae', JSON.stringify(array[0]));
        //   updateFriendLastMsgWithoutCount(
        //     message.text.data.message_details.to_user.id,
        //     message.text.data.message_details,
        //   );
        // }

        if (
          this.props.currentRouteName == 'FriendChats' &&
          currentFriend &&
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          deleteFriendMessageById(message.text.data.message_details.id);
          this.getLocalFriendConversation();
        }
        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        // var users = getLocalUserFriend(
        //   message.text.data.message_details.from_user.id,
        // );
        // var array = [];
        // for (let u of users) {
        //   array = [...array, u];
        // }
        // deleteFriendMessageById(message.text.data.message_details.id);
        // if (array[0].last_msg.id == message.text.data.message_details.id) {
        //   var chats = getFriendChatConversationById(
        //     message.text.data.message_details.channel,
        //   );
        //   var array = [];
        //   for (let chat of chats) {
        //     array = [...array, chat];
        //   }
        //   console.log('updated_last_messgae', JSON.stringify(array[0]));
        //   updateFriendLastMsgWithoutCount(
        //     message.text.data.message_details.from_user.id,
        //     message.text.data.message_details,
        //   );
        // }

        if (
          this.props.currentRouteName == 'FriendChats' &&
          currentFriend &&
          message.text.data.message_details.from_user.id ==
            currentFriend.user_id
        ) {
          deleteFriendMessageById(message.text.data.message_details.id);
          this.getLocalFriendConversation();
        }

        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
      }
    }
  }

  onDeleteMultipleMessageInFriend(message) {
    const {userFriends, currentFriend, userData} = this.props;
    if (
      message.text.data.type === SocketEvents.DELETE_MULTIPLE_MESSAGE_IN_FRIEND
    ) {
      message.text.data.message_details.map((item) => {
        if (item.deleted_for.includes(userData.id)) {
          deleteFriendMessageById(item.id);

          var user_id;
          if (item.from_user.id == userData.id) {
            user_id = item.to_user.id;
          } else if (item.to_user.id == userData.id) {
            user_id = item.from_user.id;
          }

          users = getLocalUserFriend(user_id);
          var array = [];
          array = realmToPlainObject(users);
          // array = users.toJSON();
          if (array[0].last_msg_id == item.id) {
            var chats = getFriendChatConversationById(item.friend);
            var chats_array = [];
            chats_array = realmToPlainObject(chats);
            // chats_array = chats.toJSON();
            if (chats_array.length > 0) {
              updateFriendLastMsgWithoutCount(user_id, chats_array[0]);
            } else {
              updateFriendLastMsgWithoutCount(user_id, null);
            }
            this.props.setUserFriends().then((res) => {
              this.props.setCommonChatConversation();
            });
          }
          if (this.props.currentRouteName == 'FriendChats' && currentFriend) {
            this.getLocalFriendConversation();
          }
        }
      });
    }
  }

  //Unsent message on friend
  onUnsentMessageInFriend(message) {
    const {userFriends, currentFriend, userData} = this.props;

    if (message.text.data.type === SocketEvents.UNSENT_MESSAGE_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getUserFriends();
        setFriendMessageUnsend(message.text.data.message_details.id);
        var users = getLocalUserFriend(
          message.text.data.message_details.to_user.id,
        );
        var array = [];
        for (let u of users) {
          array = [...array, u];
        }
        if (array[0].last_msg_id == message.text.data.message_details.id) {
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.to_user.id,
            message.text.data.message_details,
          );
        }
        if (
          this.props.currentRouteName == 'FriendChats' &&
          currentFriend &&
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          this.getLocalFriendConversation();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        setFriendMessageUnsend(message.text.data.message_details.id);
        var users = getLocalUserFriend(
          message.text.data.message_details.from_user.id,
        );
        var array = [];
        for (let u of users) {
          array = [...array, u];
        }

        if (array[0].last_msg_id == message.text.data.message_details.id) {
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.from_user.id,
            message.text.data.message_details,
          );
        }

        if (
          this.props.currentRouteName == 'FriendChats' &&
          currentFriend &&
          message.text.data.message_details.from_user.id ==
            currentFriend.user_id
        ) {
          this.getLocalFriendConversation();
        }
      }
      this.props.setUserFriends().then(() => {
        this.props.setCommonChatConversation();
      });
    }
  }

  unFriendUser = (message) => {
    const {currentFriend} = this.props;
    if (message) {
      // removeUserFriends(message.text.data.message_details.user_id);
      updateFriendStatus(message.text.data.message_details.user_id,message.text.data.message_details.status);
      this.props.setUserFriends().then((res) => {
        this.props.setCommonChatConversation();
      });
      if (
        this.props.currentRouteName == 'FriendChats' &&
        currentFriend &&
        message.text.data.message_details.user_id == currentFriend.user_id
      ) {
      }
    }
  };

  updateFriendStatus = (message) => {
    const {currentFriend} = this.props;
    if (message) {
      updateFriendStatus(
        message.text.data.message_details.user_id,
        message.text.data.message_details.status,
      );
      this.props.setUserFriends().then(() => {
        this.props.setCommonChatConversation();
      });
      if (
        this.props.currentRouteName == 'FriendChats' &&
        currentFriend &&
        message.text.data.message_details.user_id == currentFriend.user_id
      ) {
        let user = getLocalUserFriend(
          message.text.data.message_details.user_id,
        );
        let users = realmToPlainObject(user);
        if (users.length > 0) {
          let item = users[0];
          this.props.setCurrentFriend(item);
        }
      }
    }
  };

  deleteFriendObject = (message) => {
    const {currentFriend} = this.props;
    if (message) {
      removeUserFriends(message.text.data.message_details.user_id);
      this.props.setUserFriends().then((res) => {
        this.props.setCommonChatConversation();
      });
      if (
        this.props.currentRouteName == 'FriendChats' &&
        currentFriend &&
        message.text.data.message_details.user_id == currentFriend.user_id
      ) {
      }
    }
  };

  onDeleteMessageInGroup(message) {
    const {userGroups, userData, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.DELETE_MESSAGE_IN_GROUP) {
      deleteGroupMessageById(message.text.data.message_details.msg_id);
      var result = getGroupsById(message.text.data.message_details.group_id);
      let group = realmToPlainObject(result);
      // let group = result.toJSON();
      if (group && group.length > 0) {
        let chat = getGroupChatConversationById(
          message.text.data.message_details.group_id,
        );

        let array = realmToPlainObject(chat);
        // let array = chat.toJSON();

        if (array && array.length > 0) {
          updateLastMsgGroupsWithoutCount(
            message.text.data.message_details.group_id,
            array[0].message_body.type,
            array[0].message_body.text,
            array[0].msg_id,
            array[0].timestamp,
          );
          this.props.getLocalUserGroups().then((res) => {
            this.props.setCommonChatConversation();
          });
        }
      }

      if (
        this.props.currentRouteName == 'GroupChats' &&
        currentGroup &&
        message.text.data.message_details.group_id == currentGroup.group_id
      ) {
        this.getLocalGroupConversation();
      }
    }
  }

  onDeleteMultipleMessageInGroup(message) {
    const {userGroups, userData, currentGroup} = this.props;
    if (
      message.text.data.type === SocketEvents.DELETE_MULTIPLE_MESSAGE_IN_GROUP
    ) {
      message.text.data.message_details.map((item) => {
        deleteGroupMessageById(item.msg_id);

        var result = getGroupsById(item.group_id);
        let group = realmToPlainObject(result);
        // let group = result.toJSON();

        if (group && group.length > 0) {
          let chat = getGroupChatConversationById(item.group_id);
          let array = realmToPlainObject(chat);
          // let array = chat.toJSON();

          if (group[0].last_msg_id == item.msg_id) {
            if (array && array.length > 0) {
              updateLastMsgGroupsWithoutCount(
                item.group_id,
                array[0].message_body && array[0].message_body.type
                  ? array[0].message_body.type
                  : array[0].message_body,
                array[0].message_body && array[0].message_body.text
                  ? array[0].message_body.text
                  : array[0].message_body,
                array[0].msg_id,
                array[0].timestamp,
              );
            } else {
              updateLastMsgGroupsWithoutCount(
                item.group_id,
                null,
                null,
                null,
                group[0].timestamp,
                true
              );
            }
            this.props.getLocalUserGroups().then((res) => {
              this.props.setCommonChatConversation();
            });
          }
        }

        if (
          this.props.currentRouteName == 'GroupChats' &&
          currentGroup &&
          item.group_id == currentGroup.group_id
        ) {
          this.getLocalGroupConversation();
        }
      });
    }
  }

  onCreateNewGroup(message) {
    const {userGroups, userData} = this.props;
    if (message.text.data.type === SocketEvents.CREATE_NEW_GROUP) {
      for (let id of message.text.data.message_details.members) {
        if (id == userData.id) {
          var item = message.text.data.message_details;
            let lastMsg = {text: '', type: 'text'}
          var group = {
            group_id: item.id,
            group_name: item.name,
            unread_msg: 0,
            total_members: item.members.length,
            description: item.description,
            chat: 'group',
            group_picture: item.group_picture,
            last_msg: lastMsg,
            last_msg_id: '',
            timestamp: item.timestamp,
            joining_date: item.timestamp,
            event: `group_${item.id}`,
            no_msgs: true,
            is_pined: false,
            sender_id: null,
            sender_username: null,
            sender_display_name: null,
            mentions: [],
            reply_to: null,
          };
          setGroups([group]).then(() => {
            this.props.getLocalUserGroups().then((res) => {
              this.props.setCommonChatConversation();
            });
          });
          break;
        }
      }
    }
  }

  onDeleteGroup(message) {
    const {userGroups, userData, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.DELETE_GROUP) {
      var result = getGroupsById(message.text.data.message_details.group_id);
      let group = realmToPlainObject(result);
      // let group = result.toJSON();
      if (group && group.length > 0) {
        if (
          this.props.currentRouteName == 'GroupChats' &&
          currentGroup &&
          message.text.data.message_details.group_id == currentGroup.group_id
        ) {
          NavigationService.pop();
          this.props.setCurrentGroup(null);
          this.props.setGroupConversation([]);
        }

        deleteGroupById(message.text.data.message_details.group_id);
        deleteAllGroupMessageByGroupId(
          message.text.data.message_details.group_id,
        );
        this.props.getLocalUserGroups().then((res) => {
          console.log('local groups update');
          this.props.setCommonChatConversation();
        });
      }
    }
  }

  onAddGroupMember(message) {
    const {userGroups, userData, currentGroup} = this.props;
    console.log('message_Details', JSON.stringify(message));
    if (message.text.data.type === SocketEvents.ADD_GROUP_MEMBER) {
      for (let i of message.text.data.message_details.members_data) {
        if (i.id == userData.id) {
          setGroups([message.text.data.message_details.group_data]);
          this.props.getLocalUserGroups().then((res) => {
            this.props.setCommonChatConversation();
          });
          break;
        }
      }
    }
    if (
      (this.props.currentRouteName == 'GroupChats' ||
        this.props.currentRouteName == 'GroupDetails') &&
      currentGroup &&
      message.text.data.message_details.group_id == currentGroup.group_id
    ) {
      this.getGroupDetail();
      this.getGroupMembers();
    }
  }

  onMuteGroup(message) {
    const {userGroups, userData, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.MUTE_GROUP) {
      var result = getGroupsById(message.text.data.message_details.group_id);
      let group = realmToPlainObject(result);
      // let group = result.toJSON();
      if (group && group.length > 0) {
        if (userData.id === message.text.data.message_details.user_id) {
          removeGroupById(message.text.data.message_details.group_id);
          // deleteGroupById(message.text.data.message_details.group_id);
          // deleteAllGroupMessageByGroupId(
          //   message.text.data.message_details.group_id,
          // );
          // this.props.getLocalUserGroups().then((res) => {
          //   this.props.setCommonChatConversation();
          // });
        }
      }
    }
    if (
      (this.props.currentRouteName == 'GroupChats' ||
        this.props.currentRouteName == 'GroupDetails') &&
      currentGroup &&
      message.text.data.message_details.group_id == currentGroup.group_id
    ) {
      this.getGroupDetail();
      this.getGroupMembers();
    }
  }

  onRemoveGroupMember(message) {
    const {currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.REMOVE_GROUP_MEMBER) {
      let user_delete = message.text.data.message_details.members_data.filter(
        (item) => item.id === this.props.userData.id,
      );

      let result = getGroupsById(message.text.data.message_details.group_id);
      let group = realmToPlainObject(result);
      // let group = result.toJSON();
      if (group && group.length > 0) {
        if (user_delete.length > 0) {
          removeGroupById(message.text.data.message_details.group_id);
        }

        if (
          (this.props.currentRouteName == 'GroupChats' ||
            this.props.currentRouteName == 'GroupDetails') &&
          currentGroup &&
          message.text.data.message_details.group_id == currentGroup.group_id
        ) {
          this.getGroupDetail();
          this.getGroupMembers();
        }
      }
    }
  }

  onMemberTypeUpdate = (message) => {
    const {userGroups, userData, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.GROUP_MEMBER_TO_ADMIN) {
      for (let i of message.text.data.message_details.members_data) {
        if (i.id == userData.id) {
          if (
            (this.props.currentRouteName == 'GroupChats' ||
              this.props.currentRouteName == 'GroupDetails') &&
            currentGroup &&
            message.text.data.message_details.group_id == currentGroup.group_id
          ) {
            this.getGroupDetail();
            this.getGroupMembers();
          }
        }
      }
    }
  }

  onRemoveGroupFromList = (message) => {
    const {currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.CLEAR_GROUP_CHAT) {
      if (
        message.text.data.message_details.user_id === this.props.userData.id
      ) {
        deleteGroupById(message.text.data.message_details.group_id);
        deleteAllGroupMessageByGroupId(
          message.text.data.message_details.group_id,
        );
        if (
          this.props.currentRouteName == 'GroupChats' &&
          currentGroup &&
          message.text.data.message_details.group_id == currentGroup.group_id
        ) {
          NavigationService.pop();
          this.props.setCurrentGroup(null);
          this.props.setGroupConversation([]);
        }
        this.props.getLocalUserGroups().then((res) => {
          console.log('local groups update');
          this.props.setCommonChatConversation();
        });
      } else {
        if (
          (this.props.currentRouteName == 'GroupChats' ||
            this.props.currentRouteName == 'GroupDetails') &&
          currentGroup &&
          message.text.data.message_details.group_id == currentGroup.group_id
        ) {
          this.getGroupDetail();
          this.getGroupMembers();
        }
      }
    }
  };

  onUpdateGroupDetail(message) {
    const {userGroups, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.EDIT_GROUP_DETAIL) {
      for (let i of userGroups) {
        if (i.group_id === message.text.data.message_details.id) {
          UpdateGroupDetail(
            message.text.data.message_details.id,
            message.text.data.message_details.name,
            message.text.data.message_details.group_picture,
            message.text.data.message_details.members.length,
          );
          this.props.getLocalUserGroups().then((res) => {
            this.props.setCommonChatConversation();
          });
        }
      }
      if (
        currentGroup &&
        message.text.data.message_details.id == currentGroup.group_id
      ) {
        this.getGroupDetail();
      }
    }
  }

  onNewFriendRequest = (message) => {
    const {friendRequest} = this.props;
    if (message.text.data.type === SocketEvents.NEW_FRIEND_REQUEST) {
      setFriendRequests([message.text.data.message_details]);
      this.props.setFriendRequest();
    }
  };

  onAcceptFriendReuqest = (message) => {
    if (message.text.data.type === SocketEvents.FRIEND_REQUEST_ACCEPTED) {
      let messageDetail = message.text.data.message_details
      console.log(
        'messageDetail',
          messageDetail.conversation.requested_from,
      );
      if (
        messageDetail.conversation.requested_from ===
          this.props.userData.username &&
        !messageDetail.invitation
      ) {
        Toast.show({
          title: translate('pages.xchat.friendRequest'),
          text: translate(
            'pages.xchat.toastr.acceptedYourFriendRequest',
          ).replace(
            '[missing {{friend}} value]',
            messageDetail.conversation.display_name,
          ),
          type: 'positive',
        });
      }
      deleteFriendRequest(
        messageDetail.conversation.user_id,
      );
      this.props.setFriendRequest();
      handleRequestAccept(
        messageDetail.conversation,
        messageDetail.invitation,
      );

      let array = this.props.acceptedRequest;

      if(!array.includes()){
        array.push(messageDetail.conversation.user_id);
        this.props.setAcceptedRequest(array);
      }


      this.props.setUserFriends().then(() => {
        this.props.setCommonChatConversation();
      });
      if (this.props.currentRouteName == 'FriendChats' &&
        this.props.currentFriend &&
        messageDetail.conversation.user_id ==
          this.props.currentFriend.user_id) {
          this.setFriendCommonly(this.props.currentFriend.user_id)
          this.showFriendToast(messageDetail.conversation.display_name, messageDetail.is_already_friend)
      }
        if (messageDetail.invitation && this.props.currentRouteName !== 'FriendChats' ){
            this.setFriendCommonly(messageDetail.conversation.user_id)
            this.props.navigation.navigate('FriendChats');
            this.showFriendToast(messageDetail.conversation.display_name, messageDetail.is_already_friend)
        }else if(messageDetail.invitation && this.props.currentRouteName == 'FriendChats' &&
            this.props.currentFriend &&
            messageDetail.conversation.user_id !==
            this.props.currentFriend.user_id){
            NavigationService.popToTop();
            this.setFriendCommonly(messageDetail.conversation.user_id)
            this.props.navigation.navigate('FriendChats');
            this.showFriendToast(messageDetail.conversation.display_name, messageDetail.is_already_friend)
        }
    }
  };

  showFriendToast(displayName, isFriendAlready){
        Toast.show({
            title: translate('pages.xchat.friendRequest'),
            text: isFriendAlready ? translate(
                'pages.xchat.toastr.isAlreadyFriend',
            ).replace('[missing {{friendName}} value]',
                displayName,
            ) : translate(
                'pages.xchat.toastr.youAreNowFriends',
            ).replace('[missing {{ friend }} value]',
                displayName,
            ) ,
            type: 'positive',
        });
  }

  setFriendCommonly(id){
      let user = getLocalUserFriend(id);
      let users = realmToPlainObject(user);
      if (users.length > 0) {
          let item = users[0];
          this.props.setCurrentFriend(item);
      }
  }

  markChannelMsgsRead() {
    this.props.readAllChannelMessages(this.props.currentChannel.id);
  }

  markFriendMsgsRead() {
    this.props.markFriendMsgsRead(this.props.currentFriend.friend);
  }

  markGroupMsgsRead() {
    let data = {group_id: this.props.currentGroup.group_id};
    this.props.markGroupConversationRead(data);
  }

  onNewFriendRequest = (message) => {
    const {friendRequest} = this.props;
    if (message.text.data.type === SocketEvents.NEW_FRIEND_REQUEST) {
      setFriendRequests([message.text.data.message_details]);
      this.props.setFriendRequest();
    }
  };

  // onAcceptFriendReuqest = (message) => {
  //   if (message.text.data.type === SocketEvents.FRIEND_REQUEST_ACCEPTED) {
  //     // if (
  //     //   message.text.data.message_details.conversation.requested_from ===
  //     //   this.props.userData.username
  //     // ) {
  //     //   Toast.show({
  //     //     title: translate('pages.xchat.friendRequest'),
  //     //     text: translate(
  //     //       'pages.xchat.toastr.acceptedYourFriendRequest',
  //     //     ).replace(
  //     //       '[missing {{friend}} value]',
  //     //       message.text.data.message_details.conversation.display_name,
  //     //     ),
  //     //     type: 'positive',
  //     //   });
  //     // }
  //     deleteFriendRequest(
  //       message.text.data.message_details.conversation.user_id,
  //     );
  //     this.props.setFriendRequest();
  //     handleRequestAccept(message.text.data.message_details.conversation);
  //     this.props.setUserFriends().then(() => {
  //       this.props.setCommonChatConversation();
  //     });
  //   }
  // };

  markChannelMsgsRead() {
    this.props.readAllChannelMessages(this.props.currentChannel.id);
  }

  markFriendMsgsRead() {
    this.props.markFriendMsgsRead(this.props.currentFriend.friend);
  }

  markGroupMsgsRead() {
    let data = {group_id: this.props.currentGroup.group_id};
    this.props.markGroupConversationRead(data);
  }

  onPinFriend = (message) => {
    console.log('onPinFriend -> message', message);
    const currentFriend = JSON.parse(JSON.stringify(this.props.currentFriend));
    currentFriend.is_pined = true;
    this.props.setCurrentFriend(currentFriend);
    updateUserFriendsWhenPined(message.text.data.message_details);
    this.props.getUserFriends().then((res) => {
      this.props.setCommonChatConversation();
    });
  };
  onUnpinFriend = (message) => {
    console.log('onUnpinFriend -> message', message);
    const currentFriend = JSON.parse(JSON.stringify(this.props.currentFriend));
    currentFriend.is_pined = false;
    this.props.setCurrentFriend(currentFriend);
    updateUserFriendsWhenUnpined(message.text.data.message_details);
    this.props.getUserFriends().then((res) => {
      this.props.setCommonChatConversation();
    });
  };
  onPinGroup = (message) => {
    console.log('onPinGroup -> message', message);
    const currentGroup = JSON.parse(JSON.stringify(this.props.currentGroup));
    currentGroup.is_pined = true;
    this.props.setCurrentGroup(currentGroup);
    updateGroupsWhenPined(message.text.data.message_details);
    this.props.getLocalUserGroups().then((res) => {
      this.props.setCommonChatConversation();
    });
  };
  onUnpinGroup = (message) => {
    console.log('onUnpinGroup -> message', message);
    const currentGroup = JSON.parse(JSON.stringify(this.props.currentGroup));
    currentGroup.is_pined = false;
    this.props.setCurrentGroup(currentGroup);
    updateGroupsWhenUnpined(message.text.data.message_details);
    this.props.getLocalUserGroups().then((res) => {
      this.props.setCommonChatConversation();
    });
  };
  onPinChannel = (message) => {
    console.log('onPinChannel -> message', message);
    const currentChannel = JSON.parse(
      JSON.stringify(this.props.currentChannel),
    );
    currentChannel.is_pined = true;
    this.props.setCurrentChannel(currentChannel);
    updateChannelsWhenPined(message.text.data.message_details);
    this.props.getLocalFollowingChannels().then((res) => {
      this.props.setCommonChatConversation();
    });
  };
  onUnpinChannel = (message) => {
    console.log('onUnpinChannel -> message', message);
    const currentChannel = JSON.parse(
      JSON.stringify(this.props.currentChannel),
    );
    currentChannel.is_pined = false;
    this.props.setCurrentChannel(currentChannel);
    updateChannelsWhenUnpined(message.text.data.message_details);
    this.props.getLocalFollowingChannels().then((res) => {
      this.props.setCommonChatConversation();
    });
  };

  onUpdateUserTP = (message) => {
    if(message && message.text.data.message_details.user_id==this.props.userData.id){
      console.log('touku points',message.text.data.message_details.wallet_amount);
      this.props.setToukuPoints(this.props.userData,message.text.data.message_details.wallet_amount);
    }
  }

  onUserProfileUpdate = (message) => {
    const {currentFriend, userData} = this.props;
    if (message.text.data.type === SocketEvents.UPDATE_USER_PROFILE) {
      var user = getLocalUserFriend(message.text.data.message_details.user);
      if (user && user.length > 0) {
        updateFriendProfileData(
          message.text.data.message_details.user,
          message.text.data.message_details.display_name,
          message.text.data.message_details.background_image
        );
        this.props.getUserFriends().then((res) => {
          this.setCommonConversation();
        });
      }
      if (currentFriend.user_id === message.text.data.message_details.user) {
        if(message.text.data.message_details.background_image){
          this.props.updateCurrentFriendBackgroundImage(
            message.text.data.message_details
          );
        }else if(!currentFriend.display_name_edited){
          this.props.updateCurrentFriendDisplayName(
            message.text.data.message_details,
          );
        }
      }
      if(userData.id === message.text.data.message_details.user){
          if(message.text.data.message_details.background_image){
              this.props.updateUserBackgroundImage(
                  message.text.data.message_details
              );
          }else{
              this.props.updateUserDisplayName(
                  message.text.data.message_details,
              );
          }
      }
    }
  }

  onSearch = async (text) => {
    console.log('onSearch called');
    await this.setState({searchText: text, commonConversation: []});
    //this.getCommonChat();
    this.renderCommonChat();
  };

  onOpenChannelChats = (item) => {
    NetInfo.fetch().then((state) => {
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        this.props.setCurrentChannel(item);
        this.props.navigation.navigate('ChannelChats');
      } else {
        Toast.show({
          title: 'TOUKU',
          text: translate(`common.networkError`),
          type: 'primary',
        });
      }
    });
  };

  onOpenGroupChats = (item) => {
    NetInfo.fetch().then((state) => {
      console.log('Is connected?', state.isConnected);

      if (state.isConnected) {
        this.props.setCurrentGroup(item);
        this.props.navigation.navigate('GroupChats');
      } else {
        Toast.show({
          title: 'TOUKU',
          text: translate(`common.networkError`),
          type: 'primary',
        });
      }
    });
  };

  onOpenFriendChats = (item) => {
    NetInfo.fetch().then((state) => {
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        this.props.setCurrentFriend(item);
        this.props.navigation.navigate('FriendChats');
      } else {
        Toast.show({
          title: 'TOUKU',
          text: translate(`common.networkError`),
          type: 'primary',
        });
      }
    });
  };

  onOpenFriendDetails = (item) => {
    NetInfo.fetch().then((state) => {
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        console.log('onOpenFriendDetails -> item chat');
        this.props.setCurrentFriend(item);
        this.props.navigation.navigate('FriendNotes');
      } else {
        Toast.show({
          title: 'TOUKU',
          text: translate(`common.networkError`),
          type: 'primary',
        });
      }
    });
  };

  getLocalChannelConversations = () => {
    let chat = getChannelChatConversationById(this.props.currentChannel.id);
    if (chat.length) {
      let conversations = [];
      conversations = realmToPlainObject(chat);
      // conversations = chat.toJSON();
      this.props.setChannelConversation(conversations);
    }
  };

  // async getCommonChat() {
  //   const {
  //     followingChannels,
  //     userGroups,
  //     userFriends,
  //     channelLoading,
  //     groupLoading,
  //     friendLoading,
  //   } = this.props;
  //   const filteredChannels = followingChannels.filter(
  //     createFilter(this.state.searchText, ['name']),
  //   );
  //   if (filteredChannels.length > 0 && !channelLoading) {
  //     await this.setState({
  //       commonConversation: [
  //         ...this.state.commonConversation,
  //         ...filteredChannels,
  //       ],
  //     });
  //   }
  //   const filteredGroups = userGroups.filter(
  //     createFilter(this.state.searchText, ['group_name']),
  //   );
  //   if (filteredGroups.length > 0 && !groupLoading) {
  //     await this.setState({
  //       commonConversation: [
  //         ...this.state.commonConversation,
  //         ...filteredGroups,
  //       ],
  //     });
  //   }
  //   const filteredFriends = userFriends.filter(
  //     createFilter(this.state.searchText, ['display_name']),
  //   );
  //   if (filteredFriends.length > 0 && !friendLoading) {
  //     await this.setState({
  //       commonConversation: [
  //         ...this.state.commonConversation,
  //         ...filteredFriends,
  //       ],
  //     });
  //   }

  //   await this.setState({
  //     isLoading: false,
  //   });
  // }

  // async getUpdatedCommonChat() {
  //   const {
  //     followingChannels,
  //     userGroups,
  //     userFriends,
  //     channelLoading,
  //     groupLoading,
  //     friendLoading,
  //   } = this.props;

  //   let updatedConversation = [];

  //   const filteredChannels = await followingChannels.filter(
  //     createFilter(this.state.searchText, ['name']),
  //   );
  //   if (filteredChannels.length > 0 && !channelLoading) {
  //     updatedConversation = [...updatedConversation, ...filteredChannels];
  //   }
  //   const filteredGroups = await userGroups.filter(
  //     createFilter(this.state.searchText, ['group_name']),
  //   );
  //   if (filteredGroups.length > 0 && !groupLoading) {
  //     updatedConversation = [...updatedConversation, ...filteredGroups];
  //   }
  //   const filteredFriends = await userFriends.filter(
  //     createFilter(this.state.searchText, ['display_name']),
  //   );
  //   if (filteredFriends.length > 0 && !friendLoading) {
  //     updatedConversation = [...updatedConversation, ...filteredFriends];
  //   }

  //   await this.setState({
  //     commonConversation: updatedConversation,
  //   });

  //   await this.setState({
  //     isLoading: false,
  //   });
  // }

  getGroupDetail() {
    this.props
      .getGroupDetail(this.props.currentGroup.group_id)
      .then((res) => {
        this.props.setCurrentGroupDetail(res);
      })
      .catch((err) => {
        // Toast.show({
        //   title: 'TOUKU',
        //   text: translate('common.somethingWentWrong'),
        //   type: 'primary',
        // });
      });
  }

  getGroupMembers() {
    this.props
      .getGroupMembers(this.props.currentGroup.group_id)
      .then((res) => {
        console.log('res_getGroupMembers', JSON.stringify(res));
        this.props.setCurrentGroupMembers(res);
      })
      .catch((err) => {});
  }

  getLocalGroupConversation = () => {
    let chat = getGroupChatConversationById(this.props.currentGroup.group_id);
    if (chat) {
      let conversations = [];
      // chat.map((item, index) => {
      //   let i = {
      //     msg_id: item.msg_id,
      //     sender_id: item.sender_id,
      //     group_id: item.group_id,
      //     sender_username: item.sender_username,
      //     sender_display_name: item.sender_display_name,
      //     sender_picture: item.sender_picture,
      //     message_body: item.message_body,
      //     is_edited: item.is_edited,
      //     is_unsent: item.is_unsent,
      //     timestamp: item.timestamp,
      //     reply_to: item.reply_to,
      //     mentions: item.mentions,
      //     read_count: item.read_count,
      //     created: item.created,
      //   };
      //   conversations = [...conversations, i];
      // });

      conversations = realmToPlainObject(chat);
      // conversations = chat.toJSON();

      this.props.setGroupConversation(conversations);
    }
  };

  shotListBy = (sortBy) => {
    this.setState({
      sortBy: sortBy,
    });
    switch (sortBy) {
      case 'time': {
        let sortData = {
          sort_by: sortBy,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData);
        return;
      }
      case 'unread': {
        let sortData = {
          sort_by: sortBy,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData);
        return;
      }
      case 'name': {
        let sortData = {
          sort_by: sortBy,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData);
        return;
      }
      default:
        let sortData = {
          sort_by: this.props.userConfig.sort_by,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData);
        return;
    }
  };

  sortList = () => {
    const {sortBy} = this.state;
    const commonConversation = this.props.commonChat;

    switch (sortBy) {
      case 'time': {
        commonConversation.sort((a, b) =>
          a.created &&
          b.created &&
          new Date(a.last_msg ? a.last_msg.created : a.joining_date) <
            new Date(b.last_msg ? b.last_msg.created : b.joining_date)
            ? 1
            : a.created &&
              b.timestamp &&
              new Date(a.last_msg ? a.last_msg.created : a.joining_date) <
                new Date(b.timestamp)
            ? 1
            : a.timestamp &&
              b.created &&
              new Date(a.timestamp) <
                new Date(b.last_msg ? b.last_msg.created : b.joining_date)
            ? 1
            : a.timestamp &&
              b.timestamp &&
              new Date(a.timestamp) < new Date(b.timestamp)
            ? 1
            : -1,
        );

        return commonConversation;
      }
      case 'unread': {
        commonConversation.sort((a, b) =>
          a.created &&
          b.created &&
          new Date(a.last_msg ? a.last_msg.created : a.joining_date) >
            new Date(b.last_msg ? b.last_msg.created : b.joining_date)
            ? 1
            : a.created &&
              b.timestamp &&
              new Date(a.last_msg ? a.last_msg.created : a.joining_date) >
                new Date(b.timestamp)
            ? 1
            : a.timestamp &&
              b.created &&
              new Date(a.timestamp) >
                new Date(b.last_msg ? b.last_msg.created : b.joining_date)
            ? 1
            : a.timestamp &&
              b.timestamp &&
              new Date(a.timestamp) > new Date(b.timestamp)
            ? 1
            : -1,
        );

        commonConversation.sort((a, b) =>
          a.unread_msg < b.unread_msg ? 1 : -1,
        );
        return commonConversation;
      }
      case 'name': {
        commonConversation.sort((a, b) =>
          a.group_name &&
          b.group_name &&
          a.group_name.toUpperCase() > b.group_name.toUpperCase()
            ? 1
            : a.group_name &&
              b.display_name &&
              a.group_name.toUpperCase() > b.display_name.toUpperCase()
            ? 1
            : a.display_name &&
              b.group_name &&
              a.display_name.toUpperCase() > b.group_name.toUpperCase()
            ? 1
            : a.group_name &&
              b.name &&
              a.group_name.toUpperCase() > b.name.toUpperCase()
            ? 1
            : a.name &&
              b.group_name &&
              a.name.toUpperCase() > b.group_name.toUpperCase()
            ? 1
            : a.display_name &&
              b.display_name &&
              a.display_name.toUpperCase() > b.display_name.toUpperCase()
            ? 1
            : a.display_name &&
              b.name &&
              a.display_name.toUpperCase() > b.name.toUpperCase()
            ? 1
            : a.name &&
              b.display_name &&
              a.name.toUpperCase() > b.display_name.toUpperCase()
            ? 1
            : a.name && b.name && a.name.toUpperCase() > b.name.toUpperCase()
            ? 1
            : -1,
        );

        return commonConversation;
      }
      default:
        // {
        //   commonConversation.sort((a, b) =>
        //     a.created &&
        //     b.created &&
        //     new Date(a.last_msg ? a.last_msg.created : a.created) <
        //       new Date(b.last_msg ? b.last_msg.created : b.created)
        //       ? 1
        //       : a.created &&
        //         b.timestamp &&
        //         new Date(a.last_msg ? a.last_msg.created : a.created) <
        //           new Date(b.timestamp)
        //       ? 1
        //       : a.timestamp &&
        //         b.created &&
        //         new Date(a.timestamp) <
        //           new Date(b.last_msg ? b.last_msg.created : b.created)
        //       ? 1
        //       : a.timestamp &&
        //         b.timestamp &&
        //         new Date(a.timestamp) < new Date(b.timestamp)
        //       ? 1
        //       : -1,
        //   );

        return commonConversation;
      // }
    }
  };

  updateModalVisibility() {
    this.setState({isDeleteVisible: !this.state.isDeleteVisible});
  }

  updatePasswordModalVisibility() {
    this.setState({isSetPasswordVisible: !this.state.isSetPasswordVisible});
  }

  updateChangePasswordModalVisibility() {
    this.setState({
      isChangePassModalVisible: !this.state.isChangePassModalVisible,
    });
  }

  updateChangeEmailModalVisibility() {
    this.setState({
      isChangeEmailModalVisible: !this.state.isChangeEmailModalVisible,
    });
  }

  onCheckChange = (type, isCheck, item) => {
    /// group
    if (isCheck === 'check' && type === 'group') {
      if (groupId.length === 0) {
        groupId = [item.group_id];
      } else {
        groupId.push(item.group_id);
      }
    } else if (isCheck == 'unCheck' && type === 'group') {
      if (groupId.length > 0) {
        let filterData = groupId.filter((citem) => {
          return citem !== item.group_id;
        });

        if (groupId.length > 0) {
          groupId = filterData;
        } else {
          groupId = filterData;
        }
      }
    }

    /// channel
    if (isCheck == 'check' && type === 'channel') {
      if (channelId.length === 0) {
        channelId = [item.id];
      } else {
        channelId.push(item.id);
      }
    } else if (isCheck == 'unCheck' && type === 'channel') {
      if (channelId.length > 0) {
        let filterData = channelId.filter((citem) => {
          return citem !== item.id;
        });

        if (filterData.length > 0) {
          channelId = filterData;
        } else {
          channelId = filterData;
        }
      }
    }

    //// friend
    if (isCheck == 'check' && type === 'friend') {
      if (friendId.length === 0) {
        friendId = [item.friend];
      } else {
        friendId.push(item.friend);
      }
    } else if (isCheck == 'unCheck' && type === 'friend') {
      if (friendId.length > 0) {
        let filterData = friendId.filter((citem) => {
          return citem !== item.user_id;
        });

        if (friendId.length > 0) {
          friendId = filterData;
        } else {
          friendId = filterData;
        }
      }
    }

    let channel_ids = channelId;
    let friend_ids = friendId;
    let group_ids = groupId;
    let replies_ids = [];
    deleteObj = {channel_ids, friend_ids, group_ids, replies_ids};
    let i = [item];

    console.log('data item', deleteObj);
    if (isCheck == 'check') {
      count = count + i.length;
    } else {
      count = count - i.length;
    }
    this.setState({countChat: count});
  };

  onCanclePressButton = () => {
    this.setState({isVisible: false, isUncheck: false, countChat: 0});
    deleteObj = null;
    channelId = [];
    friendId = [];
    groupId = [];
    count = 0;
  };

  manageDelete = () => {
    if (
      deleteObj == null ||
      (deleteObj &&
        deleteObj.channel_ids.length === 0 &&
        deleteObj &&
        deleteObj.group_ids.length === 0 &&
        deleteObj &&
        deleteObj.friend_ids.length === 0)
    ) {
      Toast.show({
        title: 'TOUKU',
        text: translate('pages.xchat.toastr.selectChatText'),
      });
      deleteObj = null;
      this.setState({isVisible: true});
    } else {
      this.updateModalVisibility();
    }
  };

  actionDelete = async () => {
    this.setState({isDeleteLoading: true});
    console.log('deleteObj',deleteObj);
    this.props.deleteChat(deleteObj).then((res) => {
      this.setState({isDeleteLoading: false});
      if (res && res.status) {
        let commonData = [...this.props.commonChat];

        multipleDeleteChatConversation(deleteObj);

        // channel
        if (deleteObj.channel_ids && deleteObj.channel_ids.length > 0) {
          deleteObj.channel_ids.map((channelItem, index) => {
            commonData = commonData.filter((item) => item.id !== channelItem);
          });
        }

        // friend
        if (deleteObj.friend_ids && deleteObj.friend_ids.length > 0) {
          deleteObj.friend_ids.map((friendItem, index) => {
            commonData = commonData.filter(
              (item) => item.friend !== friendItem,
            );
          });
        }

        // group
        if (deleteObj.group_ids && deleteObj.group_ids.length > 0) {
          deleteObj.group_ids.map((groupItem, index) => {
            commonData = commonData.filter(
              (item) => item.group_id !== groupItem,
            );
            // console.log('common', commonData);
          });
        }

        this.setState({commonChat: commonData, countChat: 0, isDeleteVisible: !this.state.isDeleteVisible, isVisible: false},()=>{
          this.props.setDeleteChat(this.state.commonChat);
        });
        // this.props.setDeleteChat(this.state.commonChat);
        deleteObj = null;
        count = 0;
      }
    }).catch((err)=>{
      this.setState({isDeleteLoading: false, isDeleteVisible: !this.state.isDeleteVisible, isVisible: false, countChat: 0});
    });
    // this.updateModalVisibility();
    // this.setState({isVisible: false, countChat: 0});
  };

  actionCancel() {
    this.updateModalVisibility();
  }

  actionPasswordCancel() {
    this.updatePasswordModalVisibility();
  }

  actionEmailCancel() {
    this.updatePasswordModalVisibility();
  }

  onPinUnpinGroup = (item,onClose) => {
    if (item.is_pined) {
      this.props
        .unpinGroup(item.group_id)
        .then((res) => {
          // itemRef && itemRef.close();
          onClose();
          if (res.status === true) {
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.xchat.sucessFullyUnPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          // itemRef && itemRef.close();
          onClose();
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    } else {
      this.props
        .pinGroup(item.group_id)
        .then((res) => {
          // itemRef && itemRef.close();
          onClose();
          if (res.status === true) {
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.xchat.sucessFullyPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          // itemRef && itemRef.close();
          onClose();
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    }
  };

  onPinUnpinChannel = (item,onClose) => {
    if (item.is_pined) {
      this.props
        .unpinChannel(item.id)
        .then((res) => {
          onClose();
          if (res.status === true) {
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.xchat.sucessFullyUnPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          onClose();
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    } else {
      this.props
        .pinChannel(item.id)
        .then((res) => {
          onClose();
          if (res.status === true) {
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.xchat.sucessFullyPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          onClose();
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    }
  };

  onPinUnpinFriend = (item,onClose) => {
    if (item.is_pined) {
      this.props
        .unpinFriend(item.friend, item.user_id)
        .then((res) => {
          onClose();
          if (res.status === true) {
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.xchat.sucessFullyUnPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          onClose();
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    } else {
      this.props
        .pinFriend(item.friend, item.user_id)
        .then((res) => {
          onClose();
          if (res.status === true) {
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.xchat.sucessFullyPined'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          onClose();
          Toast.show({
            title: 'TOUKU',
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    }
  };

  onSwipeInitial = (swipeItem) => {
    if (swipeItem !== this._showingSwipeButton && this._showingSwipeButton != null) {
      console.log('buttons close');
      this._showingSwipeButton.close();
      this._showingSwipeButton = null;
    }
  }

  onSwipeButtonShowed = (swipeItem) => {
    this._showingSwipeButton = swipeItem;
  }

  setDataToDeleteChat = () => {
    let channel_ids = channelId;
    let friend_ids = friendId;
    let group_ids = groupId;
    let replies_ids = [];
    deleteObj = { channel_ids, friend_ids, group_ids, replies_ids };
    this.updateModalVisibility();
  }

  renderDisplayNameText = (text, message) => {
    if(message, text.includes('{Display Name}')){
      let update_txt = text.replaceAll("{Display Name}",this.props.userConfig.display_name);
      return update_txt;
    }else {
      return text;
    }
  }

  renderCommonChat = () => {
    const {isLoading, isVisible, isUncheck} = this.state;
    const commonChat = this.props.commonChat;

    // if (this.props.currentRouteName !== 'ChatTab') {
    //   return;
    // }
    // console.log('renderCommonChat with text', this.state.searchText)
    let commonConversation = this.sortList();
    commonConversation = commonChat.filter(
      createFilter(this.state.searchText, [
        'name',
        'group_name',
        'display_name',
      ]),
    );
    const pinedConversations = commonConversation.filter((cc) => cc.is_pined);
    const unpinedConversations = commonConversation.filter(
      (cc) => !cc.is_pined,
    );
    const conversations = [...pinedConversations, ...unpinedConversations];

    if (conversations.length > 0) {
      return (
        <FlatList
            keyExtractor={(item, index) => index.toString()}
          data={conversations}
          renderItem={({item, index}) =>
            item.chat === 'group' ? (
              <GroupListItem
                key={index + ''}
                last_msg_id={item.last_msg_id}
                title={item.group_name}
                onCheckChange={this.onCheckChange}
                description={
                  item.last_msg !== null
                    ? item.last_msg.type === 'text'
                      ? item.last_msg.text
                      : item.last_msg.type === 'image'
                      ? translate('pages.xchat.photo')
                      : item.last_msg.type === 'video'
                      ? translate('pages.xchat.video')
                      : item.last_msg.type === 'doc'
                      ? translate('pages.xchat.document')
                      : item.last_msg.type === 'audio'
                      ? translate('pages.xchat.audio')
                      : ''
                    : item.no_msgs || !item.last_msg_id
                    ? ''
                    : translate('pages.xchat.messageUnsent')
                }
                mentions={item.mentions}
                date={item.timestamp}
                image={item.group_picture}
                onPress={() => this.onOpenGroupChats(item)}
                unreadCount={item.unread_msg}
                isVisible={isVisible}
                isUncheck={isUncheck}
                item={item}
                isPined={item.is_pined}
                swipeable={true}
                onSwipeButtonShowed={this.onSwipeButtonShowed}
                onSwipeInitial={this.onSwipeInitial}
                onDeleteChat={(id)=>{
                  if(id){
                    groupId = [id];
                    this.setDataToDeleteChat();
                  }
                }}
                onPinUnpinChat={(item,onClose)=>{
                  this.onPinUnpinGroup(item,onClose);
                }}
              />
            ) : item.chat === 'channel' ? (
              <ChannelListItem
                key={index}
                last_msg={item.last_msg}
                title={item.name}
                onCheckChange={this.onCheckChange}
                description={
                  item.subject_message
                    ? item.subject_message
                    : item.last_msg
                    ? item.last_msg.is_unsent
                      ? translate('pages.xchat.messageUnsent')
                      : item.last_msg.msg_type === 'text'
                      ? this.renderDisplayNameText(item.last_msg.message_body,item.last_msg)
                      : item.last_msg.msg_type === 'image'
                      ? translate('pages.xchat.photo')
                      : item.last_msg.msg_type === 'video'
                      ? translate('pages.xchat.video')
                      : item.last_msg.msg_type === 'doc'
                      ? translate('pages.xchat.document')
                      : item.last_msg.msg_type === 'audio'
                      ? translate('pages.xchat.audio')
                      : ''
                    : ''
                }
                date={item.last_msg ? item.last_msg.created : item.joining_date}
                image={item.channel_picture}
                onPress={() => this.onOpenChannelChats(item)}
                unreadCount={item.unread_msg}
                isVisible={isVisible}
                isUncheck={isUncheck}
                item={item}
                isPined={item.is_pined}
                swipeable={true}
                onSwipeButtonShowed={this.onSwipeButtonShowed}
                onSwipeInitial={this.onSwipeInitial}
                onDeleteChat={(id)=>{
                  if(id){
                    channelId = [id];
                    this.setDataToDeleteChat();
                  }
                }}
                onPinUnpinChat={(item,onClose)=>{
                  this.onPinUnpinChannel(item,onClose);
                }}
              />
            ) : (
              <FriendListItem
                key={index}
                last_msg_id={item.last_msg_id}
                user_id={item.user_id}
                title={item.display_name}
                onCheckChange={this.onCheckChange}
                description={
                  item.last_msg
                    ? item.last_msg_type === 'text'
                      ? item.last_msg
                      : item.last_msg_type === 'image'
                      ? translate('pages.xchat.photo')
                      : item.last_msg_type === 'video'
                      ? translate('pages.xchat.video')
                      : item.last_msg_type === 'doc'
                      ? translate('pages.xchat.document')
                      : item.last_msg_type === 'audio'
                      ? translate('pages.xchat.audio')
                      : ''
                    : item.last_msg_id
                    ? translate('pages.xchat.messageUnsent')
                    : ''
                }
                image={getAvatar(item.profile_picture)}
                date={item.timestamp}
                isOnline={item.is_online}
                onPress={() => this.onOpenFriendChats(item)}
                onAvtarPress={() => {
                  if (item.friend_status !== 'UNFRIEND') {
                    this.onOpenFriendDetails(item);
                  }
                }}
                unreadCount={item.unread_msg}
                isTyping={item.is_typing}
                callTypingStop={(id) => {
                  updateFriendTypingStatus(id, false);
                  this.props.setUserFriends().then(() => {
                    this.props.setCommonChatConversation();
                  });
                }}
                isVisible={isVisible}
                isUncheck={isUncheck}
                item={item}
                isPined={item.is_pined}
                swipeable={true}
                onSwipeButtonShowed={this.onSwipeButtonShowed}
                onSwipeInitial={this.onSwipeInitial}
                onDeleteChat={(id)=>{
                  if(id){
                    friendId = [id]
                    this.setDataToDeleteChat();
                  }
                }}
                onPinUnpinChat={(item,onClose)=>{
                  this.onPinUnpinFriend(item,onClose);
                }}
              />
            )
          }
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          ListFooterComponent={() => (
            <View>{isLoading ? <ListLoader /> : null}</View>
          )}
          keyExtractor={(item, index) => String(index)}
        />
      );
    } else if (conversations.length === 0 && isLoading) {
      return <ListLoader />;
    } else {
      return <NoData title={translate('pages.xchat.noChatFound')} />;
    }
  };

  render() {
    const {
      orientation,
      sortBy,
      isDeleteVisible,
      isSetPasswordVisible,
      isChangePassModalVisible,
      isSetEmailVisible,
      isChangeEmailModalVisible,
      isLoading,
      isVisible,
      countChat,
      isDeleteLoading,
      bonusModal,
      bonusXP
    } = this.state;
    return (
      // <ImageBackground
      //   source={Images.image_home_bg}
      //   style={globalStyles.container}>
      <View style={globalStyles.container}>
        <HomeHeader
          ref={(header)=>this.header = header}
          title={translate('pages.xchat.chat')}
          isSortOptions
          menuItems={[
            {
              title: translate('pages.xchat.timeReceived'),
              onPress: () => this.shotListBy('time'),
              isSorted: sortBy === 'time' ? true : false,
            },
            {
              title: translate('pages.xchat.unreadMessages'),
              onPress: () => this.shotListBy('unread'),
              isSorted: sortBy === 'unread' ? true : false,
            },
            {
              title: translate('pages.setting.name'),
              onPress: () => this.shotListBy('name'),
              isSorted: sortBy === 'name' ? true : false,
            },
          ]}
          countObject={countChat}
          onChangeText={this.onSearch.bind(this)}
          navigation={this.props.navigation}
          isSearchBar
          isIconDelete
          onDeletePress={() => {
            this.setState({isVisible: true, isUncheck: false});
          }}
          onCanclePress={() => {
            this.onCanclePressButton();
          }}
          onDeleteConfrimPress={() => {
            this.manageDelete();
          }}
          isDeleteVisible={isLoading ? false : true}
          isVisibleButton={isVisible}
          currentRouteName={this.props.currentRouteName}
        />
        {/* <SearchInput
            onChangeText={this.onSearch.bind(this)}
            navigation={this.props.navigation}
          /> */}
        <View style={globalStyles.container}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}>
            {this.renderCommonChat()}
          </KeyboardAwareScrollView>
        </View>

        <ConfirmationModal
          orientation={orientation}
          visible={isDeleteVisible}
          onCancel={this.actionCancel.bind(this)}
          onConfirm={this.actionDelete.bind(this)}
          title={translate('pages.xchat.toastr.areYouSure')}
          message={translate('pages.xchat.toastr.chatHistoryDelete')}
          isLoading={isDeleteLoading}
        />

        <PasswordConfirmationModal
          orientation={orientation}
          visible={isSetPasswordVisible}
          onCancel={this.actionPasswordCancel.bind(this)}
          onConfirm={() => {
            this.setState({isSetPasswordVisible: !isSetPasswordVisible}, () => {
              setTimeout(() => {
                this.setState({
                  isChangePassModalVisible: !isChangePassModalVisible,
                });
              }, 500);
            });
          }}
          title={translate('pages.xchat.toastr.setPassword')}
          message={translate('pages.xchat.toastr.setPasswordText')}
        />

        <ChangePassModal
          visible={isChangePassModalVisible}
          onRequestClose={this.updateChangePasswordModalVisibility.bind(this)}
          isSetPassword
        />

        <EmailConfirmationModal
          orientation={orientation}
          visible={isSetEmailVisible}
          onCancel={this.actionEmailCancel.bind(this)}
          onConfirm={() => {
            this.setState({isSetEmailVisible: !isSetEmailVisible}, () => {
              setTimeout(() => {
                this.setState({
                  isChangeEmailModalVisible: !isChangeEmailModalVisible,
                });
              }, 500);
            });
          }}
          title={translate('pages.xchat.toastr.setEmail')}
          message={translate('pages.xchat.toastr.setEmailText')}
        />

        <ChangeEmailModal
          visible={isChangeEmailModalVisible}
          onRequestClose={this.updateChangeEmailModalVisibility.bind(this)}
          isSetEmail
        />

        <BonusModal
          visible={bonusModal}
          onRequestClose={() => {
            this.setState({ bonusModal: false })
          }}
          bonusXP={bonusXP}
          registerBonus={true}
        />

      </View>
      // </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    userChannels: state.channelReducer.userChannels,
    followingChannels: state.channelReducer.followingChannels,
    channelLoading: state.channelReducer.loading,
    userGroups: state.groupReducer.userGroups,
    groupLoading: state.groupReducer.loading,
    userFriends: state.friendReducer.userFriends,
    friendLoading: state.friendReducer.loading,
    userConfig: state.configurationReducer.userConfig,
    commonChat: state.commonReducer.commonChat,
    currentFriend: state.friendReducer.currentFriend,
    currentGroup: state.groupReducer.currentGroup,
    currentChannel: state.channelReducer.currentChannel,
    currentRouteName: state.userReducer.currentRouteName,
    trendTimline: state.timelineReducer.trendTimline,
    acceptedRequest: state.addFriendReducer.acceptedRequest
  };
};

const mapDispatchToProps = {
  getUserProfile,
  getUserChannels,
  getFollowingChannels,
  setCurrentChannel,
  getUserGroups,
  setCurrentGroup,
  getUserFriends,
  getFriendRequests,
  setCurrentFriend,
  updateCurrentFriendAvtar,
  updateCurrentFriendDisplayName,
  updateCurrentFriendBackgroundImage,
  getUserConfiguration,
  updateConfiguration,
  setCommonChatConversation,
  getMoreFollowingChannels,
  getMissedSocketEventsById,
  updateUnreadFriendMsgsCounts,
  updateUnreadGroupMsgsCounts,
  getLocalUserGroups,
  getLocalFollowingChannels,
  setUserFriends,
  setFriendConversation,
  getFriendRequest,
  setFriendRequest,
  setGroupConversation,
  setCurrentGroupMembers,
  getGroupMembers,
  setCurrentGroupDetail,
  getGroupDetail,
  setChannelConversation,
  setAppLanguage,
  markFriendMsgsRead,
  readAllChannelMessages,
  markGroupConversationRead,
  updateCurrentChannel,
  deleteChat,
  multipleData,
  setDeleteChat,
  setToukuPoints,
  addFriendByReferralCode,
  checkLoginBonusOfChannel,
  getLoginBonusOfChannel,
  selectRegisterJackpot,
  pinGroup,
  unpinGroup,
  pinChannel,
  unpinChannel,
  pinFriend,
  unpinFriend,
  updateUserBackgroundImage,
  updateUserDisplayName,
  updateUserProfileImage,
  updateTrendTimeline,
  setAcceptedRequest
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigationFocus(Chat));
