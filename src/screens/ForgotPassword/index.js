import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  Platform,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import {Images, Icons} from '../../constants';
import {BackHeader} from '../../components/Headers';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {forgotStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';
import Toast from '../../components/Toast';
import {
  forgotPassword,
  forgotUserName,
} from '../../redux/reducers/forgotPassReducer';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      userName: '',
      authCode: '',
      password: '',
      newPassword: '',

      passwordStatus: 'normal',
      newPasswordConfirmStatus: 'normal',

      userNameErr: null,
      authCodeErr: null,
      passwordErr: null,
      newPasswordErr: null,
      requestOTP: false,
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  focusNextField(id) {
    this.inputs[id].focus();
  }

  handleUserName = (userName) => {
    this.setState({userName});
    if (userName.length <= 0) {
      this.setState({userNameErr: 'messages.required'});
    } else {
      this.setState({userNameErr: null});
    }
  };

  handleAuthCode = (authCode) => {
    this.setState({authCode});
    if (authCode.length <= 0) {
      this.setState({authCodeErr: 'messages.required'});
    } else {
      this.setState({authCodeErr: null});
    }
  };

  handlePassword = (password) => {
    this.setState({password});
    if (password.length <= 7 || password.length > 64) {
      if (password !== '') {
        this.setState({passwordStatus: 'wrong'});
      } else {
        this.setState({passwordStatus: 'normal', passwordErr: null});
      }
    } else {
      this.setState({passwordStatus: 'right', passwordErr: null});
    }
  };

  handleConfirmPassword = (newPassword) => {
    this.setState({newPassword});
    if (this.state.password != newPassword) {
      if (newPassword !== '') {
        this.setState({
          newPasswordConfirmStatus: 'wrong',
          newPasswordErr: 'pages.resetPassword.passwordsMustMatch',
        });
      } else {
        this.setState({
          newPasswordConfirmStatus: 'normal',
          newPasswordErr: null,
        });
      }
    } else {
      if (newPassword !== '') {
        this.setState({
          newPasswordConfirmStatus: 'right',
          newPasswordErr: null,
        });
      } else {
        this.setState({
          newPasswordConfirmStatus: 'normal',
          newPasswordErr: null,
        });
      }
    }
  };

  sendOTP() {
    const {userName} = this.state;
    this.setState({requestOTP: true});
    if (userName !== '') {
      let userNameData = {
        username: userName,
      };
      this.props
        .forgotUserName(userNameData)
        .then((res) => {
          Toast.show({
            title: translate('common.sendSMS'),
            text: translate(res.message),
            type: 'positive',
          });
        })
        .catch((err) => {
          if (err.response.request._response) {
            this.setState({requestOTP: false});

            let errMessage = JSON.parse(err.response.request._response);
            if (errMessage.detail) {
              Toast.show({
                title: translate('common.sendSMS'),
                text: errMessage.detail.toString(),
                type: 'primary',
              });
            } else {
              Toast.show({
                title: translate('common.sendSMS'),
                text: errMessage.message.toString().includes('backend.')?translate(errMessage.message.toString()):errMessage.message.toString(),
                type: 'primary',
              });
            }
          }
        });
    } else {
      Toast.show({
        title: translate('common.sendSMS'),
        text: translate('pages.setting.toastr.pleaseEnterUsername'),
        type: 'warning',
      });
    }
  }

  onSubmitPress() {
    Keyboard.dismiss();
    const {userName, authCode, password, newPassword, requestOTP} = this.state;

    this.setState({
      userNameErr: null,
      authCodeErr: null,
      passwordErr: null,
      newPasswordErr: null,
    });
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let isValid = true;

    if (userName.length <= 0) {
      isValid = false;
      this.setState({
        userNameErr: 'messages.required',
      });
    }
    if (authCode.length <= 0) {
      isValid = false;
      this.setState({
        authCodeErr: 'messages.required',
      });
    }
    if (password.length <= 0) {
      isValid = false;
      this.setState({
        passwordErr: 'messages.required',
      });
    }
    if (newPassword.length <= 0) {
      isValid = false;
      this.setState({
        newPasswordErr: 'messages.required',
      });
    }
    if (password.length > 0 && password.length <= 7) {
      isValid = false;
      this.setState({
        passwordErr: 'pages.register.minLengthPassword',
      });
    }
    if (password.length > 64) {
      isValid = false;
      this.setState({
        passwordErr: 'pages.register.maxLengthPassword',
      });
    }
    if (password != newPassword) {
      isValid = false;
      this.setState({
        newPasswordConfirmStatus: 'wrong',
        newPasswordErr: 'pages.resetPassword.passwordsMustMatch',
      });
    }

    if (isValid) {
      let forgotData = {
        code: authCode,
        confirm_password: newPassword,
        password: password,
        username: userName,
      };
      if (!requestOTP) {
        Toast.show({
          title: translate('common.register'),
          text: translate('pages.register.toastr.pleaseSubmitOTPfirst'),
          type: 'primary',
        });
      } else {
        this.props
          .forgotPassword(forgotData)
          .then((res) => {
            console.log('Response for Forgot password', res);
            if (res.status === true) {
              Toast.show({
                title: translate('pages.resetPassword.resetPassword'),
                text: translate('pages.resetPassword.toastr.passwordUpdated'),
                type: 'positive',
              });
              this.props.navigation.goBack();
            } else {
              Toast.show({
                title: translate('pages.resetPassword.resetPassword'),
                text: translate(
                  'pages.resetPassword.toastr.pleaseCheckOTPCodeandTryAgain',
                ),
                type: 'primary',
              });
            }
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
              if (err.response.request._response) {
                console.log(err.response.request._response);
                let errMessage = JSON.parse(err.response.request._response);
                if (errMessage.message) {
                  Toast.show({
                    title: translate('pages.resetPassword.resetPassword'),
                    text: errMessage.message.toString().includes('backend.')?translate(errMessage.message.toString()):errMessage.message.toString(),
                    type: 'primary',
                  });
                } else if (errMessage.non_field_errors) {
                  let strRes = errMessage.non_field_errors;
                  Toast.show({
                    title: translate('pages.resetPassword.resetPassword'),
                    text: translate(strRes.toString()),
                    type: 'primary',
                  });
                } else if (errMessage.phone) {
                  Toast.show({
                    title: translate('pages.resetPassword.resetPassword'),
                    text: translate(
                      'pages.register.toastr.phoneNumberIsInvalid',
                    ),
                    type: 'primary',
                  });
                } else if (errMessage.detail) {
                  Toast.show({
                    title: translate('pages.resetPassword.resetPassword'),
                    text: errMessage.detail.toString(),
                    type: 'primary',
                  });
                }
              }
            }
          });
      }
    }
  }

  render() {
    const {
      orientation,
      userNameErr,
      authCodeErr,
      passwordErr,
      newPasswordErr,
    } = this.state;
    const {selectedLanguageItem} = this.props;
    return (
      <ImageBackground
        //source={Images.image_touku_bg}
        source={
          Platform.isPad ? Images.image_touku_bg : Images.image_touku_bg_phone
        }
        style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            behavior={'position'}
            contentContainerStyle={{padding: 20, flex: Platform.isPad ? 1 : 0}}
            showsVerticalScrollIndicator={false}>
            <BackHeader onBackPress={() => this.props.navigation.goBack()} />
            <View
              style={{
                flex: 1,
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
              }}>
              <Text
                style={[
                  globalStyles.bigSemiBoldText,
                  {
                    fontSize: 30,
                    marginVertical: 50,
                    opacity: 0.8,
                  },
                ]}>
                {translate('pages.resetPassword.resetPassword')}
              </Text>
              <View
                style={{
                  flex: 1,
                  width: Platform.isPad ? '75%' : '100%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Inputfield
                  isRightSideBtn={true}
                  rightBtnText={translate('common.sms')}
                  //rightBtnText={'OTP'}
                  placeholder={translate('common.enterUsername')}
                  value={this.state.userName}
                  onChangeText={(userName) => this.handleUserName(userName)}
                  onPressConfirm={() => this.sendOTP()}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    this.focusNextField('authCode');
                  }}
                  loading={this.props.loadingSMS}
                />
                {userNameErr !== null ? (
                  <Text
                    style={[
                      globalStyles.smallLightText,
                      {
                        textAlign: 'left',
                        marginTop: -10,
                        marginStart: 10,
                        marginBottom: 5,
                      },
                    ]}>
                    {translate(userNameErr).replace(
                      '[missing {{field}} value]',
                      translate('common.username'),
                    )}
                  </Text>
                ) : null}
                <Inputfield
                  onRef={(ref) => {
                    this.inputs['authCode'] = ref;
                  }}
                  placeholder={translate('common.enterYourAuthenticationCode')}
                  value={this.state.authCode}
                  onChangeText={(authCode) => this.handleAuthCode(authCode)}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    this.focusNextField('password');
                  }}
                  keyboardType={'number-pad'}
                />
                {authCodeErr !== null ? (
                  <Text
                    style={[
                      globalStyles.smallLightText,
                      {
                        textAlign: 'left',
                        marginTop: -10,
                        marginStart: 10,
                        marginBottom: 5,
                      },
                    ]}>
                    {translate(authCodeErr).replace(
                      '[missing {{field}} value]',
                      translate('common.verificationCode'),
                    )}
                  </Text>
                ) : null}
                <Inputfield
                  onRef={(ref) => {
                    this.inputs['password'] = ref;
                  }}
                  placeholder={translate('pages.setting.newPassword')}
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={(password) => this.handlePassword(password)}
                  returnKeyType={'next'}
                  status={this.state.passwordStatus}
                  onSubmitEditing={() => {
                    this.focusNextField('newPassword');
                  }}
                />
                {passwordErr !== null ? (
                  <Text
                    style={[
                      globalStyles.smallLightText,
                      {
                        textAlign: 'left',
                        marginTop: -10,
                        marginStart: 10,
                        marginBottom: 5,
                      },
                    ]}>
                    {passwordErr === 'messages.required'
                      ? translate(passwordErr).replace(
                          '[missing {{field}} value]',
                          translate('common.password'),
                        )
                      : translate(passwordErr)}
                  </Text>
                ) : null}
                <Inputfield
                  onRef={(ref) => {
                    this.inputs['newPassword'] = ref;
                  }}
                  placeholder={translate('pages.setting.confirmPassword')}
                  value={this.state.newPassword}
                  secureTextEntry={true}
                  onChangeText={(newPassword) =>
                    this.handleConfirmPassword(newPassword)
                  }
                  status={this.state.newPasswordConfirmStatus}
                  returnKeyType={'done'}
                />
                {newPasswordErr !== null ? (
                  <Text
                    style={[
                      globalStyles.smallLightText,
                      {
                        textAlign: 'left',
                        marginTop: -10,
                        marginStart: 10,
                        marginBottom: 5,
                      },
                    ]}>
                    {/*{translate(newPasswordErr).replace(*/}
                    {/*'[missing {{field}} value]',*/}
                    {/*translate('pages.resetPassword.repeatPassword'),*/}
                    {/*)}*/}

                    {newPasswordErr === 'messages.required'
                      ? translate(newPasswordErr).replace(
                          '[missing {{field}} value]',
                          translate('pages.resetPassword.repeatPassword'),
                        )
                      : translate('messages.required').replace(
                          '[missing {{field}} value]',
                          translate('pages.resetPassword.passwordsMustMatch'),
                        )}
                  </Text>
                ) : null}
                <Button
                  type={'primary'}
                  title={translate('pages.resetPassword.resetPassword')}
                  onPress={() => this.onSubmitPress()}
                  loading={this.props.loading}
                  fontType={
                    selectedLanguageItem.language_name === 'ja'
                      ? 'normalRegular22Text'
                      : ''
                  }
                />
              </View>
            </View>
            <LanguageSelector />
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    loading: state.forgotPassReducer.loading,
    loadingSMS: state.forgotPassReducer.loadingSMS,
  };
};

const mapDispatchToProps = {
  forgotPassword,
  forgotUserName,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
