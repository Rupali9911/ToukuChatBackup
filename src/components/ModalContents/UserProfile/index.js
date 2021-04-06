// Library imports
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

// Local imports
import {Colors, Fonts, Icons} from '../../../constants';
import S3uploadService from '../../../helpers/S3uploadService';
import {
  getUserProfile,
  updateConfiguration,
  uploadAvatar,
} from '../../../redux/reducers/configurationReducer';
import {translate} from '../../../redux/reducers/languageReducer';
import {globalStyles} from '../../../styles';
import {getAvatar, getImage, resizeImage} from '../../../utils';

// Component imports
import {ImageLoader, ListLoader} from '../../Loaders';
import {
  ChangeEmailModal,
  ChangeNameModal,
  ChangePassModal,
  UpdatePhoneModal,
} from '../../Modals';
import RoundedImage from '../../RoundedImage';
import Toast from '../../ToastModal';
import ProfileItem from './components/ProfileItem';
import ClickableImage from './components/ClickableImage';

// StyleSheet import
import styles from './styles';

/**
 * User profile component
 */
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChangePassModalVisible: false,
      isChangeEmailModalVisible: false,
      isChangeNameModalVisible: false,
      isUpdatePhoneModalVisible: false,
      backgroundImagePath: {uri: this.props.userConfig.background_image},
      profileImagePath: {uri: this.props.userData.avatar},
    };
    this.S3uploadService = new S3uploadService();
  }

  // Set state based on latest props
  componentDidUpdate(prevProps) {
    if (
      this.props.userConfig.background_image !==
      prevProps.userConfig.background_image
    ) {
      this.setState({
        backgroundImagePath: {uri: this.props.userConfig.background_image},
      });
    }
    if (this.props.userData.avatar !== prevProps.userData.avatar) {
      this.setState({profileImagePath: {uri: this.props.userData.avatar}});
    }
  }

  // Display edit password modal
  onShowChangePassModal() {
    this.setState({isChangePassModalVisible: true});
  }

  // Display edit email modal
  onShowChangeEmailModal() {
    this.setState({isChangeEmailModalVisible: true});
  }

  // Display edit name modal
  onShowChangeNameModal() {
    this.setState({isChangeNameModalVisible: true});
  }
  // Display edit phone modal
  onShowChangeMobileModal() {
    this.setState({isUpdatePhoneModalVisible: true});
  }

  /**
   * Display gallery for user to pick
   * an image profile picture
   */
  onUserImageCameraPress = () => {
    let options = {
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
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        console.log('response.error', response.error);
      } else {
        // console.log('response from picker', response)
        let source = {uri: response.uri};
        this.setState({
          uploadImageLoading: true,
          profileImagePath: source,
        });

        const imageFile = await resizeImage(response.uri, 360, 360);

        const userAndSocialToken = await AsyncStorage.multiGet([
          'userToken',
          'socialToken',
        ]);
        let jwtToken = '';
        if (userAndSocialToken[0][1]) {
          jwtToken = `JWT ${userAndSocialToken[0][1]}`;
        } else {
          jwtToken = `JWT ${userAndSocialToken[1][1]}`;
        }

        // console.log('token::', jwtToken);
        // const result = await this.props.uploadAvatar(imageFile, jwtToken);
        // const anotherResult = await result();
        // console.log('Another Result', Object.values(anotherResult));
        this.props
          .uploadAvatar(imageFile, jwtToken)
          .then((res) => {
            console.log('uploadAvatar response final');
            this.props.getUserProfile();
            this.setState({uploadImageLoading: false});
            Toast.show({
              title: 'TOUKU',
              text: translate('pages.setting.toastr.userImageChanged'),
              type: 'positive',
            });

            // alert(JSON.stringify(res));
          })
          .catch((err) => {
            console.error('this.props.uploadAvatar::err', err);
            //alert(JSON.stringify(err));
          });
      }
    });
  };

  /**
   * Display gallery for user to pick
   * a background
   */
  chooseBackgroundImage = async () => {
    let options = {
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
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        // console.log('response data',response);
        this.setState({
          uploadLoading: true,
          backgroundImagePath: response,
        });

        let file = response;
        file.name = file.uri.substring(file.uri.lastIndexOf('/') + 1);
        let files = [file];
        // console.log('files', files);
        const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
          files,
        );
        console.log('Uploaded Image', uploadedImages);
        let bgData = {
          background_image: uploadedImages.image[0].image,
          //background_image: uploadedImages.image[0].thumbnail,
        };
        this.props.updateConfiguration(bgData).then((res) => {
          Toast.show({
            title: 'TOUKU',
            text: translate('pages.setting.toastr.userImageChanged'),
            type: 'positive',
          });
          this.setState({uploadLoading: false});
        });
      }
    });
  };

  render() {
    const {onRequestClose, userData, userConfig} = this.props;
    console.log('Props', this.props);
    const {
      isChangePassModalVisible,
      isChangeEmailModalVisible,
      isChangeNameModalVisible,
      isUpdatePhoneModalVisible,
      backgroundImagePath,

      uploadLoading,
      uploadImageLoading,
    } = this.state;
    const colors = ['#9440a3', '#c13468', '#ee2e3b', '#fa573a', '#fca150'];
    return (
      <View style={styles.Wrapper}>
        <KeyboardAwareScrollView
          contentContainerStyle={{backgroundColor: Colors.white}}
          showsVerticalScrollIndicator={false}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.8, y: 0.3}}
            locations={[0.3, 0.5, 0.8, 1, 1]}
            colors={colors}
            style={styles.linearGradientStyle}>
            {uploadLoading ? (
              <ListLoader />
            ) : (
              <View style={styles.singleFlex}>
                {backgroundImagePath.uri !== '' ? (
                  <ImageLoader
                    style={styles.firstView}
                    source={getImage(backgroundImagePath.uri)}>
                    <TouchableOpacity
                      style={styles.closeIconPadding}
                      onPress={onRequestClose}>
                      <Image
                        source={Icons.icon_close}
                        style={styles.iconClose}
                      />
                    </TouchableOpacity>
                  </ImageLoader>
                ) : null}
                <View style={styles.firstBottomView}>
                  <View
                    style={[globalStyles.iconStyle, styles.cameraContainer]}>
                    <ClickableImage
                      source={Icons.icon_camera}
                      size={14}
                      onClick={this.chooseBackgroundImage.bind(this)}
                    />
                  </View>
                </View>
              </View>
            )}
            <TouchableOpacity onPress={onRequestClose}>
              <Image source={Icons.icon_close} style={styles.iconClose} />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.avatarContainer}>
            {uploadImageLoading ? (
              <View style={styles.avatarLoadingContainer}>
                <ActivityIndicator color={Colors.primary} size={'small'} />
              </View>
            ) : (
              <RoundedImage
                size={80}
                source={getAvatar(this.props.userData.avatar)}
                clickable={true}
              />
            )}
            <View style={styles.centerBottomView}>
              <View
                style={[globalStyles.iconStyle, styles.cameraIconContainer]}>
                <ClickableImage
                  source={Icons.icon_camera}
                  size={14}
                  onClick={() => this.onUserImageCameraPress()}
                />
              </View>
            </View>
          </View>

          <View style={styles.nameContainer}>
            <Text style={[globalStyles.normalSemiBoldText, styles.nameText]}>
              {userConfig.display_name}
            </Text>
            <RoundedImage
              source={Icons.icon_pencil}
              size={24}
              color={Colors.black}
              clickable={true}
              isRounded={false}
              onClick={() => this.onShowChangeNameModal()}
            />
          </View>

          <View style={styles.usernameContainer}>
            <Text style={[globalStyles.smallRegularText, styles.usernameText]}>
              {userData.username}
            </Text>
          </View>
          <ProfileItem
            title={translate('common.password')}
            value={'*********'}
            editable={true}
            onEditIconPress={() => this.onShowChangePassModal()}
          />

          <ProfileItem
            title={translate('common.email')}
            value={userData.email}
            editable={true}
            onEditIconPress={() => this.onShowChangeEmailModal()}
          />

          {userData.country ? (
            <ProfileItem
              title={translate('common.country')}
              value={userData.country}
              editable={false}
            />
          ) : null}

          {userData.phone ? (
            <ProfileItem
              title={translate('common.phone')}
              value={userData.phone}
              editable={true}
              onEditIconPress={() => this.onShowChangeMobileModal()}
            />
          ) : (
            <View style={styles.inputTextContainer}>
              <View style={styles.singleFlex}>
                <Text
                  style={[
                    globalStyles.smallRegularText,
                    styles.textNormal,
                    {fontFamily: Fonts.light},
                  ]}>
                  {translate('common.phone')}
                </Text>
              </View>
              <FontAwesome
                name={'plus'}
                size={18}
                color={'#638bbb'}
                style={styles.addIcon}
                onPress={() => {
                  this.setState({isUpdatePhoneModalVisible: true});
                }}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
        <View style={styles.toastContainer}>
          <Toast
            ref={(c) => {
              if (c) {
                Toast.toastInstance = c;
              }
            }}
          />
        </View>
        <ChangePassModal
          visible={isChangePassModalVisible}
          onRequestClose={() =>
            this.setState({isChangePassModalVisible: false})
          }
        />
        <ChangeEmailModal
          visible={isChangeEmailModalVisible}
          onRequestClose={() =>
            this.setState({isChangeEmailModalVisible: false})
          }
        />
        <ChangeNameModal
          visible={isChangeNameModalVisible}
          onRequestClose={() =>
            this.setState({isChangeNameModalVisible: false})
          }
        />
        <UpdatePhoneModal
          visible={isUpdatePhoneModalVisible}
          onRequestClose={() =>
            this.setState({isUpdatePhoneModalVisible: false})
          }
          editable={userData.phone ? true : false}
        />
      </View>
    );
  }
}

/**
 * @Redux - Map following state to props
 * @param {object} state - current state in storeed in redux
 * @returns object
 */
const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    userConfig: state.configurationReducer.userConfig,
  };
};

// Actions to be accessed from redux
const mapDispatchToProps = {
  updateConfiguration,
  uploadAvatar,
  getUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
