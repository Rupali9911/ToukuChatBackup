import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  NativeModules,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import LineLogin from 'react-native-line-sdk';
import auth from '@react-native-firebase/auth';
import * as RNLocalize from 'react-native-localize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Button from '../../components/Button';
import Inputfield from '../../components/InputField';
import CheckBox from '../../components/CheckBox';
import {Colors, Images, Icons} from '../../constants';
import {BackHeader} from '../../components/Headers';
import {loginStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {SocialLogin} from '../LoginSignUp';
import {globalStyles} from '../../styles';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {
  getUserProfile,
  facebookRegister,
  googleRegister,
  twitterRegister,
  lineRegister,
  kakaoRegister,
} from '../../redux/reducers/userReducer';
import {userLogin} from '../../redux/reducers/loginReducer';
import Toast from '../../components/Toast';
import AsyncStorage from '@react-native-community/async-storage';
import KakaoLogins from '@react-native-seoul/kakao-login';
const {RNTwitterSignIn} = NativeModules;

import appleAuth, {
    AppleButton,
    AppleAuthRequestScope,
    AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

import {getSNSCheck} from '../../redux/reducers/loginReducer';
import {getParamsFromURL} from '../../utils'

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
      this.checkSNSVisibility()
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

    checkSNSVisibility(){
        this.props.getSNSCheck().then((url)=> {
            const { hide_sns } = getParamsFromURL(url)
            if (hide_sns === 'true'){
                this.setState({showSNS: false})
            }else{
                this.setState({showSNS: true})
            }
        })
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
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo: userInfo, loggedIn: true});

      const googleLoginData = {
        code: userInfo.idToken,
        access_token_secret: userInfo.idToken,
        site_from: 'touku',
        dev_id: '',
      };
      this.props.googleRegister(googleLoginData).then(async (res) => {
        console.log('JWT TOKEN=> ', JSON.stringify(res));
        if (res.token) {
          let status = res.status;
          let isEmail = res.email_required;
          if (!status) {
            if (isEmail) {
              this.props.navigation.navigate('SignUp', {
                pageNumber: 1,
                isSocial: true,
              });
              return;
            }
            this.props.navigation.navigate('SignUp', {
              pageNumber: 2,
              isSocial: true,
            });
            return;
          }
          await AsyncStorage.setItem('userToken', res.token);
          await AsyncStorage.removeItem('socialToken');
          this.props.navigation.navigate('Chat');
          return;
        }
        if (res.user) {
          // alert('something went wrong!');
        }
      });
    } catch (error) {
      // alert(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // alert('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // alert('operation (f.e. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // alert('play services not available or outdated');
      } else {
        // alert('some other error happened');
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

    auth()
      .signInWithCredential(facebookCredential)
      .then((res) => {
        console.log('Facebook response', JSON.stringify(res));
        const facebookLoginData = {
          access_token: data.accessToken,
          code: data.accessToken,
          access_token_secret: data.accessToken,
          // username: result.additionalUserInfo.username,
          site_from: 'touku',
          dev_id: '',
        };
        console.log(
          'LoginSignUp -> firebaseFacebookLogin -> facebookLoginData',
          facebookLoginData,
        );
        this.props.facebookRegister(facebookLoginData).then(async (res) => {
          console.log('JWT TOKEN=> ', JSON.stringify(res));
          if (res.token) {
            let status = res.status;
            let isEmail = res.email_required;
            if (!status) {
              if (isEmail) {
                this.props.navigation.navigate('SignUp', {
                  pageNumber: 1,
                  isSocial: true,
                });
                return;
              }
              this.props.navigation.navigate('SignUp', {
                pageNumber: 2,
                isSocial: true,
              });
              return;
            }
            await AsyncStorage.setItem('userToken', res.token);
            await AsyncStorage.removeItem('socialToken');
            this.props.navigation.navigate('Chat');
            return;
          }
          if (res.user) {
            // alert('something went wrong!');
          }
        });
      })
      .catch((err) => {});
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
    return auth()
      .signInWithCredential(twitterCredential)
      .then((res) => {
        console.log('twitter response data==> ', JSON.stringify(res));
        const twitterLoginData = {
          access_token: authToken,
          access_token_secret: authTokenSecret,
          // username: result.additionalUserInfo.username,
          site_from: 'touku',
          dev_id: '',
          username: userName,
        };

        this.props.twitterRegister(twitterLoginData).then(async (res) => {
          console.log('JWT TOKEN=> ', JSON.stringify(res));
          if (res.token) {
            let status = res.status;
            let isEmail = res.email_required;
            if (!status) {
              if (isEmail) {
                this.props.navigation.navigate('SignUp', {
                  pageNumber: 1,
                  isSocial: true,
                });
                return;
              }
              this.props.navigation.navigate('SignUp', {
                pageNumber: 2,
                isSocial: true,
              });
              return;
            }
            await AsyncStorage.setItem('userToken', res.token);
            await AsyncStorage.removeItem('socialToken');
            this.props.navigation.navigate('Chat');
            return;
          }
          if (res.user) {
            // alert('something went wrong!');
          }
        });
      });
  }

  async firebaseLineLogin() {
    console.log('LoginSignUp -> firebaseLineLogin -> firebaseLineLogin');

    if (Platform.OS === 'ios') {
      let arrPermissions = ['profile', 'openid', 'email'];
      LineLogin.loginWithPermissions(arrPermissions)
        .then((user) => {
          console.log(user);
          const lineLoginData = {
            email: user.idToken.email,
            code: '',
            access_token: user.accessToken.accessToken,
            dev_id: '',
            site_from: 'touku',
          };
          console.log(
            'LoginSignUp -> firebaseLineLogin -> lineLoginData',
            lineLoginData,
          );
          this.props.lineRegister(lineLoginData).then(async (res) => {
            console.log('JWT TOKEN=> ', JSON.stringify(res));
            if (res.token) {
              let status = res.status;
              let isEmail = res.email_required;
              if (!status) {
                if (isEmail) {
                  this.props.navigation.navigate('SignUp', {
                    pageNumber: 1,
                    isSocial: true,
                  });
                  return;
                }
                this.props.navigation.navigate('SignUp', {
                  pageNumber: 2,
                  isSocial: true,
                });
                return;
              }
              await AsyncStorage.setItem('userToken', res.token);
              await AsyncStorage.removeItem('socialToken');
              this.props.navigation.navigate('Chat');
              return;
            }
            if (res.user) {
              // alert('something went wrong!');
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      LineLogin.login()
        .then((user) => {
          console.log(user);
          const lineLoginData = {
            code: '',
            access_token: user.accessToken.accessToken,
            dev_id: '',
            site_from: 'touku',
          };
          console.log(
            'LoginSignUp -> firebaseLineLogin -> lineLoginData',
            lineLoginData,
          );
          this.props.lineRegister(lineLoginData).then(async (res) => {
            console.log('JWT TOKEN=> ', JSON.stringify(res));
            if (res.token) {
              let status = res.status;
              let isEmail = res.email_required;
              if (!status) {
                if (isEmail) {
                  this.props.navigation.navigate('SignUp', {
                    pageNumber: 1,
                    isSocial: true,
                  });
                  return;
                }
                this.props.navigation.navigate('SignUp', {
                  pageNumber: 2,
                  isSocial: true,
                });
                return;
              }
              await AsyncStorage.setItem('userToken', res.token);
              await AsyncStorage.removeItem('socialToken');
              this.props.navigation.navigate('Chat');
              return;
            }
            if (res.user) {
              // alert('something went wrong!');
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  kakaoLogin() {
    console.log('kakaoLogin');
    KakaoLogins.login()
      .then((result) => {
        console.log('result kakaoLogin', result);
        const kakaoLoginData = {
          code: '',
          access_token: result.accessToken,
          dev_id: '',
          site_from: 'touku',
        };
        console.log('kakao request', kakaoLoginData);
        this.props.kakaoRegister(kakaoLoginData).then(async (res) => {
          console.log('JWT TOKEN=> ', JSON.stringify(res));
          if (res.token) {
            let status = res.status;
            if (!status) {
              this.props.navigation.navigate('SignUp', {
                pageNumber: 2,
                isSocial: true,
              });
              return;
            }
            await AsyncStorage.setItem('userToken', res.token);
            await AsyncStorage.removeItem('socialToken');
            this.props.navigation.navigate('Home');
            return;
          }
        });
      })
      .catch((err) => {
        console.log('Error kakaoLogin', err);
        if (err.code === 'E_CANCELLED_OPERATION') {
          //logCallback(`Login Cancelled:${err.message}`, setLoginLoading(false));
        } else {
          // logCallback(
          //     `Login Failed:${err.code} ${err.message}`,
          //     setLoginLoading(false),
          // );
        }
      });
  }

  handleUserName = (username) => {
    this.setState({username});
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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

  onLoginPress() {
    this.setState({userNameErr: null, passwordErr: null});
    const {username, password, isRememberChecked} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

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
      let loginData = {
        dev_id: '',
        email: username,
        password: password,
        rememberMe: true,
      };
      this.props
        .userLogin(loginData)
        .then((res) => {
          if (res.token) {
            this.props.getUserProfile().then((res) => {
              if (res.id) {
                this.props.navigation.navigate('Chat');
              }
            });
          }
          if (res.user) {
            Toast.show({
              title: 'Login Failed',
              text: 'User Not Exist or Incorrect Password',
              type: 'primary',
            });
            this.setState({authError: res.user});
          }
        })
        .catch((err) => {
          Toast.show({
            title: 'Login Failed',
            text: 'User Not Exist',
            type: 'primary',
          });
        });
    }
  }

  onNeedSupportClick() {
    this.props.navigation.navigate('NeedSupport');
  }

    appleLogin (){
        this.onAppleButtonPress()
    }
    async onAppleButtonPress() {
        // 1). start a apple sign-in request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
        });

        // 2). if the request was successful, extract the token and nonce
        const { identityToken, nonce } = appleAuthRequestResponse;

        console.log('appleAuthRequestResponse', appleAuthRequestResponse)
        // can be null in some scenarios
        if (identityToken) {
            // 3). create a Firebase `AppleAuthProvider` credential
            const appleCredential = auth.auth.AppleAuthProvider.credential(identityToken, nonce);

            // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
            //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
            //     to link the account to an existing user
            const userCredential = await auth.auth().signInWithCredential(appleCredential);

            // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
            console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
        } else {
            // handle this - retry?

        }
    }

  render() {
    const {
      isRememberChecked,
      isCheckLanguages,
      orientation,
      userNameStatus,
      passwordStatus,
      userNameErr,
      passwordErr,
        showSNS
    } = this.state;
    return (
      <ImageBackground
          //source={Images.image_touku_bg}
          source={Platform.isPad ? Images.image_touku_bg :  Images.image_touku_bg_phone}
        style={globalStyles.container}>
        <SafeAreaView
          pointerEvents={this.props.loading ? 'none' : 'auto'}
          style={globalStyles.safeAreaView}>
          <KeyboardAwareScrollView
            contentContainerStyle={[
              loginStyles.scrollView,
              {flex: Platform.isPad ? 1 : 0},
            ]}
            showsVerticalScrollIndicator={false}>
            <BackHeader
              onBackPress={() => this.props.navigation.goBack()}
              isChecked={isCheckLanguages}
              onLanguageSelectPress={() => this.onLanguageSelectPress()}
            />
            <View
              style={{
                flex: 1,
                width: Platform.isPad ? '75%' : '100%',
                alignSelf: 'center',
                justifyContent: 'center',
                paddingHorizontal: orientation !== 'PORTRAIT' ? 50 : 0,
                paddingTop:
                  orientation !== 'PORTRAIT'
                    ? 0
                    : Platform.OS === 'ios'
                    ? 60
                    : 0,
              }}>
              <Text style={globalStyles.logoText}>
                {translate('header.logoTitle')}
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: Platform.isPad ? 'center' : 'flex-start',
                }}>
                <View
                  style={{
                    paddingTop:
                      orientation !== 'PORTRAIT'
                        ? 0
                        : Platform.OS === 'ios'
                        ? 40
                        : 0,
                  }}>
                  <Inputfield
                    value={this.state.username}
                    placeholder={translate('common.usernameEmail')}
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
                        {
                          textAlign: 'left',
                          marginTop: -10,
                          marginStart: 10,
                          marginBottom: 5,
                        },
                      ]}>
                      {translate(userNameErr).replace(
                        '[missing {{field}} value]',
                        translate('common.usernameEmail'),
                      )}
                    </Text>
                  ) : null}
                  <Inputfield
                    onRef={(ref) => {
                      this.inputs['password'] = ref;
                    }}
                    value={this.state.password}
                    placeholder={translate('common.loginPassword')}
                    returnKeyType={'done'}
                    secureTextEntry={true}
                    onChangeText={(password) => this.handlePassword(password)}
                    onSubmitEditing={() => {}}
                    status={'normal'}
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
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 15,
                    justifyContent: 'space-between',
                    paddingHorizontal: 5,
                  }}>
                  <View style={{alignItems: 'flex-start'}}>
                    <Text
                      style={[
                        globalStyles.smallLightText,
                        {textDecorationLine: 'underline'},
                      ]}
                      onPress={() => this.onNeedSupportClick()}>
                      {translate('pages.xchat.needSupport')}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'flex-end',
                      flexDirection:
                        this.props.selectedLanguageItem.language_name ===
                          'ja' && orientation === 'PORTRAIT'
                          ? 'column'
                          : 'row',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallLightText,
                        {textDecorationLine: 'underline'},
                      ]}
                      onPress={() =>
                        this.props.navigation.navigate('ForgotUsername')
                      }>
                      {translate('common.username')}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallLightText,
                        {marginHorizontal: 5},
                      ]}>
                      {translate('pages.setting.or')}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        globalStyles.smallLightText,
                        {textDecorationLine: 'underline'},
                      ]}
                      onPress={() =>
                        this.props.navigation.navigate('ForgotPassword')
                      }>
                      {translate('common.password')}
                    </Text>
                    <Text style={globalStyles.smallLightText}>
                      {' ' + translate('common.forgot')}
                    </Text>
                  </View>
                </View>
                  {
                      showSNS &&
                      <View>
                          <View style={{marginTop: 25}}>
                              <Text style={globalStyles.smallLightText}>
                                  {translate('pages.welcome.OrLoginWith')}
                              </Text>
                          </View>
                          <View
                              style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  marginTop: 20,
                              }}>
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
                              {/*<SocialLogin*/}
                                  {/*IconSrc={Icons.icon_apple}*/}
                                  {/*onPress={() => this.appleLogin()}*/}
                              {/*/>*/}
                          </View>
                      </View>
                  }
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
    getSNSCheck

};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
