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
  Image,
  ImageBackground,
  NativeModules,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import LineLogin from 'react-native-line-sdk';
import * as RNLocalize from 'react-native-localize';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import LanguageSelector from '../../components/LanguageSelector';
import Toast from '../../components/Toast';
import {Icons, Images} from '../../constants';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {getSNSCheck} from '../../redux/reducers/loginReducer';
import {
  appleRegister,
  facebookRegister,
  getAccessCodeKakao,
  googleRegister,
  kakaoRegister,
  lineRegister,
  twitterRegister,
} from '../../redux/reducers/userReducer';
import {globalStyles} from '../../styles';
import {getParamsFromURL} from '../../utils';
import styles from './styles';

const {RNTwitterSignIn} = NativeModules;

const TwitterKeys = {
  TWITTER_CONSUMER_KEY: 'BvR9GWViH6r35PXtNHkV5MCxd',
  TWITTER_CONSUMER_SECRET: '2R6vK7nCsWIYneFgmlvBQUSbajD1djiYMIFLwwElZMYaa3r6Q8',
};

class LoginSignUp extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      pushData: [],
      loggedIn: false,
      showSNS: false,
    };
  }

  onSignUpPress() {
    this.props.navigation.navigate('SignUp', {
      showEmail: true,
      pageNumber: 0,
      isSocial: false,
    });
  }

  onLoginPress() {
    this.props.navigation.navigate('Login');
  }

  UNSAFE_componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    // this.checkSNSVisibility()
    GoogleSignin.configure({
      webClientId:
        '185609886814-rderde876lo4143bas6l1oj22qoskrdl.apps.googleusercontent.com',
    });
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
    Orientation.getOrientation((err, orientation) => {
      console.log(`Current Device Orientation: ${orientation}`);
      if (err) {
        console.err(err);
      }
    });

    Orientation.removeOrientationListener(this._orientationDidChange);
  }

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
  firebaseGoogleLogin = async () => {
    this.setState({isLoading: true});
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo: userInfo, loggedIn: true});
      // const credential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      // const firebaseUserCredential = await auth().signInWithCredential(
      //   credential,
      // );
      // console.log(JSON.stringify(userInfo));
      const googleLoginData = {
        code: userInfo.idToken,
        access_token_secret: userInfo.idToken,
        // username: firebaseUserCredential.additionalUserInfo.profile.email,
        site_from: 'touku',
        dev_id: fcmToken ? fcmToken : '',
      };
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
            return;
          }
          if (res.error) {
            Toast.show({
              title: 'Login Failed',
              text: translate(res.error.toString()),
              type: 'primary',
            });
          }
        })
        .catch((err) => {
          this.setState({isLoading: false});
          if (err.response) {
            // console.log(err.response)
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
                  showEmail: false,
                  isSocial: true,
                });
                return;
              }
              await AsyncStorage.setItem('userToken', response.token);
              await AsyncStorage.removeItem('socialToken');
              this.props.navigation.navigate('App');
              return;
            }
            if (response.error) {
              Toast.show({
                title: 'Login Failed',
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

  async firebaseTwitterLogin() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
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

    console.log('TWITTER TOKEN:-- ', authToken);

    // Sign-in the user with the credential
    auth()
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
        console.log('twitterLoginData==> ', twitterLoginData);
        this.props
          .twitterRegister(twitterLoginData)
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
                  showEmail: false,
                  isSocial: true,
                });
                return;
              }
              await AsyncStorage.setItem('userToken', response.token);
              await AsyncStorage.removeItem('socialToken');
              this.props.navigation.navigate('App');
              return;
            }
            if (response.error) {
              Toast.show({
                title: 'Login Failed',
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

  async firebaseLineLogin() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('LoginSignUp -> firebaseLineLogin -> firebaseLineLogin');

    if (Platform.OS === 'ios') {
      let arrPermissions = ['profile', 'openid', 'email'];

      LineLogin.loginWithPermissions(arrPermissions)
        .then((user) => {
          this.setState({isLoading: true});
          console.log(user);
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
                return;
              }
              if (res.error) {
                Toast.show({
                  title: 'Login Failed',
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
                return;
              }
              if (res.error) {
                Toast.show({
                  title: 'Login Failed',
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
                title: 'Login Failed',
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
          return;
        }
        if (res.error) {
          Toast.show({
            title: 'Login Failed',
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
    const {orientation, isLoading} = this.state;
    const {selectedLanguageItem} = this.props;

    const scrollContentContainerPadding =
      orientation !== 'PORTRAIT' ? 50 : Platform.OS === 'ios' ? 120 : 90;

    const containerPadding = orientation !== 'PORTRAIT' ? 50 : 0;

    const subContainerMargin =
      orientation !== 'PORTRAIT' || Platform.isPad ? 0 : 50;

    return (
      <ImageBackground
        //source={Images.image_touku_bg}
        source={
          Platform.isPad ? Images.image_touku_bg : Images.image_touku_bg_phone
        }
        style={globalStyles.container}
        resizeMode={'cover'}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <ScrollView
            contentContainerStyle={[
              {
                paddingTop: scrollContentContainerPadding,
              },
              styles.scrollContentContainer,
            ]}
            showsVerticalScrollIndicator={false}>
            <View
              style={[
                {
                  paddingHorizontal: containerPadding,
                },
                styles.container,
              ]}>
              <Text style={globalStyles.logoText}>
                {translate('header.logoTitle')}
              </Text>
              <View
                style={[{marginTop: subContainerMargin}, styles.subContainer]}>
                <View style={styles.connectedContainer}>
                  <Text
                    style={[
                      selectedLanguageItem.language_name === 'ja'
                        ? globalStyles.normalLightText
                        : globalStyles.smallLightText,
                      styles.theWorldIsConnectedText,
                    ]}>
                    {translate('pages.welcome.theWorldIsConnected')}
                  </Text>
                  <Text
                    style={[
                      selectedLanguageItem.language_name === 'ja'
                        ? globalStyles.normalLightText
                        : globalStyles.smallLightText,
                      styles.connectedByToukuText,
                    ]}>
                    {translate('pages.welcome.connectedByTouku')}
                  </Text>
                </View>
                <View style={styles.loginContainer}>
                  <Button
                    type={'transparent'}
                    title={translate('common.login')}
                    onPress={() => this.onLoginPress()}
                    fontType={
                      selectedLanguageItem.language_name === 'ja'
                        ? 'normalRegular22Text'
                        : ''
                    }
                  />
                  <Button
                    type={'primary'}
                    title={translate('pages.welcome.signUp')}
                    onPress={() => this.onSignUpPress()}
                    fontType={
                      selectedLanguageItem.language_name === 'ja'
                        ? 'normalRegular22Text'
                        : ''
                    }
                  />
                </View>
              </View>
              <View>
                <View style={styles.loginWithContainer}>
                  <Text
                    style={
                      selectedLanguageItem.language_name === 'ja'
                        ? globalStyles.normalLightText
                        : globalStyles.smallLightText
                    }>
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
                {/*{Platform.OS === 'ios' && (*/}
                {/*<View style={{alignSelf: 'center', width: '80%'}}>*/}
                {/*<Text*/}
                {/*style={*/}
                {/*selectedLanguageItem.language_name === 'ja'*/}
                {/*? [globalStyles.normalLightText, {marginTop: 10}]*/}
                {/*: [*/}
                {/*globalStyles.smallLightText,*/}
                {/*{marginTop: 10, fontSize: 14},*/}
                {/*]*/}
                {/*}>*/}
                {/*{translate('common.or')}*/}
                {/*</Text>*/}
                {/*<TouchableOpacity*/}
                {/*onPress={() => this.appleLogin()}*/}
                {/*style={{*/}
                {/*marginTop: 10,*/}
                {/*marginBottom: 10,*/}
                {/*backgroundColor: 'white',*/}
                {/*height: 48,*/}
                {/*borderRadius: 10,*/}
                {/*alignItems: 'center',*/}
                {/*justifyContent: 'center',*/}
                {/*}}>*/}
                {/*<View style={{flexDirection: 'row'}}>*/}
                {/*<FontAwesome*/}
                {/*name={'apple'}*/}
                {/*size={20}*/}
                {/*color={Colors.black}*/}
                {/*style={{alignSelf: 'center'}}*/}
                {/*/>*/}
                {/*<View pointerEvents="none">*/}
                {/*<TextInput*/}
                {/*style={globalStyles.normalRegularText17}>*/}
                {/*{translate('common.continueWithApple')}*/}
                {/*</TextInput>*/}
                {/*</View>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}
                {/*</View>*/}
                {/*)}*/}
              </View>
            </View>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color="white"
                style={styles.loader}
              />
            )}
            <LanguageSelector />
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

export const SocialLogin = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.6}>
      <Image
        source={props.IconSrc}
        style={[globalStyles.iconStyle, styles.socialLoginImage]}
      />
    </TouchableOpacity>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {
  facebookRegister,
  twitterRegister,
  googleRegister,
  lineRegister,
  kakaoRegister,
  getAccessCodeKakao,
  getSNSCheck,
  appleRegister,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignUp);
