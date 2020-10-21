import React, {Component} from 'react';
import {View, ImageBackground, ScrollView, Linking, ActivityIndicator} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';

import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getToukuPoints} from '../../redux/reducers/configurationReducer';
import {setToukuPoints} from '../../redux/reducers/userReducer';
import {
  Images,
  Icons,
  Colors,
  supportUrl,
  xanaUrl,
  xanaDeepLink,
  xanaAppStore,
} from '../../constants';
import SettingsItem from '../../components/SettingsItem';
import ProfileModal from '../../components/Modals/ProfileModal';
import {logout} from '../../redux/reducers';
import WebViewClass from '../../components/WebView';
import QRCodeClass from '../../components/QRCode';
import ConfirmationModal from '../../components/Modals/ConfirmationModal';
import AsyncStorage from '@react-native-community/async-storage';
import {resetData} from '../../storage/Service';
import LinearGradient from 'react-native-linear-gradient';
import SingleSocket from '../../helpers/SingleSocket';

class More extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isWebViewVisible: false,
      isQRVisible: false,
      isSupport: false,
      isLogOutVisible: false,
        loggingloggingOutOut: false
    };
    this.SingleSocket = SingleSocket.getInstance();
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
    //this.props.navigation.addListener('willFocus', this.load)
  }

  // load = () => {
  //     const {getToukuPoints, setToukuPoints} = this.props
  //     getToukuPoints().then((res) => {
  //         if (res && res.status === true){
  //             setToukuPoints(this.props.userData, res.total_tp).then((res) => {
  //                 this.setState({isQRVisible: false})
  //             });
  //         }
  //     })
  // }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  updateModalVisibility() {
    this.setState({isLogOutVisible: !this.state.isLogOutVisible});
    // this.setState((prevState) => ({
    //     isLogOutVisible: !prevState.isLogOutVisible,
    // }));
  }

  clearAsyncStorage = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    await AsyncStorage.clear();
    await AsyncStorage.setItem('fcmToken', fcmToken);
  };

  actionLogout = async () => {
    this.setState({loggingOut: true})
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let data = {
        dev_id: fcmToken
    }
    this.props.logout(data).then(async (res) => {
        this.updateModalVisibility();
        this.props.navigation.navigate('Auth');
        this.SingleSocket && this.SingleSocket.closeSocket();
        resetData();
        await this.clearAsyncStorage();
        this.setState({loggingOut: false})
    })
        .catch((error) => {
            this.setState({loggingOut: false})
        });
  };

  actionCancel() {
    this.updateModalVisibility();
  }

  onPressXana() {
    //   const supported = await Linking.canOpenURL(xanaDeepLink);
    //   console.log('supported', supported)
    // if (supported) {
    //     Linking.openURL(xanaDeepLink)
    // }else{
    //     Linking.openURL(xanaAppStore)
    // }
    Linking.openURL(xanaUrl);
  }

    onNeedSupportClick() {
        this.setState({isWebViewVisible: true})
        //Linking.openURL(supportUrl);
    }


    render() {
    const {
      orientation,
      isWebViewVisible,
      isQRVisible,
      isSupport,
      isLogOutVisible,
        loggingOut
    } = this.state;
    const {selectedLanguageItem, navigation} = this.props;
    return (
      // <ImageBackground
      //   source={Images.image_home_bg}
      //   style={globalStyles.container}>
      <View style={globalStyles.container}>
        <HomeHeader title={translate('common.setting')} />
        <ScrollView
          ref={(ref) => {
            this.scrollView = ref;
          }}>
          <Section />
          <SettingsItem
            icon_name={'user'}
            title={translate('pages.xchat.addFriend')}
            onPress={() => navigation.navigate('AddFriend')}
            isImage={Icons.add_friend}
          />
          <SettingsItem
            icon_name={'user'}
            title={translate('pages.xchat.createNewGroup')}
            onPress={() => navigation.navigate('CreateGroupChat')}
            isImage={Icons.icon_create_group_chat}
          />
          {/*<SettingsItem*/}
          {/*icon_name={'user'}*/}
          {/*title={translate('pages.xchat.createChannel')}*/}
          {/*onPress={() => navigation.navigate('CreateChannel')}*/}
          {/*isImage={Icons.icon_create_new_channel}*/}
          {/*/>*/}
          <Section />
          <SettingsItem
            icon_name={'user'}
            title={translate('common.profile')}
            onPress={() => ProfileModal.show()}
            isFontAwesome={true}
          />
          <SettingsItem
            icon_name={'id-card'}
            title={translate('pages.xchat.urlForAddingAFriend')}
            isFontAwesome={true}
            isInvitation={true}
            onPressQR={() => this.setState({isQRVisible: true})}
          />
          {/*<SettingsItem*/}
          {/*icon_name={'star'}*/}
          {/*title={translate('pages.xchat.toukuPoints')}*/}
          {/*isFontAwesome={true}*/}
          {/*isToukuPoints={true}*/}
          {/*/>*/}
          {/*<SettingsItem*/}
          {/*icon_name={'user'}*/}
          {/*title={translate('common.goToXana')}*/}
          {/*isImage={Icons.xana_app}*/}
          {/*onPress={() => this.onPressXana()}*/}
          {/*/>*/}
          <Section />
          <SettingsItem
            icon_name={'language'}
            title={translate('pages.setting.language')}
            isLanguage={true}
            scrollToBottom={() =>
              this.scrollView.scrollToEnd({animated: false})
            }
          />
          {/*<SettingsItem*/}
          {/*icon_name={'comments'}*/}
          {/*title={translate('pages.xchat.channelModeText')}*/}
          {/*isImage={Icons.channel_mode}*/}
          {/*isChannelMode={true}*/}
          {/*/>*/}
          <SettingsItem
            icon_name={'comments'}
            title={translate('pages.xchat.customerSupport')}
            isFontAwesome={true}
            isCustomerSupport={true}
            onPress={() => this.onNeedSupportClick()}
          />
          <SettingsItem
            icon_name={'code-branch'}
            title={translate('pages.setting.version')}
            isVersion={true}
          />
          <SettingsItem
            icon_name={'sign-out-alt'}
            title={translate('header.logout')}
            onPress={() => this.updateModalVisibility()}
          />
            {isWebViewVisible &&
            <WebViewClass
                modalVisible={isWebViewVisible}
                url={supportUrl}
                closeModal={() => this.setState({isWebViewVisible: false})}
            />
            }

        </ScrollView>
          <QRCodeClass
              modalVisible={isQRVisible}
              closeModal={() => this.setState({isQRVisible: false})}
          />
        <ConfirmationModal
          orientation={orientation}
          visible={isLogOutVisible}
          onCancel={this.actionCancel.bind(this)}
          onConfirm={this.actionLogout.bind(this)}
          title={translate('header.logoTitle')}
          message={translate('common.logOutAlert')}
          isLoading={loggingOut}
        />

      </View>
      // </ImageBackground>
    );
  }
}

const Section = (props) => {
  return (
    <LinearGradient
      start={{x: 0.03, y: 0.7}}
      end={{x: 0.95, y: 0.8}}
      locations={[0.1, 0.9, 1]}
      colors={[
        Colors.header_gradient_3,
        Colors.header_gradient_2,
        Colors.header_gradient_1,
      ]}
      style={{
        height: 27
      }}
    />
  );

  // <View style={{height: 27, backgroundColor: Colors.home_header}} />;
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userConfig: state.configurationReducer.userConfig,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  logout,
  getToukuPoints,
  setToukuPoints,
};

export default connect(mapStateToProps, mapDispatchToProps)(More);
