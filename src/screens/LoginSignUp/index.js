import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import * as RNLocalize from 'react-native-localize';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import Header from '../../components/Header';
import Button from '../../components/Button';
import {Images, Icons} from '../../constants';
import {loginSignUpStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';

class LoginSignUp extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguage);
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

  render() {
    const {orientation} = this.state;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={loginSignUpStyles.container}
        resizeMode={'cover'}>
        <SafeAreaView style={loginSignUpStyles.safeAreaView}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              padding: 20,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
              }}>
              <View style={{marginBottom: 25}}>
                <Text style={loginSignUpStyles.text}>
                  {translate('pages.welcome.theWorldIsConnected')}
                </Text>
                <Text style={loginSignUpStyles.text}>
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
              <View style={{marginTop: 25}}>
                <Text style={loginSignUpStyles.text}>
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
                  onPress={() => alert('twitter clicked')}
                />
              </View>
              <View style={loginSignUpStyles.buttonContainer}>
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

const SocialLogin = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.6}>
      <Image source={props.IconSrc} style={loginSignUpStyles.iconStyle} />
    </TouchableOpacity>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedLanguage: state.languageReducer.selectedLanguage,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignUp);
