import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { createGroupStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import GroupFriend from '../../components/GroupFriend';
import { Images, Icons } from '../../constants';

import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getUserProfile } from '../../redux/reducers/userReducer';
import { getUserChannels } from '../../redux/reducers/channelReducer';
import { getUserGroups } from '../../redux/reducers/groupReducer';
import { getUserFriends } from '../../redux/reducers/friendReducer';
import Button from '../../components/Button';

class CreateGroupChat extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      groupName: '',
      note: '',
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
  }
  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  onAdd = (id) => {
    console.log('CreateGroupChat -> onAdd -> id', id);
  };

  render() {
    const { userData, userChannels, userGroups, userFriends } = this.props;

    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title="Create New Group"
          />
          <KeyboardAwareScrollView
            contentContainerStyle={createGroupStyles.mainContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={createGroupStyles.imageContainer}>
              <View style={createGroupStyles.imageView}>
                <Image
                  source={Images.image_touku_bg}
                  resizeMode={'cover'}
                  style={createGroupStyles.profileImage}
                />
                <TouchableOpacity style={createGroupStyles.cameraButton}>
                  <Image
                    source={Icons.icon_camera}
                    resizeMode={'cover'}
                    style={createGroupStyles.cameraIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={createGroupStyles.inputesContainer}>
              <InputWithTitle
                title="Group name"
                value={this.state.groupName}
                onChangeText={(text) => this.setState({ groupName: text })}
              />

              <TextAreaWithTitle
                title="Note"
                rightTitle="0/3000"
                value={this.state.note}
                onChangeText={(text) => this.setState({ note: text })}
              />

              <View style={createGroupStyles.searchContainer}>
                <Image
                  source={Icons.icon_search}
                  style={createGroupStyles.iconSearch}
                />
                <TextInput
                  style={[createGroupStyles.inputStyle]}
                  placeholder="Search"
                  onChangeText={this.onChangeText}
                  returnKeyType={'done'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  underlineColorAndroid={'transparent'}
                />
              </View>
            </View>

            <View style={createGroupStyles.frindListContainer}>
              <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                <GroupFriend
                  user={{ name: 'Jhon Doe', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(1)}
                />
                <GroupFriend
                  user={{ name: 'Will Parker', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(2)}
                />
                <GroupFriend
                  user={{ name: 'Patrik Shaw', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(3)}
                />
                <GroupFriend
                  user={{ name: 'Jhon Doe', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(4)}
                />
                <GroupFriend
                  user={{ name: 'Will Parker', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(5)}
                />
                <GroupFriend
                  user={{ name: 'Patrik Shaw', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(6)}
                />
                <GroupFriend
                  user={{ name: 'Jhon Doe', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(7)}
                />
                <GroupFriend
                  user={{ name: 'Will Parker', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(8)}
                />
                <GroupFriend
                  user={{ name: 'Patrik Shaw', avatar: userData.avatar }}
                  onAddPress={() => this.onAdd(9)}
                />
              </ScrollView>
            </View>
            <View style={createGroupStyles.buttonContainer}>
              <Button
                type={'primary'}
                title={translate('pages.xchat.create')}
                onPress={() => this.onSignUpPress()}
              />
              <Button
                type={'transparent'}
                title={translate('common.cancel')}
                onPress={() => this.onLoginPress()}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupChat);
