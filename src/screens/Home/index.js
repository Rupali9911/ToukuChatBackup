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

import {homeStyles} from './styles';
import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {Images, Colors, Icons} from '../../constants';
import {SearchInput} from '../../components/TextInputs';
import RoundedImage from '../../components/RoundedImage';
import {getAvatar} from '../../utils';
import {ProfileModal} from '../../components/Modals';
import {ChannelListItem} from '../../components/ListItems';
import FriendListItem from '../../components/ListItems/FriendListItem';
import GroupListItem from '../../components/ListItems/GroupListItem';
import NoData from '../../components/NoData';
import {ListLoader} from '../../components/Loaders';
import {socket, websocket} from '../../helpers/api';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getUserProfile} from '../../redux/reducers/userReducer';
import {
  getUserChannels,
  setCurrentChannel,
} from '../../redux/reducers/channelReducer';
import {getUserGroups} from '../../redux/reducers/groupReducer';
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
    };
  }

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    this.props.getUserProfile();
    Orientation.addOrientationListener(this._orientationDidChange);

    this.props.getUserChannels();
    this.props.getUserGroups();
    this.props.getUserFriends();
    this.props.getFriendRequests();

    // socket.connect();

    // socket.on('connect', function (e) {
    //   alert('Socket Connected');
    // });
    // socket.on('connect_error', (err) => {
    //   // alert(err);
    // });

    websocket.onopen = () => {
      // connection opened
      // ws.send('something'); // send a message
      // alert('connected');
    };

    websocket.onmessage = (e) => {
      // a message was received
      console.log(e.data);
    };

    websocket.onerror = (e) => {
      // an error occurred
      // alert(JSON.stringify(e));
    };

    websocket.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };
  }
  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  onSearch = (text) => {
    this.setState({searchText: text});
  };

  onUserProfilePress() {
    ProfileModal.show();
  }

  onOpenChannelChats = (item) => {
    this.props.setCurrentChannel(item);
    this.props.navigation.navigate('ChannelChats');
  };

  onOpenGroupChats = (item) => {
    this.props.navigation.navigate('GroupChats', {
      data: item,
    });
  };

  onOpenFriendChats = (item) => {
    this.props.setCurrentFriend(item);
    this.props.navigation.navigate('FriendChats');
  };

  renderUserChannels() {
    const {userChannels, channelLoading} = this.props;
    const filteredChannels = userChannels.filter(
      createFilter(this.state.searchText, ['name']),
    );

    if (filteredChannels.length === 0 && channelLoading) {
      return <ListLoader />;
    } else if (filteredChannels.length > 0) {
      return (
        <FlatList
          data={filteredChannels}
          renderItem={({item, index}) => (
            <ChannelListItem
              title={item.name}
              description={item.description}
              date={item.created}
              image={item.channel_picture}
              onPress={() => this.onOpenChannelChats(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          ListFooterComponent={() => (
            <View>{channelLoading ? <ListLoader /> : null}</View>
          )}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noChannelFound')} />;
    }
  }

  renderUserGroups() {
    const {userGroups, groupLoading} = this.props;
    const filteredGroups = userGroups.filter(
      createFilter(this.state.searchText, ['group_name']),
    );

    if (filteredGroups.length === 0 && groupLoading) {
      return <ListLoader />;
    } else if (filteredGroups.length > 0) {
      return (
        <FlatList
          data={filteredGroups}
          renderItem={({item, index}) => (
            <GroupListItem
              title={item.group_name}
              description={item.last_msg.text}
              date={item.timestamp}
              image={item.group_picture}
              onPress={() => this.onOpenGroupChats(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          ListFooterComponent={() => (
            <View>{groupLoading ? <ListLoader /> : null}</View>
          )}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noGroupFound')} />;
    }
  }

  renderUserFriends() {
    const {userFriends, friendLoading} = this.props;
    const filteredFriends = userFriends.filter(
      createFilter(this.state.searchText, ['username']),
    );

    if (filteredFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          data={filteredFriends}
          renderItem={({item, index}) => (
            <FriendListItem
              title={item.username}
              description={item.last_msg}
              image={getAvatar(item.profile_picture)}
              date={item.timestamp}
              isOnline={item.is_online}
              onPress={() => this.onOpenFriendChats(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          ListFooterComponent={() => (
            <View>{friendLoading ? <ListLoader /> : null}</View>
          )}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noFriendFound')} />;
    }
  }

  showDropdown = () => {
    console.log(
      'Home -> showDropdown -> showDropdown',
      this.state.showDropdown,
    );
    this.setState({
      showDropdown: !this.state.showDropdown,
    });
    this.props.navigation.navigate('CreateGroupChat');
  };

  render() {
    const {
      orientation,
      isChannelCollapsed,
      isGroupCollapsed,
      isFriendsCollapsed,
      searchText,
    } = this.state;

    const {userData, userChannels, userGroups, userFriends} = this.props;
    const filteredChannels = userChannels.filter(
      createFilter(searchText, ['name']),
    );
    const filteredGroups = userGroups.filter(
      createFilter(searchText, ['group_name']),
    );
    const filteredFriends = userFriends.filter(
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
                padding: 10,
              }}>
              <RoundedImage source={getAvatar(userData.avatar)} size={60} />
              <Text
                style={[
                  globalStyles.normalRegularText,
                  {color: Colors.black, marginStart: 10},
                ]}>
                {userData.username}
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
                    counts={filteredChannels.length}
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
                    counts={filteredGroups.length}
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
                    counts={filteredFriends.length}
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
  const {title, counts, isCollapsed} = props;
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
        paddingVertical: 10,
        paddingHorizontal: 15,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={globalStyles.smallRegularText}>{title}</Text>
        <Text style={[globalStyles.smallRegularText, {marginStart: 5}]}>
          {'('}
          {counts}
          {')'}
        </Text>
      </View>
      <Image
        source={isCollapsed ? Icons.icon_arrow_down : Icons.icon_arrow_up}
        style={{width: 10, height: 10, resizeMode: 'contain'}}
      />
    </LinearGradient>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    userChannels: state.channelReducer.userChannels,
    channelLoading: state.channelReducer.loading,
    userGroups: state.groupReducer.userGroups,
    groupLoading: state.groupReducer.loading,
    userFriends: state.friendReducer.userFriends,
    friendLoading: state.friendReducer.loading,
  };
};

const mapDispatchToProps = {
  getUserProfile,
  getUserChannels,
  setCurrentChannel,
  getUserGroups,
  getUserFriends,
  getFriendRequests,
  setCurrentFriend,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
