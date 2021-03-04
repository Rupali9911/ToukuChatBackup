import React, {Component} from 'react';
import {View, ImageBackground, Text, FlatList, Dimensions} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {createGroupStyles} from './styles';
import {globalStyles} from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import GroupFriend from '../../components/GroupFriend';
import {Images, Icons, Colors} from '../../constants';
import Button from '../../components/Button';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getUserFriends} from '../../redux/reducers/friendReducer';
import {createNewGroup, getUserGroups, setCurrentGroup} from '../../redux/reducers/groupReducer';
import {ListLoader} from '../../components/Loaders';
import NoData from '../../components/NoData';
import Toast from '../../components/Toast';
const {width, height} = Dimensions.get('window');

class CreateFriendGroup extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      groupName: '',
      groupNameErr: null,
      addedFriends: [this.props.currentFriend.user_id],
      recent: [this.props.currentFriend],
      filteredFriends: this.props.userFriends,
    };
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    this.props.getUserFriends().then((res) => {
      // for (let friend of this.state.filteredFriends) {
      //   // alert(JSON.stringify(friend));
      //   if (friend.user_id === this.props.currentFriend.user_id) {
      //     const index = this.state.filteredFriends.indexOf(friend.user_id);
      //     if (index > -1) {
      //       friend.isChecked = true;
      //       this.state.addedFriends.push(friend.user_id);
      //       this.setState({filteredFriends: this.state.filteredFriends});
      //     }
      //   }
      // }
    });
    // this.state.addedFriends.push(this.props.currentFriend.user_id);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  onCheckRecentPress = (status, item, index) => {
    const recent = this.state.recent.map((recent) =>
      recent.user_id === item.user_id ? {...recent, isChecked: status} : recent,
    );

    this.setState({
      recent: recent,
    });
  };

  onCheckFriendPress = (status, item, index) => {
    const {filteredFriends, addedFriends} = this.state;

    filteredFriends[index].isChecked = status;
    if (status === true) {
      addedFriends.push(item.user_id);
    } else {
      const index = addedFriends.indexOf(item.user_id);
      if (index > -1) {
        addedFriends.splice(index, 1);
      }
    }

    this.setState({filteredFriends: this.state.filteredFriends});
  };

  handleGroupName(groupName) {
    this.setState({groupName});
    if (groupName.trim() === '') {
      this.setState({groupNameErr: 'messages.required'});
    } else {
      this.setState({groupNameErr: null});
    }
  }

  renderRecent = () => {
    const {currentFriend} = this.props;
    const {recent} = this.state;
    let friendIndex = -1;
    const index = recent.map((item, index) => {
      if (item.user_id === currentFriend.user_id) {
        friendIndex = index;
      }
    });
    if (friendIndex > -1) {
      recent[friendIndex].isChecked = true;
    }

    return (
      <FlatList
        data={recent}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <GroupFriend
            user={item}
            isCheckBox
            onCheckPress={(isCheck) =>
              this.onCheckRecentPress(isCheck, item, index)
            }
          />
        )}
      />
    );
  };

  renderFriends = () => {
    const {friendLoading, currentFriend} = this.props;
    const {filteredFriends} = this.state;

    if (filteredFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      let friendIndex = -1;
      const index = filteredFriends.map((item, index) => {
        if (item.user_id === currentFriend.user_id) {
          friendIndex = index;
        }
      });
      if (friendIndex > -1) {
        filteredFriends[friendIndex].isChecked = true;
      }
      return (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <GroupFriend
              user={item}
              isCheckBox
              onCheckPress={(isCheck) =>
                item.user_id === currentFriend.user_id
                  ? null
                  : this.onCheckFriendPress(isCheck, item, index)
              }
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
  };

  createFriendGroup() {
    const {groupName, addedFriends} = this.state;
    if (groupName.trim() === '') {
      this.setState({groupNameErr: 'messages.required'});
      Toast.show({
        title: 'TOUKU',
        text: translate('pages.xchat.toastr.groupNameIsRequired'),
        type: 'primary',
      });
    } else if (addedFriends.length <= 0) {
      Toast.show({
        title: 'TOUKU',
        text: translate('pages.xchat.toastr.pleaseSelectMember'),
        type: 'primary',
      });
    } else {
      let groupData = {
        company_name: '',
        cover_image: '',
        cover_image_thumb: '',
        description: '',
        email: '',
        genre: '',
        greeting_text: '',
        group_members: addedFriends,
        group_picture: '',
        group_picture_thumb: '',
        name: groupName,
        sub_genre: '',
      };

      this.props.createNewGroup(groupData).then((res) => {
        Toast.show({
          title: 'TOUKU',
          text: translate('pages.xchat.toastr.groupCreateSuccessfully'),
          type: 'positive',
        });
        this.props.getUserGroups().then((res) => {
          if (res.conversations) {
          }
        });
        this.props.setCurrentGroup(res);
        this.props.navigation.goBack();
        this.props.navigation.navigate('GroupChats');
      });
    }
  }

  render() {
    const {groupName, groupNameErr} = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.inviteToGroup')}
          />
          <KeyboardAwareScrollView
            contentContainerStyle={createGroupStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            <View
              style={{
                height: '5%',
                justifyContent: 'center',
              }}>
              <Text>{translate('pages.xchat.recentChats')}</Text>
            </View>
            <View style={{maxHeight: '30%'}}>{this.renderRecent()}</View>
            <View
              style={{
                height: '5%',
                justifyContent: 'center',
              }}>
              <Text>{translate('pages.xchat.friends')}</Text>
            </View>
            <View style={{maxHeight: '30%'}}>{this.renderFriends()}</View>
            <InputWithTitle
              title={translate('pages.xchat.groupName')}
              value={groupName}
              onChangeText={(groupName) => this.handleGroupName(groupName)}
            />
            {groupNameErr !== null ? (
              <Text
                style={[
                  globalStyles.smallLightText,
                  {
                    color: Colors.danger,
                    textAlign: 'left',
                    marginTop: -10,
                    marginStart: 10,
                    marginBottom: 5,
                  },
                ]}>
                {translate(groupNameErr).replace(
                  '[missing {{field}} value]',
                  translate('pages.xchat.groupName'),
                )}
              </Text>
            ) : null}

            <View>
              <Button
                type={'primary'}
                title={translate('pages.xchat.create')}
                onPress={() => this.createFriendGroup()}
                loading={this.props.groupLoading}
              />
              <Button
                type={'translucent'}
                title={translate('common.cancel')}
                onPress={() => this.props.navigation.goBack()}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    userFriends: state.friendReducer.userFriends,
    friendLoading: state.friendReducer.loading,
    currentFriend: state.friendReducer.currentFriend,
    groupLoading: state.groupReducer.loading,
  };
};

const mapDispatchToProps = {
  getUserFriends,
  getUserGroups,
  createNewGroup,
  setCurrentGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateFriendGroup);
