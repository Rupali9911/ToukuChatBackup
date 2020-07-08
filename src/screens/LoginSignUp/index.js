import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  SafeAreaView,
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
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import Button from '../../components/Button';
import {Images, Icons} from '../../constants';
import {loginSignUpStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';

import {
  facebookRegister,
  googleRegister,
  twitterRegister,
  lineRegister,
  kakaoRegister,
  getAccessCodeKakao,
} from '../../redux/reducers/userReducer';
import AsyncStorage from '@react-native-community/async-storage';
const {RNTwitterSignIn} = NativeModules;
import KakaoLogins from '@react-native-seoul/kakao-login';

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

class LoginSignUp extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      pushData: [],
      loggedIn: false,
        showSNS: false
    };
  }

  onSignUpPress() {
    this.props.navigation.navigate('SignUp', {
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
    this.checkSNSVisibility()
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
  firebaseGoogleLogin = async () => {
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
          this.props.navigation.navigate('Home');
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
              // if (isEmail) {
              //   this.props.navigation.navigate('SignUp', {
              //     pageNumber: 1,
              //     isSocial: true,
              //   });
              //   return;
              // }
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
          if (res.user) {
            // alert('something went wrong!');
          }
        });
      })
      .catch((err) => {});
  }

  async firebaseTwitterLogin() {
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
            this.props.navigation.navigate('Home');
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
              this.props.navigation.navigate('Home');
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
              this.props.navigation.navigate('Home');
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
    const {orientation, showSNS} = this.state;
    const {selectedLanguageItem} = this.props;
    return (
      <ImageBackground
          //source={Images.image_touku_bg}
          source={Platform.isPad ? Images.image_touku_bg :  Images.image_touku_bg_phone}
        style={globalStyles.container}
        resizeMode={'cover'}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <ScrollView
            contentContainerStyle={{
              flex: Platform.isPad ? 1 : 0,
              padding: 20,
              paddingTop:
                orientation != 'PORTRAIT'
                  ? 50
                  : Platform.OS === 'ios'
                  ? 120
                  : 90,
            }}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
                width: Platform.isPad ? '60%' : '100%',
                alignSelf: 'center',
              }}>
              <Text style={globalStyles.logoText}>
                {translate('header.logoTitle')}
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: Platform.isPad ? 'center' : 'flex-start',
                  alignItems: 'center',
                  marginTop:
                    orientation != 'PORTRAIT' || Platform.isPad ? 0 : 50,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 25,
                  }}>
                  <Text style={[globalStyles.smallLightText, {marginEnd: 10}]}>
                    {translate('pages.welcome.theWorldIsConnected')}
                  </Text>
                  <Text style={globalStyles.smallLightText}>
                    {translate('pages.welcome.connectedByTouku')}
                  </Text>
                </View>
                <View
                  style={{
                    width: Platform.isPad ? '45%' : '100%',
                  }}>
                  <Button
                    type={'transparent'}
                    title={translate('common.login')}
                    onPress={() => this.onLoginPress()}
                  />
                  <Button
                    type={'primary'}
                    title={translate('pages.welcome.signUp')}
                    onPress={() => this.onSignUpPress()}
                  />
                </View>
                  {
                      showSNS &&
                          <View>
                <View style={{marginTop: 30, marginBottom: 10}}>
                  <Text style={globalStyles.smallLightText}>
                    {translate('pages.welcome.OrLoginWith')}
                  </Text>
                </View>
                      <View
                          style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              marginTop: 10,
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
        style={[globalStyles.iconStyle, {marginHorizontal: 10}]}
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
    getSNSCheck
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignUp);
