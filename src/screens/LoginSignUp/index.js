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
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
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
} from '../../redux/reducers/userReducer';

const {RNTwitterSignIn} = NativeModules;
const TwitterKeys = {
  TWITTER_CONSUMER_KEY: 'jswnBuBVPVSlItRYpNnzldDaM',
  TWITTER_CONSUMER_SECRET: 'vjYIzkKQR3DCRG1DNdAppfj3zbn48k2VECDVDRU8mKFn9Gfk5n',
};

class LoginSignUp extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      pushData: [],
      loggedIn: false,
    };
  }

  onSignUpPress() {
    this.props.navigation.navigate('SignUp');
  }

  onLoginPress() {
    this.props.navigation.navigate('Login');
  }

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '587597919962-0vgp633fs9es1sfu0ufnff8flv2291jl.apps.googleusercontent.com',
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

  firebaseGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo: userInfo, loggedIn: true});
      const credential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      const firebaseUserCredential = await auth().signInWithCredential(
        credential,
      );

      const socialLoginData = {
        code: userInfo.idToken,
        // access_token_secret: userInfo.idToken,
        // username: firebaseUserCredential.additionalUserInfo.profile.email,
        site_from: 'touku',
        // dev_id: "",
      };

      console.log(JSON.stringify(userInfo.idToken));

      this.props.googleRegister(socialLoginData).then((res) => {
        if (res.token) {
          this.props.navigation.navigate('Home');
        }
        if (res.user) {
          alert('something went wrong!');
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
    console.log('data.accessToken===========', data);
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // const data = {
    //   access_token: data.accessToken,
    //   code: data.accessToken,
    //   access_token_secret: '',
    //   // username: result.additionalUserInfo.username,
    //   site_from: 'touku',
    //   dev_id: '',
    // };

    // this.props.facebookRegister(socialLoginData).then((res) => {
    //   alert(JSON.stringify(res));
    //   console.log('JWT TOKEN=> ', JSON.stringify(res));
    // });

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
  }

  render() {
    const {orientation} = this.state;
    const {selectedLanguageItem} = this.props;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={globalStyles.container}
        resizeMode={'cover'}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingTop: orientation != 'PORTRAIT' ? 20 : 120,
            }}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
              }}>
              <Text style={globalStyles.logoText}>
                {translate('header.logoTitle')}
              </Text>
              <View
                style={{
                  flexDirection:
                    selectedLanguageItem.language_name != 'en'
                      ? 'row'
                      : 'column',
                  justifyContent: 'center',
                  marginBottom: 25,
                  marginTop: orientation != 'PORTRAIT' ? 0 : 50,
                }}>
                <Text style={[globalStyles.smallLightText, {marginEnd: 10}]}>
                  {translate('pages.welcome.theWorldIsConnected')}
                </Text>
                <Text style={globalStyles.smallLightText}>
                  {translate('pages.welcome.connectedByTouku')}
                </Text>
              </View>
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
              <View>
                {/* {!this.state.loggedIn && (
                  <Text>You are currently logged out</Text>
                )} */}
                {this.state.loggedIn && (
                  <Button
                    type={'primary'}
                    title={'Signout'}
                    onPress={() => this.signOut()}
                  />
                )}
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

const mapDispatchToProps = {facebookRegister, twitterRegister, googleRegister};

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignUp);
