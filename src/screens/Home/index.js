import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  TextInput,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import Realm from 'realm';
import {
  AccordionList,
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createFilter} from 'react-native-search-filter';
import {Badge} from 'react-native-paper';
import {withNavigationFocus} from 'react-navigation';

import {homeStyles} from './styles';
import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {Images, Colors, Icons, SocketEvents} from '../../constants';
import {SearchInput} from '../../components/TextInputs';
import RoundedImage from '../../components/RoundedImage';
import {getAvatar, eventService, normalize} from '../../utils';
import {ProfileModal} from '../../components/Modals';
import {
  ChannelListItem,
  FriendListItem,
  GroupListItem,
  FriendRequestListItem,
} from '../../components/ListItems';
import NoData from '../../components/NoData';
import Button from '../../components/Button';
import {ListLoader} from '../../components/Loaders';
import SingleSocket from '../../helpers/SingleSocket';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {
  getUserProfile,
  getMissedSocketEventsById,
} from '../../redux/reducers/userReducer';

import {
  getFriendRequest,
  acceptFriendRequst,
  rejectFriendRequst,
  setFriendRequest,
} from '../../redux/reducers/addFriendReducer';

import {getUserConfiguration} from '../../redux/reducers/configurationReducer';
import {
  getMoreFollowingChannels,
  getFollowingChannels,
  setCurrentChannel,
  getLocalFollowingChannels,
} from '../../redux/reducers/channelReducer';
import {
  getUserGroups,
  getLocalUserGroups,
  setCurrentGroup,
  updateUnreadGroupMsgsCounts,
} from '../../redux/reducers/groupReducer';
import {
  getUserFriends,
  getFriendRequests,
  setCurrentFriend,
  updateUnreadFriendMsgsCounts,
  getUserFriendsSuccess,
  setUserFriends,
} from '../../redux/reducers/friendReducer';
import Toast from '../../components/Toast';

import {
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
  getGroups,
  setGroups,
  UpdateGroupDetail,
  getGroupsById,
  updateLastMsgGroups,
  updateUnReadCount,
  updateGroupMessageById,
  setGroupMessageUnsend,
  setGroupLastMessageUnsend,
  setGroupChatConversation,
  updateChannelUnReadCountById,
  removeUserFriends,
  handleRequestAccept,
  getLocalFriendRequest,
  deleteChannelById,
  updateChannelTotalMember,
  updateChannelLastMsgWithOutCount,
  getLocalFriendRequests,
  updateFriendTypingStatus,
} from '../../storage/Service';

