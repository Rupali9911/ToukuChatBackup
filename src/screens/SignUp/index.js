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

import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import {Icons, Colors, Images} from '../../constants';
import Header from '../../components/Header';
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
} from '../../redux/reducers/userReducer';

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
    this.props.userSendOTP(signUpData).then((res) => {
      if (res) {
        alert('IF section' + JSON.stringify(res));
      }
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
              this.setState({
                currentPosition: position,
              });
            }
          });
        } else {
          alert('please enter mobile number to proceed further');
        }

        break;

      case 2: {
        this.props.userEmailCheck(emailconfirm).then((res) => {
          if (res.status) {
            alert('Email already exists! ');
          } else {
            this.setState({
              currentPosition: position,
            });
          }
        });

        break;
      }
    }
  }

  onSignUpPress() {
    // alert('completed');
    const {username} = this.state;
    this.props.userNameCheck(username).then((res) => {
      alert(res);
    });
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
    if (passwordConfirm.length < 6) {
      this.setState({passwordConfirmStatus: 'wrong'});
    } else if (this.state.password != this.state.passwordConfirm) {
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
              {/* <Inputfield
                onRef={(ref) => {
                  this.inputs['phone'] = ref;
                }}
                value={this.state.phone}
                isRightSideBtn={true}
                rightBtnText={translate('common.sms')}
                isLeftSideBtn={true}
                placeholder={this.state.countryCode}
                returnKeyType={'next'}
                keyboardType={'number-pad'}
                onChangeText={(phone) => this.setState({phone})}
                onSubmitEditing={() => {
                  this.focusNextField('verifycode');
                }}
              /> */}
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
                onRef={(ref) => {
                  this.inputs['email'] = ref;
                }}
                value={this.state.email}
                placeholder={translate('common.email')}
                returnKeyType={'next'}
                keyboardType={'email-address'}
                onChangeText={(email) => this.handleEmail(email)}
                onSubmitEditing={() => {
                  this.focusNextField('emailconfirm');
                }}
                status={this.state.emailStatus}
              />
              <Inputfield
                onRef={(ref) => {
                  this.inputs['emailconfirm'] = ref;
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
                onChangeText={(username) => this.setState({username})}
                onSubmitEditing={() => {
                  this.focusNextField('password');
                }}
              />
              <Inputfield
                onRef={(ref) => {
                  this.inputs['password'] = ref;
                }}
                value={this.state.password}
                placeholder={translate('pages.register.loginPassword')}
                returnKeyType={'next'}
                onChangeText={(password) => this.handlePassword(password)}
                onSubmitEditing={() => {}}
                secureTextEntry={true}
                status={this.state.passwordStatus}
              />
              <Inputfield
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
            <Header onBackPress={() => this.props.navigation.goBack()} />
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
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
