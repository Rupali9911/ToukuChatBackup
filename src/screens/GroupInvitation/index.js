import React, {Component} from 'react';
import {Clipboard, Platform, Text, View} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import Button from '../../components/Button';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import UrlField from '../../components/UrlField';
import {Colors} from '../../constants';
import {inviteUrlRoot} from '../../helpers/api';
import S3uploadService from '../../helpers/S3uploadService';
import {followChannel} from '../../redux/reducers/channelReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import {hasStoragePermission, showToast} from '../../utils';
import styles from './styles';

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
    let path = null;
    if (Platform.OS === 'ios') {
      path =
        RNFS.DocumentDirectoryPath + `/qr_code_${new Date().getTime()}.png`;
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
            .catch((error) => {
              // error
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
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
    const {qr_code_data, loading} = this.state;
    const {currentGroup} = this.props;

    // let tmpReferralCode = userData.referral_link;
    // const arrLink = tmpReferralCode.split('/');
    // let referralCode = '';
    // if (arrLink.length > 0) {
    //   referralCode = arrLink[arrLink.length - 1];
    // }

    const invitation_url = `${inviteUrlRoot}/#/groups/${currentGroup.group_id}/`;

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
          contentContainerStyle={styles.mainContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inputesContainer}>
            {/* <RoundedImage
              source={Images.image_app_logo}
              style={GroupInvitationStyles.profileImage}
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
            </Text> */}

            {/* <Text
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
            </Text> */}

            <Text style={styles.issueGroupInvitationText}>
              {translate('pages.xchat.issueGroupInvitation')}
            </Text>
            <Text style={styles.textStyle}>
              {translate('pages.invitation.invitationToGroup')}
            </Text>
            <UrlField url={invitation_url} />
            {/* <Text
              style={styles.textStyle}>
              {translate('pages.invitation.linkViaLp')}
            </Text>
            <UrlField url={invitation_url} /> */}
            {/* <Text
              style={styles.textStyle}>
              {translate('pages.invitation.followCode')}
            </Text>
            <UrlField url={followCode} /> */}
            <Text style={styles.textTypeOneStyle}>
              {translate('pages.invitation.copyTextForFollower')}
            </Text>
            <Text style={styles.qrCode}>
              {translate('pages.invitation.qrCode')}
            </Text>
            <View style={styles.qrCodeContainer}>
              <QRCode
                size={120}
                value={invitation_url}
                quietZone={10}
                getRef={(c) => (this.qr_code = c)}
              />
            </View>
            <View style={styles.downloadContainer}>
              <Button
                type={'primary'}
                title={translate('pages.setting.download')}
                isRounded={false}
                onPress={() => {
                  if (Platform.OS === 'android') {
                    hasStoragePermission() &&
                      this.downloadQRCodeImage(qr_code_data);
                  } else {
                    this.downloadQRCodeImage(qr_code_data);
                  }
                }}
                loading={loading}
                leftIcon={
                  <FontAwesome5Icon
                    name={'download'}
                    color={Colors.white}
                    size={18}
                    style={styles.downloadIcon}
                  />
                }
              />
            </View>

            <UrlField
              url={`<img src="data:image/png;base64,${qr_code_data}">`}
            />
            <Text style={styles.textTypeOneStyle}>
              {translate('pages.xchat.scanOrShareQRImage')}
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
    currentGroup: state.groupReducer.currentGroup,
  };
};

const mapDispatchToProps = {
  followChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelInvitation);
