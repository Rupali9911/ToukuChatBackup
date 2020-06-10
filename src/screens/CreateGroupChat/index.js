import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createFilter } from 'react-native-search-filter';
import ImagePicker from 'react-native-image-picker';

import { createGroupStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import GroupFriend from '../../components/GroupFriend';
import { Images, Icons, Colors } from '../../constants';
import Button from '../../components/Button';
import NoData from '../../components/NoData';
import Toast from '../../components/Toast';

import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { getUserFriends } from '../../redux/reducers/friendReducer';
import {
  createNewGroup,
  getUserGroups,
} from '../../redux/reducers/groupReducer';
import { ListLoader } from '../../components/Loaders';
import { getImage } from '../../utils';

class CreateGroupChat extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      groupName: '',
      note: '',
      searchText: '',
      addedFriends: [],
      groupNameErr: null,

      filePath: {}, //For Image Picker
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
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    this.props.getUserFriends();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  chooseFile = () => {
    var options = {
      title: 'Choose Option',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton);
      } else {
        // let source = response;
        // You can also display the image using data:
        let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
        });
      }
    });
  };

  onAdd = (isAdded, data) => {
    if (isAdded) {
      this.state.addedFriends.push(data.user_id);
    } else {
      const index = this.state.addedFriends.indexOf(data.user_id);
      if (index > -1) {
        this.state.addedFriends.splice(index, 1);
      }
    }
  };

  handleGroupName(groupName) {
    this.setState({ groupName });
    if (groupName.trim() === '') {
      this.setState({ groupNameErr: 'messages.required' });
    } else {
      this.setState({ groupNameErr: null });
    }
  }

  onCreatePress() {
    const { groupName, note, addedFriends } = this.state;
    if (groupName.trim() === '') {
      this.setState({ groupNameErr: 'messages.required' });
      Toast.show({
        title: 'Touku',
        text: translate('pages.xchat.toastr.groupNameIsRequired'),
        type: 'primary',
      });
    } else if (addedFriends.length <= 0) {
      Toast.show({
        title: 'Touku',
        text: translate('pages.xchat.toastr.pleaseSelectMember'),
        type: 'primary',
      });
    } else {
      let groupData = {
        company_name: '',
        cover_image: '',
        cover_image_thumb: '',
        description: note,
        email: '',
        genre: '',
        greeting_text: '',
        group_members: addedFriends,
        group_picture:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/image_1588933664724_1.png',
        group_picture_thumb:
          'https://angelium-media.s3.ap-southeast-1.amazonaws.com/thumb_image_1588933664724_1.png',
        name: groupName,
        sub_genre: '',
      };

      this.props.createNewGroup(groupData).then((res) => {
        Toast.show({
          title: 'Touku',
          text: translate('pages.xchat.toastr.groupCreateSuccessfully'),
          type: 'positive',
        });
        this.props.getUserGroups().then((res) => {
          if (res.conversations) {
            this.props.navigation.goBack();
          }
        });
      });
    }
  }

  renderUserFriends() {
    const { userFriends, friendLoading } = this.props;
    const filteredFriends = userFriends.filter(
      createFilter(this.state.searchText, ['username'])
    );

    if (filteredFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          data={filteredFriends}
          renderItem={({ item, index }) => (
            <GroupFriend
              user={item}
              onAddPress={(isAdded) => this.onAdd(isAdded, item)}
              isRightButton
            />
          )}
          ListFooterComponent={() => (
            <View>{friendLoading ? <ListLoader /> : null}</View>
          )}
        />
      );
    } else {
      return <NoData title={translate('pages.xchat.noFriendFound')} />;
    }
  }

  render() {
    const { groupName, note, groupNameErr } = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.createNewGroup')}
          />
          <KeyboardAwareScrollView
            contentContainerStyle={createGroupStyles.mainContainer}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={100}
          >
            <View style={createGroupStyles.imageContainer}>
              <View style={createGroupStyles.imageView}>
                <Image
                  // source={{uri: this.state.filePath.uri}}
                  source={getImage(this.state.filePath.uri)}
                  resizeMode={'cover'}
                  style={createGroupStyles.profileImage}
                />
                <TouchableOpacity
                  style={createGroupStyles.cameraButton}
                  onPress={this.chooseFile.bind(this)}
                >
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
                  ]}
                >
                  {translate(groupNameErr).replace(
                    '[missing {{field}} value]',
                    translate('pages.xchat.groupName')
                  )}
                </Text>
              ) : null}

              <TextAreaWithTitle
                title={translate('pages.xchat.note')}
                rightTitle={note.length + '/3000'}
                value={note}
                onChangeText={(note) => this.setState({ note })}
                maxLength={3000}
              />

              <View style={createGroupStyles.searchContainer}>
                <Image
                  source={Icons.icon_search}
                  style={createGroupStyles.iconSearch}
                />
                <TextInput
                  style={[createGroupStyles.inputStyle]}
                  placeholder={translate('pages.xchat.search')}
                  onChangeText={(searchText) => this.setState({ searchText })}
                  returnKeyType={'done'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  underlineColorAndroid={'transparent'}
                />
              </View>
            </View>

            <View style={createGroupStyles.frindListContainer}>
              {this.renderUserFriends()}
            </View>
            <View>
              <Button
                type={'primary'}
                title={translate('pages.xchat.create')}
                onPress={() => this.onCreatePress()}
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
    groupLoading: state.groupReducer.loading,
  };
};

const mapDispatchToProps = {
  getUserFriends,
  getUserGroups,
  createNewGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupChat);
