import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
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

import {homeStyles} from './styles';
import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {Images, Colors, Icons, SocketEvents} from '../../constants';
import {SearchInput} from '../../components/TextInputs';
import RoundedImage from '../../components/RoundedImage';
import {getAvatar, eventService} from '../../utils';
import {ProfileModal} from '../../components/Modals';
import {ChannelListItem} from '../../components/ListItems';
import FriendListItem from '../../components/ListItems/FriendListItem';
import GroupListItem from '../../components/ListItems/GroupListItem';
import NoData from '../../components/NoData';
import Button from '../../components/Button';
import {ListLoader} from '../../components/Loaders';
import SingleSocket from '../../helpers/SingleSocket';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {
  getUserProfile,
  getMissedSocketEventsById,
} from '../../redux/reducers/userReducer';
import {getUserConfiguration} from '../../redux/reducers/configurationReducer';
import {
  getMoreFollowingChannels,
  getFollowingChannels,
  setCurrentChannel,
  updateFollowingChannels,
} from '../../redux/reducers/channelReducer';
import {
  getUserGroups,
  setCurrentGroup,
} from '../../redux/reducers/groupReducer';
import {
  getUserFriends,
  getFriendRequests,
  setCurrentFriend,
} from '../../redux/reducers/friendReducer';

