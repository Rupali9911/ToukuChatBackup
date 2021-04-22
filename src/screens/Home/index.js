import NetInfo from '@react-native-community/netinfo';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import React, {PureComponent} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';
import {Badge} from 'react-native-paper';
import {createFilter} from 'react-native-search-filter';
import {withNavigationFocus} from 'react-navigation';
import {connect} from 'react-redux';
import Realm from 'realm';
import HomeHeader from '../../components/HomeHeader';
import {
  ChannelListItem,
  FriendListItem,
  FriendRequestListItem,
  GroupListItem,
} from '../../components/ListItems';
import {ListLoader} from '../../components/Loaders';
import {ProfileModal} from '../../components/Modals';
import NoData from '../../components/NoData';
import RoundedImage from '../../components/RoundedImage';
import Toast from '../../components/Toast';
import {Colors, Icons, Images, SocketEvents} from '../../constants';
import SingleSocket from '../../helpers/SingleSocket';
import {
  acceptFriendRequst,
  getFriendRequest,
  rejectFriendRequst,
  setFriendRequest,
} from '../../redux/reducers/addFriendReducer';
import {
  assetXPValueOfChannel,
  getFollowingChannels,
  getLocalFollowingChannels,
  getMoreFollowingChannels,
  setCurrentChannel,
} from '../../redux/reducers/channelReducer';
import {getUserConfiguration} from '../../redux/reducers/configurationReducer';
import {
  getFriendRequests,
  getUserFriends,
  setCurrentFriend,
  setUserFriends,
  updateUnreadFriendMsgsCounts,
} from '../../redux/reducers/friendReducer';
import {
  getLocalUserGroups,
  getUserGroups,
  setCurrentGroup,
  updateUnreadGroupMsgsCounts,
} from '../../redux/reducers/groupReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {setActiveTimelineTab} from '../../redux/reducers/timelineReducer';
import {
  getAdWallUniqueUrl,
  getMissedSocketEventsById,
  getUserProfile,
  requestLoginForm,
} from '../../redux/reducers/userReducer';
import {
  deleteChannelById,
  deleteFriendMessageById,
  deleteMessageById,
  getChannelChatConversationById,
  getChannels,
  getChannelsById,
  getFriendChatConversationById,
  getGroupsById,
  getLocalUserFriend,
  removeUserFriends,
  setChannelChatConversation,
  setFriendChatConversation,
  setFriendMessageUnsend,
  setGroupChatConversation,
  setGroupLastMessageUnsend,
  setGroupMessageUnsend,
  setMessageUnsend,
  updateChannelLastMsg,
  updateChannelLastMsgWithOutCount,
  updateChannelTotalMember,
  updateChannelUnReadCountById,
  updateFriendLastMsg,
  updateFriendLastMsgWithoutCount,
  updateFriendMessageById,
  updateFriendsUnReadCount,
  updateFriendTypingStatus,
  UpdateGroupDetail,
  updateGroupMessageById,
  updateLastMsgGroups,
  updateMessageById,
  updateUnReadCount,
} from '../../storage/Service';
import {globalStyles} from '../../styles';
import {getAvatar, normalize} from '../../utils';
import styles from './styles';

