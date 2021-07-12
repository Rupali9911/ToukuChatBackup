import React, {Component} from 'react';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import InputWithTitle from '../../components/TextInputs/InputWithTitle';
import Toast from '../../components/Toast';
import {Colors} from '../../constants';
import S3uploadService from '../../helpers/S3uploadService';
import {
  followChannel,
  setCurrentChannel,
} from '../../redux/reducers/channelReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {getChannels, getChannelsById} from '../../storage/Service';
import {globalStyles} from '../../styles';
import {realmToPlainObject} from '../../utils';
import styles from './styles';

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
    const {channel_id} = this.state;
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
        console.log('data',data);
        this.props
          .followChannel(data)
          .then((res) => {
            if (res && res.status) {
              this.setState({
                loading: false,
                channel_id: '',
              });
              Toast.show({
                title: translate('pages.xchat.followChannel'),
                text: translate('pages.xchat.toastr.AddedToNewChannel'),
                type: 'positive',
              });

              //get all channel
              let channels = [];
              let result = getChannels();
              channels = realmToPlainObject(result);
              // channels = result.toJSON();

              //find channel into list
              let cIndex = channels.findIndex(
                (item) => item.id === Number(decryptedData[0]),
              );

              //set current channel with navigation
              if (cIndex !== -1) {
                let currentChannel = channels[cIndex];
                this.props.setCurrentChannel(currentChannel);
                this.props.navigation.navigate('ChannelChats');
              }
            }
          })
          .catch((err) => {
            console.log('follow error ', err);
            this.setState({loading: false});
            Toast.show({
              title: translate('pages.xchat.followChannel'),
              text: translate('backend.common.RererralCodeIsInvalid'),
              type: 'primary',
            });
          });
      }
    }
  };

  render() {
    const {channel_id, loading} = this.state;
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
          contentContainerStyle={styles.mainContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.inputesContainer}>
            <InputWithTitle
              title={translate('pages.xchat.channelId') + ' :'}
              titleStyle={styles.channelTitleStyle}
              // keyboardType={'number-pad'}
              value={channel_id}
              onChangeText={(text) => this.setState({channel_id: text})}
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

          <View style={styles.addChannelButtonContainer}>
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
