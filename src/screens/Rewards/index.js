import React, {Component} from 'react';
import {ImageBackground, Linking, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import Toast from '../../components/Toast';
import {Colors} from '../../constants';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {getAdWallUniqueUrl} from '../../redux/reducers/userReducer';
import {globalStyles} from '../../styles';
import styles from './styles';

class Rewards extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      channel_id: '',
      referral_code: '',
      loading: false,
    };
    this.rewards = [
      {
        url:
          'https://s3-ap-southeast-1.amazonaws.com/toukupy.angelium.net/frontiaz/assets/images/ad-wall-1.png',
        type: 'coming soon',
      },
      {
        url:
          'https://s3-ap-southeast-1.amazonaws.com/toukupy.angelium.net/frontiaz/assets/images/ad-wall-2.png',
        type: 'coming soon',
      },
      {
        url:
          'https://s3-ap-southeast-1.amazonaws.com/toukupy.angelium.net/frontiaz/assets/images/ad-wall-3.png',
        type: 'channel',
      },
    ];
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
    if (
      this.props.userData.user_type === 'owner' ||
      this.props.userData.user_type === 'company' ||
      this.props.userData.user_type === 'tester'
    ) {
    } else {
      Toast.show({
        title: 'TOUKU',
        text: translate('pages.clasrm.comingSoon'),
        type: 'positive',
      });
    }
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  getUniqueUrl = (ad) => {
    this.props
      .getAdWallUniqueUrl(ad)
      .then((res) => {
        if (res && res.add_wall_url) {
          console.log('url', res.add_wall_url);
          Linking.openURL(res.add_wall_url);
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  render() {
    return (
      <View
        style={[globalStyles.container, {backgroundColor: Colors.light_pink}]}>
        <HeaderWithBack
          onBackPress={() => this.props.navigation.goBack()}
          title={translate('pages.xchat.rewards')}
          isCentered
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
          {this.rewards.map((item, index) => {
            return (
              <View>
                <TouchableOpacity
                  style={styles.singleFlex}
                  onPress={() => {
                    if (item.type === 'channel') {
                      this.props.navigation.navigate('ChannelInfo', {
                        channelItem: {channel_id: 1422},
                      });
                    } else {
                      if (
                        this.props.userData.user_type === 'owner' ||
                        this.props.userData.user_type === 'company' ||
                        this.props.userData.user_type === 'tester'
                      ) {
                        this.getUniqueUrl(index + 1);
                      } else {
                        Toast.show({
                          title: 'TOUKU',
                          text: translate('pages.clasrm.comingSoon'),
                          type: 'positive',
                        });
                      }
                    }
                  }}>
                  <ImageBackground
                    source={{uri: item.url}}
                    resizeMode={'cover'}
                    style={styles.urlImageBackground}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
  };
};

const mapDispatchToProps = {
  getAdWallUniqueUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(Rewards);
