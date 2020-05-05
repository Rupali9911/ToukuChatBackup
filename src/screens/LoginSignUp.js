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
import auth from '@react-native-firebase/auth';
import * as RNLocalize from 'react-native-localize';
import {setI18nConfig, translate} from '../redux/reducers/languageReducer';
import Header from '../components/Header';
import Button from '../components/Button';
import {Images} from '../constants';

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

  HandleGo() {
    console.log('GO tapped');
    this.onGoogleButtonPress().then((result) =>
      alert('Signed in with Google!', result),
    );
  }

  async onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    console.log('idToken', idToken);
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log('googleCredential', googleCredential);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

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

  onLanguageSelectPress() {
    // if (this.state.isCheckLanguages) {
    //   setI18nConfig('ja');
    // } else {
    //   setI18nConfig('en');
    // }
    this.setState((prevState) => {
      return {
        isCheckLanguages: !prevState.isCheckLanguages,
      };
    });
  }

  // componentDidMount() {
  //   GoogleSignin.configure({
  //     webClientId:
  //       '587597919962-0vgp633fs9es1sfu0ufnff8flv2291jl.apps.googleusercontent.com', //For Android
  //     // '27210262657-g7rscl500jb3p5doogfu6a2jfvks5rsj.apps.googleusercontent.com', //For iOS
  //     offlineAccess: true,
  //     hostedDomain: '',
  //     loginHint: '',
  //     forceConsentPrompt: true,
  //     accountName: '',
  //   });
  //   RNLocalize.addEventListener('change', this.handleLocalizationChange);
  // }

  // firebaseGoogleLogin = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     this.setState({userInfo: userInfo, loggedIn: true});
  //     alert(userInfo);
  //     const credential = auth.GoogleAuthProvider.credential(
  //       userInfo.idToken,
  //       userInfo.accessToken,
  //     );
  //     const firebaseUserCredential = await auth().signInWithCredential(
  //       credential,
  //     );

  //     console.warn(JSON.stringify(firebaseUserCredential.user.toJSON()));
  //   } catch (error) {
  //     alert(error);
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       alert('user cancelled the login flow');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       alert('operation (f.e. sign in) is in progress already');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       alert('play services not available or outdated');
  //     } else {
  //       alert('some other error happened');
  //     }
  //   }
  // };

  // _signIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     this.setState({userInfo: userInfo, loggedIn: true});
  //     alert(userInfo);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       alert('user cancelled the login flow');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       alert('operation (f.e. sign in) is in progress already');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       alert('play services not available or outdated');
  //     } else {
  //       alert('some other error happened');
  //     }
  //   }
  // };

  // getCurrentUserInfo = async () => {
  //   try {
  //     const userInfo = await GoogleSignin.signInSilently();
  //     this.setState({userInfo});
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_REQUIRED) {
  //       alert('user has not signed in yet');
  //       this.setState({loggedIn: false});
  //     } else {
  //       alert('some other error happened');
  //       this.setState({loggedIn: false});
  //     }
  //   }
  // };

  // signOut = async () => {
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //     this.setState({user: null, loggedIn: false});
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  render() {
    const {isCheckLanguages, orientation} = this.state;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={styles.container}
        resizeMode={'cover'}>
        <SafeAreaView style={styles.safeAreaView}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              padding: 20,
            }}>
            <Header
              isChecked={isCheckLanguages}
              isIconLeft={false}
              onLanguageSelectPress={() => this.onLanguageSelectPress()}
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
              }}>
              <View style={{marginBottom: 25}}>
                <Text style={styles.text}>
                  {translate('pages.welcome.theWorldIsConnected')}
                </Text>
                <Text style={styles.text}>
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
                <Text style={styles.text}>
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
                  IconSrc={require('../../assets/icons/line.png')}
                  onPress={() => alert('line clicked')}
                />
                <SocialLogin
                  IconSrc={require('../../assets/icons/googleplus.png')}
                  onPress={() => this.HandleGo()}
                />
                <SocialLogin
                  IconSrc={require('../../assets/icons/twitter.png')}
                  onPress={() => alert('twitter clicked')}
                />
              </View>
              <View style={styles.buttonContainer}>
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
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const SocialLogin = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.6}>
      <Image source={props.IconSrc} style={styles.iconStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  safeAreaView: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    paddingVertical: 5,
    textAlign: 'center',
    color: 'white',
  },
  iconStyle: {
    height: 22,
    width: 22,
    marginHorizontal: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    selectedLanguage: state.languageReducer.selectedLanguage,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoginSignUp);