class Home extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isChannelCollapsed: true,
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
    // this.getFriendRequest();
    this.getLocalRequest();
    this.getFollowingChannels();
    this.getUserGroups();
    this.getUserFriends();
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

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  getFriendRequest() {
    this.props.getFriendRequest().then((res) => {
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
    var channels = getChannels();
    if (channels.length) {
      var array = [];
      channels.map((item, index) => {
        array = [...array, item];
      });
      dispatch(getFollowingChannelsSuccess(array));
    }
    this.props.getFollowingChannels().then((res) => {
      // if (res.conversations.length > 0) {
      //   this.handleLoadMoreChannels();
      // }
      let counts = 0;
      for (var channel of this.props.followingChannels) {
        counts = counts + channel.unread_msg;
      }
      this.setState({channelHeaderCounts: counts});
    });
  }

  getFollowingChannels() {
    // this.props.getFollowingChannels().then((res) => {
    // if (res.conversations.length > 0) {
    //   this.handleLoadMoreChannels();
    // }
    let counts = 0;
    for (var channel of this.props.followingChannels) {
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
    for (var channel of this.props.followingChannels) {
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

  //Set Friend's online status with socket event
  setFriendsOnlineStatus(message) {
    const {userFriends} = this.props;
    if (message.text.data.type === SocketEvents.USER_ONLINE_STATUS) {
      for (var i in userFriends) {
        if (
          userFriends[i].user_id == message.text.data.message_details.user_id
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
        if (message.text.data.message_details.channel == i.id) {
          if (message.text.data.message_details.from_user.id == userData.id) {
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
            this.props.getLocalFollowingChannels();
            this.setChannelHeaderCount();
            break;
          } else if (
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
            updateChannelLastMsg(
              message.text.data.message_details.channel,
              message.text.data.message_details,
              channels[0].unread_msg + 1,
            );
            this.props.getLocalFollowingChannels();
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
    const {userData, followingChannels} = this.props;
    if (
      message.text.data.type ===
      SocketEvents.MULTIPLE_MESSAGE_IN_FOLLOWING_CHANNEL
    ) {
      for (let item of message.text.data.message_details) {
        console.log('item', item);
        for (let i of followingChannels) {
          if (item.channel == i.id) {
            var result = getChannelsById(item.channel);
            var channels = [];
            result.map((item) => {
              channels.push(item);
            });
            setChannelChatConversation([item]);
            updateChannelLastMsg(
              item.channel,
              item,
              channels[0].unread_msg + 1,
            );
            this.props.getLocalFollowingChannels();
            this.setChannelHeaderCount();
            break;
          }
        }
      }
    }
  }

  messageUpdateInFollowingChannel(message) {
    const {userData, followingChannels} = this.props;
    if (
      message.text.data.type ===
      SocketEvents.MESSAGE_EDITED_IN_FOLLOWING_CHANNEL
    ) {
      for (let i of followingChannels) {
        if (message.text.data.message_details.channel == i.id) {
          var result = getChannelsById(
            message.text.data.message_details.channel,
          );
          var channels = [];
          result.map((item) => {
            channels.push(item);
          });
          updateMessageById(
            message.text.data.message_details.id,
            message.text.data.message_details.message_body,
          );
          if (channels[0].last_msg.id == message.text.data.message_details.id) {
            console.log('updateasdasdasd');
            updateChannelLastMsgWithOutCount(
              message.text.data.message_details.channel,
              message.text.data.message_details,
            );
          }
          this.props.getLocalFollowingChannels();
          this.setChannelHeaderCount();
          break;
        }
      }
    }
  }

  messageDeleteInFollowingChannel(message) {
    const {userData, followingChannels} = this.props;
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
      this.props.getLocalFollowingChannels();
      this.setChannelHeaderCount();
    }
  }

  messageUnsentInFollowingChannel(message) {
    const {userData, followingChannels} = this.props;
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
        console.log('updated_last_messgae', JSON.stringify(array[0]));
        updateChannelLastMsgWithOutCount(
          message.text.data.message_details.channel,
          array[0],
        );
      }
      this.props.getLocalFollowingChannels();
      this.setChannelHeaderCount();
    }
  }

  onNewFriendRequest = (message) => {
    const {friendRequest} = this.props;

    if (message.text.data.type === SocketEvents.NEW_FRIEND_REQUEST) {
      this.getFriendRequest();
    }
  };

  //New Message in Friend
  onNewMessageInFriend(message) {
    const {userFriends} = this.props;
    const {userData} = this.props;

    if (message.text.data.type === SocketEvents.NEW_MESSAGE_IN_FREIND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getUserFriends();
        setFriendChatConversation([message.text.data.message_details]);
        updateFriendLastMsg(
          message.text.data.message_details.to_user.id,
          message.text.data.message_details,
        );
        this.props.setUserFriends();
        this.setFriendHeaderCount();
      } else if (message.text.data.message_details.to_user.id == userData.id) {
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
    const {userFriends} = this.props;
    const {userData} = this.props;

    if (message.text.data.type === SocketEvents.MESSAGE_EDITED_IN_FRIEND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getUserFriends();
        let editMessageId = message.text.data.message_details.id;
        let newMessageText = message.text.data.message_details.message_body;
        let messageType = message.text.data.message_details.msg_type;
        updateFriendMessageById(editMessageId, newMessageText, messageType);

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
          this.props.setUserFriends();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        let editMessageId = message.text.data.message_details.id;
        let newMessageText = message.text.data.message_details.message_body;
        let messageType = message.text.data.message_details.msg_type;
        updateFriendMessageById(editMessageId, newMessageText, messageType);

        var users = getLocalUserFriend(
          message.text.data.message_details.from_user.id,
        );

        var array = [];

        for (let u of users) {
          array = [...array, u];
        }

        console.log('array', JSON.stringify(array[0]));
        if (
          array.length > 0 &&
          array[0].last_msg_id == message.text.data.message_details.id
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
      if (message.text.data.message_details.from_user.id == userData.id) {
        var users = getLocalUserFriend(
          message.text.data.message_details.to_user.id,
        );
        var array = [];
        for (let u of users) {
          array = [...array, u];
        }
        deleteFriendMessageById(message.text.data.message_details.id);
        if (array[0].last_msg.id == message.text.data.message_details.id) {
          var chats = getFriendChatConversationById(
            message.text.data.message_details.channel,
          );
          var array = [];
          for (let chat of chats) {
            array = [...array, chat];
          }
          console.log('updated_last_messgae', JSON.stringify(array[0]));
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.to_user.id,
            message.text.data.message_details,
          );
        }
        this.props.getLocalFollowingChannels();
        this.setChannelHeaderCount();
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        var users = getLocalUserFriend(
          message.text.data.message_details.from_user.id,
        );
        var array = [];
        for (let u of users) {
          array = [...array, u];
        }
        deleteFriendMessageById(message.text.data.message_details.id);
        if (array[0].last_msg.id == message.text.data.message_details.id) {
          var chats = getFriendChatConversationById(
            message.text.data.message_details.channel,
          );
          var array = [];
          for (let chat of chats) {
            array = [...array, chat];
          }
          console.log('updated_last_messgae', JSON.stringify(array[0]));
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.from_user.id,
            message.text.data.message_details,
          );
        }
        this.props.getLocalFollowingChannels();
        this.setChannelHeaderCount();
      }
    }
  }

  //Unsent message on friend
  onUnsentMessageInFriend(message) {
    const {userFriends} = this.props;
    const {userData} = this.props;

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
        if (array[0].last_msg.id == message.text.data.message_details.id) {
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.to_user.id,
            message.text.data.message_details,
          );
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
        if (array[0].last_msg.id == message.text.data.message_details.id) {
          updateFriendLastMsgWithoutCount(
            message.text.data.message_details.from_user.id,
            message.text.data.message_details,
          );
        }
      }
      this.props.getLocalFollowingChannels();
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
          var item = message.text.data.message_details.unread_msg.filter(
            (item) => {
              return item.user__id === this.props.userData.id;
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
            group[0].last_msg_id == message.text.data.message_details.msg_id
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
            group[0].last_msg_id == message.text.data.message_details.msg_id
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
      for (var i in userGroups) {
        if (
          userGroups[i].group_id == message.text.data.message_details.group_id
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
      for (var i in followingChannels) {
        if (
          followingChannels[i].id ==
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
          this.props.getLocalFollowingChannels();
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
      for (var i in userFriends) {
        if (
          userFriends[i].friend == detail.friend_id &&
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
      // for (var i in this.props.followingChannels) {
      //   if (message.text.data.message_details.channel_id === i.id) {
      //     alert('channel unfollowed');
      //     break;
      //   }
      // }
      deleteChannelById(message.text.data.message_details.channel_id);
      this.props.getLocalFollowingChannels();
      this.setChannelHeaderCount();
    }
  }

  onChannelMemberRemoveCount() {
    if (
      message.text.data.type ===
        SocketEvents.MEMBER_REMOVED_FROM_CHANNEL_COUNT &&
      message.text.data.message_details.user_id === this.props.userData.id
    ) {
      updateChannelTotalMember(message.text.data.message_details.channel_id);
      this.props.getLocalFollowingChannels();
      this.setChannelHeaderCount();
    }
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
    console.log('Home -> onOpenChannelChats -> item', item);
    this.props.setCurrentChannel(item);
    this.props.navigation.navigate('ChannelChats');
  };

  onOpenGroupChats = (item) => {
    this.props.setCurrentGroup(item);
    this.props.navigation.navigate('GroupChats');
  };

  onOpenFriendChats = (item) => {
    this.props.setCurrentFriend(item);
    this.props.navigation.navigate('FriendChats');
  };

  onOpenFriendDetails = (item) => {
    console.log('item', item);
    this.props.setCurrentFriend(item);
    this.props.navigation.navigate('FriendNotes');
  };

  handleLoadMoreChannels = () => {
    this.start = this.start + 20;
    this.props.getMoreFollowingChannels(this.start).then((res) => {
      if (res.conversations.length < 20) {
        this.setState({loadMoreVisible: false});
      }
    });
  };

  renderUserChannels() {
    const {followingChannels, channelLoading} = this.props;
    const {loadMoreVisible} = this.state;

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
    //
    if (channels.length === 0 && channelLoading) {
      return <ListLoader />;
    } else if (channels.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{display: 'flex'}}
          data={channels}
          extraData={this.state}
          renderItem={({item, index}) => (
            <ChannelListItem
              key={index}
              title={item.name}
              last_msg={item.last_msg}
              description={
                item.last_msg
                  ? item.last_msg.msg_type === 'text'
                    ? item.last_msg.message_body
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
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          // ListFooterComponent={() => (
          //   <View>
          //     {channelLoading && loadMoreVisible ? <ListLoader /> : null}
          //   </View>
          // )}
          keyExtractor={(item, index) => String(index)}
          // onEndReached={this.handleLoadMoreChannels.bind(this)}
          onEndReachedThreshold={1}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noChannelFound')} />;
    }
  }

  renderUserGroups() {
    const {groupLoading, userGroups} = this.props;

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

    const pinedGroups = filteredGroups.filter((group) => group.is_pined);
    const unpinedGroups = filteredGroups.filter((group) => !group.is_pined);
    const groups = [...pinedGroups, ...unpinedGroups];
    if (groups.length === 0 && groups) {
      return <ListLoader />;
    } else if (groups.length > 0) {
      return (
        <FlatList
          data={groups}
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
                  : ''
              }
              mentions={item.mentions}
              date={
                item.timestamp >= item.joining_date
                  ? item.timestamp
                  : item.joining_date
              }
              image={item.group_picture}
              onPress={() => this.onOpenGroupChats(item)}
              unreadCount={item.unread_msg}
              isPined={item.is_pined}
            />
          )}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          // ListFooterComponent={() => (
          //   <View>{groupLoading ? <ListLoader /> : null}</View>
          // )}
          keyExtractor={(item, index) => String(index)}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noGroupFound')} />;
    }
  }

  renderUserFriends() {
    const {friendLoading, userFriends} = this.props;
    const filteredFriends = userFriends.filter(
      createFilter(this.state.searchText, ['username']),
    );
    const pinedFriends = filteredFriends.filter((friend) => friend.is_pined);
    const unpinedFriends = filteredFriends.filter((friend) => !friend.is_pined);
    const friends = [...pinedFriends, ...unpinedFriends];
    if (friends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (friends.length > 0) {
      return (
        <FlatList
          data={friends}
          extraData={this.state}
          renderItem={({item, index}) => (
            <FriendListItem
              key={index}
              user_id={item.user_id}
              last_msg_id={item.last_msg_id}
              title={item.display_name}
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
                    : item.last_msg.type === 'audio'
                    ? translate('pages.xchat.audio')
                    : ''
                  : ''
              }
              image={getAvatar(item.profile_picture)}
              date={item.timestamp}
              isOnline={item.is_online}
              isTyping={item.is_typing}
              onPress={() => this.onOpenFriendChats(item)}
              unreadCount={item.unread_msg}
              callTypingStop={(id) => {
                console.log('home_user_id', id);
                updateFriendTypingStatus(id, false);
                this.props.setUserFriends();
              }}
              onAvtarPress={() => this.onOpenFriendDetails(item)}
              isPined={item.is_pined}
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

  renderFriendRequestList() {
    const {friendRequestLoading, friendRequest} = this.props;
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
          last_msg_id={last_msg_id}
          renderItem={({item, index}) => (
            <FriendRequestListItem
              key={index}
              title={item.from_user_display_name}
              image={getAvatar(item.from_user_avatar)}
              date={item.created}
              onAcceptPress={() => this.onAcceptPress(item)}
              onRejectPress={() => this.onRejectPress(item)}
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
        Toast.show({
          title: 'Touku',
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
        Toast.show({
          title: 'Touku',
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
      orientation,
      isChannelCollapsed,
      isGroupCollapsed,
      isFriendsCollapsed,
      isFriendReqCollapse,
      searchText,
      channelHeaderCounts,
      groupHeaderCounts,
      friendHeaderCounts,
      friendRequestHeaderCounts,
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
    return (
      // <ImageBackground
      //   source={Images.image_home_bg}
      //   style={globalStyles.container}>
      <View style={globalStyles.container}>
        <HomeHeader
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

        <View style={globalStyles.container}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => this.onUserProfilePress()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 7,
              paddingHorizontal: 10,
            }}>
            <RoundedImage source={getAvatar(userData.avatar)} size={50} />
            <Text
              style={[
                globalStyles.smallNunitoRegularText,
                {
                  color: Colors.black,
                  marginStart: 10,
                  fontSize: 14,
                  fontWeight: '600',
                },
              ]}>
              {userConfig.display_name}
            </Text>
          </TouchableOpacity>
          {/* Friend Request */}
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}>
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
                  listcounts={filteredFriends.length}
                  badgeCount={this.setFriendHeaderCount()}
                  selectedLanguageItem={selectedLanguageItem}
                />
              </CollapseHeader>
              <CollapseBody>{this.renderUserFriends()}</CollapseBody>
            </Collapse>
          </KeyboardAwareScrollView>
        </View>
      </View>
      // </ImageBackground>
    );
  }
}

const DropdownHeader = (props) => {
  const {
    title,
    listcounts,
    badgeCount,
    isCollapsed,
    selectedLanguageItem,
  } = props;
  return (
    <LinearGradient
      start={{x: 0.03, y: 0.7}}
      end={{x: 0.95, y: 0.8}}
      locations={[0.065, 0.22, 0.92]}
      useAngle={true}
      angle={222.28}
      colors={[
        Colors.header_gradient_1,
        Colors.header_gradient_2,
        Colors.header_gradient_3,
      ]}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 15,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {Platform.OS === 'ios' ? (
          <TextInput
            pointerEvents="none"
            editable={false}
            style={[
              globalStyles.smallRegularText,
              {
                fontSize: 14,
                fontWeight: '400',
                color: '#fff',
                textShadowColor: 'rgba(0,0,0,.004)',
                textShadowOffset: {width: 1, height: 1},
                textShadowRadius: 10,
              },
            ]}>
            {title}
          </TextInput>
        ) : (
          <Text
            style={[
              globalStyles.smallRegularText,
              {
                fontSize: 14,
                fontWeight: '400',
                color: '#fff',
                textShadowColor: 'rgba(0,0,0,.004)',
                textShadowOffset: {width: 1, height: 1},
                textShadowRadius: 10,
              },
            ]}>
            {title}
          </Text>
        )}
        <Text
          style={[
            globalStyles.smallRegularText,
            {
              marginStart: 5,
              fontSize: 14,
              fontWeight: '400',
              textShadowColor: 'rgba(0,0,0,.004)',
              color: '#fff',
              textShadowOffset: {width: 1, height: 1},
              textShadowRadius: 1,
            },
          ]}>
          {'('}
          {listcounts}
          {')'}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {badgeCount > 0 ? (
          <Badge
            style={{
              backgroundColor: Colors.green,
              color: Colors.white,
              fontSize: normalize(9),
            }}>
            {badgeCount}
          </Badge>
        ) : null}
        <Image
          source={isCollapsed ? Icons.icon_arrow_down : Icons.icon_arrow_up}
          style={{
            width: 10,
            height: 10,
            resizeMode: 'contain',
            marginStart: 10,
          }}
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigationFocus(Home));
