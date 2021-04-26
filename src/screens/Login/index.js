import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-community/async-storage';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import KakaoLogins from '@react-native-seoul/kakao-login';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  NativeModules,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LineLogin from 'react-native-line-sdk';
import * as RNLocalize from 'react-native-localize';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import {BackHeader} from '../../components/Headers';
import Inputfield from '../../components/InputField';
import LanguageSelector from '../../components/LanguageSelector';
import Toast from '../../components/Toast';
import WebViewClass from '../../components/WebView';
import {Icons, Images, supportUrl} from '../../constants';
import {setCurrentChannel} from '../../redux/reducers/channelReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {getSNSCheck, userLogin} from '../../redux/reducers/loginReducer';
import {
  appleRegister,
  facebookRegister,
  getUserProfile,
  googleRegister,
  kakaoRegister,
  lineRegister,
  twitterRegister,
} from '../../redux/reducers/userReducer';
import {globalStyles} from '../../styles';
import {getParamsFromURL} from '../../utils';
import {SocialLogin} from '../LoginSignUp';
import styles from './styles';

const {RNTwitterSignIn} = NativeModules;

const TwitterKeys = {
  TWITTER_CONSUMER_KEY: 'BvR9GWViH6r35PXtNHkV5MCxd',
  TWITTER_CONSUMER_SECRET: '2R6vK7nCsWIYneFgmlvBQUSbajD1djiYMIFLwwElZMYaa3r6Q8',
};

