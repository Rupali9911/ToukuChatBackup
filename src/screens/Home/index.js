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

import {homeStyles} from './styles';
import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getUserProfile} from '../../redux/reducers/userReducer';
import {Images, Colors, Icons} from '../../constants';
import {SearchInput} from '../../components/TextInputs';
import RoundedImage from '../../components/RoundedImage';
import {getAvatar} from '../../utils';
import {ProfileModal} from '../../components/Modals';
import {ChannelListItem} from '../../components/ListItems';
import FriendListItem from '../../components/ListItems/FriendListItem';
import GroupListItem from '../../components/ListItems/GroupListItem';

class Home extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isChannelCollapsed: true,
      isGroupCollapsed: false,
      isFriendsCollapsed: false,

      channels: [
        {
          id: 1,
          name: 'Channel 1',
          detail: 'description 1',
          date: '21/05',
        },

        {
          id: 2,
          name: 'Channel 2',
          detail: 'description 1',
          date: '21/05',
        },

        {
          id: 3,
          name: 'Channel 3',
          detail: 'description 1',
          date: '21/05',
        },
      ],

      groups: [
        {
          id: 1,
          name: 'Group 1',
          detail: 'description 1',
          date: '21/05',
        },

        {
          id: 2,
          name: 'Group 2',
          detail: 'description 1',
          date: '21/05',
        },

        {
          id: 3,
          name: 'Group 3',
          detail: 'description 1',
          date: '21/05',
        },
      ],

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
  }
  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  onSearch = (text) => {};

  onUserProfilePress() {
    ProfileModal.show();
  }

  render() {
    const {
      orientation,
      isChannelCollapsed,
      isGroupCollapsed,
      isFriendsCollapsed,
    } = this.state;
    const {userData} = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HomeHeader title={translate('pages.xchat.home')} />
          <SearchInput onChangeText={this.onSearch.bind(this)} />
          <View style={globalStyles.container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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
                  />
                </CollapseHeader>
                <CollapseBody>
                  <FlatList
                    data={this.state.channels}
                    renderItem={({item, index}) => (
                      <ChannelListItem
                        title={item.name}
                        description={item.detail}
                        date={item.date}
                      />
                    )}
                  />
                </CollapseBody>
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
                  />
                </CollapseHeader>
                <CollapseBody>
                  <FlatList
                    data={this.state.groups}
                    renderItem={({item, index}) => (
                      <GroupListItem
                        title={item.name}
                        description={item.detail}
                        date={item.date}
                      />
                    )}
                  />
                </CollapseBody>
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
                  />
                </CollapseHeader>
                <CollapseBody>
                  <FlatList
                    data={this.state.friends}
                    renderItem={({item, index}) => (
                      <FriendListItem
                        title={item.name}
                        description={item.detail}
                        date={item.date}
                        isOnline={item.is_online}
                      />
                    )}
                  />
                </CollapseBody>
              </Collapse>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const DropdownHeader = (props) => {
  const {title, isCollapsed} = props;
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
      <Text style={globalStyles.smallRegularText}>{title}</Text>
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
  };
};

const mapDispatchToProps = {
  getUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
