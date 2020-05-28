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
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import {Colors, Fonts, Images, Icons} from '../../constants';
import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import {ChangePassModal, ChangeEmailModal, ChangeNameModal} from '../Modals';
import {getAvatar} from '../../utils';
import UploadUserImageModal from '../Modals/UploadUserImageModal';
import {translate} from '../../redux/reducers/languageReducer';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChangePassModalVisible: false,
      isChangeEmailModalVisible: false,
      isChangeNameModalVisible: false,
      isUploadUserImageModalVisible: false,
    };
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
    this.setState({isUploadUserImageModalVisible: true});
  }

  render() {
    const {onRequestClose, userData} = this.props;
    const {
      isChangePassModalVisible,
      isChangeEmailModalVisible,
      isChangeNameModalVisible,
      isUploadUserImageModalVisible,
    } = this.state;
    return (
      <View style={styles.Wrapper}>
        <ScrollView
          contentContainerStyle={{backgroundColor: Colors.white}}
          showsVerticalScrollIndicator={false}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.8, y: 0.3}}
            locations={[0.3, 0.5, 0.8, 1, 1]}
            colors={['#9440a3', '#c13468', '#ee2e3b', '#fa573a', '#fca150']}
            style={{height: 150}}>
            <ImageBackground style={styles.firstView}>
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
                    onClick={() => {}}
                  />
                </View>
              </View>

              <TouchableOpacity onPress={onRequestClose}>
                <Image source={Icons.icon_close} style={styles.iconClose} />
              </TouchableOpacity>
            </ImageBackground>
          </LinearGradient>

          <View style={{alignSelf: 'center', marginTop: -40}}>
            <RoundedImage
              size={80}
              source={getAvatar(userData.avatar)}
              clickable={true}
            />
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
                {color: Colors.black, marginHorizontal: 10},
              ]}>
              {userData.first_name + ' '}
              {userData.last_name}
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
                {color: Colors.black, marginBottom: 10},
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

          <ProfileItem
            title={translate('common.country')}
            value={userData.country}
            editable={false}
          />

          <ProfileItem
            title={translate('common.phone')}
            value={userData.phone}
            editable={false}
          />
        </ScrollView>
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

        <UploadUserImageModal
          visible={isUploadUserImageModalVisible}
          onRequestClose={() =>
            this.setState({isUploadUserImageModalVisible: false})
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
        <Text style={[globalStyles.smallRegularText, styles.textNormal]}>
          {title}
        </Text>
        <Text style={[globalStyles.smallRegularText, styles.textNormal]}>
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
    alignItems: 'flex-end',
    padding: 10,
  },
  firstBottomView: {
    bottom: 0,
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
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
