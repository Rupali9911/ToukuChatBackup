import React, { Component } from 'react';
import { View, ImageBackground, Text, FlatList } from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { createGroupStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import GroupFriend from '../../components/GroupFriend';
import { Images, Icons, Colors } from '../../constants';
import Button from '../../components/Button';

import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getUserFriends } from '../../redux/reducers/friendReducer';
import {
  createNewGroup,
  getUserGroups,
} from '../../redux/reducers/groupReducer';

class CreateFriendGroup extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      groupName: '',
      addedFriends: [],
      recent: [
        {
          id: 1,
          username: 'Raj',
          isChecked: false,
        },
        {
          id: 2,
          username: 'Ravi',
          isChecked: false,
        },
        {
          id: 3,
          username: 'Raju',
          isChecked: false,
        },
        {
          id: 4,
          username: 'Rajverdhan',
          isChecked: false,
        },
        {
          id: 5,
          username: 'Rajveer',
          isChecked: false,
        },
      ],
      filteredFriends: [
        {
          id: 1,
          username: 'Raj',
          isChecked: false,
        },
        {
          id: 2,
          username: 'Ravi',
          isChecked: false,
        },
        {
          id: 3,
          username: 'Raju',
          isChecked: false,
        },
        {
          id: 4,
          username: 'Rajverdhan',
          isChecked: false,
        },
        {
          id: 5,
          username: 'Rajveer',
          isChecked: false,
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
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    this.props.getUserFriends();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  onCheckRecentPress = (status, item) => {
    const recent = this.state.recent.map((recent) =>
      recent.id === item.id ? { ...recent, isChecked: status } : recent
    );

    this.setState({
      recent: recent,
    });
  };
  onCheckFriendPress = (status, item) => {
    const filteredFriends = this.state.filteredFriends.map((friend) =>
      friend.id === item.id ? { ...friend, isChecked: status } : friend
    );

    this.setState({
      filteredFriends: filteredFriends,
    });
  };

  renderRecent = () => {
    return (
      <FlatList
        data={this.state.recent}
        renderItem={({ item, index }) => (
          <GroupFriend
            user={item}
            isCheckBox
            onCheckPress={(isCheck) => this.onCheckRecentPress(isCheck, item)}
          />
        )}
      />
    );
  };

  renderFriends = () => {
    return (
      <FlatList
        data={this.state.filteredFriends}
        renderItem={({ item, index }) => (
          <GroupFriend
            user={item}
            isCheckBox
            onCheckPress={(isCheck) => this.onCheckFriendPress(isCheck, item)}
          />
        )}
      />
    );
  };

  render() {
    const { groupName } = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.inviteToGroup')}
          />
          <KeyboardAwareScrollView
            contentContainerStyle={createGroupStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View
              style={{
                height: '5%',
                justifyContent: 'center',
              }}
            >
              <Text>{translate('pages.xchat.recentChats')}</Text>
            </View>
            {this.renderRecent()}
            <View
              style={{
                height: '5%',
                justifyContent: 'center',
              }}
            >
              <Text>{translate('pages.xchat.friends')}</Text>
            </View>
            {this.renderFriends()}

            <InputWithTitle
              title={translate('pages.xchat.groupName')}
              value={groupName}
              onChangeText={(groupName) => this.handleGroupName(groupName)}
            />

            <View>
              <Button
                type={'primary'}
                title={translate('pages.xchat.create')}
                onPress={() => this.onCreatePress()}
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
  };
};

const mapDispatchToProps = {
  getUserFriends,
  getUserGroups,
  createNewGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateFriendGroup);
