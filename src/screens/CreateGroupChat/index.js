import React, {Component} from 'react';
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
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {createFilter} from 'react-native-search-filter';
import ImagePicker from 'react-native-image-picker';

import {createGroupStyles} from './styles';
import {globalStyles} from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import GroupFriend from '../../components/GroupFriend';
import {Images, Icons, Colors} from '../../constants';
import Button from '../../components/Button';
import NoData from '../../components/NoData';
import Toast from '../../components/Toast';
import S3uploadService from '../../helpers/S3uploadService';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getUserFriends} from '../../redux/reducers/friendReducer';
import {createNewGroup, getUserGroups} from '../../redux/reducers/groupReducer';
import {ListLoader} from '../../components/Loaders';
import {getImage} from '../../utils';

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
      groupImagePath: {uri: null}, //For Image Picker
      loading: false,
    };
    this.S3uploadService = new S3uploadService();
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

    this.props.getUserFriends();
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  chooseFile = () => {
    var options = {
      title: translate('pages.xchat.chooseOption'),
      takePhotoButtonTitle: translate('pages.xchat.takePhoto'),
      chooseFromLibraryButtonTitle: translate('pages.xchat.chooseFromLibrary'),
      // chooseWhichLibraryTitle: translate('pages.xchat.chooseOption'),
      cancelButtonTitle: translate('pages.xchat.cancelChooseOption'),
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
        let source = {uri: 'data:image/jpeg;base64,' + response.data};
        this.setState({
          groupImagePath: source,
        });
      }
    });
  };

  onAdd = (isAdded, data) => {
    const {addedFriends} = this.state;
    if (isAdded) {
      if (!addedFriends.includes(data.user_id)) {
        this.setState({
          addedFriends: [...addedFriends, data.user_id],
        });
      }
    } else {
      const index = this.state.addedFriends.indexOf(data.user_id);

      const newList = addedFriends
        .slice(0, index)
        .concat(addedFriends.slice(index + 1, addedFriends.length));
      this.setState({
        addedFriends: newList,
      });
    }
  };

  handleGroupName(groupName) {
    this.setState({groupName});
    if (groupName.trim() === '') {
      this.setState({groupNameErr: 'messages.required'});
    } else {
      this.setState({groupNameErr: null});
    }
  }

  async onCreatePress() {
    const {groupName, note, addedFriends, groupImagePath} = this.state;
    if (groupName.trim() === '') {
      this.setState({groupNameErr: 'messages.required'});
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
      if (groupImagePath.uri != null) {
        this.setState({loading: true});
        let file = groupImagePath.uri;
        let files = [file];
        const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
          files,
        );

        let groupData = {
          company_name: '',
          cover_image: '',
          cover_image_thumb: '',
          description: note,
          email: '',
          genre: '',
          greeting_text: '',
          group_members: addedFriends,
          group_picture: uploadedImages.image[0].image,
          group_picture_thumb: uploadedImages.image[0].thumbnail,
          name: groupName,
          sub_genre: '',
        };

        this.props.createNewGroup(groupData).then((res) => {
          console.log('CreateGroupChat -> onCreatePress -> res', res);
          this.setState({loading: false});
          Toast.show({
            title: 'Touku',
            text: translate('pages.xchat.toastr.groupCreateSuccessfully'),
            type: 'positive',
          });
          this.props.navigation.goBack();
          // this.props.getUserGroups().then((res) => {
          //   if (res.conversations) {
          //   }
          // });
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
          group_picture: null,
          group_picture_thumb: null,
          name: groupName,
          sub_genre: '',
        };

        this.props.createNewGroup(groupData).then((res) => {
          console.log('CreateGroupChat -> onCreatePress -> res', res);
          this.setState({loading: false});
          Toast.show({
            title: 'Touku',
            text: translate('pages.xchat.toastr.groupCreateSuccessfully'),
            type: 'positive',
          });
          this.props.navigation.goBack();
          // this.props.getUserGroups().then((res) => {
          //   if (res.conversations) {
          //   }
          // });
        });
      }
    }
  }

  renderUserFriends() {
    const {userFriends, friendLoading} = this.props;
    const {addedFriends} = this.state;
    const filteredFriends = userFriends.filter(
      createFilter(this.state.searchText, ['display_name']),
    );

    if (filteredFriends.length === 0 && friendLoading) {
      return <ListLoader />;
    } else if (filteredFriends.length > 0) {
      return (
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          behavior={'position'}
          keyExtractor={(item, index) => index.toString()}
          data={filteredFriends}
          renderItem={({item, index}) => (
            <GroupFriend
              user={item}
              onAddPress={(isAdded) => this.onAdd(isAdded, item)}
              isRightButton
              isSelected={addedFriends.includes(item.user_id)}
              // addedUser={addedFriends}
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
    const {groupName, note, groupNameErr, loading, groupImagePath} = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.createNewGroup')}
          />
          <KeyboardAwareScrollView
            scrollEnabled
            // enableOnAndroid={true}
            keyboardShouldPersistTaps={'handled'}
            // extraScrollHeight={100}
            extraHeight={100}
            behavior={'position'}
            contentContainerStyle={createGroupStyles.mainContainer}
            showsVerticalScrollIndicator={false}>
            <View style={createGroupStyles.imageContainer}>
              <View style={createGroupStyles.imageView}>
                <Image
                  // source={{uri: this.state.groupImagePath.uri}}
                  source={getImage(groupImagePath.uri)}
                  resizeMode={'cover'}
                  style={createGroupStyles.profileImage}
                />
                <TouchableOpacity
                  style={createGroupStyles.cameraButton}
                  onPress={this.chooseFile.bind(this)}>
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
                  ]}>
                  {translate(groupNameErr).replace(
                    '[missing {{field}} value]',
                    translate('pages.xchat.groupName'),
                  )}
                </Text>
              ) : null}

              <TextAreaWithTitle
                title={translate('pages.xchat.note')}
                rightTitle={note.length + '/3000'}
                value={note}
                onChangeText={(note) => this.setState({note})}
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
                  onChangeText={(searchText) => this.setState({searchText})}
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
                loading={
                  groupImagePath.uri != null ? loading : this.props.groupLoading
                }
              />
              <Button
                type={'translucent'}
                title={translate('common.cancel')}
                onPress={() => {
                  loading ? null : this.props.navigation.goBack();
                }}
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
