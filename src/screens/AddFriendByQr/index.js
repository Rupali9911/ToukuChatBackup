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
import {Fonts, Images, registerUrl, registerUrlStage} from "../../constants";
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
    };
  }

  static navigationOptions = () => {
    return {
      headerShown: false,
    };
  };

  UNSAFE_componentWillMount() {

  }

  componentDidMount() {
      this.getRecentPhoto()
  }

  componentWillUnmount() {

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
                    title: translate('common.referral'),
                    text: 'Invalid referral Url',
                    type: 'primary',
                });
            }
        }else{
            Toast.show({
                title: translate('common.referral'),
                text: 'No referral url found',
                type: 'primary',
            });
        }
    }

    addFriendFromUrl(invitationCode){
        console.log('invitationCode onfocus', invitationCode)
        if (invitationCode) {
            let data = {invitation_code: invitationCode};
            this.props.addFriendByReferralCode(data).then((res) => {
                // if (res.status === true) {
                //     this.setState({showLoader: true})
                // }
               // console.log('addFriendByReferralCode response', res)
            });
        }
    }

    showMyQrCode(){
        this.setState({isQRVisible: true})
    }

  render() {
    const {recentImageData, isQRVisible} = this.state;
    console.log('recentImageData', recentImageData)
    return (
        <ImageBackground
            source={Images.image_home_bg}
            style={globalStyles.container}>
            <View style={globalStyles.container}>
                <HeaderWithBack
                    onBackPress={() => this.props.navigation.goBack()}
                    title={'Add Friend by QR Code'}
                    // onChangeText={this.searchFriends}
                    navigation={this.props.navigation}
                />
        <QRCodeScanner
            onRead={this.onSuccess}
            reactivate={true}
            reactivateTimeout={2000}
           // flashMode={RNCamera.Constants.FlashMode.torch}
            topViewStyle={{flex: 0}}
            containerStyle={{flex: 1}}
            cameraStyle={{height: '100%'}}
            bottomContent={
                recentImageData?
                    <View style={{flex: 1, flexDirection: 'row', width: '100%', height: 100, position: 'absolute', bottom: 0}}>
                        <TouchableOpacity style={{flex: 1,alignSelf: 'center'}} onPress={() => this.showMyQrCode()}>
                            <Text style={{alignSelf: 'center', justifyContent: 'center', fontFamily: Fonts.regular, fontWeight: '400', fontSize: 20, color: 'white'}}>My QR Code</Text>
                        </TouchableOpacity>
                            <TouchableOpacity style={{position: 'absolute', padding: 10, alignSelf: 'center', right: 0}} onPress={() => this.getRecentMedias()}>
                              <Image
                                  style={{width: 60, height: 60}}
                                 source={{ uri: recentImageData[0].node.image.uri }}/>
                             </TouchableOpacity>
                    </View>
                    : null

            }
        />
            </View>
            <QRCodeClass
                modalVisible={isQRVisible}
                closeModal={() => this.setState({isQRVisible: false})}
            />
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
