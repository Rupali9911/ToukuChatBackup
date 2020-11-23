import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RNS3} from 'react-native-aws3';
import * as moment from 'moment';

import {Colors, Fonts, Images, Icons, environment} from '../../constants';
import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import {
  ChangePassModal,
  ChangeEmailModal,
  ChangeNameModal,
  UpdatePhoneModal,
} from '../Modals';
import {getAvatar, getImage, normalize} from '../../utils';
import S3uploadService from '../../helpers/S3uploadService';
import {ListLoader, ImageLoader} from '../Loaders';
import {translate} from '../../redux/reducers/languageReducer';
import {updateConfiguration} from '../../redux/reducers/configurationReducer';
import {getUserProfile, uploadAvatar} from '../../redux/reducers/userReducer';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from '../ToastModal';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

  onShowChangePassModal() {
    this.setState({isChangePassModalVisible: true});
  }

  onShowChangeEmailModal() {
    this.setState({isChangeEmailModalVisible: true});
  }

  onShowChangeNameModal() {
    this.setState({isChangeNameModalVisible: true});
  }

  onUserImageCameraPress() {
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
    ImagePicker.showImagePicker(options, async (response) => {
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

        this.props
          .uploadAvatar(response.uri, jwtToken)
          .then((res) => {
            console.log('uploadAvatar response final');
            this.props.getUserProfile();
            this.setState({uploadImageLoading: false});
            Toast.show({
              title: 'Touku',
              text: translate('pages.setting.toastr.userImageChanged'),
              type: 'positive',
            });

            // alert(JSON.stringify(res));
          })
          .catch((err) => {
            //alert(JSON.stringify(err));
          });
      }
    });
  }

  chooseBackgroundImage = async () => {
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
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        let source = {uri: 'data:image/jpeg;base64,' + response.data};
        this.setState({
          uploadLoading: true,
          backgroundImagePath: source,
        });

        let file = source.uri;
        let files = [file];
        const uploadedImages = await this.S3uploadService.uploadImagesOnS3Bucket(
          files,
        );

        let bgData = {
          // background_image: uploadedImages.image[0].image,
          background_image: uploadedImages.image[0].thumbnail,
        };

        this.props.updateConfiguration(bgData).then((res) => {
          Toast.show({
            title: 'Touku',
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
    const {
      isChangePassModalVisible,
      isChangeEmailModalVisible,
      isChangeNameModalVisible,
      isUpdatePhoneModalVisible,
      backgroundImagePath,
      profileImagePath,
      uploadLoading,
      uploadImageLoading,
    } = this.state;
    return (
      <View style={styles.Wrapper}>
        <KeyboardAwareScrollView
          contentContainerStyle={{backgroundColor: Colors.white}}
          showsVerticalScrollIndicator={false}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.8, y: 0.3}}
            locations={[0.3, 0.5, 0.8, 1, 1]}
            colors={['#9440a3', '#c13468', '#ee2e3b', '#fa573a', '#fca150']}
            style={{height: 150}}>
            {uploadLoading ? (
              <ListLoader />
            ) : (
              <View style={{flex: 1}}>
                {backgroundImagePath.uri != '' ? (
                  <ImageLoader
                    style={styles.firstView}
                    source={getImage(backgroundImagePath.uri)}>
                    <TouchableOpacity
                      style={{padding: 10}}
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
                    style={[
                      globalStyles.iconStyle,
                      {
                        backgroundColor: Colors.white,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                        borderWidth: 1,
                      },
                    ]}>
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

          <View style={{alignSelf: 'center', marginTop: -40}}>
            {uploadImageLoading ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 80,
                  width: 80,
                  backgroundColor: '#e9eef1',
                  borderRadius: 40,
                  borderWidth: 0.5,
                }}>
                <ActivityIndicator color={Colors.primary} size={'small'} />
              </View>
            ) : (
              <RoundedImage
                size={80}
                source={getAvatar(profileImagePath.uri)}
                clickable={true}
              />
            )}
            <View style={styles.centerBottomView}>
              <View
                style={[
                  globalStyles.iconStyle,
                  {
                    backgroundColor: Colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    borderWidth: 1,
                  },
                ]}>
                <ClickableImage
                  source={Icons.icon_camera}
                  size={14}
                  onClick={() => this.onUserImageCameraPress()}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text
              style={[
                globalStyles.normalSemiBoldText,
                {
                  color: Colors.black,
                  marginHorizontal: 10,
                  fontSize: normalize(15),
                },
              ]}>
              {/* {userData.first_name + ' '}
              {userData.last_name} */}
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

          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={[
                globalStyles.smallRegularText,
                {
                  color: Colors.black,
                  marginBottom: 10,
                  fontSize: normalize(12),
                  fontFamily: Fonts.nunitoSansJPLight,
                },
              ]}>
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
              editable={false}
            />
          ) : (
            <View style={styles.inputTextContainer}>
              <View style={{flex: 1}}>
                <Text
                  style={[
                    globalStyles.smallRegularText,
                    styles.textNormal,
                    {fontFamily: Fonts.nunitoSansJPLight},
                  ]}>
                  {translate('common.phone')}
                </Text>
              </View>
              <FontAwesome
                name={'plus'}
                size={18}
                color={'#638bbb'}
                style={{padding: 5}}
                onPress={() => {
                  this.setState({isUpdatePhoneModalVisible: true});
                }}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
        <View style={{position: 'absolute', width: '100%', top: 0}}>
          <Toast
            ref={(c) => {
              if (c) Toast.toastInstance = c;
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
        />
      </View>
    );
  }
}

const ProfileItem = (props) => {
  const {title, value, editable, onEditIconPress} = props;
  return (
    <View style={styles.inputTextContainer}>
      <View style={{flex: 1}}>
        <Text
          style={[
            globalStyles.smallRegularText,
            styles.textNormal,
            {fontFamily: Fonts.nunitoSansJPLight},
          ]}>
          {title}
        </Text>
        <Text
          style={[
            globalStyles.smallRegularText,
            styles.textNormal,
            {
              fontSize: normalize(13),
              fontFamily: Fonts.nunitoSansJPLight,
              color: 'rgba(87,132,178,1)',
            },
          ]}>
          {value}
        </Text>
      </View>
      {editable ? (
        <RoundedImage
          source={Icons.icon_pencil}
          size={18}
          clickable={true}
          isRounded={false}
          onClick={onEditIconPress}
        />
      ) : null}
    </View>
  );
};

export const ClickableImage = (props) => {
  const {size, source, onClick} = props;
  return (
    <TouchableOpacity onPress={onClick}>
      <Image
        source={source}
        style={{width: size, height: size, resizeMode: 'contain'}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    display: 'flex',
  },
  Wrapper: {
    width: '80%',
    backgroundColor: 'transparent',
    display: 'flex',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  firstView: {
    height: 150,
    width: '100%',
  },
  firstBottomView: {
    bottom: 0,
    right: 0,
    position: 'absolute',
    padding: 10,
  },
  centerBottomView: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  iconClose: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.white,
    top: 10,
    right: 10,
    position: 'absolute',
  },
  textNormal: {
    textAlign: 'left',
    color: Colors.black,
  },
  inputTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    userConfig: state.configurationReducer.userConfig,
  };
};

const mapDispatchToProps = {
  updateConfiguration,
  uploadAvatar,
  getUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
