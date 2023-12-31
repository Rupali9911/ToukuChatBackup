import React, {Component} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import {createFilter} from 'react-native-search-filter';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import GroupFriend from '../../components/GroupFriend';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {ListLoader} from '../../components/Loaders';
import NoData from '../../components/NoData';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import TextAreaWithTitle from '../../components/TextInputs/TextAreaWithTitle';
import Toast from '../../components/Toast';
import {Icons, Images} from '../../constants';
import S3uploadService from '../../helpers/S3uploadService';
import {getUserFriends} from '../../redux/reducers/friendReducer';
import {
  createNewGroup,
  getUserGroups,
  setCurrentGroup,
} from '../../redux/reducers/groupReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import {getImage} from '../../utils';
import styles from './styles';

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
    this.isPressed = false;
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
        // let source = {uri: 'data:image/jpeg;base64,' + response.data};
        let source = response;
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
    if (this.isPressed) {
      return;
    }
    this.isPressed = true;
    if (groupName.trim() === '') {
      this.isPressed = false;
      this.setState({groupNameErr: 'messages.required'});
      Toast.show({
        title: 'TOUKU',
        text: translate('pages.xchat.toastr.groupNameIsRequired'),
        type: 'primary',
      });
    } else if (addedFriends.length <= 0) {
      this.isPressed = false;
      Toast.show({
        title: 'TOUKU',
        text: translate('pages.xchat.toastr.pleaseSelectMember'),
        type: 'primary',
      });
    } else {
      if (groupImagePath.uri != null) {
        this.setState({loading: true});
        let file = groupImagePath;
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
            title: 'TOUKU',
            text: translate('pages.xchat.toastr.groupCreateSuccessfully'),
            type: 'positive',
          });
          this.props.setCurrentGroup(res);
          this.props.navigation.goBack();
          this.props.navigation.navigate('GroupChats');
          // this.props.navigation.goBack();
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
            title: 'TOUKU',
            text: translate('pages.xchat.toastr.groupCreateSuccessfully'),
            type: 'positive',
          });
          this.props.setCurrentGroup(res);
          this.props.navigation.goBack();
          this.props.navigation.navigate('GroupChats');
          // this.props.navigation.goBack();
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
            contentContainerStyle={styles.mainContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <View style={styles.imageView}>
                <Image
                  // source={{uri: this.state.groupImagePath.uri}}
                  source={getImage(groupImagePath.uri)}
                  resizeMode={'cover'}
                  style={styles.profileImage}
                />
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={this.chooseFile.bind(this)}>
                  <Image
                    source={Icons.icon_camera}
                    resizeMode={'cover'}
                    style={styles.cameraIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputesContainer}>
              <InputWithTitle
                title={translate('pages.xchat.groupName')}
                value={groupName}
                onChangeText={(text) => this.handleGroupName(text)}
              />
              {groupNameErr !== null ? (
                <Text style={[globalStyles.smallLightText, styles.groupName]}>
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
                onChangeText={(text) => this.setState({note: text})}
                maxLength={3000}
              />

              <View style={styles.searchContainer}>
                <Image source={Icons.icon_search} style={styles.iconSearch} />
                <TextInput
                  style={[styles.inputStyle]}
                  placeholder={translate('pages.xchat.search')}
                  placeholderTextColor={'grey'}
                  onChangeText={(searchText) => this.setState({searchText})}
                  returnKeyType={'done'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  underlineColorAndroid={'transparent'}
                />
              </View>
            </View>

            <View style={styles.frindListContainer}>
              {this.renderUserFriends()}
            </View>
            <View>
              <Button
                type={'primary'}
                title={translate('pages.xchat.create')}
                onPress={() =>
                  loading || this.props.groupLoading
                    ? null
                    : this.onCreatePress()
                }
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
  setCurrentGroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupChat);
