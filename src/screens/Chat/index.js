import React, {Component} from 'react';
import {View, ImageBackground, FlatList} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createFilter} from 'react-native-search-filter';
import {withNavigationFocus} from 'react-navigation';

import {Images, SocketEvents} from '../../constants';
import {SearchInput} from '../../components/TextInputs';
import {getAvatar, eventService} from '../../utils';
import {
  ChannelListItem,
  FriendListItem,
  GroupListItem,
} from '../../components/ListItems';
import NoData from '../../components/NoData';
import {ListLoader} from '../../components/Loaders';

import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';

import {
  getUserProfile,
  getMissedSocketEventsById,
} from '../../redux/reducers/userReducer';
import {
  getUserConfiguration,
  updateConfiguration,
} from '../../redux/reducers/configurationReducer';
import {setCommonChatConversation} from '../../redux/reducers/commonReducer';
import {
  getUserChannels,
  getFollowingChannels,
  setCurrentChannel,
  getMoreFollowingChannels,
  getLocalFollowingChannels,
  setChannelConversation,
} from '../../redux/reducers/channelReducer';
import {setFriendRequest} from '../../redux/reducers/addFriendReducer';
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
} from '../../redux/reducers/groupReducer';
import {getFriendRequest} from '../../redux/reducers/addFriendReducer';
import {
  getUserFriends,
  getFriendRequests,
  setCurrentFriend,
  updateUnreadFriendMsgsCounts,
  getUserFriendsSuccess,
  setUserFriends,
  setFriendConversation,
} from '../../redux/reducers/friendReducer';
import SingleSocket from '../../helpers/SingleSocket';

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
  updateFriendOnlineStatus,
  updateFriendTypingStatus,
  getGroups,
  setGroups,
  setFriendRequests,
  deleteFriendRequest,
  setChannels,
  deleteGroupById,
  deleteAllGroupMessageByGroupId,
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
  getLocalFriendRequests,
  deleteChannelById,
  updateChannelTotalMember,
  updateChannelLastMsgWithOutCount,
  getFriendChatConversationById,
  getGroupChatConversationById,
  updateLastEventId,
} from '../../storage/Service';

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
      sortOptions: [
        {
          title: translate('pages.xchat.timeReceived'),
          onPress: () => this.shotListBy('time'),
        },
        {
          title: translate('pages.xchat.unreadMessages'),
          onPress: () => this.shotListBy('unread'),
        },
        {
          title: translate('pages.setting.name'),
          onPress: () => this.shotListBy('name'),
        },
      ],
    };
    this.SingleSocket = new SingleSocket();
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });
  }

  async componentDidMount() {
    this.props.getUserProfile();
    this.SingleSocket.create({user_id: this.props.userData.id});
    Orientation.addOrientationListener(this._orientationDidChange);
    // this.getFollowingChannels();
    // this.getUserGroups();
    // this.getUserFriends();
    // this.setCommonConversation();
    this.props.getUserConfiguration();
    this.props.getFriendRequest();

    this.props.getFollowingChannels().then((res) => {
      this.props.getUserGroups().then((res) => {
        this.props.getUserFriends().then((res) => {
          this.setCommonConversation();
        });
      });
    });

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

    // this.focusListener = this.props.navigation.addListener(
    //   'didFocus',
    //   async () => this.updateData(),
    // );
  }

  componentWillUnmount() {
    this.SingleSocket && this.SingleSocket.closeSocket();
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
      await this.setState({
        isLoading: false,
      });
    });
  };

  checkEventTypes(message) {
    //console.log(JSON.stringify(message));
    console.log(
      'checkEventTypes -> message.text.data.type',
      message.text.data.type,
    );
    if (message.text.data.socket_event_id) {
      updateLastEventId(message.text.data.socket_event_id);
    }
    switch (message.text.data.type) {
      case SocketEvents.USER_ONLINE_STATUS:
        this.setFriendsOnlineStatus(message);
        break;
      case SocketEvents.FRIEND_TYPING_MESSAGE:
        this.setFriendsTypingStatus(message);
        break;
      case SocketEvents.CHECK_IS_USER_ONLINE:
        // this.checkIsUserOnline(message);
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
      case SocketEvents.FRIEND_TYPING_MESSAGE:
        // this.friendIsTyping(message);
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
      case SocketEvents.UNSENT_MESSAGE_IN_FRIEND:
        this.onUnsentMessageInFriend(message);
        break;
      case SocketEvents.UNFRIEND:
        removeUserFriends(message.text.data.message_details.user_id);
        console.log('get local freinds');
        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
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
      case SocketEvents.REMOVE_GROUP_MEMBER:
        this.onRemoveGroupMember(message);
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
      case SocketEvents.PINED_CHANNEL:
        break;
      case SocketEvents.UNPINED_CHANNEL:
        break;
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
            updateFriendOnlineStatus(
              message.text.data.message_details.user_id,
              true,
            );
          } else {
            updateFriendOnlineStatus(
              message.text.data.message_details.user_id,
              false,
            );
          }
          this.props.setUserFriends().then((res) => {
            this.props.setCommonChatConversation();
          });
          break;
        }
      }
    }
  }

  //Set Friend's typing status with socket event
  setFriendsTypingStatus(message) {
    const {userFriends} = this.props;
    if (message.text.data.type === SocketEvents.FRIEND_TYPING_MESSAGE) {
      for (var i in userFriends) {
        if (
          userFriends[i].user_id ==
          message.text.data.message_details.sender_user_id
        ) {
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

          // this.props.getMissedSocketEventsById(
          //   message.text.data.socket_event_id,
          // );
          // this.getUserFriends();
          this.props.setUserFriends().then((res) => {
            this.props.setCommonChatConversation();
          });

          break;
        }
      }
    }
  }

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
          // this.props.getMissedSocketEventsById(
          //   message.text.data.socket_event_id,
          // );
          // this.getFollowingChannels();
          this.props.getLocalFollowingChannels().then((res) => {
            this.props.setCommonChatConversation();
          });
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

          // this.props.getMissedSocketEventsById(
          //   message.text.data.socket_event_id,
          // );
          this.props.getLocalUserGroups().then((res) => {
            this.props.setCommonChatConversation();
          });
          // this.getUserGroups();
          break;
        }
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
          this.props.getLocalUserGroups().then((res) => {
            this.props.setCommonChatConversation();
          });
          break;
        }
      }
      if (
        currentGroup &&
        message.text.data.message_details.group_id == currentGroup.group_id
      ) {
        this.getLocalGroupConversation();
      }
    }
  }

  editMessageFromGroup(message) {
    const {userGroups, currentGroup} = this.props;
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
          this.props.getLocalUserGroups().then((res) => {
            this.props.setCommonChatConversation();
          });
          break;
        }
      }
      if (
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
          this.props.getLocalUserGroups().then((res) => {
            this.props.setCommonChatConversation();
          });
          break;
        }
      }
      if (
        currentGroup &&
        message.text.data.message_details.group_id == currentGroup.group_id
      ) {
        this.getLocalGroupConversation();
      }
    }
  }

  //Message in Following Channel
  messageInFollowingChannel(message) {
    const {userData, followingChannels, currentChannel} = this.props;
    console.log('messageInFollowingChannel -> currentChannel', currentChannel);

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
              channels[0].unread_msg + 1,
            );
            this.props.getLocalFollowingChannels().then((res) => {
              this.props.setCommonChatConversation();
            });
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
            this.props.getLocalFollowingChannels().then((res) => {
              this.props.setCommonChatConversation();
            });
            break;
          }
          break;
        }
      }
      if (
        currentChannel &&
        message.text.data.message_details.channel == currentChannel.id
      ) {
        this.getLocalChannelConversations();
      }
    }
  }

  //Multiple Message in Following Channel
  multipleMessageInFollowingChannel(message) {
    const {userData, followingChannels, currentChannel} = this.props;
    console.log('multipleMessageInFollowingChannel -> userData', userData.id);
    console.log(
      'multipleMessageInFollowingChannel -> currentChannel',
      currentChannel,
    );
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
            this.props.getLocalFollowingChannels().then(() => {
              this.props.setCommonChatConversation();
            });
            break;
          }
        }
        if (currentChannel && item.channel == currentChannel.id) {
          this.getLocalChannelConversations();
        }
      }
    }
  }

  messageUpdateInFollowingChannel(message) {
    const {userData, followingChannels, currentChannel} = this.props;
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
          this.props.getLocalFollowingChannels().then(() => {
            this.props.setCommonChatConversation();
          });
          break;
        }
      }
      if (
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
        console.log('updated_last_messgae', JSON.stringify(array[0]));
        updateChannelLastMsgWithOutCount(
          message.text.data.message_details.channel,
          array[0],
        );
      }
      this.props.getLocalFollowingChannels().then(() => {
        this.props.setCommonChatConversation();
      });
      if (
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
      this.props.getLocalFollowingChannels().then((res) => {
        this.props.setCommonChatConversation();
      });
    }
  }

  //On Remove Channel Member
  onRemoveChannelMember(message) {
    if (
      message.text.data.type === SocketEvents.REMOVE_MEMBER_FROM_CHANNEL &&
      message.text.data.message_details.user_id === this.props.userData.id
    ) {
      deleteChannelById(message.text.data.message_details.channel_id);
      this.props.getLocalFollowingChannels().then((res) => {
        this.props.setCommonChatConversation();
      });
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
    console.log(
      'onNewMessageInFriend -> onNewMessageInFriend currentFriend',
      currentFriend,
    );

    if (message.text.data.type === SocketEvents.NEW_MESSAGE_IN_FREIND) {
      if (message.text.data.message_details.from_user.id == userData.id) {
        // this.getUserFriends();
        setFriendChatConversation([message.text.data.message_details]);
        updateFriendLastMsg(
          message.text.data.message_details.to_user.id,
          message.text.data.message_details,
        );
        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });

        if (
          currentFriend &&
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          this.getLocalFriendConversation();
        }
      } else if (message.text.data.message_details.to_user.id == userData.id) {
        setFriendChatConversation([message.text.data.message_details]);
        updateFriendLastMsg(
          message.text.data.message_details.from_user.id,
          message.text.data.message_details,
        );
        // this.getUserFriends();
        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
        if (
          currentFriend &&
          message.text.data.message_details.from_user.id ==
            currentFriend.user_id
        ) {
          this.getLocalFriendConversation();
        }
      }
    }
  }

  getLocalFriendConversation = () => {
    let chat = getFriendChatConversationById(this.props.currentFriend.friend);
    if (chat.length) {
      let conversations = [];
      chat.map((item, index) => {
        conversations = [...conversations, item];
      });
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

      console.log('array', JSON.stringify(array[0]));
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
    console.log('onDeleteMessageInFriend -> currentFriend', currentFriend);
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
          currentFriend &&
          message.text.data.message_details.to_user.id == currentFriend.user_id
        ) {
          deleteFriendMessageById(message.text.data.message_details.id);
          let friendChat = getFriendChatConversationById(currentFriend.friend);
          this.props.setFriendConversation(friendChat);
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
          currentFriend &&
          message.text.data.message_details.from_user.id ==
            currentFriend.user_id
        ) {
          deleteFriendMessageById(message.text.data.message_details.id);
          let friendChat = getFriendChatConversationById(currentFriend.friend);
          this.props.setFriendConversation(friendChat);
        }

        this.props.setUserFriends().then((res) => {
          this.props.setCommonChatConversation();
        });
      }
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

  onDeleteMessageInGroup(message) {
    const {userGroups, userData, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.DELETE_MESSAGE_IN_GROUP) {
      for (let i of userGroups) {
      }
    }
    if (
      currentGroup &&
      message.text.data.message_details.group_id == currentGroup.group_id
    ) {
      deleteGroupMessageById(message.text.data.message_details.msg_id);
      let chat = getGroupChatConversationById(currentGroup.group_id);
      this.props.setGroupConversation(chat);
    }
  }

  onCreateNewGroup(message) {
    const {userGroups, userData} = this.props;
    if (message.text.data.type === SocketEvents.CREATE_NEW_GROUP) {
      for (let id of message.text.data.message_details.members) {
        if (id == userData.id) {
          var item = message.text.data.message_details;
          var group = {
            group_id: item.id,
            group_name: item.name,
            unread_msg: 0,
            total_members: item.members.length,
            description: item.description,
            chat: 'group',
            group_picture: item.group_picture,
            last_msg: null,
            last_msg_id: null,
            timestamp: item.timestamp,
            event: `group_${item.id}`,
            no_msgs: true,
            is_pined: false,
            sender_id: null,
            sender_username: null,
            sender_display_name: null,
            mentions: null,
            reply_to: null,
          };
          setGroups([group]);
          this.props.getLocalUserGroups().then((res) => {
            this.props.setCommonChatConversation();
          });
          break;
        }
      }
    }
  }

  onDeleteGroup(message) {
    const {userGroups, userData} = this.props;
    if (message.text.data.type === SocketEvents.DELETE_GROUP) {
      for (let i of userGroups) {
        if (i.group_id === message.text.data.message_details.group_id) {
          deleteGroupById(message.text.data.message_details.group_id);
          deleteAllGroupMessageByGroupId(
            message.text.data.message_details.group_id,
          );
          this.props.getLocalUserGroups().then((res) => {
            this.props.setCommonChatConversation();
          });
          break;
        }
      }
    }
  }

  onAddGroupMember(message) {
    const {userGroups, userData, currentGroup} = this.props;
    if (message.text.data.type === SocketEvents.DELETE_GROUP) {
      for (let i of userGroups) {
        if (i.group_id === message.text.data.message_details.group_id) {
        }
      }
    }
    if (
      currentGroup &&
      message.text.data.message_details.group_id == currentGroup.group_id
    ) {
      this.getGroupDetail();
      this.getGroupMembers();
    }
  }

  onRemoveGroupMember(message) {
    const {currentGroup} = this.props;
    if (
      currentGroup &&
      message.text.data.message_details.group_id == currentGroup.group_id
    ) {
      this.getGroupDetail();
      this.getGroupMembers();
    }
  }

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
        message.text.data.message_details.group_id == currentGroup.group_id
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
      deleteFriendRequest(
        message.text.data.message_details.conversation.user_id,
      );
      this.props.setFriendRequest();
      handleRequestAccept(message.text.data.message_details.conversation);
      this.props.setUserFriends().then(() => {
        this.props.setCommonChatConversation();
      });
    }
  };

  onSearch = async (text) => {
    await this.setState({searchText: text, commonConversation: []});
    // this.getCommonChat();
  };

  onOpenChannelChats = (item) => {
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

  getLocalChannelConversations = () => {
    let chat = getChannelChatConversationById(this.props.currentChannel.id);
    if (chat.length) {
      let conversations = [];
      chat.map((item, index) => {
        conversations = [...conversations, item];
      });
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
        Toast.show({
          title: 'Touku',
          text: translate('common.somethingWentWrong'),
          type: 'primary',
        });
      });
  }

  getGroupMembers() {
    this.props
      .getGroupMembers(this.props.currentGroup.group_id)
      .then((res) => {
        this.props.setCurrentGroupMembers(res.results);
      })
      .catch((err) => {});
  }

  getLocalGroupConversation = () => {
    let chat = getGroupChatConversationById(this.props.currentGroup.group_id);
    if (chat.length) {
      let conversations = [];
      chat.map((item, index) => {
        conversations = [...conversations, item];
      });
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

        this.props.updateConfiguration(sortData).then((res) => {
          // this.setState({
          //   sortBy: res.sort_by,
          // });
        });
        return;
      }
      case 'unread': {
        let sortData = {
          sort_by: sortBy,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData).then((res) => {
          // this.setState({
          //   sortBy: res.sort_by,
          // });
        });
        return;
      }
      case 'name': {
        let sortData = {
          sort_by: sortBy,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData).then((res) => {
          // this.setState({
          //   sortBy: res.sort_by,
          // });
        });
        return;
      }
      default:
        let sortData = {
          sort_by: this.props.userConfig.sort_by,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData).then((res) => {
          // this.setState({
          //   sortBy: res.sort_by,
          // });
        });
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
          new Date(a.last_msg ? a.last_msg.created : a.created) <
            new Date(b.last_msg ? b.last_msg.created : b.created)
            ? 1
            : a.created &&
              b.timestamp &&
              new Date(a.last_msg ? a.last_msg.created : a.created) <
                new Date(b.timestamp)
            ? 1
            : a.timestamp &&
              b.created &&
              new Date(a.timestamp) <
                new Date(b.last_msg ? b.last_msg.created : b.created)
            ? 1
            : a.timestamp &&
              b.timestamp &&
              new Date(a.timestamp) < new Date(b.timestamp)
            ? 1
            : -1,
        );

        return;
      }
      case 'unread': {
        commonConversation.sort((a, b) =>
          a.created &&
          b.created &&
          new Date(a.last_msg ? a.last_msg.created : a.created) >
            new Date(b.last_msg ? b.last_msg.created : b.created)
            ? 1
            : a.created &&
              b.timestamp &&
              new Date(a.last_msg ? a.last_msg.created : a.created) >
                new Date(b.timestamp)
            ? 1
            : a.timestamp &&
              b.created &&
              new Date(a.timestamp) >
                new Date(b.last_msg ? b.last_msg.created : b.created)
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
        return;
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

        return;
      }
      default:
        return;
    }
  };

  renderCommonChat = () => {
    const {isLoading} = this.state;
    const commonChat = this.props.commonChat;
    const commonConversation = commonChat.filter(
      createFilter(this.state.searchText, [
        'name',
        'group_name',
        'display_name',
      ]),
    );
    this.sortList();
    if (commonConversation.length === 0 && isLoading) {
      return <ListLoader />;
    } else if (commonConversation.length > 0 && isLoading) {
      return <ListLoader />;
    } else if (commonConversation.length > 0) {
      return (
        <FlatList
          data={commonConversation}
          renderItem={({item, index}) =>
            item.chat === 'group' ? (
              <GroupListItem
                key={index}
                title={item.group_name}
                description={
                  item.last_msg
                    ? item.last_msg.type === 'text'
                      ? item.last_msg.text
                      : item.last_msg.type
                    : ''
                }
                date={item.timestamp}
                image={item.group_picture}
                onPress={() => this.onOpenGroupChats(item)}
                unreadCount={item.unread_msg}
              />
            ) : item.chat === 'channel' ? (
              <ChannelListItem
                key={index}
                title={item.name}
                description={
                  item.last_msg
                    ? item.last_msg.msg_type === 'text'
                      ? item.last_msg.message_body
                      : item.last_msg.msg_type
                    : ''
                }
                date={item.created}
                image={item.channel_picture}
                onPress={() => this.onOpenChannelChats(item)}
                unreadCount={item.unread_msg}
              />
            ) : (
              <FriendListItem
                key={index}
                title={item.display_name}
                description={
                  item.last_msg
                    ? item.last_msg_type === 'text'
                      ? item.last_msg
                      : item.last_msg_type
                    : ''
                }
                image={getAvatar(item.profile_picture)}
                date={item.timestamp}
                isOnline={item.is_online}
                onPress={() => this.onOpenFriendChats(item)}
                unreadCount={item.unread_msg}
                isTyping={item.is_typing}
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
    } else {
      return <NoData title={translate('pages.xchat.noChannelFound')} />;
    }
  };

  render() {
    const {orientation} = this.state;
    return (
      // <ImageBackground
      //   source={Images.image_home_bg}
      //   style={globalStyles.container}>
      <View style={globalStyles.container}>
        <HomeHeader
          title={translate('pages.xchat.chat')}
          isSortOptions
          menuItems={this.state.sortOptions}
          onChangeText={this.onSearch.bind(this)}
          navigation={this.props.navigation}
          isSearchBar
        />
        {/* <SearchInput
            onChangeText={this.onSearch.bind(this)}
            navigation={this.props.navigation}
          /> */}
        <View style={globalStyles.container}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            {this.renderCommonChat()}
          </KeyboardAwareScrollView>
        </View>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigationFocus(Chat));
