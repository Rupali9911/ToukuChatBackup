import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import * as RNLocalize from 'react-native-localize';

import Button from '../../components/Button';
import Inputfield from '../../components/InputField';
import CheckBox from '../../components/CheckBox';
import {Colors, Images, Icons} from '../../constants';
import Header from '../../components/Header';
import {loginStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {SocialLogin} from '../LoginSignUp';
import {globalStyles} from '../../styles';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {userLogin} from '../../redux/reducers/userReducer';

class Login extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      isRememberChecked: false,
      isCheckLanguages: false,
      username: '',
      password: '',
      authError: '',
      userNameStatus: 'normal',
      passwordStatus: 'normal',
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    Orientation.addOrientationListener(this._orientationDidChange);

    // fetch('https://touku.angelium.net/api/jwt/api-token-auth-xana/', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     dev_id: '',
    //     email: 'new.register@angelium.net',
    //     password: 'Test@123',
    //     rememberMe: false,
    //   }),
    // })
    //   .then((response) => alert(JSON.stringify(response)))
    //   .catch((err) => alert(JSON.stringify(err)));
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
      alert(JSON.stringify(userInfo));
      const credential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
        userInfo.accessToken,
      );
      const firebaseUserCredential = await auth().signInWithCredential(
        credential,
      );

      console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (error) {
      alert(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('operation (f.e. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('play services not available or outdated');
      } else {
        alert('some other error happened');
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

  firebaseFacebookLogin() {
    console.log('facebook tapped');
    this.onFacebookButtonPress().then((result) =>
      console.log('Signed in with facebook!', JSON.stringify(result)),
    );
  }

  async onFacebookButtonPress() {
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
    console.log('data.accessToken===========', data.accessToken);
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
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
    const {authToken, authTokenSecret} = await RNTwitterSignIn.logIn();

    // Create a Twitter credential with the tokens
    const twitterCredential = auth.TwitterAuthProvider.credential(
      authToken,
      authTokenSecret,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(twitterCredential);
    // RNTwitterSignIn.init(
    //   TwitterKeys.TWITTER_CONSUMER_KEY,
    //   TwitterKeys.TWITTER_CONSUMER_SECRET,
    // );
    // RNTwitterSignIn.logIn()
    //   .then(function (loginData) {
    //     var accessToken = auth.TwitterAuthProvider.credential(
    //       loginData.authToken,
    //       loginData.authTokenSecret,
    //     );
    //     handleFirebaseLogin(accessToken);
    //   })
    //   .catch(function (error) {
    //     alert(error);
    //   });
  }

  handleUserName = (username) => {
    this.setState({username});
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let isValid = true;

    if (username.length <= 0) {
      isValid = false;
      this.setState({userNameStatus: 'wrong'});
    } else if (reg.test(username) === false) {
      isValid = false;
      this.setState({userNameStatus: 'wrong'});
    }
    if (isValid) {
      this.setState({userNameStatus: 'right'});
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

  onLoginPress() {
    this.setState({authError: ''});
    const {username, password, isRememberChecked} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let isValid = true;

    if (username.length <= 0) {
      isValid = false;
      this.setState({userNameStatus: 'wrong'});
    } else if (reg.test(username) === false) {
      isValid = false;
      this.setState({userNameStatus: 'wrong'});
    } else {
      this.setState({userNameStatus: 'right'});
    }

    if (password.length < 6) {
      isValid = false;
      this.setState({passwordStatus: 'wrong'});
    } else {
      this.setState({passwordStatus: 'right'});
    }

    if (isValid) {
      let loginData = {
        dev_id: '',
        email: username,
        password: password,
        rememberMe: isRememberChecked,
      };
      this.props.userLogin(loginData).then((res) => {
        if (res.token) {
          this.props.navigation.navigate('Home');
        }
        if (res.user) {
          this.setState({authError: res.user});
        }
      });
    }
  }

  render() {
    const {
      isRememberChecked,
      isCheckLanguages,
      orientation,
      authError,
      userNameStatus,
      passwordStatus,
    } = this.state;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <ScrollView
            contentContainerStyle={loginStyles.scrollView}
            showsVerticalScrollIndicator={false}>
            <Header
              onBackPress={() => this.props.navigation.goBack()}
              isChecked={isCheckLanguages}
              onLanguageSelectPress={() => this.onLanguageSelectPress()}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: orientation !== 'PORTRAIT' ? 50 : 0,
                paddingTop: orientation !== 'PORTRAIT' ? 0 : 60,
              }}>
              <Text style={globalStyles.logoText}>
                {translate('header.logoTitle')}
              </Text>
              <View style={{paddingTop: orientation !== 'PORTRAIT' ? 0 : 40}}>
                <Inputfield
                  value={this.state.username}
                  placeholder={translate('common.username')}
                  returnKeyType={'next'}
                  onChangeText={(username) => this.handleUserName(username)}
                  onSubmitEditing={() => {
                    this.focusNextField('password');
                  }}
                  status={userNameStatus}
                />
                <Inputfield
                  onRef={(ref) => {
                    this.inputs['password'] = ref;
                  }}
                  value={this.state.password}
                  placeholder={translate('pages.register.loginPassword')}
                  returnKeyType={'done'}
                  secureTextEntry={true}
                  onChangeText={(password) => this.handlePassword(password)}
                  onSubmitEditing={() => {}}
                  status={passwordStatus}
                />

                {authError !== '' ? (
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
                    {authError}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
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
              </TouchableOpacity>
              <Button
                type={'primary'}
                title={translate('common.login')}
                onPress={() => this.onLoginPress()}
              />
              <View
                style={{
                  flexDirection: 'row',
                  // alignSelf: 'center',
                  marginTop: 15,
                  justifyContent: 'space-between',
                  paddingHorizontal: 10,
                }}>
                <View>
                  <Text
                    style={[
                      globalStyles.smallLightText,
                      {textDecorationLine: 'underline'},
                    ]}>
                    {'Need Support?'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
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
                    style={[
                      globalStyles.smallLightText,
                      {marginHorizontal: 5},
                    ]}>
                    {translate('pages.setting.or')}
                  </Text>
                  <Text
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
                  onPress={() => alert('line clicked')}
                />
                <SocialLogin
                  IconSrc={Icons.icon_google}
                  onPress={() => this.firebaseGoogleLogin()}
                />
                <SocialLogin
                  IconSrc={Icons.icon_twitter}
                  onPress={() => this.firebaseTwitterLogin()}
                />
              </View>
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
  };
};

const mapDispatchToProps = {
  userLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