class Home extends PureComponent {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.listener;
    this.state = {
      orientation: 'PORTRAIT',
      // isChannelCollapsed: (this.props.userData.user_type==='owner' || this.props.userData.user_type==='company' || this.props.userData.user_type==='tester')?false:true,
      isChannelCollapsed: false,
      isFriendReqCollapse: true,
      isGroupCollapsed: false,
      isFriendsCollapsed: false,
      searchText: '',
      showDropdown: false,
      loadMoreVisible: true,
      friendRequestHeaderCounts: 0,
      channelHeaderCounts: 0,
      groupHeaderCounts: 0,
      friendHeaderCounts: 0,
      getGroupData: [],
      getChannelData: [],
      getFriendData: [],
      assetXPValue: null,
    };
    this.SingleSocket = SingleSocket.getInstance();
    this.start = 0;
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});

    // this.events = eventService.getMessage().subscribe((message) => {
    //   this.checkEventTypes(message);
    // });
  }

  componentWillUnmount() {
    //  this.events.unsubscribe();
  }

  groupFilter = () => {
    const {userGroups} = this.props;

    const sortChannels = userGroups;
    // sortChannels.sort((a, b) =>
    //   new Date(a.timestamp) <= new Date(a.joining_date)
    //     ? new Date(a.timestamp)
    //     : new Date(a.joining_date) <
    //       new Date(b.timestamp) <=
    //       new Date(b.joining_date)
    //     ? new Date(b.timestamp)
    //     : new Date(b.joining_date)
    //     ? 1
    //     : -1,
    // );

    sortChannels.sort((a, b) =>
      a.timestamp &&
      b.timestamp &&
      (new Date(a.timestamp) > new Date(a.joining_date)
        ? new Date(a.timestamp)
        : new Date(a.joining_date)) <
        (new Date(b.timestamp) > new Date(b.joining_date)
          ? new Date(b.timestamp)
          : new Date(b.joining_date))
        ? 1
        : -1,
    );

    const filteredGroups = sortChannels.filter(
      createFilter(this.state.searchText, ['group_name']),
    );

    let is_pined = [];
    let is_un_pined = [];
    filteredGroups.filter((group) => {
      if (group.is_pined) {
        is_pined.push(group);
      } else {
        is_un_pined.push(group);
      }
    });

    const groups = [...is_pined, ...is_un_pined];
    this.setState({getGroupData: groups});
  };

  channelFilter = () => {
    const {followingChannels} = this.props;

    const sortChannels = followingChannels;
    sortChannels.sort((a, b) =>
      new Date(a.last_msg ? a.last_msg.updated : a.joining_date) <
      new Date(b.last_msg ? b.last_msg.updated : b.joining_date)
        ? 1
        : -1,
    );

    const filteredChannels = sortChannels.filter(
      createFilter(this.state.searchText, ['name']),
    );

    const pinedChannels = filteredChannels.filter(
      (channel) => channel.is_pined,
    );
    const unpinedChannels = filteredChannels.filter(
      (channel) => !channel.is_pined,
    );

    const channels = [...pinedChannels, ...unpinedChannels];

    this.setState({getChannelData: channels});
  };

  friendFilter = () => {
    const {userFriends} = this.props;
    // console.log('userFriends',userFriends);
    const Friends = userFriends.filter((friend) => friend.friend_status !== 'UNFRIEND')
    const filteredFriends = Friends.filter(
      createFilter(this.state.searchText, ['username']),
    );
    const pinedFriends = filteredFriends.filter((friend) => friend.is_pined);
    const unpinedFriends = filteredFriends.filter((friend) => !friend.is_pined);
    const friends = [...pinedFriends, ...unpinedFriends];
    this.setState({getFriendData: friends});
  };

  async componentDidMount() {
    Realm.open({})
      .then((realm) => {
        console.log('Realm is located at: ' + realm.path);
      })
      .catch((err) => {
        console.log('Real Open error', err);
      });

    this.props.getUserProfile();
    // this.SingleSocket.create({ user_id: this.props.userData.id });
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getFriendRequest();
    this.getLocalRequest();
    console.log('componentDidMount_Home');
    this.getFollowingChannels();
    this.getUserGroups();
    this.getUserFriends();
    this.channelFilter();
    this.groupFilter();
    this.friendFilter();
    this.getAssetXpValue();

    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      async () =>
        setTimeout(() => {
          console.log('focus gain');
          this.groupFilter();
          this.friendFilter();
          this.channelFilter();
          this.getAssetXpValue();
        }, 100),
    );

    this.focusListener = this.props.navigation.addListener(
      'willBlur',
      () => {
        console.log('focus change');
        // this.header && this.header._closeMenu();
        this.header && this.header._closeOption();
      }
    );

    // this.props.getFriendRequests();
    // this.props.getUserConfiguration();
    // this.focusListener = this.props.navigation.addListener(
    //   'didFocus',
    //   async () => {
    //     this.getFriendRequest();
    //     this.getFollowingChannels();
    //     this.getUserGroups();
    //     this.getUserFriends();
    //   }
    // );
    // Get on-disk location of the default Realm

    //
    // console.log('expandCollapse on SignUp', this.props.navigation.state.params.expandCollapse)
    // if (this.props.navigation.state.params.expandCollapse && this.props.navigation.state.params.expandCollapse === 'friends'){
    //         this.setState({isFriendReqCollapse: true})
    // } else if (this.props.navigation.state.params.expandCollapse && this.props.navigation.state.params.expandCollapse === 'friends'){
    //     this.setState({isFriendsCollapsed: true})
    // }
  }

  componentDidUpdate(nextPorps) {
    if (nextPorps.followingChannels !== this.props.followingChannels) {
      this.channelFilter();
    } else if (nextPorps.userGroups !== this.props.userGroups) {
      this.groupFilter();
    } else if (nextPorps.userFriends !== this.props.userFriends) {
      this.friendFilter();
    }
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  getFriendRequest() {
    this.props.getFriendRequest().then(() => {
      // let counts = 0;
      // for (let friend of this.props.friendRequest) {
      //   counts = counts + friend.unread_msg;
      // }
      this.props.friendRequest.length;
      console.log('friendRequest', this.props.friendRequest);
      this.setState({
        friendRequestHeaderCounts: this.props.friendRequest.length,
      });
    });
  }

  getFollowingChannelsInitial() {
    let channels = getChannels();
    if (channels.length) {
      let array = [];
      channels.map((item) => {
        array = [...array, item];
      });
      dispatch(getFollowingChannelsSuccess(array)); // TODO: Cannot find dispatch
    }
    this.props.getFollowingChannels().then(() => {
      // if (res.conversations.length > 0) {
      //   this.handleLoadMoreChannels();
      // }
      let counts = 0;
      for (let channel of this.props.followingChannels) {
        counts = counts + channel.unread_msg;
      }
      this.setState({channelHeaderCounts: counts});
    });
  }

  getAssetXpValue = () => {
    this.props
      .assetXPValueOfChannel()
      .then((res) => {
        if (res) {
          console.log('asset_xp', res);
          if (res && res.data) {
            this.setState({assetXPValue: res.data});
          }
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  getUniqueUrl = () => {
    this.props
      .getAdWallUniqueUrl()
      .then((res) => {
        if (res && res.add_wall_url) {
          Linking.openURL(res.add_wall_url);
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  requestXanaLoginform = () => {
    this.props
      .requestLoginForm()
      .then((res) => {
        if (res && res.status) {
          console.log('res', res);
          Linking.openURL(
            `https://www.xigolo.com/xigolo/#/popup-login?nkt=${res.data}`,
          );
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  getFollowingChannels() {
    // this.props.getFollowingChannels().then((res) => {
    // if (res.conversations.length > 0) {
    //   this.handleLoadMoreChannels();
    // }
    let counts = 0;
    for (let channel of this.props.followingChannels) {
      counts = counts + channel.unread_msg;
    }
    this.setState({channelHeaderCounts: counts});
    // });
  }

  getUserGroups() {
    // this.props.getUserGroups().then((res) => {
    // if (res.conversations && res.conversations.length > 0) {
    let counts = 0;
    for (let group of this.props.userGroups) {
      counts = counts + group.unread_msg;
    }
    this.setState({groupHeaderCounts: counts});
    // }
    // });
  }

  getUserFriends() {
    // this.props.getUserFriends().then((res) => {
    let counts = 0;
    for (let friend of this.props.userFriends) {
      counts = counts + friend.unread_msg;
    }
    this.setState({friendHeaderCounts: counts});
    // });
  }

  getLocalRequest() {
    this.props.setFriendRequest();
  }

  setChannelHeaderCount() {
    let counts = 0;
    for (let channel of this.props.followingChannels) {
      counts = counts + channel.unread_msg;
    }
    // this.setState({ channelHeaderCounts: counts });
    return counts;
  }

  setFriendHeaderCount() {
    let counts = 0;
    for (let friend of this.props.userFriends) {
      counts = counts + friend.unread_msg;
    }
    counts = counts + this.props.acceptedRequest.length;
    // this.setState({ friendHeaderCounts: counts });
    return counts;
  }

  setGroupHeaderCount() {
    let counts = 0;
    for (let group of this.props.userGroups) {
      counts = counts + group.unread_msg;
    }
    // this.setState({ groupHeaderCounts: counts });
    return counts;
  }

  checkEventTypes(message) {
    console.log('event_call', JSON.stringify(message));
    switch (message.text.data.type) {
      case SocketEvents.USER_ONLINE_STATUS:
        this.setFriendsOnlineStatus(message);
        break;
      case SocketEvents.CHECK_IS_USER_ONLINE:
        this.checkIsUserOnline(message);
        break;
      case SocketEvents.READ_ALL_MESSAGE_CHANNEL_CHAT:
        this.readAllMessageChannelChat(message);
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
      case SocketEvents.UNSENT_MESSAGE_IN_FOLLOWING_CHANNEL:
        this.messageUnsentInFollowingChannel(message);
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
      case SocketEvents.FRIEND_TYPING_MESSAGE:
        this.friendIsTyping(message);
        break;
      case SocketEvents.NEW_MESSAGE_IN_FREIND:
        this.onNewMessageInFriend(message);
        break;
      case SocketEvents.MESSAGE_EDITED_IN_FRIEND:
        this.onEditMessageInFriend(message);
        break;
      case SocketEvents.DELETE_MESSAGE_IN_FRIEND:
        // this.onDeleteMessageInFriend(message);
        break;
      case SocketEvents.UNSENT_MESSAGE_IN_FRIEND:
        this.onUnsentMessageInFriend(message);
        break;
      case SocketEvents.UNFRIEND:
        removeUserFriends(message.text.data.message_details.user_id);
        console.log('get local freinds');
        this.props.setUserFriends();
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
      case SocketEvents.UNSENT_MESSAGE_FROM_GROUP:
        this.UnsentMessageFromGroup(message);
        break;
      case SocketEvents.EDIT_GROUP_DETAIL:
        // this.getUserGroups(message);
        this.onUpdateGroupDetail(message);
        break;
      case SocketEvents.FRIEND_REQUEST_CANCELLED:
        // this.onNewMessageInFriend(message);
        // this.getFriendRequest();
        break;
      case SocketEvents.NEW_FRIEND_REQUEST:
        // this.getFriendRequest();
        // this.onNewFriendRequest(message);
        break;
      case SocketEvents.FRIEND_REQUEST_ACCEPTED:
        // handleRequestAccept(message.text.data.message_details.conversation);
        // console.log('get local freinds')
        // this.props.setUserFriends();
        // this.setFriendHeaderCount();
        break;
      case SocketEvents.FRIEND_REQUEST_REJECTED:
      // this.getFriendRequest();
      // this.getUserFriends();
    }
  }

  checkIsUserOnline(message) {
    if (message.text.data.type === SocketEvents.USER_ONLINE_STATUS) {
      if (
        message.text.data.message_details.user_id === this.props.userData.id
      ) {
        const payload = {
          type: SocketEvents.CHECK_IS_USER_ONLINE,
          data: {},
        };
        this.SingleSocket.sendMessage(JSON.stringify(payload));
      }
    }
  }

  //Friend is Typing
  friendIsTyping(message) {
    const {userFriends} = this.props;
    if (message.text.data.message_details.type === 'personal') {
      for (let i in userFriends) {
        if (
          userFriends[i].user_id ===
            message.text.data.message_details.sender_user_id &&
          this.props.userData.id ===
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
      for (let i in userFriends) {
        userFriends[i].is_typing = false;
      }
    }
  }

  //Set Friend's online status with socket event
  setFriendsOnlineStatus(message) {
    const {userFriends} = this.props;
    if (message.text.data.type === SocketEvents.USER_ONLINE_STATUS) {
      for (let i in userFriends) {
        if (
          userFriends[i].user_id === message.text.data.message_details.user_id
        ) {
          if (message.text.data.message_details.status === 'online') {
            userFriends[i].is_online = true;
          } else {
            userFriends[i].is_online = false;
          }
          // this.getUserFriends();
          break;
        }
      }
    }
  }

  //Message in Following Channel
  messageInFollowingChannel(message) {
    const {userData, followingChannels} = this.props;

    if (message.text.data.type === SocketEvents.MESSAGE_IN_FOLLOWING_CHANNEL) {
      for (let i of followingChannels) {
        if (message.text.data.message_details.channel === i.id) {
          if (message.text.data.message_details.from_user.id === userData.id) {
            // this.getFollowingChannels();
            let result = getChannelsById(
              message.text.data.message_details.channel,
            );

            let channels = [];

            result.map((item) => {
              channels.push(item);
            });
            setChannelChatConversation([message.text.data.message_details]);
            updateChannelLastMsg(
              message.text.data.message_details.channel,
              message.text.data.message_details,
              channels[0].unread_msg,
            );
            // this.props.getLocalFollowingChannels();
            this.setChannelHeaderCount();
            break;
          } else if (
            message.text.data.message_details.to_user != null &&
            message.text.data.message_details.to_user.id === userData.id
          ) {
            // this.getFollowingChannels();
            let result = getChannelsById(
              message.text.data.message_details.channel,
            );

            let channels = [];

            result.map((item) => {
              channels.push(item);
            });
            setChannelChatConversation([message.text.data.message_details]);
            updateChannelLastMsg(
              message.text.data.message_details.channel,
              message.text.data.message_details,
              channels[0].unread_msg + 1,
            );
            // this.props.getLocalFollowingChannels();
            this.setChannelHeaderCount();
            break;
          }
          break;
        }
      }
    }
  }

  //Multiple Message in Following Channel
  multipleMessageInFollowingChannel(message) {
    const {followingChannels} = this.props;
    if (
      message.text.data.type ===
      SocketEvents.MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL
    ) {
      for (let item of message.text.data.message_details) {
        console.log('item', item);
        for (let i of followingChannels) {
          if (item.channel === i.id) {
            let result = getChannelsById(item.channel);
            let channels = [];
            result.map((channel) => {
              channels.push(channel);
            });
            setChannelChatConversation([item]);
            updateChannelLastMsg(
              item.channel,
              item,
              channels[0].unread_msg + 1,
            );
            // this.props.getLocalFollowingChannels();
            this.setChannelHeaderCount();
            break;
          }
        }
      }
    }
  }

  messageUpdateInFollowingChannel(message) {
    const {followingChannels} = this.props;
    if (
      message.text.data.type ===
      SocketEvents.MESSAGE_EDITED_IN_FOLLOWING_CHANNEL
    ) {
      for (let i of followingChannels) {
        if (message.text.data.message_details.channel === i.id) {
          let result = getChannelsById(
            message.text.data.message_details.channel,
          );
          let channels = [];
          result.map((item) => {
            channels.push(item);
          });
          updateMessageById(
            message.text.data.message_details.id,
            message.text.data.message_details.message_body,
          );
          if (
            channels[0].last_msg.id === message.text.data.message_details.id
          ) {
            console.log('updateasdasdasd');
            updateChannelLastMsgWithOutCount(
              message.text.data.message_details.channel,
              message.text.data.message_details,
            );
          }
          // this.props.getLocalFollowingChannels();
          this.setChannelHeaderCount();
          break;
        }
      }
    }
  }

  messageDeleteInFollowingChannel(message) {
    if (
      message.text.data.type ===
      SocketEvents.DELETE_MESSAGE_IN_FOLLOWING_CHANNEL
    ) {
      let result = getChannelsById(message.text.data.message_details.channel);
      let channels = [];
      result.map((item) => {
        channels.push(item);
      });
      deleteMessageById(message.text.data.message_details.id);
      if (channels[0].last_msg.id === message.text.data.message_details.id) {
        let chats = getChannelChatConversationById(
          message.text.data.message_details.channel,
        );
        let array = [];
        for (let chat of chats) {
          array = [...array, chat];
        }
        console.log('updated_last_messgae', JSON.stringify(array[0]));
        updateChannelLastMsgWithOutCount(
          message.text.data.message_details.channel,
          array[0],
        );
      }
      // this.props.getLocalFollowingChannels();
      this.setChannelHeaderCount();
    }
  }

  messageUnsentInFollowingChannel(message) {
    if (
      message.text.data.type ===
      SocketEvents.UNSENT_MESSAGE_IN_FOLLOWING_CHANNEL
    ) {
      let result = getChannelsById(message.text.data.message_details.channel);
      let channels = [];
      result.map((item) => {
        channels.push(item);
      });
      setMessageUnsend(message.text.data.message_details.id);
      if (channels[0].last_msg.id === message.text.data.message_details.id) {
        let chats = getChannelChatConversationById(
          message.text.data.message_details.channel,
        );
        let array = [];
        for (let chat of chats) {
          array = [...array, chat];
        }
        console.log('updated_last_messgae', JSON.stringify(array[0]));
        updateChannelLastMsgWithOutCount(
          message.text.data.message_details.channel,
          array[0],
        );
      }
      // this.props.getLocalFollowingChannels();
      this.setChannelHeaderCount();
    }
  }

  onNewFriendRequest = (message) => {
    if (message.text.data.type === SocketEvents.NEW_FRIEND_REQUEST) {
      this.getFriendRequest();
    }
  };

  //New Message in Friend
  onNewMessageInFriend(message) {
    const {userData} = this.props;

    if (message.text.data.type === SocketEvents.NEW_MESSAGE_IN_FREIND) {
      if (message.text.data.message_details.from_user.id === userData.id) {
        // this.getUserFriends();
        setFriendChatConversation([message.text.data.message_details]);
        updateFriendLastMsg(
          message.text.data.message_details.to_user.id,
          message.text.data.message_details,
        );
        this.props.setUserFriends();
        this.setFriendHeaderCount();
      } else if (message.text.data.message_details.to_user.id === userData.id) {
        setFriendChatConversation([message.text.data.message_details]);
        updateFriendLastMsg(
          message.text.data.message_details.from_user.id,
          message.text.data.message_details,
        );
        // this.getUserFriends();
        this.props.setUserFriends();
        this.setFriendHeaderCount();
      }
    }
  }

  //Edit Message in Friend
  onEditMessageInFriend(message) {
    const {userData} = this.props;

    if (message.text.data.type === SocketEvents.MESSAGE_EDITED_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id === userData.id) {
        // this.getUserFriends();
        let editMessageId = message.text.data.message_details.id;
        let newMessageText = message.text.data.message_details.message_body;
        let messageType = message.text.data.message_details.msg_type;
        updateFriendMessageById(editMessageId, newMessageText, messageType);

        let users = getLocalUserFriend(
          message.text.data.message_details.to_user.id,
        );

        let array = [];

        for (let u of users) {
          array = [...array, u];
        }

        if (
          array.length > 0 &&
          array[0].last_msg_id === message.text.data.message_details.id
        ) {
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.to_user.id,
            message.text.data.message_details,
          );
          this.props.setUserFriends();
        }
      } else if (message.text.data.message_details.to_user.id === userData.id) {
        let editMessageId = message.text.data.message_details.id;
        let newMessageText = message.text.data.message_details.message_body;
        let messageType = message.text.data.message_details.msg_type;
        updateFriendMessageById(editMessageId, newMessageText, messageType);

        let users = getLocalUserFriend(
          message.text.data.message_details.from_user.id,
        );

        let array = [];

        for (let u of users) {
          array = [...array, u];
        }

        console.log('array', JSON.stringify(array[0]));
        if (
          array.length > 0 &&
          array[0].last_msg_id === message.text.data.message_details.id
        ) {
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.from_user.id,
            message.text.data.message_details,
          );
          this.props.setUserFriends();
        }
      }
    }
  }

  onDeleteMessageInFriend(message) {
    const {userData} = this.props;
    if (message.text.data.type === SocketEvents.DELETE_MESSAGE_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id === userData.id) {
        let users = getLocalUserFriend(
          message.text.data.message_details.to_user.id,
        );
        let array = [];
        for (let u of users) {
          array = [...array, u];
        }
        deleteFriendMessageById(message.text.data.message_details.id);
        if (array[0].last_msg.id === message.text.data.message_details.id) {
          let chats = getFriendChatConversationById(
            message.text.data.message_details.channel,
          );
          let arr = [];
          for (let chat of chats) {
            arr = [...arr, chat];
          }
          console.log('updated_last_messgae', JSON.stringify(arr[0]));
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.to_user.id,
            message.text.data.message_details,
          );
        }
        // this.props.getLocalFollowingChannels();
        this.setChannelHeaderCount();
      } else if (message.text.data.message_details.to_user.id === userData.id) {
        let users = getLocalUserFriend(
          message.text.data.message_details.from_user.id,
        );
        let array = [];
        for (let u of users) {
          array = [...array, u];
        }
        deleteFriendMessageById(message.text.data.message_details.id);
        if (array[0].last_msg.id === message.text.data.message_details.id) {
          let chats = getFriendChatConversationById(
            message.text.data.message_details.channel,
          );
          let arr = [];
          for (let chat of chats) {
            arr = [...arr, chat];
          }
          console.log('updated_last_messgae', JSON.stringify(arr[0]));
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.from_user.id,
            message.text.data.message_details,
          );
        }
        // this.props.getLocalFollowingChannels();
        this.setChannelHeaderCount();
      }
    }
  }

  //Unsent message on friend
  onUnsentMessageInFriend(message) {
    const {userData} = this.props;

    if (message.text.data.type === SocketEvents.UNSENT_MESSAGE_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id === userData.id) {
        // this.getUserFriends();
        setFriendMessageUnsend(message.text.data.message_details.id);
        let users = getLocalUserFriend(
          message.text.data.message_details.to_user.id,
        );
        let array = [];
        for (let u of users) {
          array = [...array, u];
        }
        if (array[0].last_msg.id === message.text.data.message_details.id) {
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.to_user.id,
            message.text.data.message_details,
          );
        }
      } else if (message.text.data.message_details.to_user.id === userData.id) {
        setFriendMessageUnsend(message.text.data.message_details.id);
        let users = getLocalUserFriend(
          message.text.data.message_details.from_user.id,
        );
        let array = [];
        for (let u of users) {
          array = [...array, u];
        }
        if (array[0].last_msg.id === message.text.data.message_details.id) {
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.from_user.id,
            message.text.data.message_details,
          );
        }
      }
      // this.props.getLocalFollowingChannels();
      this.setChannelHeaderCount();
    }
  }

  //New Message in Group
  onNewMessageInGroup(message) {
    const {userGroups} = this.props;
    if (message.text.data.type === SocketEvents.NEW_MESSAGE_IN_GROUP) {
      for (let i of userGroups) {
        if (i.group_id === message.text.data.message_details.group_id) {
          // this.getUserGroups();
          let item = message.text.data.message_details.unread_msg.filter(
            (detail) => {
              return detail.user__id === this.props.userData.id;
            },
          );

          let unreadCount = item.length > 0 ? item[0].unread_count : 0;

          setGroupChatConversation([message.text.data.message_details]);
          updateLastMsgGroups(
            message.text.data.message_details.group_id,
            message.text.data.message_details,
            unreadCount,
          );
          this.props.getLocalUserGroups();
          this.setGroupHeaderCount();
          break;
        }
      }
    }
  }

  editMessageFromGroup(message) {
    const {userGroups} = this.props;
    if (message.text.data.type === SocketEvents.MESSAGE_EDIT_FROM_GROUP) {
      for (let i of userGroups) {
        if (i.group_id === message.text.data.message_details.group_id) {
          // this.getUserGroups();

          updateGroupMessageById(message.text.data.message_details.msg_id);
          let itm = getGroupsById(message.text.data.message_details.group_id);
          let group = [];
          itm.map((item) => {
            group = [item];
          });
          console.log('checking group', group);
          if (
            group[0].last_msg_id === message.text.data.message_details.msg_id
          ) {
            updateLastMsgGroups(
              message.text.data.message_details.group_id,
              message.text.data.message_details,
              group[0].unread_msg,
            );
          }
          this.props.getLocalUserGroups();
          break;
        }
      }
    }
  }

  UnsentMessageFromGroup(message) {
    const {userGroups} = this.props;
    if (message.text.data.type === SocketEvents.UNSENT_MESSAGE_FROM_GROUP) {
      for (let i of userGroups) {
        if (i.group_id === message.text.data.message_details.group_id) {
          // this.getUserGroups();

          setGroupMessageUnsend(message.text.data.message_details.msg_id);
          let itm = getGroupsById(message.text.data.message_details.group_id);
          let group = [];
          itm.map((item) => {
            group = [item];
          });
          if (
            group[0].last_msg_id === message.text.data.message_details.msg_id
          ) {
            setGroupLastMessageUnsend(
              message.text.data.message_details.group_id,
            );
          }
          this.props.getLocalUserGroups();
          break;
        }
      }
    }
  }

  //Mark as Read Group Chat
  readAllMessageGroupChat(message) {
    const {userGroups} = this.props;
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_GROUP_CHAT) {
      let unread_counts = 0;
      for (let i in userGroups) {
        if (
          userGroups[i].group_id === message.text.data.message_details.group_id
        ) {
          // userGroups[i].unread_msg =
          //   message.text.data.message_details.read_count;

          // unread_counts =
          //   unread_counts + message.text.data.message_details.read_count;

          updateUnReadCount(
            message.text.data.message_details.group_id,
            message.text.data.message_details.read_count,
          );

          this.props.updateUnreadGroupMsgsCounts(unread_counts);

          this.props.getMissedSocketEventsById(
            message.text.data.socket_event_id,
          );
          this.props.getLocalUserGroups();
          // this.getUserGroups();
          break;
        }
      }
    }
  }

  onUpdateGroupDetail(message) {
    const {userGroups} = this.props;
    if (message.text.data.type === SocketEvents.EDIT_GROUP_DETAIL) {
      for (let i of userGroups) {
        if (i.group_id === message.text.data.message_details.id) {
          UpdateGroupDetail(
            message.text.data.message_details.id,
            message.text.data.message_details.name,
            message.text.data.message_details.group_picture,
            message.text.data.message_details.members.length,
          );
          this.props.getLocalUserGroups();
        }
      }
    }
  }

  //Read Channel's all messages with socket event
  readAllMessageChannelChat(message) {
    const {followingChannels} = this.props;
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_CHANNEL_CHAT) {
      for (let i in followingChannels) {
        if (
          followingChannels[i].id ===
          message.text.data.message_details.channel_id
        ) {
          // followingChannels[i].unread_msg =
          //   message.text.data.message_details.read_count;
          updateChannelUnReadCountById(
            message.text.data.message_details.channel_id,
            message.text.data.message_details.read_count,
          );
          this.props.getMissedSocketEventsById(
            message.text.data.socket_event_id,
          );
          // this.getFollowingChannels();
          // this.props.getLocalFollowingChannels();
          this.setChannelHeaderCount();
          break;
        }
      }
    }
  }

  //Read Friend's all messages with socket event
  readAllMessageFriendChat(message) {
    const {userFriends} = this.props;
    let detail = message.text.data.message_details;
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_FRIEND_CHAT) {
      let unread_counts = 0;
      for (let i in userFriends) {
        if (
          userFriends[i].friend === detail.friend_id &&
          detail.read_by === this.props.userData.id
        ) {
          // userFriends[i].unread_msg =
          //   message.text.data.message_details.read_count;

          // unread_counts =
          //   unread_counts + message.text.data.message_details.read_count;

          updateFriendsUnReadCount(detail.friend_id, 0);

          this.props.updateUnreadFriendMsgsCounts(unread_counts);

          this.props.getMissedSocketEventsById(
            message.text.data.socket_event_id,
          );
          // this.getUserFriends();
          this.props.setUserFriends();
          this.setFriendHeaderCount();
          break;
        }
      }
    }
  }

  //On Remove Channel Member
  onRemoveChannelMember(message) {
    if (
      message.text.data.type === SocketEvents.REMOVE_MEMBER_FROM_CHANNEL &&
      message.text.data.message_details.user_id === this.props.userData.id
    ) {
      // this.getFollowingChannels();
      // for (let i in this.props.followingChannels) {
      //   if (message.text.data.message_details.channel_id === i.id) {
      //     alert('channel unfollowed');
      //     break;
      //   }
      // }
      deleteChannelById(message.text.data.message_details.channel_id);
      // this.props.getLocalFollowingChannels();
      this.setChannelHeaderCount();
    }
  }

  onChannelMemberRemoveCount(message) {
    if (
      message.text.data.type ===
        SocketEvents.MEMBER_REMOVED_FROM_CHANNEL_COUNT &&
      message.text.data.message_details.user_id === this.props.userData.id
    ) {
      updateChannelTotalMember(message.text.data.message_details.channel_id);
      // this.props.getLocalFollowingChannels();
      this.setChannelHeaderCount();
    }
    8;
  }

  onSearch = (text) => {
    const {
      isChannelCollapsed,
      isGroupCollapsed,
      isFriendsCollapsed,
      isFriendReqCollapse,
    } = this.state;
    if (!isChannelCollapsed) {
      this.setState({isChannelCollapsed: true});
    }
    if (!isGroupCollapsed) {
      this.setState({isGroupCollapsed: true});
    }
    if (!isFriendsCollapsed) {
      this.setState({isFriendsCollapsed: true});
    }
    if (!isFriendReqCollapse) {
      this.setState({isFriendReqCollapse: true});
    }
    this.setState({searchText: text});
  };

  onUserProfilePress() {
    ProfileModal.show();
  }

  onOpenChannelChats = (item) => {
    NetInfo.fetch().then((state) => {
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        console.log('Home -> onOpenChannelChats -> item', item);
        this.props.setCurrentChannel(item);
        this.props.navigation.navigate('ChannelChats');
      } else {
        Toast.show({
          title: 'TOUKU',
          text: translate('common.networkError'),
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
          text: translate('common.networkError'),
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
          text: translate('common.networkError'),
          type: 'primary',
        });
      }
    });
  };

  onOpenFriendDetails = (item) => {
    NetInfo.fetch().then((state) => {
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        console.log('item', item);
        this.props.setCurrentFriend(item);
        this.props.navigation.navigate('FriendNotes');
      } else {
        Toast.show({
          title: 'TOUKU',
          text: translate('common.networkError'),
          type: 'primary',
        });
      }
    });
  };

  handleLoadMoreChannels = () => {
    this.start = this.start + 20;
    this.props.getMoreFollowingChannels(this.start).then((res) => {
      if (res.conversations.length < 20) {
        this.setState({loadMoreVisible: false});
      }
    });
  };

  renderDisplayNameText = (text, message) => {
    if(message, text.includes('{Display Name}')){
      let update_txt = text.replaceAll("{Display Name}",this.props.userConfig.display_name);
      return update_txt;
    }else {
      return text;
    }
  }

  renderUserChannels() {
    const {channelLoading} = this.props;
    const {getChannelData} = this.state;
    const filteredChannels = getChannelData.filter(
      createFilter(this.state.searchText, ['name']),
    );

    //console.log('filteredChannels', filteredChannels);
    if (filteredChannels.length === 0 && channelLoading) {
      return <ListLoader />;
    } else if (filteredChannels.length > 0) {
      return (
        <FlatList
          contentContainerStyle={styles.flexDisplay}
          data={filteredChannels}
          extraData={this.state}
          renderItem={({item, index}) => (
            <ChannelListItem
              key={index}
              title={item.name}
              last_msg={item.last_msg}
              description={
                item.subject_message
                  ? item.subject_message
                  : item.last_msg
                    ? item.last_msg.is_unsent
                      ? translate('pages.xchat.messageUnsent')
                      : item.last_msg.msg_type === 'text'
                        ? this.renderDisplayNameText(item.last_msg.message_body, item.last_msg)
                        : item.last_msg.msg_type === 'image'
                          ? translate('pages.xchat.photo')
                          : item.last_msg.msg_type === 'video'
                            ? translate('pages.xchat.video')
                            : item.last_msg.msg_type === 'doc'
                              ? translate('pages.xchat.document')
                              : translate('pages.xchat.audio')
                    : ''
              }
              date={item.last_msg ? item.last_msg.created : item.joining_date}
              image={item.channel_picture}
              isPined={item.is_pined}
              onPress={() => this.onOpenChannelChats(item)}
              unreadCount={item.unread_msg}
            />
          )}
          maxToRenderPerBatch={5}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          // ListFooterComponent={() => (
          //   <View>
          //     {channelLoading && loadMoreVisible ? <ListLoader /> : null}
          //   </View>
          // )}
          keyExtractor={(_, index) => String(index)}
          // onEndReached={this.handleLoadMoreChannels.bind(this)}
          onEndReachedThreshold={1}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noChannelFound')} />;
    }
  }

  renderUserGroups() {
    const {groupLoading} = this.props;
    const {getGroupData} = this.state;
    const filteredGroups = getGroupData.filter(
      createFilter(this.state.searchText, ['group_name']),
    );

    if (filteredGroups.length === 0 && groupLoading) {
      return <ListLoader />;
    } else if (filteredGroups.length > 0) {
      return (
        <FlatList
          data={filteredGroups}
          extraData={this.state}
          renderItem={({item, index}) => (
            <GroupListItem
              key={index}
              title={item.group_name}
              last_msg_id={item.last_msg_id}
              description={
                item.last_msg
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
              date={
                item.joining_date
                  ? item.timestamp >= item.joining_date
                    ? item.timestamp
                    : item.joining_date
                  : item.timestamp
              }
              image={item.group_picture}
              onPress={() => this.onOpenGroupChats(item)}
              unreadCount={item.unread_msg}
              isPined={item.is_pined}
            />
          )}
          maxToRenderPerBatch={5}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          // ListFooterComponent={() => (
          //   <View>{groupLoading ? <ListLoader /> : null}</View>
          // )}
          keyExtractor={(_, index) => String(index)}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noGroupFound')} />;
    }
  }

  renderUserFriends() {
    const {friendLoading} = this.props;
    const {getFriendData} = this.state;

    const filteredFriends = getFriendData.filter(
      createFilter(this.state.searchText, ['username']),
    );

    if (filteredFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          data={filteredFriends}
          extraData={this.state}
          renderItem={({item, index}) => {
            const description = item.last_msg
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
              : '';

            const handleTypingEnd = (id) => {
              updateFriendTypingStatus(id, false);
              this.props.setUserFriends();
            };

            const handleAvatarPress = () => {
              if (item.friend_status !== 'UNFRIEND') {
                this.onOpenFriendDetails(item);
              }
            };

            return (
              <FriendListItem
                key={index}
                user_id={item.user_id}
                last_msg_id={item.last_msg_id}
                title={item.display_name}
                description={description}
                image={getAvatar(item.profile_picture)}
                date={item.timestamp}
                isOnline={item.is_online}
                isTyping={item.is_typing}
                onPress={() => this.onOpenFriendChats(item)}
                unreadCount={item.unread_msg}
                callTypingStop={handleTypingEnd}
                onAvtarPress={handleAvatarPress}
                isPined={item.is_pined}
                acceptedRequest={
                  this.props.acceptedRequest.includes(item.user_id) ? 1 : 0
                }
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          // ListFooterComponent={() => (
          //   <View>{friendLoading ? <ListLoader /> : null}</View>
          // )}
          maxToRenderPerBatch={5}
          keyExtractor={(_, index) => String(index)}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noFriendFound')} />;
    }
  }

  renderFriendRequestList() {
    const {
      friendRequestLoading,
      friendRequest,
      isAcceptLoading,
      isRejectLoading,
    } = this.props;
    const filteredFriendRequest = friendRequest.filter(
      createFilter(this.state.searchText, ['from_user_display_name']),
    );
    if (filteredFriendRequest.length === 0 && friendRequestLoading) {
      return <ListLoader />;
    } else if (filteredFriendRequest.length > 0) {
      return (
        <FlatList
          data={filteredFriendRequest}
          extraData={this.state}
          // last_msg_id={last_msg_id}
          renderItem={({item, index}) => (
            <FriendRequestListItem
              key={index}
              title={item.from_user_display_name}
              image={getAvatar(item.from_user_avatar)}
              date={item.created}
              onAcceptPress={() => this.onAcceptPress(item)}
              onRejectPress={() => this.onRejectPress(item)}
              isRejectLoading={isRejectLoading}
              isAcceptLoading={isAcceptLoading}
            />
          )}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          // ListFooterComponent={() => (
          //   <View>{friendLoading ? <ListLoader /> : null}</View>
          // )}
          keyExtractor={(item, index) => String(index)}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noFriendFound')} />;
    }
  }

  onAcceptPress = (item) => {
    console.log('onAcceptPress -> onAcceptPress', item);
    const payload = {
      channel_name: `friend_request_${item.from_user_id}`,
      sender_id: item.from_user_id,
    };
    this.props
      .acceptFriendRequst(payload)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: translate('pages.xchat.toastr.added'),
            text: translate('pages.xchat.toastr.friendAddedSuccessfully'),
            type: 'positive',
          });
          this.props.getFriendRequest();
        }
      })
      .catch((err) => {
        console.error('acceptFriendRequst =>', err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
      });
  };

  onRejectPress = (item) => {
    console.log('onRejectPress -> onRejectPress', item);
    const payload = {
      sender_id: item.from_user_id,
    };
    this.props
      .rejectFriendRequst(payload)
      .then((res) => {
        if (res.status === true) {
          Toast.show({
            title: translate('pages.xchat.toastr.rejected'),
            text: translate('pages.xchat.toastr.friendRequestRejected'),
            type: 'positive',
          });
          this.props.getFriendRequest();
        }
      })
      .catch((err) => {
        console.error('rejectFriendRequst', err);
        Toast.show({
          title: 'TOUKU',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
      });
  };

  showDropdown = () => {
    this.setState((prevState) => ({
      showDropdown: !prevState.showDropdown,
    }));
  };

  render() {
    const {
      isChannelCollapsed,
      isGroupCollapsed,
      isFriendsCollapsed,
      isFriendReqCollapse,
      searchText,
      getFriendData,
      assetXPValue
    } = this.state;

    const {
      followingChannels,
      userFriends,
      userGroups,
      userData,
      userConfig,
      friendRequest,
      selectedLanguageItem,
    } = this.props;

    const filteredChannels = followingChannels.filter(
      createFilter(searchText, ['name']),
    );

    const filteredGroups = userGroups.filter(
      createFilter(searchText, ['group_name']),
    );

    const filteredFriends = userFriends.filter(
      createFilter(searchText, ['username']),
    );

    const filteredFriendRequest = friendRequest.filter(
      createFilter(searchText, ['from_user_display_name']),
    );

    //  console.log('touku_tp',this.props.userData.total_tp);
    return (
      // <ImageBackground
      //   source={Images.image_home_bg}
      //   style={globalStyles.container}>
      <View style={globalStyles.container}>
        <HomeHeader
          ref={(header)=>this.header = header}
          title={translate('pages.xchat.home')}
          onChangeText={this.onSearch.bind(this)}
          onIconRightClick={this.showDropdown}
          navigation={this.props.navigation}
          isSearchBar
        />
        {/* <SearchInput
            onChangeText={this.onSearch.bind(this)}
            onIconRightClick={this.showDropdown}
            navigation={this.props.navigation}
          /> */}

        <View style={[globalStyles.container, {backgroundColor: Colors.white}]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => this.onUserProfilePress()}
            style={styles.headerContainer}>
            <RoundedImage source={getAvatar(userData.avatar)} size={50} />
            <Text
              style={[globalStyles.smallNunitoRegularText, styles.displayName]}>
              {userConfig.display_name}
            </Text>
          </TouchableOpacity>
          {/* Friend Request */}
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            //horizontal={false}
            style={{backgroundColor: Colors.white}}>
            {filteredFriendRequest.length > 0 && (
              <Collapse
                onToggle={(isColl) =>
                  this.setState({
                    isFriendReqCollapse: isColl,
                  })
                }
                isCollapsed={isFriendReqCollapse}>
                <CollapseHeader>
                  <DropdownHeader
                    title={translate('pages.xchat.friendRequest')}
                    isCollapsed={isFriendReqCollapse}
                    listcounts={filteredFriendRequest.length}
                    badgeCount={friendRequest.length}
                    selectedLanguageItem={selectedLanguageItem}
                    icon={Icons.icon_friend}
                  />
                </CollapseHeader>
                <CollapseBody>{this.renderFriendRequestList()}</CollapseBody>
              </Collapse>
            )}

            {/* Channels */}
            <Collapse
              onToggle={(isColl) =>
                this.setState({
                  isChannelCollapsed: isColl,
                })
              }
              isCollapsed={isChannelCollapsed}>
              <CollapseHeader>
                <DropdownHeader
                  title={translate('pages.xchat.channels')}
                  isCollapsed={isChannelCollapsed}
                  listcounts={filteredChannels.length}
                  badgeCount={this.setChannelHeaderCount()}
                  selectedLanguageItem={selectedLanguageItem}
                  icon={Icons.icon_channel_list}
                />
              </CollapseHeader>
              <CollapseBody>{this.renderUserChannels()}</CollapseBody>
            </Collapse>

            {/* Groups */}
            <Collapse
              onToggle={(isColl) =>
                this.setState({
                  isGroupCollapsed: isColl,
                })
              }
              isCollapsed={isGroupCollapsed}>
              <CollapseHeader>
                <DropdownHeader
                  title={translate('pages.xchat.groups')}
                  isCollapsed={isGroupCollapsed}
                  listcounts={filteredGroups.length}
                  badgeCount={this.setGroupHeaderCount()}
                  selectedLanguageItem={selectedLanguageItem}
                  icon={Icons.icon_group}
                />
              </CollapseHeader>
              <CollapseBody>{this.renderUserGroups()}</CollapseBody>
            </Collapse>

            {/* Friends */}
            <Collapse
              onToggle={(isColl) =>
                this.setState({
                  isFriendsCollapsed: isColl,
                })
              }
              isCollapsed={isFriendsCollapsed}>
              <CollapseHeader>
                <DropdownHeader
                  title={translate('pages.xchat.friends')}
                  isCollapsed={isFriendsCollapsed}
                  listcounts={getFriendData.length}
                  badgeCount={this.setFriendHeaderCount()}
                  selectedLanguageItem={selectedLanguageItem}
                  icon={Icons.icon_friend}
                />
              </CollapseHeader>
              <CollapseBody>{this.renderUserFriends()}</CollapseBody>
            </Collapse>

            {/* {(this.props.userData.user_type==='owner' || this.props.userData.user_type==='company' || this.props.userData.user_type==='tester') &&  */}
            <View>
              <View style={styles.headingContainer}>
                <Text style={styles.headingText}>
                  {translate('pages.adWall.yourPoint')}
                </Text>
                <View style={styles.rowContainer}>
                  <LinearGradient
                    start={{x: 0.03, y: 0.7}}
                    end={{x: 0.95, y: 0.8}}
                    // locations={[0.065, 0.22, 0.92]}
                    useAngle={true}
                    angle={0}
                    colors={[
                      // Colors.button_gradient_1,
                      // Colors.button_gradient_2,
                      '#fff3f5',
                      '#fff3f5',
                    ]}
                    style={[
                      styles.fill_border_box_style,
                      styles.tpPointsGradientContainer,
                    ]}>
                    <View>
                      <Text style={styles.pointsText}>
                        {translate('pages.xchat.toukuPoints')}
                      </Text>
                      <Text style={styles.pointsText}>(TP)</Text>
                      <Text style={styles.pointsCount}>
                        {this.props.userData.total_tp &&
                          parseInt(
                            this.props.userData.total_tp,
                            10,
                          ).toLocaleString()}
                      </Text>
                    </View>
                  </LinearGradient>
                  <LinearGradient
                    start={{x: 0.03, y: 0.7}}
                    end={{x: 0.95, y: 0.8}}
                    // locations={[0.065, 0.22, 0.92]}
                    useAngle={true}
                    angle={0}
                    colors={[
                      // Colors.button_gradient_1,
                      // Colors.button_gradient_2,
                      '#fff3f5',
                      '#fff3f5',
                    ]}
                    style={[
                      styles.fill_border_box_style,
                      styles.xpPointsGradientContainer,
                    ]}>
                    <View>
                      <Text style={styles.pointsText}>
                        {translate('pages.adWall.gamePoint')}
                      </Text>
                      <Text style={styles.pointsText}>(XP)</Text>
                      <Text style={styles.pointsCount}>
                        {assetXPValue ? assetXPValue.XP : 0}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>

              <View style={styles.headingContainer}>
                <Text style={[styles.headingText]}>
                  {translate('pages.xchat.transfer')}
                </Text>
                <View style={styles.rowContainer}>
                  <TouchableOpacity
                    style={styles.singleFlex}
                    onPress={() =>
                      this.props.navigation.navigate('AmazonExchangeScreen')
                    }>
                    <LinearGradient
                      start={{x: 0.03, y: 0.7}}
                      end={{x: 0.95, y: 0.8}}
                      // locations={[0.065, 0.22, 0.92]}
                      useAngle={true}
                      angle={0}
                      colors={[
                        // '#FFD60941',
                        // '#D7944141',
                        'white',
                        'white',
                      ]}
                      style={[
                        styles.fill_border_box_style,
                        styles.amazonContainer,
                      ]}>
                      <Image
                        source={Images.amazon_logo}
                        resizeMode={'contain'}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.singleFlex}
                    onPress={() => {
                      Toast.show({
                        title: translate('pages.adWall.btcExchangeHistory'),
                        text: translate('pages.clasrm.comingSoon'),
                        type: 'positive',
                      });
                    }}>
                    <LinearGradient
                      start={{x: 0.03, y: 0.7}}
                      end={{x: 0.95, y: 0.8}}
                      // locations={[0.065, 0.22, 0.92]}
                      useAngle={true}
                      angle={0}
                      colors={[
                        // '#FFD60941',
                        // '#D7944141',
                        'white',
                        'white',
                      ]}
                      style={[
                        styles.fill_border_box_style,
                        styles.bitcoinContainer,
                      ]}>
                      <Image
                        source={Images.bitcoin_logo}
                        resizeMode={'contain'}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.singleFlex}
                  onPress={() => {
                    this.props.navigation.navigate('Rewards');
                    // if(this.props.userData.user_type==='owner' || this.props.userData.user_type==='company' || this.props.userData.user_type==='tester'){
                    //   this.getUniqueUrl();
                    // }else{
                    //   Toast.show({
                    //     title: 'TOUKU',
                    //     text: translate('pages.clasrm.comingSoon'),
                    //     type: 'positive'
                    //   });
                    // }
                  }}>
                  {/* <LinearGradient
                  start={{ x: 0.03, y: 0.7 }}
                  end={{ x: 0.95, y: 0.8 }}
                  // locations={[0.065, 0.22, 0.92]}
                  useAngle={true}
                  angle={0}
                  colors={[
                    '#D79441',
                    '#FFD609',
                    '#D79441'
                  ]}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    marginTop: 20,
                    flex: 1,
                  }}>
                  <Text style={{ fontSize: normalize(25), fontWeight: 'bold' }}>{translate('pages.adWall.clickHere')}</Text>
                  <Text style={{ fontSize: normalize(12), fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif' }}>{translate('pages.adWall.increaseyourPoint')}</Text>
                </LinearGradient> */}
                  <ImageBackground
                    source={Images.banner_img}
                    style={styles.bannerImage}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.headingContainer}>
                <Text style={[styles.headingText]}>
                  {translate('pages.adWall.other')}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.rowContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('ChannelInfo', {
                        channelItem: {channel_id: 1422},
                      });
                      // onPressHyperlink('https://touku.angelium.net/api/xchat/channel-details/1422/')
                    }}>
                    <View style={styles.recommendedContainers}>
                      <Image
                        source={{
                          uri:
                            'https://cdn.angelium.net/touku/assets/images/lady_cartoon.jpg',
                        }}
                        // source={{ uri: 'https://cdn.angelium.net/touku/assets/images/person_money.png' }}
                        style={styles.recommendedPosters}
                      />
                      <Text numberOfLines={1} style={styles.recommendedLabels}>
                        {translate('pages.adWall.earnChannels')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.requestXanaLoginform();
                    }}>
                    <View style={styles.recommendedContainers}>
                      <Image
                        source={{
                          uri:
                            'https://cdn.angelium.net/touku/assets/images/xigolo_girl.png',
                        }}
                        style={styles.recommendedPosters}
                      />
                      <Text numberOfLines={1} style={styles.recommendedLabels}>
                        {translate('pages.adWall.OptionalXigolo')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('ChannelInfo', {
                        channelItem: {channel_id: 800},
                      });
                    }}>
                    <View style={styles.recommendedContainers}>
                      <Image
                        source={{
                          uri:
                            'https://cdn.angelium.net/touku/assets/images/welcome-page/bg-1218x812.jpg',
                        }}
                        style={styles.recommendedPosters}
                      />
                      <Text numberOfLines={1} style={styles.recommendedLabels}>
                        {translate('pages.adWall.comingSoon')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        this.props.userData.user_type === 'owner' ||
                        this.props.userData.user_type === 'company' ||
                        this.props.userData.user_type === 'tester'
                      ) {
                        this.props.setActiveTimelineTab('ranking');
                        this.props.navigation.navigate('Timeline', {
                          activeTab: 'ranking',
                        });
                      } else {
                        Toast.show({
                          title: 'TOUKU',
                          text: translate('pages.clasrm.comingSoon'),
                          type: 'positive',
                        });
                      }
                    }}>
                    <View style={styles.recommendedContainers}>
                      <Image
                        source={Images.crown_img}
                        style={styles.recommendedImage}
                      />
                      <Text numberOfLines={1} style={styles.recommendedLabels}>
                        {translate('pages.adWall.GoldCrownText')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
            {/* } */}
          </KeyboardAwareScrollView>
        </View>
      </View>
      // </ImageBackground>
    );
  }
}

