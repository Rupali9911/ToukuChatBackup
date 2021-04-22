import React, {Component} from 'react';
import {Image, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {Colors, Images} from '../../constants';
import S3uploadService from '../../helpers/S3uploadService';
import {
  followChannel,
  setCurrentChannel,
} from '../../redux/reducers/channelReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {getChannelsById} from '../../storage/Service';
import {globalStyles} from '../../styles';
import {normalize} from '../../utils';
import styles from './styles';

class ToukuPointExchange extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isExchange: false,
      loading: false,
      tp_point: 0,
      point_in_yen: 0,
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

  render() {
    const {isExchange} = this.state;
    return (
      <View style={[globalStyles.container, {backgroundColor: Colors.white}]}>
        <HeaderWithBack
          onBackPress={() => this.props.navigation.goBack()}
          title={translate('pages.adWall.amazonExchange')}
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
          <View style={styles.amazonLogoContainer}>
            <Image
              source={Images.amazon_logo}
              style={styles.amazonLogo}
              resizeMode={'contain'}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <Text style={styles.contentText}>
                {translate('pages.adWall.miniExchangePoint')}
              </Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.contentLabel}>500TP</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.contentText}>
                {translate('pages.adWall.exchangeFee')}
              </Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.contentLabel}>500TP</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.contentText}>
                {translate('pages.adWall.twoStepVerificaion')}
              </Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.contentLabel}>500TP</Text>
            </View>
            <View style={styles.exchangeDaysNumberContainer}>
              <Text>{translate('pages.adWall.exchangeDaysNumber')}</Text>
            </View>
            <View style={styles.sendToEmailContainer}>
              <Text>{translate('pages.adWall.sendItToYourEmail')}</Text>
            </View>
            <View style={styles.interactionContainer}>
              <View style={styles.singleFlex}>
                <Button
                  type={'translucent'}
                  title={translate('pages.adWall.exchangeHistory')}
                  onPress={() => {
                    this.props.navigation.navigate('ExchangeHistoryScreen');
                  }}
                />
              </View>
              <View style={styles.divider} />
              <View style={styles.singleFlex}>
                <Button
                  type={isExchange ? '' : 'translucent'}
                  title={translate('pages.adWall.exchange')}
                  onPress={() => {
                    this.setState({isExchange: !this.state.isExchange});
                  }}
                />
              </View>
            </View>
            {isExchange ? (
              <View>
                <View style={styles.currentPointContainer}>
                  <Text style={styles.currentPointText}>
                    {translate('pages.adWall.currentPointHeld')}
                  </Text>
                  <Text style={styles.currentPointLabel}>500TP</Text>
                </View>
                <View style={styles.exchangeAmountContainer}>
                  <Text style={styles.exchangeAmountText}>
                    {translate('pages.adWall.amountOfExchangePoint')}
                  </Text>
                </View>
                <View style={styles.convertInputContainer}>
                  <TextInput
                    style={styles.tpPointText}
                    value={this.state.tp_point}
                    onChangeText={(text) => {
                      this.setState({tp_point: text, point_in_yen: text});
                    }}
                  />
                  <Text style={styles.label}>TP</Text>
                  <Image
                    source={Images.convert_img}
                    style={styles.convertImage}
                  />
                  <Text numberOfLines={1} style={styles.pointsInYen}>
                    {this.state.point_in_yen}
                  </Text>
                  <Text numberOfLines={1} style={styles.label}>
                    YEN
                  </Text>
                </View>
                <View style={styles.exchangeButtonContainer}>
                  <Button
                    type={isExchange ? '' : 'translucent'}
                    title={translate('pages.adWall.exchange')}
                    onPress={() => {
                      this.setState({isExchange: !this.state.isExchange});
                    }}
                  />
                </View>
              </View>
            ) : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(ToukuPointExchange);
