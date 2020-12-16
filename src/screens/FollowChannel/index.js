import React, {Component} from 'react';
import {View} from 'react-native';
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
import {
  followChannel,
  setCurrentChannel,
} from '../../redux/reducers/channelReducer';
import {getChannelsById, getChannels} from '../../storage/Service';

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
    // console.log('this.props.getChannels', this.props.followingChannels);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  checkChannelFollow = (id) => {
    var channels = getChannelsById(id);
    if (channels && channels.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  // getChannelData = () => {
  //   let channelInfo = '1617-XXBNP31P';

  //   let data = channelInfo.split('-');

  //   let chanleObj = {
  //     channel_id: data[0],
  //     referral_code: data[1],
  //   };

  //   this.handleButtonPress(chanleObj);
  // };

  handleButtonPress = (chanleObj) => {
    const {channel_id} = this.state;
    if (channel_id === null || channel_id === '' || channel_id === undefined) {
      Toast.show({
        title: translate('pages.xchat.followChannel'),
        text: translate('pages.invitation.enterFollowCode'),
        type: 'primary',
      });
    } else {
      this.followChannel();
    }
  };

  followChannel = () => {
    const {channel_id, referral_code} = this.state;
    let channelInfo = channel_id;

    const code = channelInfo.slice(0, -1);

    console.log('code', code);
    const index = Number(channelInfo.slice(-1));
    console.log('code 1', index);
    const decryptedData = [
      code.slice(0, index),
      code.slice(index, code.length),
    ];

    console.log('decrypted', decryptedData);

    let data = {
      channel_id: Number(decryptedData[0]),
      referral_code: decryptedData[1],
      user_id: this.props.userData.id,
    };

    this.setState({loading: true});
    if (!index || !Number(decryptedData[0]) || Number(decryptedData[0]) === 0) {
      this.setState({loading: false});
      Toast.show({
        title: translate('pages.xchat.followChannel'),
        text: translate('pages.invitation.wrongFollowCode'),
        type: 'primary',
      });
    } else {
      // check already follow or not
      let channelIndex = this.props.followingChannels.findIndex(
        (item) => item.id === Number(decryptedData[0]),
      );
      if (channelIndex !== -1) {
        this.setState({loading: false});
        Toast.show({
          title: translate('pages.xchat.followChannel'),
          text: translate('pages.xchat.toastr.alreadyFollowed'),
          type: 'primary',
        });
      } else {
        this.props
          .followChannel(data)
          .then((res) => {
            if (res && res.status) {
              this.setState({
                loading: false,
                channel_id: '',
                referral_code: '',
              });
              Toast.show({
                title: translate('pages.xchat.followChannel'),
                text: translate('pages.xchat.toastr.AddedToNewChannel'),
                type: 'positive',
              });

              //get all channel
              let channels = [];
              let result = getChannels();

              channels = result.toJSON();

              //find channel into list
              let channelIndex = channels.findIndex(
                (item) => item.id === Number(decryptedData[0]),
              );

              //set current channel with navigation
              if (channelIndex !== -1) {
                let setCurrentChannel = channels[channelIndex];
                this.props.setCurrentChannel(setCurrentChannel);
                this.props.navigation.navigate('ChannelChats');
              }
            }
          })
          .catch((err) => {
            console.log('follow error ', err);
            this.setState({loading: false});
            Toast.show({
              title: translate('pages.xchat.followChannel'),
              text: translate('pages.invitation.wrongFollowCode'),
              type: 'primary',
            });
          });
      }
    }
  };

  render() {
    const {channel_id, referral_code, loading} = this.state;
    return (
      <View
        style={[globalStyles.container, {backgroundColor: Colors.light_pink}]}>
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
                Colors: '#000',
                fontFamily: Fonts.regular,
              }}
              keyboardType={'number-pad'}
              value={channel_id}
              onChangeText={(channel_id) =>
                this.setState({channel_id: channel_id})
              }
            />
            {/* <InputWithTitle
              title={
                translate('pages.xchat.referralCode') +
                ' (' +
                translate('pages.xchat.optional') +
                ') :'
              }
              titleStyle={{
                fontFamily: Fonts.light,
              }}
              value={referral_code}
              onChangeText={(referral_code) => this.setState({referral_code})}
            /> */}
          </View>

          <View style={{marginTop: 10, justifyContent: 'center'}}>
            <Button
              type={'primary'}
              title={translate('pages.xchat.addChannel')}
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
    followingChannels: state.channelReducer.followingChannels,
  };
};

const mapDispatchToProps = {
  followChannel,
  setCurrentChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(FollowChannel);