class Login extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isRememberChecked: true,
      isCheckLanguages: false,
      username: '',
      password: '',
      authError: '',
      userNameErr: null,
      passwordErr: null,
      userNameStatus: 'normal',
      passwordStatus: 'normal',
      showSNS: false,
      isWebViewVisible: false,
      isLoading: false,
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  UNSAFE_componentWillMount() {
    GoogleSignin.configure({
      webClientId:
        '185609886814-rderde876lo4143bas6l1oj22qoskrdl.apps.googleusercontent.com',
    });
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    //this.checkSNSVisibility();
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  handleLocalizationChange = () => {
    setI18nConfig()
      .then(() => this.forceUpdate())
      .catch((error) => {
        console.error(error);
      });
  };

  checkSNSVisibility() {
    this.props.getSNSCheck().then((url) => {
      const {hide_sns} = getParamsFromURL(url);
      if (hide_sns === 'true') {
        this.setState({showSNS: false});
      } else {
        this.setState({showSNS: true});
      }
    });
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  onCheckRememberMe() {
    this.setState((prevState) => {
      return {
        isRememberChecked: !prevState.isRememberChecked,
      };
    });
  }

  onLanguageSelectPress() {
    this.setState((prevState) => {
      return {
        isCheckLanguages: !prevState.isCheckLanguages,
      };
    });
  }

  firebaseGoogleLogin = async () => {
    this.setState({isLoading: true});
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo: userInfo, loggedIn: true});
      console.log('userInfo', userInfo);
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      const googleLoginData = {
        code: userInfo.idToken,
        access_token_secret: userInfo.idToken,
        site_from: 'touku',
        dev_id: fcmToken ? fcmToken : '',
      };
      console.log('googleLoginData', googleLoginData);
      this.props
        .googleRegister(googleLoginData)
        .then(async (res) => {
          this.setState({isLoading: false});
          console.log('JWT TOKEN=> ', JSON.stringify(res));
          if (res.token) {
            let status = res.status;
            let isEmail = res.email_required;
            if (!status) {
              if (isEmail) {
                this.props.navigation.navigate('SignUp', {
                  showEmail: true,
                  isSocial: true,
                });
                return;
              }
              this.props.navigation.navigate('SignUp', {
                showEmail: false,
                isSocial: true,
              });
              return;
            }
            await AsyncStorage.setItem('userToken', res.token);
            await AsyncStorage.removeItem('socialToken');
            this.props.navigation.navigate('App');

            let channelDataJson = await AsyncStorage.getItem('channelData');
            let channelData = JSON.parse(channelDataJson);
            if (channelData) {
              this.props.setCurrentChannel(channelData);
              setTimeout(() => {
                this.props.navigation.navigate('ChannelInfo');
              }, 1000);
            }
            return;
          }
          if (res.error) {
            Toast.show({
              title: translate('common.loginFailed'),
              text: translate(res.error.toString()),
              type: 'primary',
            });
          }
        })
        .catch((err) => {
          this.setState({isLoading: false});
          if (err.response) {
            console.log(err.response);
            if (err.response.data) {
              Toast.show({
                title: 'Login Failed',
                text: translate(err.response.data.toString()),
                type: 'primary',
              });
            }
          }
        });
    } catch (error) {
      this.setState({isLoading: false});
      //alert(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // alert('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // alert('operation (f.e. sign in) is in progress already');
        Toast.show({
          title: translate('common.loginFailed'),
          text: 'operation (f.e. sign in) is in progress already',
          type: 'primary',
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // alert('play services not available or outdated');
        Toast.show({
          title: translate('common.loginFailed'),
          text: 'play services not available or outdated',
          type: 'primary',
        });
      } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // alert('play services not available or outdated');
        Toast.show({
          title: translate('common.loginFailed'),
          text: 'play services not available or outdated',
          type: 'primary',
        });
      } else {
        // alert('some other error happened');
        Toast.show({
          title: translate('common.loginFailed'),
          text: 'Error occured while signin',
          type: 'primary',
        });
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({user: null, loggedIn: false});
    } catch (error) {
      console.error(error);
    }
  };

  async firebaseFacebookLogin() {
    console.log('facebook tapped');
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    console.log('data.accessToken===========', data);
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    auth()
      .signInWithCredential(facebookCredential)
      .then((res) => {
        this.setState({isLoading: true});
        console.log('Facebook response', JSON.stringify(res));
        const facebookLoginData = {
          access_token: data.accessToken,
          code: data.accessToken,
          access_token_secret: data.accessToken,
          // username: result.additionalUserInfo.username,
          site_from: 'touku',
          dev_id: fcmToken ? fcmToken : '',
        };
        console.log(
          'LoginSignUp -> firebaseFacebookLogin -> facebookLoginData',
          facebookLoginData,
        );
        this.props
          .facebookRegister(facebookLoginData)
          .then(async (response) => {
            this.setState({isLoading: false});
            console.log('JWT TOKEN=> ', JSON.stringify(response));
            if (response.token) {
              let status = response.status;
              let isEmail = response.email_required;
              if (!status) {
                if (isEmail) {
                  this.props.navigation.navigate('SignUp', {
                    showEmail: true,
                    isSocial: true,
                  });
                  return;
                }
                this.props.navigation.navigate('SignUp', {
                  pageNumber: false,
                  isSocial: true,
                });
                return;
              }
              await AsyncStorage.setItem('userToken', response.token);
              await AsyncStorage.removeItem('socialToken');
              this.props.navigation.navigate('App');

              let channelDataJson = await AsyncStorage.getItem('channelData');
              let channelData = JSON.parse(channelDataJson);
              if (channelData) {
                this.props.setCurrentChannel(channelData);
                setTimeout(() => {
                  this.props.navigation.navigate('ChannelInfo');
                }, 1000);
              }
              return;
            }
            if (response.error) {
              Toast.show({
                title: translate('common.loginFailed'),
                text: translate(response.error.toString()),
                type: 'primary',
              });
            }
          })
          .catch((err) => {
            this.setState({isLoading: false});
            if (err.response) {
              console.log(err.response);
              if (err.response.data) {
                Toast.show({
                  title: 'Login Failed',
                  text: translate(err.response.data.toString()),
                  type: 'primary',
                });
              }
            }
          });
      })
      .catch((err) => {
        this.setState({isLoading: false});
        Toast.show({
          title: translate('common.loginFailed'),
          text: err,
          type: 'primary',
        });
      });
  }

  firebaseTwitterLogin() {
    console.log('twitter tapped');
    this.onTwitterButtonPress().then((result) =>
      console.log('Signed in with twitter!', JSON.stringify(result)),
    );
  }

  async onTwitterButtonPress() {
    RNTwitterSignIn.init(
      TwitterKeys.TWITTER_CONSUMER_KEY,
      TwitterKeys.TWITTER_CONSUMER_SECRET,
    ).then(() => console.log('Twitter SDK initialized'));

    // Perform the login request
    const {
      authToken,
      authTokenSecret,
      userName,
    } = await RNTwitterSignIn.logIn();

    // Create a Twitter credential with the tokens
    const twitterCredential = auth.TwitterAuthProvider.credential(
      authToken,
      authTokenSecret,
    );

    // Sign-in the user with the credential
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    return auth()
      .signInWithCredential(twitterCredential)
      .then((res) => {
        this.setState({isLoading: true});
        console.log('twitter response data==> ', JSON.stringify(res));
        const twitterLoginData = {
          access_token: authToken,
          access_token_secret: authTokenSecret,
          // username: result.additionalUserInfo.username,
          site_from: 'touku',
          dev_id: fcmToken ? fcmToken : '',
          username: userName,
        };
        console.log('twitterLoginData', twitterLoginData);
        this.props
          .twitterRegister(twitterLoginData)
          .then(async (reuslt) => {
            this.setState({isLoading: false});
            console.log('JWT TOKEN=> ', JSON.stringify(reuslt));
            if (reuslt.token) {
              let status = reuslt.status;
              let isEmail = reuslt.email_required;
              if (!status) {
                if (isEmail) {
                  this.props.navigation.navigate('SignUp', {
                    showEmail: true,
                    isSocial: true,
                  });
                  return;
                }
                this.props.navigation.navigate('SignUp', {
                  showEmail: false,
                  isSocial: true,
                });
                return;
              }
              await AsyncStorage.setItem('userToken', reuslt.token);
              await AsyncStorage.removeItem('socialToken');
              this.props.navigation.navigate('App');

              let channelDataJson = await AsyncStorage.getItem('channelData');
              let channelData = JSON.parse(channelDataJson);
              if (channelData) {
                this.props.setCurrentChannel(channelData);
                setTimeout(() => {
                  this.props.navigation.navigate('ChannelInfo');
                }, 1000);
              }
              return;
            }
            if (reuslt.error) {
              Toast.show({
                title: translate('common.loginFailed'),
                text: translate(reuslt.error.toString()),
                type: 'primary',
              });
            }
          })
          .catch((err) => {
            this.setState({isLoading: false});
            if (err.response) {
              console.log(err.response);
              if (err.response.data) {
                Toast.show({
                  title: 'Login Failed',
                  text: translate(err.response.data.toString()),
                  type: 'primary',
                });
              }
            }
          });
      })
      .catch((err) => {
        this.setState({isLoading: false});
        Toast.show({
          title: translate('common.loginFailed'),
          text: err,
          type: 'primary',
        });
      });
  }

  async firebaseLineLogin() {
    console.log('LoginSignUp -> firebaseLineLogin -> firebaseLineLogin');
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (Platform.OS === 'ios') {
      let arrPermissions = ['profile', 'openid', 'email'];
      LineLogin.loginWithPermissions(arrPermissions)
        .then((user) => {
          console.log(user);
          this.setState({isLoading: true});
          const lineLoginData = {
            email: user.idToken.email,
            code: '',
            access_token: user.accessToken.accessToken,
            dev_id: fcmToken ? fcmToken : '',
            site_from: 'touku',
          };
          console.log(
            'LoginSignUp -> firebaseLineLogin -> lineLoginData',
            lineLoginData,
          );
          this.props
            .lineRegister(lineLoginData)
            .then(async (res) => {
              this.setState({isLoading: false});
              console.log('JWT TOKEN=> ', JSON.stringify(res));
              if (res.token) {
                let status = res.status;
                let isEmail = res.email_required;
                if (!status) {
                  if (isEmail) {
                    this.props.navigation.navigate('SignUp', {
                      showEmail: true,
                      isSocial: true,
                    });
                    return;
                  }
                  this.props.navigation.navigate('SignUp', {
                    showEmail: false,
                    isSocial: true,
                  });
                  return;
                }
                await AsyncStorage.setItem('userToken', res.token);
                await AsyncStorage.removeItem('socialToken');
                this.props.navigation.navigate('App');

                let channelDataJson = await AsyncStorage.getItem('channelData');
                let channelData = JSON.parse(channelDataJson);
                if (channelData) {
                  this.props.setCurrentChannel(channelData);
                  setTimeout(() => {
                    this.props.navigation.navigate('ChannelInfo');
                  }, 1000);
                }
                return;
              }
              if (res.error) {
                Toast.show({
                  title: translate('common.loginFailed'),
                  text: translate(res.error.toString()),
                  type: 'primary',
                });
              }
            })
            .catch((err) => {
              this.setState({isLoading: false});
              if (err.response) {
                console.log(err.response);
                if (err.response.data) {
                  Toast.show({
                    title: 'Login Failed',
                    text: translate(err.response.data.toString()),
                    type: 'primary',
                  });
                }
              }
            });
        })
        .catch((err) => {
          this.setState({isLoading: false});
          // Toast.show({
          //     title: translate('common.loginFailed'),
          //     text: err,
          //     type: 'primary',
          // });
          console.log(err);
        });
    } else {
      LineLogin.login()
        .then((user) => {
          this.setState({isLoading: true});
          console.log(user);
          const lineLoginData = {
            code: '',
            access_token: user.accessToken.accessToken,
            dev_id: fcmToken ? fcmToken : '',
            site_from: 'touku',
          };
          console.log(
            'LoginSignUp -> firebaseLineLogin -> lineLoginData',
            lineLoginData,
          );
          this.props
            .lineRegister(lineLoginData)
            .then(async (res) => {
              this.setState({isLoading: false});
              console.log('JWT TOKEN=> ', JSON.stringify(res));
              if (res.token) {
                let status = res.status;
                let isEmail = res.email_required;
                if (!status) {
                  if (isEmail) {
                    this.props.navigation.navigate('SignUp', {
                      showEmail: true,
                      isSocial: true,
                    });
                    return;
                  }
                  this.props.navigation.navigate('SignUp', {
                    showEmail: false,
                    isSocial: true,
                  });
                  return;
                }
                await AsyncStorage.setItem('userToken', res.token);
                await AsyncStorage.removeItem('socialToken');
                this.props.navigation.navigate('App');

                let channelDataJson = await AsyncStorage.getItem('channelData');
                let channelData = JSON.parse(channelDataJson);
                if (channelData) {
                  this.props.setCurrentChannel(channelData);
                  setTimeout(() => {
                    this.props.navigation.navigate('ChannelInfo');
                  }, 1000);
                }
                return;
              }
              if (res.error) {
                Toast.show({
                  title: translate('common.loginFailed'),
                  text: translate(res.error.toString()),
                  type: 'primary',
                });
              }
            })
            .catch((err) => {
              this.setState({isLoading: false});
              if (err.response) {
                console.log(err.response);
                if (err.response.data) {
                  Toast.show({
                    title: 'Login Failed',
                    text: translate(err.response.data.toString()),
                    type: 'primary',
                  });
                }
              }
            });
        })
        .catch((err) => {
          this.setState({isLoading: false});
          console.log(err);
          //   Toast.show({
          //       title: translate('common.loginFailed'),
          //       text: err,
          //       type: 'primary',
          //   });
        });
    }
  }

  async kakaoLogin() {
    console.log('kakaoLogin');
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    KakaoLogins.login()
      .then((result) => {
        this.setState({isLoading: true});
        console.log('result kakaoLogin', result);
        const kakaoLoginData = {
          code: '',
          access_token: result.accessToken,
          dev_id: fcmToken ? fcmToken : '',
          site_from: 'touku',
        };
        console.log('kakao request', kakaoLoginData);
        this.props
          .kakaoRegister(kakaoLoginData)
          .then(async (res) => {
            this.setState({isLoading: false});
            console.log('JWT TOKEN=> ', JSON.stringify(res));
            if (res.token) {
              let status = res.status;
              let isEmail = res.email_required;
              if (!status) {
                if (isEmail) {
                  this.props.navigation.navigate('SignUp', {
                    showEmail: true,
                    isSocial: true,
                  });
                  return;
                }
                this.props.navigation.navigate('SignUp', {
                  showEmail: false,
                  isSocial: true,
                });
                return;
              }
              await AsyncStorage.setItem('userToken', res.token);
              await AsyncStorage.removeItem('socialToken');
              this.props.navigation.navigate('App');
              return;
            }
            if (res.error) {
              Toast.show({
                title: translate('common.loginFailed'),
                text: translate(res.error.toString()),
                type: 'primary',
              });
            }
          })
          .catch((err) => {
            this.setState({isLoading: false});
            if (err.response) {
              console.log(err.response);
              if (err.response.data) {
                Toast.show({
                  title: 'Login Failed',
                  text: translate(err.response.data.toString()),
                  type: 'primary',
                });
              }
            }
          });
      })
      .catch((err) => {
        this.setState({isLoading: false});
        console.log('Error kakaoLogin', err);
        if (err.code === 'E_CANCELLED_OPERATION') {
          //logCallback(`Login Cancelled:${err.message}`, setLoginLoading(false));
        } else {
          // logCallback(
          //     `Login Failed:${err.code} ${err.message}`,
          //     setLoginLoading(false),
          // );
          Toast.show({
            title: translate('common.loginFailed'),
            text: err.message,
            type: 'primary',
          });
        }
      });
  }

  handleUserName = (username) => {
    this.setState({username});
    // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let isValid = true;

    if (username.length <= 0) {
      isValid = false;
      this.setState({
        userNameStatus: 'wrong',
        userNameErr: 'messages.required',
      });
    }
    if (isValid) {
      this.setState({userNameStatus: 'right', userNameErr: null});
    }
  };

  handlePassword = (password) => {
    this.setState({password});
    if (password.length <= 0) {
      this.setState({
        passwordStatus: 'wrong',
        passwordErr: 'messages.required',
      });
    } else {
      this.setState({passwordStatus: 'right', passwordErr: null});
    }
  };

  async onLoginPress() {
    Keyboard.dismiss();
    this.setState({userNameErr: null, passwordErr: null});
    const {username, password} = this.state;
    // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let isValid = true;

    if (username.length <= 0) {
      isValid = false;
      this.setState({
        userNameStatus: 'wrong',
        userNameErr: 'messages.required',
      });
    }
    if (password.length <= 0) {
      isValid = false;
      this.setState({
        passwordStatus: 'wrong',
        passwordErr: 'messages.required',
      });
    }

    if (isValid) {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      let channelDataJson = await AsyncStorage.getItem('channelData');
      let channelData = JSON.parse(channelDataJson);
      let loginData = {
        dev_id: fcmToken ? fcmToken : '',
        email: username,
        password: password,
        rememberMe: true,
      };
      this.props
        .userLogin(loginData)
        .then((res) => {
          if (res.token) {
            this.props.getUserProfile().then((result) => {
              console.log('getUserProfile', result);
              if (result.id) {
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
              title: translate('common.loginFailed'),
              text: translate(res.user.toString()),
              type: 'primary',
            });
            this.setState({authError: res.user});
          }
          if (res.error) {
            Toast.show({
              title: translate('common.loginFailed'),
              text: translate(res.error.toString()),
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
                  title: translate('common.loginFailed'),
                  text: translate(errMessage.message.toString()),
                  type: 'primary',
                });
              } else if (errMessage.non_field_errors) {
                let strRes = errMessage.non_field_errors;
                Toast.show({
                  title: translate('common.loginFailed'),
                  text: translate(strRes.toString()),
                  type: 'primary',
                });
              } else if (errMessage.detail) {
                Toast.show({
                  title: translate('common.loginFailed'),
                  text: errMessage.detail.toString(),
                  type: 'primary',
                });
              }
            }
          }
        });
    }
  }

  onNeedSupportClick() {
    //this.props.navigation.navigate('NeedSupport');
    // Linking.openURL(supportUrl);
    this.setState({isWebViewVisible: true});
  }

  appleLogin() {
    this.onAppleButtonPress();
  }
  async onAppleButtonPress() {
    // 1). start a apple sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });

    // 2). if the request was successful, extract the token and nonce
    const {identityToken} = appleAuthRequestResponse;

    console.log('appleAuthRequestResponse', appleAuthRequestResponse);
    // can be null in some scenarios
    if (identityToken) {
      // // 3). create a Firebase `AppleAuthProvider` credential
      // const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      //
      // console.log("Apple credential:", appleCredential);

      // // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
      // //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
      // //     to link the account to an existing user
      // const userCredential = await auth().signInWithCredential(appleCredential);
      //
      // // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
      // console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
      //
      // console.log('Firebase response for apple', userCredential)

      let fcmToken = await AsyncStorage.getItem('fcmToken');
      const appleLoginData = {
        id_token: identityToken,
        dev_id: fcmToken ? fcmToken : '',
        site_from: 'touku',
      };
      console.log('appleLogin request', appleLoginData);

      this.props.appleRegister(appleLoginData).then(async (res) => {
        console.log('JWT TOKEN=> ', JSON.stringify(res));
        if (res.token) {
          let status = res.status;
          let isEmail = res.email_required;
          if (!status) {
            if (isEmail) {
              this.props.navigation.navigate('SignUp', {
                showEmail: true,
                isSocial: true,
              });
              return;
            }
            this.props.navigation.navigate('SignUp', {
              showEmail: false,
              isSocial: true,
            });
            return;
          }
          await AsyncStorage.setItem('userToken', res.token);
          await AsyncStorage.removeItem('socialToken');
          this.props.navigation.navigate('App');

          let channelDataJson = await AsyncStorage.getItem('channelData');
          let channelData = JSON.parse(channelDataJson);
          if (channelData) {
            this.props.setCurrentChannel(channelData);
            setTimeout(() => {
              this.props.navigation.navigate('ChannelInfo');
            }, 1000);
          }
          return;
        }
        if (res.error) {
          Toast.show({
            title: translate('common.loginFailed'),
            text: translate(res.error.toString()),
            type: 'primary',
          });
        }
      });
    } else {
      // handle this - retry?
    }
  }

  render() {
    const {
      isCheckLanguages,
      orientation,
      userNameErr,
      passwordErr,
      isWebViewVisible,
      isLoading,
    } = this.state;

    const {selectedLanguageItem} = this.props;

    const containerPaddingHorizontal = orientation !== 'PORTRAIT' ? 50 : 0;
    const containerPaddingTop =
      orientation !== 'PORTRAIT' ? 0 : Platform.OS === 'ios' ? 60 : 0;
    const inputContainerPaddingTop =
      orientation !== 'PORTRAIT' ? 0 : Platform.OS === 'ios' ? 40 : 0;

    return (
      <ImageBackground
        //source={Images.image_touku_bg}
        source={
          Platform.isPad ? Images.image_touku_bg : Images.image_touku_bg_phone
        }
        style={globalStyles.container}>
        <SafeAreaView
          pointerEvents={this.props.loading ? 'none' : 'auto'}
          style={globalStyles.safeAreaView}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            behavior={'position'}
            contentContainerStyle={[
              styles.scrollView,
              styles.keyboardScrollContentContainer,
            ]}
            showsVerticalScrollIndicator={false}>
            <BackHeader
              onBackPress={() => this.props.navigation.goBack()}
              isChecked={isCheckLanguages}
              onLanguageSelectPress={() => this.onLanguageSelectPress()}
            />
            <View
              style={[
                {
                  paddingHorizontal: containerPaddingHorizontal,
                  paddingTop: containerPaddingTop,
                },
                styles.container,
              ]}>
              <Text allowFontScaling={false} style={globalStyles.logoText}>
                {translate('header.logoTitle')}
              </Text>
              <View style={styles.inputContainer}>
                <View style={{paddingTop: inputContainerPaddingTop}}>
                  <Inputfield
                    value={this.state.username}
                    placeholder={translate('common.usernameOrEmail')}
                    returnKeyType={'next'}
                    onChangeText={(username) => this.handleUserName(username)}
                    onSubmitEditing={() => {
                      this.focusNextField('password');
                    }}
                    status={'normal'}
                  />
                  {userNameErr !== null ? (
                    <Text
                      style={[
                        globalStyles.smallLightText,
                        styles.usernameOrEmailText,
                      ]}>
                      {translate(userNameErr).replace(
                        '[missing {{field}} value]',
                        translate('common.usernameOrEmail'),
                      )}
                    </Text>
                  ) : null}
                  <Inputfield
                    onRef={(ref) => {
                      this.inputs.password = ref;
                    }}
                    value={this.state.password}
                    placeholder={translate('common.loginPassword')}
                    returnKeyType={'done'}
                    //secureTextEntry={true}
                    isEyeIcon={true}
                    onChangeText={(password) => this.handlePassword(password)}
                    onSubmitEditing={() => {}}
                    status={'normal'}
                  />
                  {passwordErr !== null ? (
                    <Text
                      style={[globalStyles.smallLightText, styles.password]}>
                      {translate(passwordErr).replace(
                        '[missing {{field}} value]',
                        translate('common.password'),
                      )}
                    </Text>
                  ) : null}
                </View>

                {/* <TouchableOpacity
                  style={loginStyles.rememberContainer}
                  activeOpacity={1}
                  onPress={() => this.onCheckRememberMe()}>
                  <CheckBox
                    onCheck={() => this.onCheckRememberMe()}
                    isChecked={isRememberChecked}
                  />
                  <Text style={globalStyles.smallLightText}>
                    {translate('pages.login.rememberMe')}
                  </Text>
                </TouchableOpacity> */}
                <Button
                  type={'primary'}
                  title={translate('common.login')}
                  onPress={() => this.onLoginPress()}
                  loading={this.props.loading}
                  fontType={
                    selectedLanguageItem.language_name === 'ja'
                      ? 'normalRegular22Text'
                      : ''
                  }
                />
                <View style={styles.supportContainer}>
                  {selectedLanguageItem.language_name === 'ja' ? (
                    <View style={styles.supportSubContainer}>
                      <Text
                        numberOfLines={1}
                        style={[
                          globalStyles.smallLightText10,
                          styles.underlineText,
                        ]}
                        onPress={() =>
                          this.props.navigation.navigate('ForgotUsername')
                        }>
                        {' ' + translate('pages.xchat.username')}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          globalStyles.smallLightText10,
                          styles.supportText,
                        ]}>
                        {translate('pages.setting.or').toLowerCase()}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          globalStyles.smallLightText10,
                          styles.underlineText,
                        ]}
                        onPress={() =>
                          this.props.navigation.navigate('ForgotPassword')
                        }>
                        {translate('pages.xchat.password')}
                      </Text>
                      <Text style={globalStyles.smallLightText10}>
                        {translate('pages.xchat.forgot')}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.supportSubContainer}>
                      <Text style={globalStyles.smallLightText}>
                        {translate('pages.xchat.forgot')}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          globalStyles.smallLightText,
                          styles.underlineText,
                        ]}
                        onPress={() =>
                          this.props.navigation.navigate('ForgotUsername')
                        }>
                        {' ' + translate('pages.xchat.username')}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          globalStyles.smallLightText,
                          styles.supportText,
                        ]}>
                        {translate('pages.setting.or').toLowerCase()}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[
                          globalStyles.smallLightText,
                          styles.underlineText,
                        ]}
                        onPress={() =>
                          this.props.navigation.navigate('ForgotPassword')
                        }>
                        {translate('pages.xchat.password')}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View>
                <View style={styles.loginWithText}>
                  <Text style={globalStyles.smallLightText}>
                    {translate('pages.welcome.OrLoginWith')}
                  </Text>
                </View>
                <View style={styles.socialLoginContainer}>
                  {/*<SocialLogin*/}
                  {/*IconSrc={Icons.icon_apple}*/}
                  {/*onPress={() => this.appleLogin()}*/}
                  {/*/>*/}
                  <SocialLogin
                    IconSrc={Icons.icon_facebook}
                    onPress={() => this.firebaseFacebookLogin()}
                  />
                  <SocialLogin
                    IconSrc={Icons.icon_line}
                    onPress={() => this.firebaseLineLogin()}
                  />
                  <SocialLogin
                    IconSrc={Icons.icon_google}
                    onPress={() => this.firebaseGoogleLogin()}
                  />
                  <SocialLogin
                    IconSrc={Icons.icon_twitter}
                    onPress={() => this.firebaseTwitterLogin()}
                  />
                  <SocialLogin
                    IconSrc={Icons.icon_kakao}
                    onPress={() => this.kakaoLogin()}
                  />
                  {Platform.OS === 'ios' && (
                    <SocialLogin
                      IconSrc={Icons.icon_apple_logo}
                      onPress={() => this.appleLogin()}
                    />
                  )}
                </View>
                {/*{*/}
                {/*Platform.OS === 'ios' &&*/}
                {/*<View style={{alignSelf: 'center', width: '80%'}}>*/}
                {/*<Text style={selectedLanguageItem.language_name === 'ja' ? [globalStyles.normalLightText,{marginTop:10}] : [globalStyles.smallLightText,{marginTop:10,fontSize:14}]}>*/}
                {/*{translate('common.or')}*/}
                {/*</Text>*/}
                {/*<TouchableOpacity onPress={() => this.appleLogin()}*/}
                {/*style={{marginTop: 10, marginBottom: 10, backgroundColor: 'white', height: 48, borderRadius: 10, alignItems:'center', justifyContent: 'center'}}>*/}
                {/*<View style={{flexDirection: 'row'}}>*/}
                {/*<FontAwesome name={'apple'} size={20} color={Colors.black} style={{alignSelf: 'center'}}/>*/}
                {/*<View pointerEvents="none">*/}
                {/*<TextInput style={globalStyles.normalRegularText17}>*/}
                {/*{translate('common.continueWithApple')}*/}
                {/*</TextInput>*/}
                {/*</View>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}
                {/*</View>*/}
                {/*}*/}
              </View>
              <View style={styles.needSupportContainer}>
                <Text
                  style={[globalStyles.smallLightText, styles.underlineText]}
                  onPress={() => this.onNeedSupportClick()}>
                  {translate('pages.xchat.needSupport')}
                </Text>
              </View>
            </View>
            {isWebViewVisible && (
              <WebViewClass
                modalVisible={isWebViewVisible}
                url={supportUrl}
                closeModal={() => this.setState({isWebViewVisible: false})}
              />
            )}

            {isLoading && (
              <ActivityIndicator
                size={'large'}
                color={'white'}
                style={styles.loader}
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
    loading: state.loginReducer.loading,
  };
};

const mapDispatchToProps = {
  userLogin,
  getUserProfile,
  facebookRegister,
  twitterRegister,
  googleRegister,
  lineRegister,
  kakaoRegister,
  getSNSCheck,
  appleRegister,
  setCurrentChannel,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
