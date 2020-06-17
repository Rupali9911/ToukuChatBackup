import React, {Component} from 'react';
import {View, ImageBackground, ScrollView, Linking} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';

import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {getToukuPoints} from '../../redux/reducers/configurationReducer';
import {setToukuPoints} from '../../redux/reducers/userReducer';
import {Images, Icons, Colors, supportUrl, xanaUrl} from '../../constants';
import SettingsItem from '../../components/SettingsItem';
import ProfileModal from "../../components/Modals/ProfileModal";
import {logout} from "../../redux/reducers";
import WebViewClass from '../../components/WebView';
import QRCodeClass from "../../components/QRCode";

class More extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
        isWebViewVisible: false,
        isQRVisible: false,
        isSupport: false
    };
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
      this.props.navigation.addListener('willFocus', this.load)
  }

    load = () => {
        const {getToukuPoints, setToukuPoints} = this.props
        getToukuPoints().then((res) => {
            if (res && res.status === true){
                setToukuPoints(this.props.userData, res.total_tp).then((res) => {
                    this.setState({isQRVisible: false})
                });
            }
        })
    }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

    async actionLogout() {
        this.props.logout().then((res) => {
            this.props.navigation.navigate('Auth');
        });
    }


  render() {
    const {orientation, isWebViewVisible, isQRVisible, isSupport} = this.state;
    const {selectedLanguageItem, navigation} = this.props;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HomeHeader title={translate('common.settings')} />
            <ScrollView
                ref={ref => {this.scrollView = ref}}>
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
            <SettingsItem
                icon_name={'user'}
              title={translate('pages.xchat.createChannel')}
                onPress={() => navigation.navigate('CreateChannel')}
                isImage={Icons.icon_create_new_channel}
            />
            <Section />
            <SettingsItem
                icon_name={'user'}
              title={translate('common.profile')}
                onPress={() => ProfileModal.show()}
                isFontAwesome={true}
            />
            <SettingsItem
                icon_name={'id-card'}
              title={translate('pages.xchat.invitation')}
                isFontAwesome={true}
                isInvitation={true}
                onPressQR={() => this.setState({isQRVisible: true})}
            />
            <SettingsItem
                icon_name={'star'}
              title={translate('pages.xchat.toukuPoints')}
                isFontAwesome={true}
                isToukuPoints={true}
            />
            <SettingsItem
                icon_name={'user'}
              title={translate('common.goToXana')}
                onPress={() => console.log('Create New Group')}
                isImage={Icons.xana_app}
                onPress={() => Linking.openURL(supportUrl)}
            />
            <Section />
                <SettingsItem
                    icon_name={'language'}
                    title={translate('pages.setting.language')}
                    isLanguage={true}
                    scrollToBottom={() => this.scrollView.scrollToEnd({animated: false})}
                />
                <SettingsItem
                    icon_name={'comments'}
                    title={translate('pages.xchat.channelModeText')}
                    isImage={Icons.channel_mode}
                    isChannelMode={true}
                />
                <SettingsItem
                    icon_name={'comments'}
                    title={translate('pages.xchat.customerSupport')}
                    isFontAwesome={true}
                    isCustomerSupport={true}
                    onPress={() => Linking.openURL(supportUrl)}
                />
                <SettingsItem
                    icon_name={'sign-out-alt'}
                    title={translate('header.logout')}
                    onPress={() => this.actionLogout()}
                />
                <WebViewClass
                modalVisible={isWebViewVisible}
                url={isSupport ? supportUrl : xanaUrl}
                closeModal={() => this.setState({isWebViewVisible: false})}
                />

                <QRCodeClass
                    modalVisible={isQRVisible}
                    closeModal={() => this.setState({isQRVisible: false})}
                />

          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const Section = (props) => {
  return <View style={{height: 30, backgroundColor: Colors.home_header}} />;
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
    setToukuPoints
};

export default connect(mapStateToProps, mapDispatchToProps)(More);
