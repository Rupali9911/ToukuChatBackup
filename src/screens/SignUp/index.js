import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import StepIndicator from 'react-native-step-indicator';
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import {Icons, Colors, Images} from '../../constants';
import {BackHeader} from '../../components/Headers';
import {signUpStyles, stepIndicatorStyle} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';
import CountryPhoneInput from '../../components/CountryPhoneInput';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {getUserProfile} from '../../redux/reducers/userReducer';
import {
  userSendOTP,
  userVerifyOTP,
  userEmailCheck,
  userNameCheck,
  userRegister,
  socialRegistration,
} from '../../redux/reducers/signupReducer';
import Toast from '../../components/Toast';

class SignUp extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      currentPosition: this.props.navigation.state.params.pageNumber,
      isAgreeWithTerms: false,

      //Page 1
      countryCode: '+1',
      phone: '',
      verifycode: '',
      //Page 2
      email: '',
      emailconfirm: '',
      //Page 3
      username: '',
      password: '',
      passwordConfirm: '',
      userNameSuggestions: [],

      emailStatus: 'normal',
      emailConfirmStatus: 'normal',
      passwordStatus: 'normal',
      passwordConfirmStatus: 'normal',
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

  sendOTP() {
    const {phone, countryCode} = this.state;

    if (phone.length <= 0) {
      Toast.show({
        title: 'Send SMS',
        text: 'Please enter your phone number',
        type: 'primary',
      });
    } else if (phone.length > 0 && phone.length < 6) {
      Toast.show({
        title: 'Send SMS',
        text: 'Phone number is invalid',
        type: 'primary',
      });
    } else {
      let signUpData = {
        phone: phone,
        user_type: 'user',
      };
      this.props
        .userSendOTP(signUpData)
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: 'Send SMS',
              text: 'We have sent OTP code to your phone number',
              type: 'positive',
            });
          } else if (res.status === false && res.data.phone != '') {
            Toast.show({
              title: 'Send SMS',
              text: 'The phone number is already registered',
              type: 'primary',
            });
          } else {
            Toast.show({
              title: 'Send SMS',
              text: 'Phone number is invalid',
              type: 'primary',
            });
          }
        })
        .catch((err) => {
          Toast.show({
            title: 'Send SMS',
            text: 'The phone number is already registered',
            type: 'primary',
          });
        });
    }
  }

  onPageChange(position) {
    const {phone, countryCode, verifycode, email, emailconfirm} = this.state;
    switch (position) {
      case 1:
        if (phone !== '' && verifycode != '') {
          let verifyData = {
            code: verifycode,
            phone: phone,
          };

          this.props.userVerifyOTP(verifyData).then((res) => {
            if (res.status === true) {
              AsyncStorage.setItem('phoneData', JSON.stringify(verifyData));
              this.setState({
                currentPosition: position,
              });
            } else {
              Toast.show({
                title: 'Verify OTP',
                text: 'Please Enter Valid OTP',
                type: 'primary',
              });
            }
          });
        } else {
          Toast.show({
            title: 'Send OTP',
            text: 'Please Enter Phone Number',
            type: 'primary',
          });
        }

        break;

      case 2: {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        let isValid = true;

        if (email.length <= 0) {
          isValid = false;
          this.setState({emailStatus: 'wrong'});
          Toast.show({
            title: 'Check Email',
            text: 'Please Enter Email Address',
            type: 'primary',
          });
        } else if (reg.test(email) === false) {
          isValid = false;
          this.setState({emailStatus: 'wrong'});
          Toast.show({
            title: 'Check Email',
            text: 'Please Enter Valid Email Address',
            type: 'primary',
          });
        } else if (this.state.email != this.state.emailconfirm) {
          isValid = false;
          this.setState({emailConfirmStatus: 'wrong'});
          Toast.show({
            title: 'Check Email',
            text: 'Email Address Not Matched',
            type: 'primary',
          });
        }
        if (isValid) {
          this.props
            .userEmailCheck(emailconfirm)
            .then((res) => {
              if (res.status === false) {
                AsyncStorage.setItem('email', email);
                this.setState({
                  currentPosition: position,
                });
              } else {
                Toast.show({
                  title: 'SignUp Failed',
                  text: 'User Already Exist',
                  type: 'primary',
                });
              }
            })
            .catch((err) => {});
          this.setState({emailStatus: 'right'});
        }
        break;
      }
    }
  }

  checkUserName(username) {
    this.setState({username});
    // if (username.length <= 1) {
    //   return;
    // }
    this.props.userNameCheck(username).then((res) => {
      if (res.status === false) {
        this.setState({userNameSuggestions: []});
        AsyncStorage.setItem('username', username);
      } else {
        Toast.show({
          title: 'SignUp Failed',
          text: 'User Name Already Exist',
          type: 'primary',
        });
        this.setState({userNameSuggestions: res.suggestions});
      }
    });
  }

  async onSignUpPress() {
    const {username, password, passwordConfirm, isAgreeWithTerms} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isValid = true;

    if (username.length <= 0) {
      isValid = false;
      Toast.show({
        title: 'SignUp Failed',
        text: 'Please Enter Username',
        type: 'primary',
      });
    } else if (password.length < 6) {
      isValid = false;
      Toast.show({
        title: 'SignUp Failed',
        text: 'Please Enter Atleast 6 Characters Password',
        type: 'primary',
      });
    } else if (password != passwordConfirm) {
      isValid = false;
      Toast.show({
        title: 'SignUp Failed',
        text: 'Password Not Matched',
        type: 'primary',
      });
    }
    if (isValid) {
      if (isAgreeWithTerms) {
        let userPhoneData = await AsyncStorage.getItem('phoneData');
        let parsedData = JSON.parse(userPhoneData);
        // let username = await AsyncStorage.getItem('username');
        let email = await AsyncStorage.getItem('email');
        let keys = ['phoneData', 'email'];
        this.props.userNameCheck(username).then((res) => {
          if (res.status === false) {
            // AsyncStorage.setItem('username', username);

            let registerData = {
              channel_invitation_code: '',
              confirm_password: passwordConfirm,
              email: email,
              first_name: '',
              invitation_code: '',
              isAgree: isAgreeWithTerms,
              last_name: '',
              otp_code: parsedData.code,
              password: password,
              phone: parsedData.phone,
              site_from: 'touku',
              user_language: 1,
              username: username,
            };
            this.props
              .userRegister(registerData)
              .then((res) => {
                if (res.token) {
                  AsyncStorage.multiRemove(keys);
                  this.props.getUserProfile().then((res) => {
                    if (res.id) {
                      this.props.navigation.navigate('Chat');
                    }
                  });
                }
                if (res.user) {
                  Toast.show({
                    title: 'SignUp Failed',
                    text: 'User Already Registered',
                    type: 'primary',
                  });
                }
              })
              .catch((err) => {
                Toast.show({
                  title: 'SignUp Failed',
                  text: 'Something Went Wrong',
                  type: 'primary',
                });
              });
          } else {
            Toast.show({
              title: 'SignUp Failed',
              text: 'User Name Already Exist',
              type: 'primary',
            });
          }
        });
      } else {
        Toast.show({
          title: 'Terms and Conditions',
          text: 'Please Select Our Terms & Conditions ',
          type: 'primary',
        });
      }
    }
  }

  onCheckRememberMe() {
    this.setState((prevState) => {
      return {
        isAgreeWithTerms: !prevState.isAgreeWithTerms,
      };
    });
  }

  onChangePhoneNumber(phone, code) {
    this.setState({phone, countryCode: code});
  }

  handleEmail = (email) => {
    this.setState({email});
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let isValid = true;

    if (email.length <= 0) {
      isValid = false;
      this.setState({emailStatus: 'wrong'});
    } else if (reg.test(email) === false) {
      isValid = false;
      this.setState({emailStatus: 'wrong'});
    }
    if (isValid) {
      this.setState({emailStatus: 'right'});
    }
  };

  handleConfirmEmail = (emailconfirm) => {
    this.setState({emailconfirm});
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let isValid = true;

    if (emailconfirm.length <= 0) {
      isValid = false;
      this.setState({emailConfirmStatus: 'wrong'});
    } else if (reg.test(emailconfirm) === false) {
      isValid = false;
      this.setState({emailConfirmStatus: 'wrong'});
    } else if (this.state.email != emailconfirm) {
      isValid = false;
      this.setState({emailConfirmStatus: 'wrong'});
    }
    if (isValid) {
      this.setState({emailConfirmStatus: 'right'});
    }
  };

  handlePassword = (password) => {
    this.setState({password});
    if (password.length < 6) {
      this.setState({passwordStatus: 'wrong'});
    } else {
      this.setState({passwordStatus: 'right'});
    }
  };

  handleConfirmPassword = (passwordConfirm) => {
    this.setState({passwordConfirm});
    if (this.state.password != passwordConfirm) {
      this.setState({passwordConfirmStatus: 'wrong'});
    } else {
      this.setState({passwordConfirmStatus: 'right'});
    }
  };

  showSuggestions = () => {
    if (this.state.userNameSuggestions.length > 0) {
      const suggestions = this.state.userNameSuggestions.map((item, index) => {
        return `'${item}' `;
      });
      return (
        <View style={{marginBottom: 15, flexDirection: 'row'}}>
          <Text style={globalStyles.smallRegularText}>
            Suggestions: {suggestions}
          </Text>
        </View>
      );
    } else return null;
  };

  async onSocialSignUp() {
    const {username, email, isAgreeWithTerms} = this.state;
    let isValid = true;

    if (username.length <= 0) {
      isValid = false;
      Toast.show({
        title: 'SignUp Failed',
        text: 'Please Enter Username',
        type: 'primary',
      });
    }
    if (isValid) {
      if (isAgreeWithTerms) {
        let registrationData;
        if (this.props.navigation.state.params.pageNumber === 1) {
          registrationData = JSON.stringify({
            username: username,
            invitation_code: '',
            email: email,
          });
        } else {
          registrationData = JSON.stringify({
            username: username,
            invitation_code: '',
          });
        }
        this.props.socialRegistration(registrationData).then((res) => {
          console.log('JWT TOKEN=> ', JSON.stringify(res));
          if (res.token) {
            this.props.navigation.navigate('Chat');
            return;
          }
        });
      } else {
        Toast.show({
          title: 'Terms and Conditions',
          text: 'Please Select Our Terms & Conditions ',
          type: 'primary',
        });
      }
    }
  }

  renderPage(page) {
    switch (page) {
      case 0:
        return (
          <View>
            <Text style={globalStyles.smallLightText}>
              {translate('common.registerStepOne')}
            </Text>
            <View style={{marginTop: 50}}>
              <CountryPhoneInput
                rightBtnText={'SMS'}
                onClickSMS={() => this.sendOTP()}
                onChangePhoneNumber={(phone, code) =>
                  this.onChangePhoneNumber(phone, code)
                }
                // value={this.state.phone}
                loading={this.props.loadingSMS}
              />
              <Inputfield
                onRef={(ref) => {
                  this.inputs['verifycode'] = ref;
                }}
                value={this.state.verifycode}
                placeholder={translate('common.smsVerificationCode')}
                returnKeyType={'done'}
                keyboardType={'number-pad'}
                onChangeText={(verifycode) => this.setState({verifycode})}
                onSubmitEditing={() => {}}
                maxLength={6}
              />
              <Button
                type={'primary'}
                title={translate('common.next')}
                onPress={() => this.onPageChange(1)}
                loading={this.props.loading}
              />
            </View>
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={globalStyles.smallLightText}>
              {translate('common.registerStepTwo')}
            </Text>
            <View style={{marginTop: 50}}>
              <Inputfield
                value={this.state.email}
                placeholder={translate('common.email')}
                returnKeyType={'next'}
                keyboardType={'email-address'}
                onChangeText={(email) => this.handleEmail(email)}
                onSubmitEditing={() => {
                  this.emailconfirm.focus();
                }}
                status={this.state.emailStatus}
              />
              <Inputfield
                ref={(input) => {
                  this.emailconfirm = input;
                }}
                value={this.state.emailconfirm}
                placeholder={translate('common.emailConfirmation')}
                returnKeyType={'done'}
                keyboardType={'email-address'}
                onChangeText={(emailconfirm) =>
                  this.handleConfirmEmail(emailconfirm)
                }
                onSubmitEditing={() => {}}
                status={this.state.emailConfirmStatus}
              />

              <Button
                type={'primary'}
                title={translate('common.next')}
                onPress={() => this.onPageChange(2)}
                loading={this.props.loading}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={globalStyles.smallLightText}>
              {translate('common.registerStepThree')}
            </Text>
            <View style={{marginTop: 50}}>
              <Inputfield
                value={this.state.username}
                placeholder={translate('common.username')}
                returnKeyType={'done'}
                onChangeText={(username) => this.checkUserName(username)}
                // onChangeText={(username) => this.setState({ username })}
                onSubmitEditing={() => {
                  this.password.focus();
                  // this.checkUserName(this.state.username);
                }}
                isSuggestions={
                  this.state.userNameSuggestions.length ? true : false
                }
              />
              {this.showSuggestions()}
              {!this.props.navigation.state.params.isSocial && (
                <React.Fragment>
                  <Inputfield
                    ref={(input) => {
                      this.password = input;
                    }}
                    value={this.state.password}
                    placeholder={translate('pages.register.loginPassword')}
                    returnKeyType={'next'}
                    onChangeText={(password) => this.handlePassword(password)}
                    onSubmitEditing={() => {
                      this.passwordConfirm.focus();
                    }}
                    secureTextEntry={true}
                    status={this.state.passwordStatus}
                  />
                  <Inputfield
                    ref={(input) => {
                      this.passwordConfirm = input;
                    }}
                    value={this.state.passwordConfirm}
                    placeholder={translate(
                      'pages.register.reEnterLoginPassword',
                    )}
                    returnKeyType={'done'}
                    onChangeText={(passwordConfirm) =>
                      this.handleConfirmPassword(passwordConfirm)
                    }
                    secureTextEntry={true}
                    status={this.state.passwordConfirmStatus}
                  />
                </React.Fragment>
              )}
              <Button
                type={'primary'}
                title={translate('common.signUp')}
                onPress={() =>
                  !this.props.navigation.state.params.isSocial
                    ? this.onSignUpPress()
                    : this.onSocialSignUp()
                }
                loading={this.props.loading}
              />
              <TouchableOpacity
                style={signUpStyles.termsContainer}
                activeOpacity={1}
                onPress={() => this.onCheckRememberMe()}>
                <CheckBox
                  onCheck={() => this.onCheckRememberMe()}
                  isChecked={this.state.isAgreeWithTerms}
                />
                <Text
                  style={[
                    globalStyles.smallLightText,
                    {textDecorationLine: 'underline'},
                  ]}>
                  {translate('pages.register.iAgreeToTheTerms&Conditions')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  }

  render() {
    const {currentPosition, orientation} = this.state;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={globalStyles.container}>
        <SafeAreaView
          pointerEvents={
            this.props.loading || this.props.loadingSMS ? 'none' : 'auto'
          }
          style={globalStyles.safeAreaView}>
          <KeyboardAwareScrollView
            contentContainerStyle={{padding: 20}}
            showsVerticalScrollIndicator={false}>
            <BackHeader onBackPress={() => this.props.navigation.goBack()} />
            <View
              style={{
                paddingHorizontal: orientation != 'PORTRAIT' ? 200 : 100,
              }}>
              <StepIndicator
                stepCount={3}
                customStyles={stepIndicatorStyle}
                currentPosition={currentPosition}
              />
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
                marginTop: 20,
              }}>
              {this.renderPage(currentPosition)}
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
    englishLanguage: state.languageReducer.en,
    loadingSMS: state.signupReducer.loadingSMS,
    loading: state.signupReducer.loading,
  };
};

const mapDispatchToProps = {
  userSendOTP,
  userVerifyOTP,
  userEmailCheck,
  userNameCheck,
  userRegister,
  getUserProfile,
  socialRegistration,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