const DropdownHeader = ({title, listcounts, badgeCount, isCollapsed, icon}) => {
  return (
    <LinearGradient
      start={{x: 0.03, y: 0.7}}
      end={{x: 0.95, y: 0.8}}
      locations={[0.065, 0.22, 0.92]}
      useAngle={true}
      angle={222.28}
      colors={[
        // Colors.header_gradient_1,
        // Colors.header_gradient_2,
        // Colors.header_gradient_3,
        '#fbfbfd',
        '#fbfbfd',
        '#fbfbfd',
      ]}
      style={styles.dropdownHeaderGradientContainer}>
      <View style={styles.dropdownHeaderContainer}>
        <Image source={icon} style={styles.headerIcon} />
        {Platform.OS === 'ios' ? (
          <TextInput
            pointerEvents={'none'}
            editable={false}
            style={[globalStyles.smallRegularText, styles.headerTitle]}>
            {title}
          </TextInput>
        ) : (
          <Text style={[globalStyles.smallRegularText, styles.headerTitle]}>
            {title}
          </Text>
        )}
        <Text style={[globalStyles.smallRegularText, styles.headerItemCount]}>
          {'('}
          {listcounts}
          {')'}
        </Text>
      </View>
      <View style={styles.dropdownHeaderContainer}>
        {badgeCount > 0 ? (
          <Badge
            style={{
              backgroundColor: Colors.green,
              color: Colors.white,
              fontSize: Platform.isPad ? normalize(6) : normalize(9),
            }}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </Badge>
        ) : null}
        <Image
          source={isCollapsed ? Icons.icon_arrow_up : Icons.icon_arrow_down}
          style={styles.headerListDropDownIcon}
        />
      </View>
    </LinearGradient>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    userConfig: state.configurationReducer.userConfig,
    followingChannels: state.channelReducer.followingChannels,
    channelLoading: state.channelReducer.loading,
    userGroups: state.groupReducer.userGroups,
    groupLoading: state.groupReducer.loading,
    userFriends: state.friendReducer.userFriends,
    friendLoading: state.friendReducer.loading,
    friendRequest: state.addFriendReducer.friendRequest,
    friendRequestLoading: state.addFriendReducer.loading,
    isAcceptLoading: state.addFriendReducer.isAcceptLoading,
    isRejectLoading: state.addFriendReducer.isRejectLoading,
    acceptedRequest: state.addFriendReducer.acceptedRequest,
  };
};

const mapDispatchToProps = {
  getUserProfile,
  getMoreFollowingChannels,
  getFollowingChannels,
  setCurrentChannel,
  getUserGroups,
  setCurrentGroup,
  getUserFriends,
  getFriendRequests,
  setCurrentFriend,
  getUserConfiguration,
  getMissedSocketEventsById,
  updateUnreadFriendMsgsCounts,
  updateUnreadGroupMsgsCounts,
  getFriendRequest,
  acceptFriendRequst,
  rejectFriendRequst,
  getLocalUserGroups,
  getLocalFollowingChannels,
  setUserFriends,
  setFriendRequest,
  assetXPValueOfChannel,
  getAdWallUniqueUrl,
  requestLoginForm,
  setActiveTimelineTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigationFocus(Home));
