import React, { Component } from 'react';
import { View, ImageBackground, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createFilter } from 'react-native-search-filter';
import { withNavigationFocus } from 'react-navigation';

import { Images, SocketEvents } from '../../constants';
import { SearchInput } from '../../components/TextInputs';
import { getAvatar, eventService } from '../../utils';
import {
  ChannelListItem,
  FriendListItem,
  GroupListItem,
} from '../../components/ListItems';
import NoData from '../../components/NoData';
import { ListLoader } from '../../components/Loaders';

import { globalStyles } from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import { setI18nConfig, translate } from '../../redux/reducers/languageReducer';

import { getUserProfile } from '../../redux/reducers/userReducer';
import {
  getUserConfiguration,
  updateConfiguration,
} from '../../redux/reducers/configurationReducer';
import {
  getUserChannels,
  getFollowingChannels,
  setCurrentChannel,
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
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({ orientation: initial });
    this.events = eventService.getMessage().subscribe((message) => {
      this.checkEventTypes(message);
    });
  }

  async componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    // this.props.getUserChannels();
    // await this.props.getFollowingChannels().then((res) => {
    //   this.props.getFriendRequests().then((res) => {
    //     this.props.getUserConfiguration().then((res) => {
    //       this.getCommonChat();
    //     });
    //   });
    // });

      this.props.getUserConfiguration()

    this.getCommonChat();

    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      async () => this.updateData()
    );
  }
  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  updateData = async () => {
    console.log('Chat -> updateData -> updateData');
    await this.props.getFollowingChannels().then((res) => {
      this.props.getFriendRequests().then((res) => {
       // this.props.getUserConfiguration().then((res) => {
          this.getUpdatedCommonChat();
       // });
      });
    });
  };

  updateGroupData = async()=>{
    await this.props.getUserGroups().then((res) => {
          this.getUpdatedCommonChat();
    });
  }

  checkEventTypes(message) {
    console.log(JSON.stringify(message));
    switch (message.text.data.type) {
      case SocketEvents.USER_ONLINE_STATUS:
        // console.log('Chat -> checkEventTypes -> setFriendsOnlineStatus');
        this.updateData();
        return;
      case SocketEvents.NEW_MESSAGE_IN_GROUP:
        // console.log('Chat -> checkEventTypes -> onNewMessageInGroup');
        this.updateData();
        return;
      case SocketEvents.NEW_MESSAGE_IN_FREIND:
        // console.log('Chat -> checkEventTypes -> onNewMessageInFriend');
        this.updateData();
        return;
      case SocketEvents.MESSAGE_IN_FOLLOWING_CHANNEL:
        // console.log('Chat -> checkEventTypes -> MESSAGE_IN_FOLLOWING_CHANNEL');
        this.updateData();
        return;
      case SocketEvents.READ_ALL_MESSAGE_CHANNEL_CHAT:
        // console.log('Chat -> checkEventTypes -> READ_ALL_MESSAGE_CHANNEL_CHAT');
        this.updateData();
        return;
    }
  }

  onSearch = async (text) => {
    await this.setState({ searchText: text, commonConversation: [] });
    this.getCommonChat();
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

  async getCommonChat() {
    const {
      followingChannels,
      userGroups,
      userFriends,
      channelLoading,
      groupLoading,
      friendLoading,
    } = this.props;
    const filteredChannels = followingChannels.filter(
      createFilter(this.state.searchText, ['name'])
    );
    if (filteredChannels.length > 0 && !channelLoading) {
      await this.setState({
        commonConversation: [
          ...this.state.commonConversation,
          ...filteredChannels,
        ],
      });
    }
    const filteredGroups = userGroups.filter(
      createFilter(this.state.searchText, ['group_name'])
    );
    if (filteredGroups.length > 0 && !groupLoading) {
      await this.setState({
        commonConversation: [
          ...this.state.commonConversation,
          ...filteredGroups,
        ],
      });
    }
    const filteredFriends = userFriends.filter(
      createFilter(this.state.searchText, ['display_name'])
    );
    if (filteredFriends.length > 0 && !friendLoading) {
      await this.setState({
        commonConversation: [
          ...this.state.commonConversation,
          ...filteredFriends,
        ],
      });
    }

    await this.setState({
      isLoading: false,
    });
  }

  async getUpdatedCommonChat() {
    const {
      followingChannels,
      userGroups,
      userFriends,
      channelLoading,
      groupLoading,
      friendLoading,
    } = this.props;

    let updatedConversation = [];

    const filteredChannels = await followingChannels.filter(
      createFilter(this.state.searchText, ['name'])
    );
    if (filteredChannels.length > 0 && !channelLoading) {
      updatedConversation = [...updatedConversation, ...filteredChannels];
    }
    const filteredGroups = await userGroups.filter(
      createFilter(this.state.searchText, ['group_name'])
    );
    if (filteredGroups.length > 0 && !groupLoading) {
      updatedConversation = [...updatedConversation, ...filteredGroups];
    }
    const filteredFriends = await userFriends.filter(
      createFilter(this.state.searchText, ['display_name'])
    );
    if (filteredFriends.length > 0 && !friendLoading) {
      updatedConversation = [...updatedConversation, ...filteredFriends];
    }

    await this.setState({
      commonConversation: updatedConversation,
    });

    await this.setState({
      isLoading: false,
    });
  }

  shotListBy = (sortBy) => {
    switch (sortBy) {
      case 'time': {
        let sortData = {
          sort_by: sortBy,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData).then((res) => {
          this.setState({
            sortBy: res.sort_by,
          });
        });
        return;
      }
      case 'unread': {
        let sortData = {
          sort_by: sortBy,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData).then((res) => {
          this.setState({
            sortBy: res.sort_by,
          });
        });
        return;
      }
      case 'name': {
        let sortData = {
          sort_by: sortBy,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData).then((res) => {
          this.setState({
            sortBy: res.sort_by,
          });
        });
        return;
      }
      default:
        let sortData = {
          sort_by: this.props.userConfig.sort_by,
          sort_order: this.props.userConfig.sort_order,
        };

        this.props.updateConfiguration(sortData).then((res) => {
          this.setState({
            sortBy: res.sort_by,
          });
        });
        return;
    }
  };

  sortList = () => {
    const { commonConversation, sortBy } = this.state;

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
            : -1
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
            : -1
        );

        commonConversation.sort((a, b) =>
          a.unread_msg < b.unread_msg ? 1 : -1
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
            : -1
        );

        return;
      }
      default:
        return;
    }
  };

  renderCommonChat = () => {
    const { commonConversation, isLoading } = this.state;
    this.sortList();
    if (commonConversation.length === 0 && isLoading) {
      return <ListLoader />;
    } else if (commonConversation.length > 0) {
      return (
        <FlatList
          data={commonConversation}
          renderItem={({ item, index }) =>
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
    const { orientation } = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HomeHeader
            title={translate('pages.xchat.chat')}
            isSortOptions
            menuItems={this.state.sortOptions}
          />
          <SearchInput
            onChangeText={this.onSearch.bind(this)}
            navigation={this.props.navigation}
          />
          <View style={globalStyles.container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              {this.renderCommonChat()}
            </KeyboardAwareScrollView>
          </View>
        </View>
      </ImageBackground>
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(Chat));
