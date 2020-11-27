import React, {Component} from 'react';
import {
  View,
} from 'react-native';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {followChannelStyles} from './styles';
import {globalStyles} from '../../styles';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import {Colors, Fonts} from '../../constants';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import S3uploadService from '../../helpers/S3uploadService';

import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {followChannel} from '../../redux/reducers/channelReducer';
import {getChannelsById} from '../../storage/Service';

class FollowChannel extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      channel_id: '',
      referral_code: '',
      loading: false,
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

  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  checkChannelFollow = (id) => {
    var channels = getChannelsById(id);
    if(channels && channels.length>0){
      return true;
    }else{
      return false;
    }
  }

  handleButtonPress = () => {
    const {channel_id} = this.state;
    var reg = /^[0-9]*$/;
    if(channel_id && channel_id.trim()!=='' && reg.test(channel_id)){
      if(this.checkChannelFollow(channel_id)){
        Toast.show({
          title: translate('pages.xchat.followChannel'),
          text: translate('pages.xchat.toastr.alreadyFollowed'),
          type: 'primary',
        });
      }else{
        this.followChannel();
      }
    }else{
      Toast.show({
        title: translate('pages.xchat.followChannel'),
        text: translate('pages.xchat.toastr.enterChannelId'),
        type: 'primary',
      });
    }

  }

  followChannel = () => {
    const {channel_id,referral_code} = this.state;

    let data = {
      channel_id: channel_id,
      user_id: this.props.userData.id,
    };

    if(referral_code && referral_code!==''){
      data['referral_code'] = referral_code;
    }

    this.setState({loading:true});

    this.props.followChannel(data).then((res)=>{
      this.setState({loading:false,channel_id:'', referral_code:''});
      if(res && res.status){
        Toast.show({
          title: '',
          text: translate('pages.xchat.toastr.AddedToNewChannel'),
          type: 'positive',
        });
        this.props.navigation.goBack();
        this.props.navigation.navigate('Home');
      }
    }).catch((err)=>{
      this.setState({loading:false});
      Toast.show({
        title: translate('pages.xchat.followChannel'),
        text: 'Not Found.',
        type: 'primary',
      });
    })

  }

  render() {
    const {channel_id, referral_code, loading} = this.state;
    return (
        <View style={[globalStyles.container,{backgroundColor: Colors.light_pink}]}>
          <HeaderWithBack
            onBackPress={() => this.props.navigation.goBack()}
            title={translate('pages.xchat.followChannel')}
          />
          <KeyboardAwareScrollView
            scrollEnabled
            // enableOnAndroid={true}
            keyboardShouldPersistTaps={'handled'}
            // extraScrollHeight={100}
            extraHeight={100}
            behavior={'position'}
            contentContainerStyle={followChannelStyles.mainContainer}
            showsVerticalScrollIndicator={false}>
            <View style={followChannelStyles.inputesContainer}>
              <InputWithTitle
                title={translate('pages.xchat.channelId') + ' :'}
                titleStyle={{
                  fontFamily: Fonts.light
                }}
                keyboardType={'number-pad'}
                value={channel_id}
                onChangeText={(channel_id) => this.setState({channel_id})}
              />
              <InputWithTitle
                title={translate('pages.xchat.referralCode') + ' (' + translate('pages.xchat.optional') +') :'}
                titleStyle={{
                  fontFamily: Fonts.light
                }}
                value={referral_code}
                onChangeText={(referral_code) => this.setState({referral_code})}
              />

            </View>

            <View style={{marginTop:10,justifyContent:'center'}}>
              <Button
                type={'primary'}
                title={translate('pages.xchat.followChannel')}
                isRounded={false}
                onPress={() => this.handleButtonPress()}
                loading={loading}
              />
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
  };
};

const mapDispatchToProps = {
  followChannel
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowChannel);
