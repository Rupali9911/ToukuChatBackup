import React, {Component} from 'react';
import {
  View,
  ImageBackground,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
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
import {socket} from '../../helpers/api';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getUserProfile} from '../../redux/reducers/userReducer';
import {getUserChannels} from '../../redux/reducers/channelReducer';
import {getUserGroups} from '../../redux/reducers/groupReducer';
import {getUserFriends} from '../../redux/reducers/friendReducer';

class Home extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isChannelCollapsed: true,
      isGroupCollapsed: false,
      isFriendsCollapsed: false,

      friends: [
        {
          id: 1,
          name: 'John Doe',
          detail: 'Hey',
          date: '21/05',
          is_online: false,
        },

        {
          id: 2,
          name: 'Harry',
          detail: 'Good morning',
          date: '21/05',
          is_online: true,
        },

        {
          id: 3,
          name: 'David',
          detail: 'ok',
          date: '21/05',
          is_online: true,
        },
      ],
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

    socket.on('connect', function () {
      alert('ghhh');
    });

    // socket.emit(
    //   '/bulk-socket?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo5Nzk1LCJ1c2VybmFtZSI6Im5ldy5yZWdpc3RlciIsImV4cCI6MTU5MDE1MDIzNSwiZW1haWwiOiJuZXcucmVnaXN0ZXJAYW5nZWxpdW0ubmV0In0.J1QxUKekSeiqq8UEppSkEfRXEK-YiiuwL9gRY_nsjY0',
    // );
    // socket.on(
    //   '/single-socket/9795?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo5Nzk1LCJ1c2VybmFtZSI6Im5ldy5yZWdpc3RlciIsImV4cCI6MTU5MDE1MDIzNSwiZW1haWwiOiJuZXcucmVnaXN0ZXJAYW5nZWxpdW0ubmV0In0.J1QxUKekSeiqq8UEppSkEfRXEK-YiiuwL9gRY_nsjY0',
    //   function (data) {
    //     alert(data);
    //   },
    // );
  }
  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  onSearch = (text) => {};

  onUserProfilePress() {
    ProfileModal.show();
  }

  renderUserChannels() {
    const {userChannels, channelLoading} = this.props;
    if (userChannels.length === 0 && channelLoading) {
      return <ListLoader />;
    } else if (userChannels.length > 0) {
      return (
        <FlatList
          data={userChannels}
          renderItem={({item, index}) => (
            <ChannelListItem
              title={item.name}
              description={item.description}
              date={item.created}
              image={item.channel_picture}
            />
          )}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          ListFooterComponent={() => (
            <View>{channelLoading ? <ListLoader /> : null}</View>
          )}
        />
      );
    } else {
      return <NoData title={'No channels Available!'} />;
    }
  }

  renderUserGroups() {
    const {userGroups, groupLoading} = this.props;
    if (userGroups.length === 0 && groupLoading) {
      return <ListLoader />;
    } else if (userGroups.length > 0) {
      return (
        <FlatList
          data={userGroups}
          renderItem={({item, index}) => (
            <GroupListItem
              title={item.group_name}
              description={item.last_msg.text}
              date={item.timestamp}
              image={item.group_picture}
            />
          )}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          ListFooterComponent={() => (
            <View>{groupLoading ? <ListLoader /> : null}</View>
          )}
        />
      );
    } else {
      return <NoData title={'No groups Available!'} />;
    }
  }

  renderUserFriends() {
    const {userFriends, friendLoading} = this.props;
    if (userFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (userFriends.length > 0) {
      return (
        <FlatList
          data={userFriends}
          renderItem={({item, index}) => (
            <FriendListItem
              title={item.username}
              description={item.last_msg}
              image={getAvatar(item.profile_picture)}
              date={item.timestamp}
              isOnline={item.is_online}
            />
          )}
          ItemSeparatorComponent={() => <View style={globalStyles.separator} />}
          ListFooterComponent={() => (
            <View>{friendLoading ? <ListLoader /> : null}</View>
          )}
        />
      );
    } else {
      return <NoData title={'No groups Available!'} />;
    }
  }

  render() {
    const {
      orientation,
      isChannelCollapsed,
      isGroupCollapsed,
      isFriendsCollapsed,
    } = this.state;

    const {userData, userChannels, userGroups, userFriends} = this.props;

    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HomeHeader title={translate('pages.xchat.home')} />
          <SearchInput onChangeText={this.onSearch.bind(this)} />
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
                  globalStyles.smallRegularText,
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
                    counts={userChannels.length}
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
                    counts={userGroups.length}
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
                    counts={userFriends.length}
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
  getUserGroups,
  getUserFriends,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
