import React, {Component} from 'react';
import {View, ImageBackground, Text, FlatList, Dimensions, Image, TextInput} from 'react-native';
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
import {createFilter} from "react-native-search-filter";
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
      recent: [],
        searchText: '',
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
    this.props.getUserFriends()
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  onCheckRecentPress = (status, item, index) => {
    // const recent = this.state.recent.map((recent) =>
    //   recent.user_id === item.user_id ? {...recent, isChecked: status} : recent,
    // );
    //
    // this.setState({
    //   recent: recent,
    // });
      const {addedFriends} = this.state;
      let tmpFriends = addedFriends
      if (status === true) {
          tmpFriends.push(item.user_id);
      } else {
          const index = addedFriends.indexOf(item.user_id);
          if (index > -1) {
              tmpFriends.splice(index, 1);
          }
      }

      this.setState({addedFriends: tmpFriends});
  };

  onCheckFriendPress = (status, item, index) => {
    const {addedFriends} = this.state;
    let tmpFriends = addedFriends
    if (status === true) {
        tmpFriends.push(item.user_id);
    } else {
      const index = addedFriends.indexOf(item.user_id);
      if (index > -1) {
          tmpFriends.splice(index, 1);
      }
    }

    this.setState({addedFriends: tmpFriends});
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
    const {currentFriend, userFriends} = this.props;
    const {recent, addedFriends, searchText} = this.state;
      let itemFriends = userFriends.slice(0, 5)
      const searchedFriend = itemFriends.filter(
          createFilter(searchText, ['display_name']),
      );
    return (
      <FlatList
        data={searchedFriend}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <GroupFriend
            user={item}
            isCheckBox
            isSelected={addedFriends.includes(item.user_id)}
            onAddPress={(isAdded) => this.onCheckRecentPress(isAdded, item, index)}
          />
        )}
      />
    );
  };

  renderFriends = () => {
    const {friendLoading, currentFriend, userFriends} = this.props;
    const {addedFriends, searchText} = this.state;
      let itemFriends = userFriends
      console.log('userFriends.length', userFriends.length)
    // if (userFriends.length > 4) {
        itemFriends = userFriends.slice(5, userFriends.length)
    // }else{
    //     itemFriends = userFriends
    // }
    const searchedFriend = itemFriends.filter(
          createFilter(searchText, ['display_name']),
      );

    if (searchedFriend.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (searchedFriend.length > 0) {
      return (
        <FlatList
          data={searchedFriend}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <GroupFriend
              user={item}
              isCheckBox
              isSelected={addedFriends.includes(item.user_id)}
              onAddPress={(isAdded) => this.onCheckFriendPress(isAdded, item, index)}
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
            keyboardShouldPersistTaps
            bounces={false}>
              <View style={createGroupStyles.searchContainer}>
                  <Image
                      source={Icons.icon_search}
                      style={createGroupStyles.iconSearch}
                  />
                  <TextInput
                      style={[createGroupStyles.inputStyle]}
                      placeholder={translate('pages.xchat.search')}
                      onChangeText={(searchText) => this.setState({searchText})}
                      returnKeyType={'done'}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      underlineColorAndroid={'transparent'}
                  />
              </View>

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
                    // marginTop: 10,
                    // marginStart: 10,
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
