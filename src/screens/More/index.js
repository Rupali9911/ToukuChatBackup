import React, {Component} from 'react';
import {View, ImageBackground, ScrollView} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';

import {globalStyles} from '../../styles';
import HomeHeader from '../../components/HomeHeader';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {Images, Icons, Colors} from '../../constants';
import SettingsItem from '../../components/SettingsItem';
import ProfileModal from "../../components/Modals/ProfileModal";
import {logout} from "../../redux/reducers";

class More extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
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
    const {orientation} = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}>
        <View style={globalStyles.container}>
          <HomeHeader title={translate('common.settings')} />
            <ScrollView>
            <Section />
            <SettingsItem
                icon_name={'user'}
              title={translate('pages.xchat.addFriend')}
                onPress={() => console.log('Add Friend pressed')}
                isImage={Icons.add_friend}
            />
            <SettingsItem
                icon_name={'user'}
              title={translate('pages.xchat.createNewGroup')}
                onPress={() => this.props.navigation.navigate('CreateGroupChat')}
                isImage={Icons.icon_create_group_chat}
            />
            <SettingsItem
                icon_name={'user'}
              title={translate('pages.xchat.createChannel')}
                onPress={() => this.props.navigation.navigate('CreateChannel')}
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
            />
            <SettingsItem
                icon_name={'star'}
              title={translate('pages.xchat.toukuPoints')}
                isFontAwesome={true}
            />
            <SettingsItem
                icon_name={'user'}
              title={translate('common.goToXana')}
                onPress={() => console.log('Create New Group')}
                isImage={Icons.xana_app}
            />
            <Section />
                <SettingsItem
                    icon_name={'language'}
                    title={translate('pages.setting.language')}
                />
                <SettingsItem
                    icon_name={'comments'}
                    title={translate('pages.xchat.channelModeText')}
                    isImage={Icons.channel_mode}
                />
                <SettingsItem
                    icon_name={'comments'}
                    title={translate('pages.xchat.customerSupport')}
                    isFontAwesome={true}
                />
                <SettingsItem
                    icon_name={'sign-out-alt'}
                    title={translate('header.logout')}
                    onPress={() => this.actionLogout()}
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
  };
};

const mapDispatchToProps = {
    logout
};

export default connect(mapStateToProps, mapDispatchToProps)(More);
