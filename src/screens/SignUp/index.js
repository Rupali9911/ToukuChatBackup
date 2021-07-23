/* eslint-disable no-useless-escape */
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import CountryPhoneInput from '../../components/CountryPhoneInput';
import {BackHeader} from '../../components/Headers';
import Inputfield from '../../components/InputField';
import LanguageSelector from '../../components/LanguageSelector';
import Toast from '../../components/Toast';
import WebViewClass from '../../components/WebView';
import {Images, termsUrl} from '../../constants';
import {setCurrentChannel} from '../../redux/reducers/channelReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {
  socialRegistration,
  socialRegistrationNew,
  userEmailCheck,
  userNameCheck,
  userNewRegister,
  userRegister,
  userSendOTP,
  userVerifyOTP,
} from '../../redux/reducers/signupReducer';
import {getUserProfile} from '../../redux/reducers/userReducer';
import {globalStyles} from '../../styles';
import styles from './styles';

class SignUp extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      currentPosition: 2,
      showEmail:
        this.props.navigation.state.params.showEmail !== null
          ? this.props.navigation.state.params.showEmail
          : true,
      //currentPosition: 2,
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
      userNameErr: 'messages.required',
      passwordErr: 'minLengthFailed',
      confirmPasswordErr: null,
      userNameStatus: 'normal',
      isWebViewVisible: false,
    };

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
    global.timeout = null;
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);

    console.log(
      'invitationCode on SignUp',
      this.props.navigation.state.params.invitationCode,
    );
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selectedLanguageItem !== this.props.selectedLanguageItem){
      if(Platform.OS === 'android'){
        this.refs.email_field && this.refs.email_field.toggleFocus();
      }
    }
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
    const {phone} = this.state;

    if (phone.length <= 0) {
      Toast.show({
        title: translate('common.sendSMS'),
        text: translate('pages.register.toastr.enterPhoneNumber'),
        type: 'primary',
      });
    } else if (phone.length > 0 && phone.length < 8) {
      Toast.show({
        title: translate('common.sendSMS'),
        text: translate('pages.register.toastr.phoneNumberIsInvalid'),
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
          console.log('Response of signup', res);
          if (res.status === true) {
            Toast.show({
              title: translate('common.sendSMS'),
              text: translate('pages.register.toastr.sentOTPtoMobile'),
              type: 'positive',
            });
            this.inputs.verifycode.focus();
          } else if (res.status === false && res.data.phone !== '') {
            Toast.show({
              title: translate('common.sendSMS'),
              text: translate('backend.common.PhoneNumberAlreadRegistered'),
              type: 'primary',
            });
          } else {
            Toast.show({
              title: translate('common.sendSMS'),
              text: translate('pages.register.toastr.phoneNumberIsInvalid'),
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
                  title: translate('common.sendSMS'),
                  text: translate(errMessage.message.toString()),
                  type: 'primary',
                });
              } else if (errMessage.non_field_errors) {
                let strRes = errMessage.non_field_errors;
                Toast.show({
                  title: translate('common.sendSMS'),
                  text: translate(strRes.toString()),
                  type: 'primary',
                });
              } else if (errMessage.phone) {
                Toast.show({
                  title: translate('common.sendSMS'),
                  text: translate('pages.register.toastr.phoneNumberIsInvalid'),
                  type: 'primary',
                });
              } else if (errMessage.detail) {
                Toast.show({
                  title: translate('common.sendSMS'),
                  text: errMessage.detail.toString(),
                  type: 'primary',
                });
              }
            }
          }
        });
    }
  }

  onPageChange(position) {
    Keyboard.dismiss();
    const {phone, verifycode, email, emailconfirm} = this.state;
    switch (position) {
      case 1:
        if (phone !== '' && verifycode !== '') {
          let verifyData = {
            code: verifycode,
            phone: phone,
          };

          this.props.userVerifyOTP(verifyData).then((res) => {
            console.log('userVerifyOTP response', res);
            if (res.status === true) {
              AsyncStorage.setItem('phoneData', JSON.stringify(verifyData));
              this.setState({
                currentPosition: position,
              });
            } else {
              Toast.show({
                title: translate('common.register'),
                text: translate('pages.register.toastr.enterCorrectOTP'),
                type: 'primary',
              });
            }
          });
        } else {
          if (phone === '') {
            Toast.show({
              title: translate('common.register'),
              text: translate('pages.register.toastr.enterPhoneNumber'),
              type: 'warning',
            });
          } else {
            Toast.show({
              title: translate('common.register'),
              text: translate('pages.register.toastr.pleaseSubmitOTPfirst'),
              type: 'warning',
            });
          }
        }

        break;

      case 2: {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        let isValid = true;

        console.log('email', email);
        if (email.length <= 0) {
          isValid = false;
          this.setState({emailStatus: 'wrong'});
          Toast.show({
            title: translate('common.register'),
            text: translate('pages.register.toastr.enterEmailAddress'),
            type: 'warning',
          });
        } else if (reg.test(email) === false) {
          isValid = false;
          this.setState({emailStatus: 'wrong'});
          Toast.show({
            title: translate('common.register'),
            text: translate('common.emailMustBeValid'),
            type: 'warning',
          });
        }
        // else if (this.state.email != this.state.emailconfirm) {
        //   isValid = false;
        //   this.setState({emailConfirmStatus: 'wrong'});
        //   Toast.show({
        //       title: translate('common.register'),
        //       text: translate('pages.register.toastr.confirmEmailDoNotMatch'),
        //       type: 'warning',
        //   });
        // }
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
                  title: translate('common.register'),
                  text: translate('pages.register.toastr.emailExist'),
                  type: 'primary',
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
          this.setState({emailStatus: 'right'});
        }
        break;
      }
    }
  }

  checkUserName(username) {
    // let isValid = true;
    //let regex = /^[a-zA-Z0-9- ]*$/;
    let regex = /^[a-zA-Z0-9\-\_.]*$/;
    username = username.replace(/\s/g, '');
    this.setState({username: username});
    if (username.length <= 0) {
      console.log('username.length', username.length);
      // isValid = false;
      this.setState({
        userNameStatus: 'normal',
        userNameErr: 'messages.required',
        userNameSuggestions: [],
      });
      return;
    } else if (regex.test(username) === false) {
      // isValid = false;
      this.setState({
        userNameStatus: 'wrong',
        userNameErr: 'notValid',
        userNameSuggestions: [],
      });
      return;
      // Toast.show({
      //     title: translate('common.register'),
      //     text: translate('pages.register.enterValueInEnglish'),
      //     type: 'primary',
      // });
    }
    //if (isValid) {
    this.setState({userNameErr: null});
    // }

    this.props.userNameCheck(username).then((res) => {
      console.log('userNameCheck res', res, username);
      if (res.status === false) {
        this.setState({userNameSuggestions: []});
        AsyncStorage.setItem('username', username);
        if (username.length <= 0) {
          this.setState({userNameStatus: 'normal'});
        } else {
          this.setState({userNameStatus: 'right'});
        }
      } else {
        this.setState({
          userNameSuggestions: res.suggestions,
          userNameStatus: 'wrong',
        });
      }
    });
  }

  async onSignUpPress() {
    const {username, password, isAgreeWithTerms, email} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isValid = true;
    //let regex = /^[a-zA-Z0-9- ]*$/;
    let regex = /^[a-zA-Z0-9\-\_.]*$/;

    console.log('email', email.length);
    if (email.length <= 0) {
      isValid = false;
      this.setState({emailStatus: 'wrong'});
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.register.toastr.enterEmailAddress'),
        type: 'warning',
      });
    } else if (reg.test(email) === false) {
      isValid = false;
      this.setState({emailStatus: 'wrong'});
      Toast.show({
        title: translate('common.register'),
        text: translate('common.emailMustBeValid'),
        type: 'warning',
      });
    } else if (password.length <= 0) {
      isValid = false;
      // this.setState({
      //     passwordStatus: 'wrong',
      //     passwordErr: 'messages.required',
      // });
      this.setState({
        passwordStatus: 'wrong',
        passwordErr: 'minLengthFailed',
      });
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.register.minLengthPassword'),
        type: 'warning',
      });
    } else if (password.length < 8) {
      isValid = false;
      this.setState({passwordStatus: 'wrong', passwordErr: 'minLengthFailed'});
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.register.minLengthPassword'),
        type: 'warning',
      });
    } else if (password.length > 64) {
      isValid = false;
      this.setState({passwordStatus: 'wrong', passwordErr: 'maxLengthFailed'});
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.register.maxLengthPassword'),
        type: 'warning',
      });
    } else if (username.length <= 0) {
      isValid = false;
      this.setState({
        userNameStatus: 'wrong',
        userNameErr: 'messages.required',
      });
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.setting.toastr.pleaseEnterUsername'),
        type: 'warning',
      });
    } else if (regex.test(username) === false) {
      isValid = false;
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.register.enterValueInEnglish'),
        type: 'primary',
      });
    }
    if (isValid) {
      if (isAgreeWithTerms) {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        let channelDataJson = await AsyncStorage.getItem('channelData');
        let invitationCode = await AsyncStorage.getItem('invitationCode');
        let channelData = JSON.parse(channelDataJson);
        let registerData = {
          email: email,
          is_agree: isAgreeWithTerms,
          password: password,
          user_language:
            this.props.selectedLanguageItem.language_name === 'en'
              ? 'en'
              : this.props.selectedLanguageItem.language_name === 'ko'
              ? 'ko'
              : this.props.selectedLanguageItem.language_name === 'ch'
              ? 'zh-hans'
              : this.props.selectedLanguageItem.language_name === 'ja'
              ? 'ja'
              : 'zh-hant',
          username: username,
          dev_id: fcmToken ? fcmToken : '',
          invitation_code: invitationCode ? invitationCode : '',
        };

        console.log('registerData', registerData);
        this.props
          .userNewRegister(registerData)
          .then((res) => {
            console.log('userRegister response', res);
            if (res.token) {
              AsyncStorage.removeItem('invitationCode');
              this.props.getUserProfile().then((response) => {
                if (response.id) {
                  this.props.navigation.navigate('App');
                  if (channelData) {
                    this.props.setCurrentChannel(channelData);
                    setTimeout(() => {
                      this.props.navigation.navigate('ChannelInfo');
                    }, 1000);
                  }
                }
              });
            }
            if (res.user) {
              Toast.show({
                title: translate('common.register'),
                text: 'User Already Registered',
                type: 'primary',
              });
            } else if (res.message) {
              Toast.show({
                title: translate('common.register'),
                text: res.message,
                type: 'primary',
              });
            }
          })
          .catch((err) => {
            console.log('userRegister response', err);
            // Toast.show({
            //     title: translate('common.register'),
            //     text: translate('common.somethingWentWrong'),
            //     type: 'primary',
            // });
          });
      } else {
        Toast.show({
          title: translate('common.register'),
          text: translate('pages.register.toastr.termsAndCondition'),
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

  onTermsAndCondition() {
    this.setState({isWebViewVisible: true});
    //Linking.openURL(termsUrl + this.props.selectedLanguageItem.language_name);
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
    if (
      this.state.emailconfirm.length > 0 &&
      email !== this.state.emailconfirm
    ) {
      this.setState({emailConfirmStatus: 'wrong'});
    }

    if (
      this.state.emailconfirm.length > 0 &&
      email === this.state.emailconfirm
    ) {
      this.setState({emailConfirmStatus: 'right'});
    }

    if (isValid) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.props
          .userEmailCheck(email)
          .then((res) => {
            if (res.status === false) {
              let newUsername = email.substring(0, email.indexOf('@'));
              this.setState({
                emailStatus: 'right',
                username: newUsername,
                userNameErr: null,
              });

              this.props.userNameCheck(newUsername).then((response) => {
                console.log('userNameCheck response', response, newUsername);
                if (response.status === false) {
                  this.setState({userNameSuggestions: []});
                  AsyncStorage.setItem('username', newUsername);
                  if (newUsername.length <= 0) {
                    this.setState({userNameStatus: 'normal'});
                  } else {
                    this.setState({userNameStatus: 'right'});
                  }
                } else {
                  this.setState({
                    userNameSuggestions: response.suggestions,
                    userNameStatus: 'wrong',
                  });
                }
              });
            } else {
              this.setState({emailStatus: 'wrong'});
            }
          })
          .catch((err) => {
            console.error(err);
            this.setState({emailStatus: 'wrong'});
          });
      }, 500);
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
    } else if (this.state.email !== emailconfirm) {
      isValid = false;
      this.setState({emailConfirmStatus: 'wrong'});
    }
    if (isValid) {
      this.setState({emailConfirmStatus: 'right'});
    }
  };

  handlePassword = (password) => {
    this.setState({password});
    if (password.length <= 0) {
      //this.setState({passwordStatus: 'wrong', passwordErr: 'messages.required'});
      this.setState({passwordStatus: 'wrong', passwordErr: 'minLengthFailed'});
    } else if (password.length < 8) {
      this.setState({passwordStatus: 'wrong', passwordErr: 'minLengthFailed'});
    } else if (password.length > 64) {
      this.setState({passwordStatus: 'wrong', passwordErr: 'maxLengthFailed'});
    } else {
      this.setState({passwordStatus: 'right', passwordErr: null});
    }
  };

  handleConfirmPassword = (passwordConfirm) => {
    this.setState({passwordConfirm});
    if (passwordConfirm.length <= 0) {
      this.setState({
        passwordConfirmStatus: 'wrong',
        confirmPasswordErr: 'messages.required',
      });
    } else if (this.state.password !== passwordConfirm) {
      this.setState({
        passwordConfirmStatus: 'wrong',
        confirmPasswordErr: 'matchFailed',
      });
    } else {
      this.setState({passwordConfirmStatus: 'right', confirmPasswordErr: null});
    }
  };

  selectSuggestedUserName(username) {
    this.setState({
      username: username,
      userNameStatus: 'right',
      userNameSuggestions: [],
    });
  }

  showSuggestions = () => {
    if (this.state.userNameSuggestions.length > 0) {
      const suggestions = this.state.userNameSuggestions.map((item, index) => {
        return `${item}`;
      });
      return (
        <View style={styles.suggestionsContainer}>
          <Text style={[globalStyles.smallLightText, styles.usernamExistText]}>
            {translate('pages.register.toastr.usrenameExist')}
          </Text>
          <View style={styles.suggestionsSubContainer}>
            <View style={styles.suggestionsTextContainer}>
              <Text style={globalStyles.smallLightText}>
                {translate('pages.register.suggestions')}:
              </Text>
            </View>
            <View style={styles.suggestionsListContainer}>
              {suggestions.map((item) => {
                return (
                  <TouchableOpacity
                    style={styles.suggestionsListItemActionContainer}
                    onPress={() => this.selectSuggestedUserName(item)}>
                    <Text
                      style={[
                        globalStyles.smallLightText,
                        styles.suggestionsListItemActionText,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  async onSocialSignUp() {
    const {username, password, isAgreeWithTerms, email, showEmail} = this.state;
    let invitationCode = await AsyncStorage.getItem('invitationCode');
    let channelDataJson = await AsyncStorage.getItem('channelData');
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let channelData = JSON.parse(channelDataJson);

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isValid = true;
    let regex = /^[a-zA-Z0-9- ]*$/;

    if (showEmail) {
      if (email.length <= 0) {
        isValid = false;
        this.setState({emailStatus: 'wrong'});
        Toast.show({
          title: translate('common.register'),
          text: translate('pages.register.toastr.enterEmailAddress'),
          type: 'warning',
        });
      } else if (reg.test(email) === false) {
        isValid = false;
        this.setState({emailStatus: 'wrong'});
        Toast.show({
          title: translate('common.register'),
          text: translate('common.emailMustBeValid'),
          type: 'warning',
        });
      }
    } else if (password.length <= 0) {
      isValid = false;
      this.setState({
        passwordStatus: 'wrong',
        passwordErr: 'minLengthFailed',
      });
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.register.minLengthPassword'),
        type: 'warning',
      });
    } else if (password.length < 8) {
      isValid = false;
      this.setState({passwordStatus: 'wrong', passwordErr: 'minLengthFailed'});
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.register.minLengthPassword'),
        type: 'warning',
      });
    } else if (password.length > 64) {
      isValid = false;
      this.setState({passwordStatus: 'wrong', passwordErr: 'maxLengthFailed'});
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.register.maxLengthPassword'),
        type: 'warning',
      });
    } else if (username.length <= 0) {
      isValid = false;
      this.setState({
        userNameStatus: 'wrong',
        userNameErr: 'messages.required',
      });
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.setting.toastr.pleaseEnterUsername'),
        type: 'warning',
      });
    } else if (regex.test(username) === false) {
      isValid = false;
      Toast.show({
        title: translate('common.register'),
        text: translate('pages.register.enterValueInEnglish'),
        type: 'primary',
      });
    }

    if (isValid) {
      if (isAgreeWithTerms) {
        let registrationData;
        if (showEmail) {
          registrationData = JSON.stringify({
            username: username,
            password: password,
            invitation_code: invitationCode ? invitationCode : '',
            email: email,
            site_from: 'touku',
            dev_id: fcmToken ? fcmToken : '',
          });
        } else {
          registrationData = JSON.stringify({
            username: username,
            password: password,
            invitation_code: invitationCode ? invitationCode : '',
            site_from: 'touku',
            dev_id: fcmToken ? fcmToken : '',
          });
        }
        console.log('RegisterData through SNS', registrationData);
        this.props
          .socialRegistrationNew(registrationData)
          .then((res) => {
            console.log('JWT TOKEN=> ', JSON.stringify(res));
            if (res.token) {
              AsyncStorage.removeItem('invitationCode');
              this.props.navigation.navigate('App');
              if (channelData) {
                this.props.setCurrentChannel(channelData);
                setTimeout(() => {
                  this.props.navigation.navigate('ChannelInfo');
                }, 1000);
              }
              return;
            } else if (res.message) {
              Toast.show({
                title: translate('pages.register.toastr.RegisterFailed'),
                text: res.message,
                type: 'primary',
              });
            }
          })
          .catch((err) => {
            if (err.response) {
              if (err.response.data) {
                console.log('err.response.data', err.response.data);
                if (err.response.data.message) {
                  Toast.show({
                    title: translate('pages.register.toastr.RegisterFailed'),
                    text: translate(err.response.data.message.toString()),
                    type: 'primary',
                  });
                } else {
                  // Toast.show({
                  //     title: translate('pages.register.toastr.RegisterFailed'),
                  //     text: translate('common.somethingWentWrong'),
                  //     type: 'primary',
                  // });
                }
              } else {
                // Toast.show({
                //     title: translate('pages.register.toastr.RegisterFailed'),
                //     text: translate('common.somethingWentWrong'),
                //     type: 'primary',
                // });
              }
            }
          });
      } else {
        Toast.show({
          title: translate('pages.register.terms&Conditions'),
          text: translate('pages.register.toastr.termsAndCondition'),
          type: 'primary',
        });
      }
    }
  }

  async actionBackPres() {
    this.props.navigation.goBack();
    // const {currentPosition} = this.state
    // if (this.props.navigation.state.params.isSocial) {
    //     this.props.navigation.goBack()
    // }else{
    //   if (currentPosition !== 0) {
    //     this.setState({currentPosition: currentPosition-1})
    //   }else{
    //       this.props.navigation.goBack()
    //   }
    // }
    await AsyncStorage.removeItem('socialToken');
    await AsyncStorage.removeItem('userToken');
  }

  renderPage(page) {
    const {
      userNameErr,
      passwordErr,
      userNameStatus,
      emailStatus,
      passwordStatus,
      showEmail,
    } = this.state;
    switch (page) {
      case 0:
        return (
          <View>
            <Text
              style={[
                globalStyles.smallLightText,
                styles.registrationStepText,
              ]}>
              {translate('common.registerStepOne')}
            </Text>
            <View style={styles.registrationInputContainer}>
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
                  this.inputs.verifycode = ref;
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
            <Text
              style={[
                globalStyles.smallLightText,
                styles.registrationStepText,
              ]}>
              {translate('common.registerStepTwo')}
            </Text>
            <View style={styles.registrationInputContainer}>
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
        const usernameErrorText =
          this.state.userNameSuggestions.length > 0 ? 10 : -10;
        return (
          <View>
            {/*<Text*/}
            {/*style={[*/}
            {/*globalStyles.smallLightText,*/}
            {/*styles.registrationStepText,*/}
            {/*]}>*/}
            {/*{translate('common.registerStepThree')}*/}
            {/*</Text>*/}
            <View style={styles.registrationInputContainer}>
              {showEmail && (
                <Inputfield
                  ref={'email_field'}
                  value={this.state.email}
                  placeholder={
                    translate('common.email') + ' ' + '(example@gmail.com)'
                  }
                  placeholderTextColor="#D3D3D3"
                  returnKeyType={'next'}
                  keyboardType={'email-address'}
                  onChangeText={(email) => this.handleEmail(email)}
                  onSubmitEditing={() => {
                    this.password.focus();
                  }}
                  status={this.state.emailStatus}
                  numberOfLines={1}
                />
              )}
              <Inputfield
                ref={(input) => {
                  this.password = input;
                }}
                value={this.state.password}
                placeholder={translate('pages.register.loginPassword')}
                placeholderTextColor="#D3D3D3"
                returnKeyType={'next'}
                onChangeText={(password) => this.handlePassword(password)}
                onSubmitEditing={() => {
                  this.username.focus();
                }}
                status={this.state.passwordStatus}
                isEyeIcon={true}
              />
              {passwordErr !== null ? (
                <Text
                  style={[
                    globalStyles.smallLightText,
                    styles.passwordErrorText,
                  ]}>
                  {/*{passwordErr === 'messages.required' ? translate(passwordErr).replace(*/}
                  {/*'[missing {{field}} value]',*/}
                  {/*translate('pages.register.loginPassword')): passwordErr === 'minLengthFailed'? translate('pages.register.minLengthPassword')*/}
                  {/*:  translate('pages.register.maxLengthPassword')}*/}
                  {passwordErr === 'minLengthFailed'
                    ? translate('pages.register.minLengthPassword')
                    : translate('pages.register.maxLengthPassword')}
                </Text>
              ) : null}

              <View style={styles.usernameContainer}>
                <Text
                  style={[globalStyles.smallLightText, styles.usernameHeading]}>
                  {translate('pages.register.thisIsYourUsername') +
                    '  ' +
                    translate('pages.register.youCanChangeItUsername')}
                </Text>
                <Inputfield
                  ref={(input) => {
                    this.username = input;
                  }}
                  value={this.state.username}
                  placeholder={translate('common.usernameText')}
                  placeholderTextColor="#D3D3D3"
                  returnKeyType={'done'}
                  onChangeText={(username) =>
                    this.checkUserName(username.toLowerCase())
                  }
                  // onChangeText={(username) => this.setState({ username })}
                  onSubmitEditing={() => {
                    this.checkUserName(this.state.username);
                  }}
                  status={this.state.userNameStatus}
                  isSuggestions={
                    this.state.userNameSuggestions.length ? true : false
                  }
                />
                {userNameErr !== null ? (
                  <Text
                    style={[
                      globalStyles.smallLightText,
                      {
                        marginTop: usernameErrorText,
                      },
                      styles.usernameErrorText,
                    ]}>
                    {userNameErr === 'messages.required'
                      ? translate('pages.register.minLengthUserName')
                      : translate('pages.register.enterValueInEnglish')}
                  </Text>
                ) : null}
                {this.showSuggestions()}
              </View>
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  onPress={() => this.onCheckRememberMe()}
                  activeOpacity={1}>
                  <CheckBox
                    onCheck={() => this.onCheckRememberMe()}
                    isChecked={this.state.isAgreeWithTerms}
                    isFromSignUp={true}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.onTermsAndCondition()}
                  activeOpacity={1}>
                  <Text
                    style={[
                      globalStyles.smallLightText,
                      styles.termsAndConditionText,
                    ]}>
                    {translate('pages.register.iAgreeToTheTerms&Conditions')}
                  </Text>
                </TouchableOpacity>
              </View>
              <Button
                type={'primary'}
                title={translate('common.signUp')}
                onPress={() =>
                  !this.props.navigation.state.params.isSocial
                    ? this.onSignUpPress()
                    : this.onSocialSignUp()
                }
                loading={this.props.loading}
                disabled={
                  !this.state.isAgreeWithTerms ||
                  userNameErr !== null ||
                  userNameStatus === 'wrong' ||
                  emailStatus === 'wrong' ||
                  passwordStatus === 'wrong' ||
                  passwordErr !== null
                }
              />
            </View>
          </View>
        );
    }
  }

  render() {
    const {orientation, isWebViewVisible} = this.state;
    const pageContainerPadding = orientation !== 'PORTRAIT' ? 50 : 0;
    return (
      <ImageBackground
        //source={Images.image_touku_bg}
        source={
          Platform.isPad ? Images.image_touku_bg : Images.image_touku_bg_phone
        }
        style={globalStyles.container}>
        <SafeAreaView
          pointerEvents={
            this.props.loading || this.props.loadingSMS ? 'none' : 'auto'
          }
          style={globalStyles.safeAreaView}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            behavior={'position'}
            contentContainerStyle={styles.keyboardScrollContentContainer}
            showsVerticalScrollIndicator={false}>
            <BackHeader onBackPress={() => this.actionBackPres()} />
            <View
              style={[
                {paddingHorizontal: pageContainerPadding},
                styles.pageContainer,
              ]}>
              {/*<View*/}
              {/*style={{*/}
              {/*paddingHorizontal: orientation != 'PORTRAIT' ? 200 : 100,*/}
              {/*marginBottom: 20,*/}
              {/*}}>*/}
              {/*<StepIndicator*/}
              {/*stepCount={3}*/}
              {/*customStyles={stepIndicatorStyle}*/}
              {/*currentPosition={currentPosition}*/}
              {/*/>*/}
              {/*</View>*/}
              {this.renderPage(2)}
            </View>
            {isWebViewVisible && (
              <WebViewClass
                modalVisible={isWebViewVisible}
                url={termsUrl + this.props.selectedLanguageItem.language_name}
                closeModal={() => this.setState({isWebViewVisible: false})}
              />
            )}

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
  userNewRegister,
  socialRegistrationNew,
  setCurrentChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
