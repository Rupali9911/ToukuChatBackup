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

import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import {Icons, Colors, Images} from '../../constants';
import BackHeader from '../../components/BackHeader';
import {signUpStyles, stepIndicatorStyle} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';
import CountryPhoneInput from '../../components/CountryPhoneInput';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {
  userSendOTP,
  userVerifyOTP,
  userEmailCheck,
  userNameCheck,
  userRegister,
  getUserProfile,
} from '../../redux/reducers/userReducer';
import Toast from '../../components/Toast';

class SignUp extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      currentPosition: 0,
      countryCode: '+91',
      isAgreeWithTerms: false,

      //Page 1
      countryCode: '',
      phone: '',
      verifycode: '',
      //Page 2
      email: '',
      emailconfirm: '',
      //Page 3
      username: '',
      password: '',
      passwordConfirm: '',

      emailStatus: 'normal',
      emailConfirmStatus: 'normal',
      passwordStatus: 'normal',
      passwordConfirmStatus: 'normal',
    };

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  componentWillMount() {
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
    let signUpData = {
      phone: '+' + countryCode + phone,
      user_type: 'user',
    };
    this.props
      .userSendOTP(signUpData)
      .then((res) => {
        if (res) {
          Toast.show({
            title: 'Send SMS',
            text: 'We have sent OTP code to your phone number',
            icon: Icons.icon_message,
          });
        }
      })
      .catch((err) => {
        Toast.show({
          title: 'Send SMS',
          text: 'Please Enter Valid Phone Number',
          icon: Icons.icon_message,
        });
      });
  }

  onPageChange(position) {
    const {phone, countryCode, verifycode, email, emailconfirm} = this.state;
    switch (position) {
      case 1:
        if (phone !== '' && phone.length <= 10) {
          let verifyData = {
            code: verifycode,
            phone: '+' + countryCode + phone,
          };

          this.props.userVerifyOTP(verifyData).then((res) => {
            if (res) {
              AsyncStorage.setItem('phoneData', JSON.stringify(verifyData));
              this.setState({
                currentPosition: position,
              });
            }
          });
        } else {
          Toast.show({
            title: 'Send OTP',
            text: 'Please Enter Phone Number',
            icon: Icons.icon_message,
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
            icon: Icons.icon_message,
          });
        } else if (reg.test(email) === false) {
          isValid = false;
          this.setState({emailStatus: 'wrong'});
          Toast.show({
            title: 'Check Email',
            text: 'Please Enter Valid Email Address',
            icon: Icons.icon_message,
          });
        } else if (this.state.email != this.state.emailconfirm) {
          isValid = false;
          this.setState({emailConfirmStatus: 'wrong'});
          Toast.show({
            title: 'Check Email',
            text: 'Email Address Not Matched',
            icon: Icons.icon_message,
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
                  icon: Icons.icon_message,
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
    this.props.userNameCheck(username).then((res) => {
      if (res.status === false) {
        AsyncStorage.setItem('username', username);
      } else {
        Toast.show({
          title: 'SignUp Failed',
          text: 'User Name Already Exist',
          icon: Icons.icon_message,
        });
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
        icon: Icons.icon_message,
      });
    } else if (password.length < 6) {
      isValid = false;
      Toast.show({
        title: 'SignUp Failed',
        text: 'Please Enter Atleast 6 Characters Password',
        icon: Icons.icon_message,
      });
    } else if (password != passwordConfirm) {
      isValid = false;
      Toast.show({
        title: 'SignUp Failed',
        text: 'Password Not Matched',
        icon: Icons.icon_message,
      });
    }
    if (isValid) {
      if (isAgreeWithTerms) {
        const {passwordConfirm, password, isAgreeWithTerms} = this.state;
        let userPhoneData = await AsyncStorage.getItem('phoneData');
        let parsedData = JSON.parse(userPhoneData);
        let username = await AsyncStorage.getItem('username');
        let email = await AsyncStorage.getItem('email');
        let keys = ['phoneData', 'username', 'email'];
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
                  this.props.navigation.navigate('Home');
                }
              });
            }
            if (res.user) {
              Toast.show({
                title: 'SignUp Failed',
                text: 'User Already Registered',
                icon: Icons.icon_message,
              });
            }
          })
          .catch((err) => {
            Toast.show({
              title: 'SignUp Failed',
              text: 'Something Went Wrong',
              icon: Icons.icon_message,
            });
          });
      } else {
        Toast.show({
          title: 'Terms and Conditions',
          text: 'Please Select Our Terms & Conditions ',
          icon: Icons.icon_message,
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
                onPressConfirm={() => this.sendOTP()}
                onChangePhoneNumber={(phone, code) =>
                  this.onChangePhoneNumber(phone, code)
                }
                value={this.state.phone}
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
                // onChangeText={(username) => this.checkUserName(username)}
                onChangeText={(username) => this.setState({username})}
                onSubmitEditing={() => {
                  this.password.focus();
                  this.checkUserName(this.state.username);
                }}
              />
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
                placeholder={translate('pages.register.reEnterLoginPassword')}
                returnKeyType={'done'}
                onChangeText={(passwordConfirm) =>
                  this.handleConfirmPassword(passwordConfirm)
                }
                secureTextEntry={true}
                status={this.state.passwordConfirmStatus}
              />
              <Button
                type={'primary'}
                title={translate('common.signUp')}
                onPress={() => this.onSignUpPress()}
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
        <SafeAreaView style={globalStyles.safeAreaView}>
          <ScrollView
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
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    englishLanguage: state.languageReducer.en,
  };
};

const mapDispatchToProps = {
  userSendOTP,
  userVerifyOTP,
  userEmailCheck,
  userNameCheck,
  userRegister,
  getUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
