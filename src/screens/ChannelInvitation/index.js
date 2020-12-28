import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Clipboard,
  Platform,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {ChannelInvitationStyles} from './styles';
import {globalStyles} from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import {Colors, Fonts, Images} from '../../constants';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import UrlField from '../../components/UrlField';
import QRCode from 'react-native-qrcode-svg';
import {getImage, normalize, showToast, hasStoragePermission} from '../../utils';
import RoundedImage from '../../components/RoundedImage';
import S3uploadService from '../../helpers/S3uploadService';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {followChannel} from '../../redux/reducers/channelReducer';
import {getChannelsById} from '../../storage/Service';
import {inviteUrlRoot} from '../../helpers/api';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {TouchableHighlight} from 'react-native-gesture-handler';
import FileViewer from 'react-native-file-viewer';

class ChannelInvitation extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      channel_id: '',
      referral_code: '',
      loading: false,
      qr_code_data: '',
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
    this.getDataURL();
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  getDataURL() {
    this.qr_code.toDataURL(this.callback);
  }

  callback = (dataURL) => {
    // console.log(dataURL);
    this.setState({qr_code_data: dataURL});
  };

  copyCode(data) {
    Clipboard.setString(data);
    showToast(
      translate('pages.setting.referralLink'),
      translate('pages.setting.toastr.linkCopiedSuccessfully'),
      'positive',
    );
  }

  downloadQRCodeImage = (data) => {
      var RNFS = require('react-native-fs');
      const dirs = RNFetchBlob.fs.dirs;
      let path = null
    if(Platform.OS==='ios'){
      path = RNFS.DocumentDirectoryPath + `/qr_code_${new Date().getTime()}.png`;
        RNFS.writeFile(path, data, 'base64')
            .then((success) => {
                showToast(
                    translate('pages.xchat.downloadFile'),
                    translate('pages.setting.downloadedSuccessfully'),
                    'positive',
                );
                FileViewer.open(path)
                    .then(() => {
                        // success
                    })
                    .catch(error => {
                        // error
                        console.log(error);
                    });
            })
            .catch((err) => {
                console.log(err.message);
            });
    }else{
      path = dirs.DownloadDir + `/qr_code_${new Date().getTime()}.png`;
        RNFetchBlob.fs
            .writeFile(path, data, 'base64')
            .then((result) => {
                showToast(
                    translate('pages.xchat.downloadFile'),
                    translate('pages.setting.downloadedSuccessfully'),
                    'positive',
                );
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // RNFetchBlob.fs.createFile(path,data,'base64').then((result)=>{
    //   console.log('result',result);
    //   showToast(
    //     translate('pages.setting.referralLink'),
    //     translate('pages.setting.toastr.linkCopiedSuccessfully'),
    //     'positive',
    //   );
    // }).catch((err)=>{
    //   console.log(err);
    // })

  };

  render() {
    const {channel_id, qr_code_data, loading} = this.state;
    const {currentChannel, userData} = this.props;

    let tmpReferralCode = userData.referral_link;
    const arrLink = tmpReferralCode.split('/');
    let referralCode = '';
    if (arrLink.length > 0) {
      referralCode = arrLink[arrLink.length - 1];
    }

    const invitation_url = `${inviteUrlRoot}/invite/${currentChannel.id}/${referralCode}/invite.member`;
    const followCode =
      currentChannel.id + referralCode + String(currentChannel.id).length;
    const invitation_lp_url = `${inviteUrlRoot}/web/reader/?channel=${currentChannel.id}&referral=${referralCode}`;

    return (
      <View
        style={[globalStyles.container, {backgroundColor: Colors.light_pink}]}>
        <HeaderWithBack
          onBackPress={() => this.props.navigation.goBack()}
          title={translate('common.invitation')}
        />
        <KeyboardAwareScrollView
          scrollEnabled
          // enableOnAndroid={true}
          keyboardShouldPersistTaps={'handled'}
          // extraScrollHeight={100}
          extraHeight={100}
          behavior={'position'}
          contentContainerStyle={ChannelInvitationStyles.mainContainer}
          showsVerticalScrollIndicator={false}>
          <View style={ChannelInvitationStyles.inputesContainer}>
            <RoundedImage
              source={Images.image_app_logo}
              style={ChannelInvitationStyles.profileImage}
              isRounded={false}
              resizeMode={'cover'}
              size={'100%'}
            />
            <Text
              style={{
                marginTop: normalize(15),
                fontFamily: Fonts.regular,
                fontSize: normalize(11.5),
                fontWeight: '300',
              }}>
              {translate('pages.invitation.findOutAllTheNewWayForFollower')}
            </Text>

            <Text
              style={{
                marginTop: normalize(15),
                fontFamily: Fonts.regular,
                fontSize: normalize(11.5),
                fontWeight: '300',
              }}>
              {translate('pages.invitation.referralOneField')}{' '}
              <Text
                style={{textDecorationLine: 'underline'}}
                onPress={() => this.copyCode(followCode)}>
                {followCode}
              </Text>
              {'.'}
            </Text>

            <Text
              style={{
                marginTop: normalize(25),
                fontSize: normalize(18),
                fontWeight: '300',
              }}>
              {translate('pages.invitation.reachOutSocialMediaText')}
            </Text>
            <Text
              style={{
                marginTop: normalize(15),
                alignSelf: 'center',
                fontFamily: Fonts.regular,
                fontSize: normalize(11.5),
                fontWeight: '300',
              }}>
              {translate('pages.invitation.invitationToChannel')}
            </Text>
            <UrlField url={invitation_url} />
            <Text
              style={{
                marginTop: normalize(15),
                alignSelf: 'center',
                fontFamily: Fonts.regular,
                fontSize: normalize(11.5),
                fontWeight: '300',
              }}>
              {translate('pages.invitation.linkViaLp')}
            </Text>
            <UrlField url={invitation_url} />
            {/* <Text
              style={{
                marginTop: normalize(15),
                alignSelf: 'center',
                fontFamily: Fonts.regular,
                fontSize: normalize(11.5),
                fontWeight: '300',
              }}>
              {translate('pages.invitation.followCode')}
            </Text>
            <UrlField url={followCode} /> */}
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: normalize(9),
                fontWeight: '300',
              }}>
              {translate('pages.invitation.copyTextForFollower')}
            </Text>
            <Text
              style={{
                marginTop: normalize(20),
                alignSelf: 'center',
                fontFamily: Fonts.regular,
                fontSize: normalize(11.5),
                fontWeight: '300',
              }}>
              {translate('pages.invitation.qrCode')}
            </Text>
            <View
              style={{
                alignSelf: 'center',
                padding: 15,
                backgroundColor: Colors.white,
                borderColor: Colors.gradient_2,
                borderWidth: 1,
                borderRadius: 5,
              }}>
              <QRCode
                size={120}
                value={invitation_url}
                quietZone={10}
                getRef={(c) => (this.qr_code = c)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'center',
              }}>
              <Button
                type={'primary'}
                title={translate('pages.setting.download')}
                isRounded={false}
                onPress={() => {
                  if(Platform.OS==='android'){
                    hasStoragePermission() && this.downloadQRCodeImage(qr_code_data);
                  }else{
                    this.downloadQRCodeImage(qr_code_data);
                  }
                }}
                loading={loading}
                leftIcon={
                  <FontAwesome5Icon
                    name={'download'}
                    color={Colors.white}
                    size={18}
                    style={{padding: 5}}
                  />
                }
              />
            </View>

            <UrlField
              url={`<img src="data:image/png;base64,${qr_code_data}">`}
            />
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: normalize(9),
                fontWeight: '300',
              }}>
              {translate('pages.invitation.scanImageForFollower')}
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
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
    currentChannel: state.channelReducer.currentChannel,
  };
};

const mapDispatchToProps = {
  followChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelInvitation);