class Home extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isChannelCollapsed: true,
      isGroupCollapsed: false,
      isFriendsCollapsed: false,
      searchText: '',
      showDropdown: false,
      loadMoreVisible: true,

      userFriendsState: this.props.userFriends,
      followingChannelsState: this.props.followingChannels,
      userGroupsState: this.props.userGroups,

      channelHeaderCounts: 0,
      groupHeaderCounts: 0,
      friendHeaderCounts: 0,
    };
    this.SingleSocket = new SingleSocket();
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

    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });
  }

  componentWillUnmount() {
    this.events.unsubscribe();
  }

  async componentDidMount() {
    this.props.getUserProfile();
    this.SingleSocket.create({user_id: this.props.userData.id});
    Orientation.addOrientationListener(this._orientationDidChange);

    this.getFollowingChannels();
    this.getUserGroups();
    this.getUserFriends();
    this.props.getFriendRequests();
    this.props.getUserConfiguration();
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  getFollowingChannels() {
    this.props.getFollowingChannels().then((res) => {
      this.setState(
        {
          followingChannelsState: this.props.followingChannels,
        },
        () => {
          if (res.conversations.length > 0) {
            this.handleLoadMoreChannels();
          }
          let counts = 0;
          for (var channel of this.state.followingChannelsState) {
            counts = counts + channel.unread_msg;
          }
          this.setState({channelHeaderCounts: counts});
          // this.props.updateFollowingChannels(this.state.followingChannelsState);
        },
      );
    });
  }

  getUserGroups() {
    this.props.getUserGroups().then((res) => {
      this.setState({userGroupsState: this.props.userGroups}, () => {
        let counts = 0;
        for (let group of this.state.userGroupsState) {
          counts = counts + group.unread_msg;
        }
        this.setState({groupHeaderCounts: counts});
      });
    });
  }

  getUserFriends() {
    this.setState({userFriendsState: this.props.userFriends}, () => {
      this.props.getUserFriends().then((res) => {
        this.setState({userFriendsState: this.props.userFriends}, () => {
          let counts = 0;
          for (let friend of this.state.userFriendsState) {
            counts = counts + friend.unread_msg;
          }
          this.setState({friendHeaderCounts: counts});
        });
      });
    });
  }

  checkEventTypes(message) {
    switch (message.text.data.type) {
      case SocketEvents.USER_ONLINE_STATUS:
        this.setFriendsOnlineStatus(message);
      case SocketEvents.READ_ALL_MESSAGE_FRIEND_CHAT:
        this.readAllMessageFriendChat(message);
      case SocketEvents.CHECK_IS_USER_ONLINE:
      // this.checkIsUserOnline(message);
      case SocketEvents.READ_ALL_MESSAGE_CHANNEL_CHAT:
        this.readAllMessageChannelChat(message);
      case SocketEvents.READ_ALL_MESSAGE_GROUP_CHAT:
        this.readAllMessageGroupChat(message);
      case SocketEvents.FRIEND_TYPING_MESSAGE:
        this.friendIsTyping(message);
      case SocketEvents.NEW_MESSAGE_IN_GROUP:
        this.onNewMessageInGroup(message);
      case SocketEvents.NEW_MESSAGE_IN_FREIND:
        this.onNewMessageInFriend(message);
      case SocketEvents.MESSAGE_IN_FOLLOWING_CHANNEL:
        this.messageInFollowingChannel(message);
    }
  }

  checkIsUserOnline(message) {
    if (message.text.data.message_details.user_id === this.props.userData.id) {
      const payload = {
        type: SocketEvents.CHECK_IS_USER_ONLINE,
        data: {},
      };
      this.SingleSocket.sendMessage(JSON.stringify(payload));
    }
  }

  //Friend is Typing
  friendIsTyping(message) {
    const {userFriendsState} = this.state;
    if (message.text.data.message_details.type === 'personal') {
      for (var i in userFriendsState) {
        if (
          userFriendsState[i].user_id ==
            message.text.data.message_details.sender_user_id &&
          this.props.userData.id ==
            message.text.data.message_details.receiver_user_id
        ) {
          if (message.text.data.message_details.status === 'typing') {
            userFriendsState[i].is_typing = true;
          } else {
            userFriendsState[i].is_typing = false;
          }
          break;
        }
      }
      this.setState({userFriendsState});
    } else {
      for (var i in userFriendsState) {
        userFriendsState[i].is_typing = false;
      }
    }
  }

  //Set Friend's online status with socket event
  setFriendsOnlineStatus(message) {
    const {userFriendsState} = this.state;
    if (message.text.data.type === SocketEvents.USER_ONLINE_STATUS) {
      for (var i in userFriendsState) {
        if (
          userFriendsState[i].user_id ==
          message.text.data.message_details.user_id
        ) {
          if (message.text.data.message_details.status === 'online') {
            userFriendsState[i].is_online = true;
          } else {
            userFriendsState[i].is_online = false;
          }
          break;
        }
      }
      this.setState({userFriendsState});
    }
  }

  //Message in Following Channel
  messageInFollowingChannel(message) {
    const {followingChannelsState} = this.state;
    const {userData} = this.props;

    if (message.text.data.type === SocketEvents.MESSAGE_IN_FOLLOWING_CHANNEL) {
      for (let i of followingChannelsState) {
        if (message.text.data.message_details.channel == i.id) {
          if (message.text.data.message_details.from_user.id == userData.id) {
            this.getFollowingChannels();
            break;
          } else if (
            message.text.data.message_details.to_user != null &&
            message.text.data.message_details.to_user.id == userData.id
          ) {
            this.getFollowingChannels();
            break;
          }
          break;
        }
      }
    }
  }

  //New Message in Friend
  onNewMessageInFriend(message) {
    const {userFriendsState} = this.state;
    const {userData} = this.props;

    if (message.text.data.type === SocketEvents.NEW_MESSAGE_IN_FREIND) {
      for (var i in userFriendsState) {
        if (message.text.data.message_details.from_user.id == userData.id) {
          this.getUserFriends();
          break;
        } else if (
          message.text.data.message_details.to_user.id == userData.id
        ) {
          this.getUserFriends();
          break;
        }
      }
      this.setState({userFriendsState});
    }
  }

  //New Message in Group
  onNewMessageInGroup(message) {
    const {userGroupsState} = this.state;
    if (message.text.data.type === SocketEvents.NEW_MESSAGE_IN_GROUP) {
      for (let i of userGroupsState) {
        if (i.group_id === message.text.data.message_details.group_id) {
          this.getUserGroups();
          break;
        }
      }
      this.setState({userGroupsState});
    }
  }

  //Mark as Read Group Chat
  readAllMessageGroupChat(message) {
    const {userGroupsState} = this.state;
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_GROUP_CHAT) {
      for (var i in userGroupsState) {
        if (
          userGroupsState[i].group_id ==
          message.text.data.message_details.group_id
        ) {
          userGroupsState[i].unread_msg =
            message.text.data.message_details.read_count;
          this.props.getMissedSocketEventsById(
            message.text.data.socket_event_id,
          );
          this.getUserGroups();
          break;
        }
      }
      // this.setState({userGroupsState});
    }
  }

  //Read Channel's all messages with socket event
  readAllMessageChannelChat(message) {
    const {followingChannelsState} = this.state;
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_CHANNEL_CHAT) {
      for (var i in followingChannelsState) {
        if (
          followingChannelsState[i].id ==
          message.text.data.message_details.channel_id
        ) {
          followingChannelsState[i].unread_msg =
            message.text.data.message_details.read_count;
          this.props.getMissedSocketEventsById(
            message.text.data.socket_event_id,
          );
          this.getFollowingChannels();
          break;
        }
      }
      // this.setState({followingChannelsState});
    }
  }

  //Read Friend's all messages with socket event
  readAllMessageFriendChat(message) {
    const {userFriendsState} = this.state;
    let detail = message.text.data.message_details;
    if (message.text.data.type === SocketEvents.READ_ALL_MESSAGE_FRIEND_CHAT) {
      for (var i in userFriendsState) {
        if (
          userFriendsState[i].friend == detail.friend_id &&
          detail.read_by === this.props.userData.id
        ) {
          userFriendsState[i].unread_msg =
            message.text.data.message_details.read_count;
          this.props.getMissedSocketEventsById(
            message.text.data.socket_event_id,
          );
          this.getUserFriends();
          break;
        }
      }
      // this.setState({userFriendsState});
    }
  }

  onSearch = (text) => {
    this.setState({searchText: text});
  };

  onUserProfilePress() {
    ProfileModal.show();
  }

  onOpenChannelChats = (item) => {
    this.props.setCurrentChannel(item);
    this.props.navigation.navigate('ChannelChats');
    console.log('Channel image.....' + JSON.stringify(item));
  };

  onOpenGroupChats = (item) => {
    this.props.setCurrentGroup(item);
    this.props.navigation.navigate('GroupChats');
  };

  onOpenFriendChats = (item) => {
    this.props.setCurrentFriend(item);
    this.props.navigation.navigate('FriendChats');
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
    const filteredChannels = followingChannels.filter(
      createFilter(this.state.searchText, ['name']),
    );

    if (filteredChannels.length === 0 && channelLoading) {
      return <ListLoader />;
    } else if (filteredChannels.length > 0) {
      return (
        <FlatList
          contentContainerStyle={{display: 'flex'}}
          data={filteredChannels}
          extraData={this.state}
          renderItem={({item, index}) => (
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
          )}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          // ListFooterComponent={() => (
          //   <View>
          //     {channelLoading && loadMoreVisible ? <ListLoader /> : null}
          //   </View>
          // )}
          keyExtractor={(item, index) => String(index)}
          onEndReached={this.handleLoadMoreChannels.bind(this)}
          onEndReachedThreshold={1}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noChannelFound')} />;
    }
  }

  renderUserGroups() {
    const {groupLoading} = this.props;
    const {userGroupsState} = this.state;

    const filteredGroups = userGroupsState.filter(
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
    const {friendLoading} = this.props;
    const {userFriendsState} = this.state;
    const filteredFriends = userFriendsState.filter(
      createFilter(this.state.searchText, ['username']),
    );

    if (filteredFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          data={filteredFriends}
          extraData={this.state}
          renderItem={({item, index}) => (
            <FriendListItem
              key={index}
              title={item.username}
              description={item.last_msg}
              image={getAvatar(item.profile_picture)}
              date={item.timestamp}
              isOnline={item.is_online}
              isTyping={item.is_typing}
              onPress={() => this.onOpenFriendChats(item)}
              unreadCount={item.unread_msg}
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
      searchText,
      userFriendsState,
      userGroupsState,
      channelHeaderCounts,
      groupHeaderCounts,
      friendHeaderCounts,
    } = this.state;

    const {followingChannels, userData, userConfig} = this.props;
    const filteredChannels = followingChannels.filter(
      createFilter(searchText, ['name']),
    );
    const filteredGroups = userGroupsState.filter(
      createFilter(searchText, ['group_name']),
    );
    const filteredFriends = userFriendsState.filter(
      createFilter(searchText, ['username']),
    );
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HomeHeader title={translate('pages.xchat.home')} />
          <SearchInput
            onChangeText={this.onSearch.bind(this)}
            onIconRightClick={this.showDropdown}
            navigation={this.props.navigation}
          />
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
                  globalStyles.normalRegularText,
                  {color: Colors.black, marginStart: 10},
                ]}>
                {userConfig.display_name}
              </Text>
            </TouchableOpacity>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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
                    badgeCount={channelHeaderCounts}
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
                    badgeCount={groupHeaderCounts}
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
                    badgeCount={friendHeaderCounts}
                  />
                </CollapseHeader>
                <CollapseBody>{this.renderUserFriends()}</CollapseBody>
              </Collapse>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const DropdownHeader = (props) => {
  const {title, listcounts, badgeCount, isCollapsed} = props;
  return (
    <LinearGradient
      start={{x: 0.1, y: 0.7}}
      end={{x: 0.7, y: 0.8}}
      locations={[0.2, 0.7, 1]}
      colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 15,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={globalStyles.smallRegularText}>{title}</Text>
        <Text style={[globalStyles.smallRegularText, {marginStart: 5}]}>
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
              fontSize: 11,
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
  updateFollowingChannels,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
