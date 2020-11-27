import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import { ChannelInvitationStyles } from './styles';
import { globalStyles } from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import { Colors, Fonts, Images } from '../../constants';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import UrlField from '../../components/UrlField';
import QRCode from 'react-native-qrcode-svg';
import { getImage, normalize } from '../../utils';
import RoundedImage from '../../components/RoundedImage';
import S3uploadService from '../../helpers/S3uploadService';
import RNFetchBlob from 'rn-fetch-blob';

import { translate, setI18nConfig } from '../../redux/reducers/languageReducer';
import { followChannel } from '../../redux/reducers/channelReducer';
import { getChannelsById } from '../../storage/Service';
import { inviteUrlRoot } from '../../helpers/api';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

class ChannelInvitation extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      channel_id: '',
      referral_code: '',
      loading: false,
      qr_code_data: ''
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
    this.setState({ orientation: initial });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.getDataURL();
  }

  _orientationDidChange = (orientation) => {
    this.setState({ orientation });
  };

  getDataURL() {
    this.qr_code.toDataURL(this.callback);
  }

  callback = (dataURL) => {
    console.log(dataURL);
    this.setState({qr_code_data: dataURL});
  }

  downloadQRCodeImage = (data) => {
    const dirs = RNFetchBlob.fs.dirs;
    var path = dirs.DocumentDir + `/qr_code_${new Date().getTime()}.png`;

    RNFetchBlob.fs.writeFile(path, data, 'base64').then((result)=>{
      console.log(result);
    }).catch((err)=>{
      console.log(err);
    });

  }

  render() {
    const { channel_id, qr_code_data, loading } = this.state;
    const {currentChannel, userData} = this.props;

    let tmpReferralCode = userData.referral_link;
    const arrLink = tmpReferralCode.split('/');
    let referralCode = "";
    if (arrLink.length > 0) {
      referralCode = arrLink[arrLink.length - 1];
    }

    const invitation_url = `${inviteUrlRoot}/invite/${currentChannel.id}/${referralCode}/invite.member`;
    const invitation_lp_url = `${inviteUrlRoot}/web/reader/?channel=${currentChannel.id}&referral=${referralCode}`;

    return (
      <View style={[globalStyles.container, { backgroundColor: Colors.light_pink }]}>
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
            <Text style={{ marginTop: normalize(15), fontFamily: Fonts.regular, fontSize: normalize(11.5), fontWeight: '300' }}>{translate('pages.invitation.findOutAllTheNewWayForFollower')}</Text>
            <Text style={{ marginTop: normalize(25), fontSize: normalize(18), fontWeight: '300' }}>{translate('pages.invitation.reachOutSocialMediaText')}</Text>
            <Text style={{ marginTop: normalize(15), alignSelf:'center', fontFamily: Fonts.regular, fontSize: normalize(11.5), fontWeight: '300' }}>{translate('pages.invitation.invitationToChannel')}</Text>
            <UrlField url={invitation_url}/>
            <Text style={{ marginTop: normalize(15), alignSelf:'center', fontFamily: Fonts.regular, fontSize: normalize(11.5), fontWeight: '300' }}>{translate('pages.invitation.linkViaLp')}</Text>
            <UrlField url={invitation_lp_url}/>
            <Text style={{ fontFamily: Fonts.regular, fontSize: normalize(9), fontWeight: '300' }}>{translate('pages.invitation.copyTextForFollower')}</Text>
            
            <Text style={{ marginTop: normalize(20), alignSelf:'center', fontFamily: Fonts.regular, fontSize: normalize(11.5), fontWeight: '300' }}>{translate('pages.invitation.qrCode')}</Text>
            <View style={{alignSelf: 'center', padding: 15, backgroundColor: Colors.white, borderColor: Colors.gradient_2, borderWidth: 1, borderRadius: 5}}>
              <QRCode
                size={120}
                value={invitation_url}
                getRef={(c)=>(this.qr_code = c)}
              />
            </View>
            <View style={{flexDirection:'row', marginTop:10,justifyContent:'center'}}>
              <Button
                type={'primary'}
                title={translate('pages.setting.download')}
                isRounded={false}
                onPress={() => {
                  this.downloadQRCodeImage(qr_code_data);
                }}
                loading={loading}
                leftIcon = {<FontAwesome5Icon name={'download'} color={Colors.white} size={18} style={{padding:5}}/>}
              />
            </View>
            
            <UrlField url={`<img src="data:image/png;base64,${qr_code_data}">`}/>
            <Text style={{ fontFamily: Fonts.regular, fontSize: normalize(9), fontWeight: '300' }}>{translate('pages.invitation.scanImageForFollower')}</Text>
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
  followChannel
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelInvitation);
