import React, {Component, Fragment} from 'react';
import {
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    Text,
    TextInput,
    FlatList, Linking, Platform, ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import ImagePicker from 'react-native-image-picker';
import { QRreader } from "react-native-qr-decode-image-camera";
import {Colors, Fonts, Icons, Images, registerUrl, registerUrlStage} from "../../constants";
import {globalStyles} from "../../styles";
import HeaderWithBack from "../../components/Headers/HeaderWithBack";
import {translate} from "../../redux/reducers/languageReducer";
import {resizeImage} from "../../utils";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from '../../components/Toast';
import {staging} from "../../helpers/api";
import {addFriendByReferralCode} from "../../redux/reducers/friendReducer";
import QRCodeClass from "../../components/QRCode";
class AddFriendByQr extends Component {
  constructor(props) {
    super(props);
    this.state = {
        recentImageData: null,
        isQRVisible: false,
        showCameraView: true,
        showLoader: false
    };
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {
      this.focusListener = this.props.navigation.addListener(
          'willFocus', this.load);
  }

    load = () => {
      console.log('AddFriendByQr willFocus called')
        this.setState({showCameraView: true, showLoader: false})
    }

  componentDidMount() {
      this.getRecentPhoto()
  }

    componentWillUnmount() {
        this.focusListener.remove();
    }

  getRecentPhoto = () => {
      CameraRoll.getPhotos({
          first: 1,
          assetType: 'Photos',
      })
          .then(r => {
               this.setState({ recentImageData: r.edges });
              console.log('Last photo', r.edges)
          })
          .catch((err) => {
              //Error Loading Images
          });
  }
    getRecentMedias = () =>  {
        var options = {
            mediaType: 'photo'
        };
        ImagePicker.launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
            } else if (response.error) {
                console.log('response.error', response.error);
            } else {
                 console.log('response from picker', response)
                QRreader(response.uri)
                    .then(data => {
                        console.log('response from QRReader', data)
                        this.checkUrlAndNavigate(data)
                    })
                    .catch(err => {
                        console.log('Error from QRReader', err)
                    });
            }
        });
    }

  onSuccess = e => {
      console.log('QRCodeScanner returned onSuccess', e)
      this.checkUrlAndNavigate(e.data)
    };


    checkUrlAndNavigate(url){
        let regUrl = staging ? registerUrlStage : registerUrl
        if (url.indexOf(regUrl) > -1) {
            let suffixUrl = url.split(regUrl)[1].trim();
            let invitationCode =
                suffixUrl.split('/').length > 0
                    ? suffixUrl.split('/')[0].trim()
                    : suffixUrl;
            if (invitationCode){
                this.addFriendFromUrl(invitationCode)
            }else{
                Toast.show({
                    title: 'TOUKU',
                    text: translate('pages.xchat.unableToAdd'),
                    type: 'primary',
                });
            }
        }else{
            Toast.show({
                title: 'TOUKU',
                text: translate('pages.xchat.unableToAdd'),
                type: 'primary',
            });
        }
    }

    addFriendFromUrl(invitationCode){
        console.log('invitationCode onfocus', invitationCode)
        if (invitationCode) {
            let data = {invitation_code: invitationCode};
            this.setState({showLoader: true})
            this.props.addFriendByReferralCode(data).then((res) => {
                if (res.status === true) {
                    this.setState({showCameraView: false})
                }else{
                    this.setState({showLoader: false})
                }
               console.log('addFriendByReferralCode response', res)
            });
        }
    }

    showMyQrCode(){
        this.setState({isQRVisible: true})
    }

  render() {
    const {recentImageData, isQRVisible, showCameraView, showLoader} = this.state;
    console.log('recentImageData', recentImageData)
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
                {
                    showCameraView &&
                    <QRCodeScanner
                        onRead={this.onSuccess}
                        reactivate={true}
                        reactivateTimeout={2000}
                        // flashMode={RNCamera.Constants.FlashMode.torch}
                        topViewStyle={{flex: 0}}
                        containerStyle={{flex: 1}}
                        cameraStyle={{height: '100%'}}
                        bottomContent={
                                <ImageBackground
                                    source={Images.header_bg_small}
                                    style={{flex: 1, flexDirection: 'row', width: '100%', height: 80, position: 'absolute', bottom: 0}}
                                    resizeMode="cover">
                                    <View style={{flex: 1}}>
                                    <TouchableOpacity activeOpacity={1} style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}} onPress={() => this.showMyQrCode()}>
                                        <Image
                                            style={{width: 25, height: 25, alignSelf: 'center', padding: 10}}
                                            source={Icons.icon_qr}/>
                                        <Text style={{textAlign: 'center',alignSelf: 'center', justifyContent: 'center', padding: 10, fontFamily: Fonts.regular, fontWeight: '400', fontSize: 14, color: 'white'}}>{translate('pages.xchat.myQrCode')}</Text>
                                    </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1}}>
                                    <TouchableOpacity activeOpacity={1} style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}} onPress={() => this.getRecentMedias()}>
                                        <Image
                                            style={{width: 25, height: 25, alignSelf: 'center', justifyContent: 'center'}}
                                            source={Icons.icon_searchQr}/>
                                        <Text style={{textAlign: 'center', alignSelf: 'center', padding: 10, fontFamily: Fonts.regular, fontWeight: '400', fontSize:14 , color: 'white'}}>{translate('pages.xchat.searchByImage')}</Text>
                                    </TouchableOpacity>
                                    </View>
                                </ImageBackground>
                        }
                    />
                }

            </View>
            <QRCodeClass
                modalVisible={isQRVisible}
                closeModal={() => this.setState({isQRVisible: false})}
            />
            { showLoader &&
                <ActivityIndicator
                    color={Colors.primary}
                    size={'large'}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
            }
        </ImageBackground>

    );
  }
}

const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToProps = {
    addFriendByReferralCode
};

export default connect(mapStateToProps, mapDispatchToProps)(AddFriendByQr);
