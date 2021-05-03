import React, {Component} from 'react';
import {Image, Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import HeaderWithBack from '../../components/Headers/HeaderWithBack';
import {
  ConfirmationModal,
  UpdatePhoneModal,
  VerifyOtpModal,
} from '../../components/Modals';
import Toast from '../../components/Toast';
import {Colors, Images} from '../../constants';
import S3uploadService from '../../helpers/S3uploadService';
import {
  followChannel,
  setCurrentChannel,
} from '../../redux/reducers/channelReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {
  sendOtpToAddAmount,
  verifyOtpToAddAmount,
} from '../../redux/reducers/userReducer';
import {getChannelsById} from '../../storage/Service';
import {globalStyles} from '../../styles';
import {isNumeric, normalize} from '../../utils';
import styles from './styles';

class AmazonExchange extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isExchange: false,
      loading: false,
      tp_point: 500,
      point_in_yen: 0,
      showPhoneUpdateModal: false,
      isUpdatePhoneModalVisible: false,
      verifyOtpModalVisible: false,
      sendOtpLoading: false,
      verifyOtpLoading: false,
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

  onCancel = () => {
    this.setState({
      showPhoneUpdateModal: false,
    });
  };

  sendOtpToAdd = () => {
    this.setState({sendOtpLoading: true});
    this.props
      .sendOtpToAddAmount()
      .then((res) => {
        if (res && res.status) {
          this.setState({sendOtpLoading: false});
          Toast.show({
            title: 'Touku',
            text: translate(res.message),
            type: 'positive',
          });
          this.setState({verifyOtpModalVisible: true});
        }
      })
      .catch((err) => {
        if (err && err.response.request._response) {
          let errorbody = JSON.parse(err.response.request._response);
          console.log('error', errorbody.message);
          if (errorbody.message.includes('backend.')) {
            Toast.show({
              title: 'Touku',
              text: translate(errorbody.message),
              type: 'primary',
            });
          } else {
            Toast.show({
              title: 'Touku',
              text: errorbody.message,
              type: 'primary',
            });
          }
        }
        this.setState({sendOtpLoading: false});
      });
  };

  // sendOtpToAdd = () => {
  //     this.setState({sendOtpLoading: true});
  //     this.props.sendOtpToAddAmount()
  //         .then((res)=>{
  //             if(res && res.status){
  //                 this.setState({sendOtpLoading: false});
  //                 Toast.show({
  //                     title: 'Touku',
  //                     text: translate(res.message),
  //                     type: 'positive',
  //                 });
  //                 this.setState({verifyOtpModalVisible: true});
  //             }
  //         }).catch((err)=>{
  //             if(err){
  //                 Toast.show({
  //                     title: 'Touku',
  //                     text: translate(err.message),
  //                     type: 'primary',
  //                 });
  //             }
  //             this.setState({sendOtpLoading: false});
  //         });
  // }

  verifyOtpToAddAmount = (amount, code) => {
    let data = {
      amount: amount,
      code: code,
      exchange_type: 'AMAZON',
      amount_type: 'TP',
    };

    this.setState({verifyOtpLoading: true});
    this.props
      .verifyOtpToAddAmount(data)
      .then((res) => {
        this.setState({verifyOtpLoading: false});
        if (res && res.status) {
          Toast.show({
            title: 'Touku',
            text: translate('pages.adWall.exchangesuccessfully'),
            type: 'positive',
          });
          this.setState({verifyOtpModalVisible: false});
        }
      })
      .catch((err) => {
        console.log('error_verify', err);
        Toast.show({
          title: 'Touku',
          text: translate(err.response.data.errors),
          type: 'primary',
        });
        this.setState({verifyOtpLoading: false});
      });
  };

  render() {
    const {
      orientation,
      isExchange,
      showPhoneUpdateModal,
      isUpdatePhoneModalVisible,
      verifyOtpModalVisible,
      sendOtpLoading,
      verifyOtpLoading,
    } = this.state;
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
          contentContainerStyle={styles.keyboardAwareScrollContentContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.amazonLogoContainer}>
            <Image
              source={Images.amazon_logo}
              style={styles.amazonLogo}
              resizeMode={'contain'}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.minExchangePointContainer}>
              <View style={styles.minExchangePointSubContainer}>
                <Text style={styles.minExchangePointText}>
                  {translate('pages.adWall.miniExchangePoint')}
                </Text>
                <Text style={styles.firstTimeExchangeText}>
                  {'(*' + translate('pages.adWall.minimumAmountOfTp') + ')'}
                </Text>
              </View>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.minExchangePoints}>500TP</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.titleText}>
                {translate('pages.adWall.exchangeFee')}
              </Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueText}>
                {translate('pages.xchat.planFreeText')}
              </Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.titleText}>
                {translate('pages.adWall.twoStepVerificaion')}
              </Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.valueText}>
                {translate('pages.adWall.yes')}
              </Text>
            </View>
            <View style={styles.exchangeDaysNumberContainer}>
              <Text>{translate('pages.adWall.exchangeDaysNumber')}</Text>
            </View>
            <View style={styles.sendItToYourEmailContainer}>
              <Text>{translate('pages.adWall.sendItToYourEmail')}</Text>
            </View>
            <View style={styles.exchangeHistoryContianer}>
              <View style={styles.singleFlex}>
                <Button
                  type={'translucent'}
                  title={translate('pages.adWall.exchangeHistory')}
                  onPress={() => {
                    this.setState({isExchange: !this.state.isExchange});
                    this.props.navigation.navigate('ExchangeHistoryScreen');
                  }}
                  fontSize={normalize(13)}
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
                  fontSize={normalize(13)}
                />
              </View>
            </View>
            {isExchange ? (
              <View>
                <View style={styles.currentPointsContainer}>
                  <Text style={styles.currentPointHeldText}>
                    {translate('pages.adWall.currentPointHeld')}
                  </Text>

                  <Text style={styles.currentPointHeldValue}>
                    {parseInt(this.props.userData.total_tp, 10)}TP
                  </Text>
                </View>
                <View style={styles.exchangePointContainer}>
                  <Text style={styles.exchangePoints}>
                    {translate('pages.adWall.amountOfExchangePoint')}
                  </Text>
                </View>
                <View style={styles.exchangePointInputContainer}>
                  <TextInput
                    style={styles.exchangePointInput}
                    keyboardType={'numeric'}
                    value={this.state.tp_point + ''}
                    onChangeText={(text) => {
                      if (isNumeric(text) || text.length === 0) {
                        this.setState({tp_point: text, point_in_yen: text});
                      }
                    }}
                  />
                  <Text style={styles.exchangeValues}>TP</Text>
                  <Image
                    source={Images.convert_img}
                    style={styles.convertImage}
                  />
                  <Text numberOfLines={1} style={styles.tpPoints}>
                    {this.state.tp_point}
                  </Text>
                  <Text numberOfLines={1} style={styles.exchangeValues}>
                    {translate('pages.xchat.yen')}
                  </Text>
                </View>
                <View style={styles.confirmButtonContainer}>
                  <Button
                    type={isExchange ? '' : 'translucent'}
                    title={translate('pages.adWall.confirm')}
                    onPress={() => {
                        if (
                            this.state.tp_point.length === 0 ||
                            parseFloat(this.state.tp_point) < 500
                        ) {
                            Toast.show({
                                title: 'Touku',
                                text: translate('pages.adWall.minimumAmountOfTp'),
                                type: 'primary',
                            });
                            return;
                        }
                      if (this.props.userData.total_tp < 500) {
                        Toast.show({
                          title: 'Touku',
                          text: translate(
                            'pages.adWall.dontHaveSufficientAmount',
                          ),
                          type: 'primary',
                        });
                        return;
                      }

                      if (
                        parseFloat(this.state.tp_point) >
                        this.props.userData.total_tp
                      ) {
                        Toast.show({
                          title: 'Touku',
                          text: translate(
                            'pages.adWall.dontHaveSufficientAmount',
                          ),
                          type: 'primary',
                        });
                        return;
                      }
                      if (!this.props.userData.phone) {
                        this.setState({showPhoneUpdateModal: true});
                        return;
                      }
                      this.sendOtpToAdd();
                    }}
                    loading={sendOtpLoading}
                  />
                </View>
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
        <ConfirmationModal
          visible={showPhoneUpdateModal}
          onCancel={this.onCancel.bind(this)}
          onConfirm={() => {
            this.setState({showPhoneUpdateModal: false}, () => {
              setTimeout(() => {
                this.setState({isUpdatePhoneModalVisible: true});
              }, 500);
            });
          }}
          orientation={orientation}
          confirmText={translate('swal.ok')}
          title={'Touku'}
          message={translate('pages.register.toastr.enterPhoneNumber')}
        />
        <UpdatePhoneModal
          visible={isUpdatePhoneModalVisible}
          onRequestClose={() =>
            this.setState({isUpdatePhoneModalVisible: false})
          }
          onVerificationComplete={() => {
            this.sendOtpToAdd();
          }}
        />
        <VerifyOtpModal
          visible={verifyOtpModalVisible}
          onRequestClose={() => this.setState({verifyOtpModalVisible: false})}
          onVerify={(code) => {
            let amount = parseFloat(this.state.tp_point);
            this.verifyOtpToAddAmount(amount, code);
          }}
          loading={verifyOtpLoading}
        />
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
  sendOtpToAddAmount,
  verifyOtpToAddAmount,
};

export default connect(mapStateToProps, mapDispatchToProps)(AmazonExchange);
