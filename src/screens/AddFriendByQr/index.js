import CameraRoll from '@react-native-community/cameraroll';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {QRreader} from 'react-native-qr-decode-image-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {connect} from 'react-redux';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import QRCodeClass from '../../components/QRCode';
import Toast from '../../components/Toast';
import {
  Colors,
  Icons,
  Images,
  registerUrl,
  registerUrlStage,
} from '../../constants';
import {staging} from '../../helpers/api';
import NavigationService from '../../navigation/NavigationService';
import {setCurrentChannel} from '../../redux/reducers/channelReducer';
import {addFriendByReferralCode} from '../../redux/reducers/friendReducer';
import {translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import styles from './styles';

class AddFriendByQr extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentImageData: null,
      isQRVisible: false,
      showCameraView: true,
      showLoader: false,
    };
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
    this.focusListener = this.props.navigation.addListener(
      'willFocus',
      this.load,
    );
  }

  load = () => {
    console.log('AddFriendByQr willFocus called');
    this.setState({showCameraView: true, showLoader: false});
  };

  componentDidMount() {
    this.getRecentPhoto();
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  getRecentPhoto = () => {
    CameraRoll.getPhotos({
      first: 1,
      assetType: 'Photos',
    })
      .then((r) => {
        this.setState({recentImageData: r.edges});
        console.log('Last photo', r.edges);
      })
      .catch((err) => {
        console.error(err);
        //Error Loading Images
      });
  };
  getRecentMedias = () => {
    var options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
      } else if (response.error) {
        console.log('response.error', response.error);
      } else {
        console.log('response from picker', response);
        QRreader(response.uri)
          .then((data) => {
            console.log('response from QRReader', data);
            this.checkUrlAndNavigate(data);
          })
          .catch((err) => {
            console.log('Error from QRReader', err);
          });
      }
    });
  };

  onSuccess = (e) => {
    console.log('QRCodeScanner returned onSuccess', e);
    this.checkUrlAndNavigate(e.data);
  };

  checkUrlAndNavigate(url) {
    let regUrl = staging ? registerUrlStage : registerUrl;
    if (url.indexOf(regUrl) > -1) {
      let suffixUrl = url.split(regUrl)[1].trim();
      let invitationCode =
        suffixUrl.split('/').length > 0
          ? suffixUrl.split('/')[0].trim()
          : suffixUrl;
      if (invitationCode) {
        this.addFriendFromUrl(invitationCode);
      } else {
        Toast.show({
          title: 'TOUKU',
          text: translate('pages.xchat.unableToAdd'),
          type: 'primary',
        });
      }
    } else if (url.indexOf('/#/groups/') > -1) {
      let split_url = url.split('/');
      let group_id = split_url[split_url.length - 2];
      console.log('group_id', group_id);
      NavigationService.navigate('JoinGroup', {group_id: group_id});
    } else if (url.indexOf('invite') > -1) {
      let urlData = url.split('/');
      if (urlData.length > 4) {
        if (
          urlData[4] !== null ||
          urlData[4] !== undefined ||
          urlData[4] !== ''
        ) {
          let data = {
            id: urlData[4],
          };
          this.navigateToChannelInfo(data, url);
        }
      }
    } else {
      Toast.show({
        title: 'TOUKU',
        text: translate('pages.xchat.unableToAdd'),
        type: 'primary',
      });
    }
  }

  navigateToChannelInfo = async (data, url) => {
    let route = NavigationService.getCurrentRoute();
    let routeName = route.routeName;
    if (
      routeName &&
      (routeName === 'ChannelInfo' || routeName === 'ChannelChats')
    ) {
      NavigationService.popToTop();
    }
    this.props.setCurrentChannel(data);
    NavigationService.navigate('ChannelInfo');
  };

  addFriendFromUrl(invitationCode) {
    console.log('invitationCode onfocus', invitationCode);
    if (invitationCode) {
      let data = {invitation_code: invitationCode};
      this.setState({showLoader: true});
      this.props.addFriendByReferralCode(data).then((res) => {
        if (res.status === true) {
          this.setState({showCameraView: false});
        } else {
          this.setState({showLoader: false});
        }
        console.log('addFriendByReferralCode response', res);
      });
    }
  }

  showMyQrCode() {
    this.setState({isQRVisible: true});
  }

  render() {
    const {
      recentImageData,
      isQRVisible,
      showCameraView,
      showLoader,
    } = this.state;
    console.log('recentImageData', recentImageData);
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.scanQr')}
            // onChangeText={this.searchFriends}
            navigation={this.props.navigation}
          />
          {showCameraView && (
            <QRCodeScanner
              onRead={this.onSuccess}
              reactivate={true}
              reactivateTimeout={2000}
              // flashMode={RNCamera.Constants.FlashMode.torch}
              topViewStyle={styles.qrTopViewStyle}
              containerStyle={styles.qrContainerStyle}
              cameraStyle={styles.qrCameraStyle}
              bottomContent={
                <ImageBackground
                  source={Images.header_bg_small}
                  style={styles.background}
                  resizeMode="cover">
                  <View style={styles.qrContainerStyle}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.actionContainer}
                      onPress={() => this.showMyQrCode()}>
                      <Image style={styles.qrIcon} source={Icons.icon_qr} />
                      <Text style={styles.myQrCodeText}>
                        {translate('pages.xchat.myQrCode')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.qrContainerStyle}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.actionContainer}
                      onPress={() => this.getRecentMedias()}>
                      <Image
                        style={styles.searchQRIcon}
                        source={Icons.icon_searchQr}
                      />
                      <Text style={styles.searchByImageText}>
                        {translate('pages.xchat.searchByImage')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              }
            />
          )}
        </View>
        <QRCodeClass
          modalVisible={isQRVisible}
          closeModal={() => this.setState({isQRVisible: false})}
        />
        {showLoader && (
          <ActivityIndicator
            color={Colors.primary}
            size={'large'}
            style={styles.loaderStyle}
          />
        )}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = {
  addFriendByReferralCode,
  setCurrentChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFriendByQr);
