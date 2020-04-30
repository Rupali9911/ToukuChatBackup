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
import Button from '../components/Button';

import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import {Images} from '../constants';

export default class LoginSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {pushData: [], loggedIn: false};
  }

  onSignUpPress() {
    this.props.navigation.navigate('SignUp');
  }

  onLoginPress() {
    this.props.navigation.navigate('Login');
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '27210262657-us76b4j4k9ilmmlhmqk3lvfr0iutd2v2.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      loginHint: '',
      forceConsentPrompt: true,
      accountName: '',
    });
  }

  firebaseGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo: userInfo, loggedIn: true});
      alert(userInfo);
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

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo: userInfo, loggedIn: true});
      alert(userInfo);
    } catch (error) {
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

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('user has not signed in yet');
        this.setState({loggedIn: false});
      } else {
        alert('some other error happened');
        this.setState({loggedIn: false});
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

  render() {
    return (
      <ImageBackground source={Images.image_touku_bg} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              padding: 20,
              justifyContent: 'center',
            }}>
            <View style={{marginBottom: 25}}>
              <Text style={styles.text}>{'The world is connected'}</Text>
              <Text style={styles.text}>{'connect with TOUKU'}</Text>
            </View>
            <Button
              type={'transparent'}
              title={'Login'}
              onPress={() => this.onLoginPress()}
            />
            <Button
              type={'primary'}
              title={'Sign up'}
              onPress={() => this.onSignUpPress()}
            />
            <View style={{marginTop: 25}}>
              <Text style={styles.text}>{'Or login with'}</Text>
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
                onPress={() => this.firebaseGoogleLogin()}
              />
              <SocialLogin
                IconSrc={require('../../assets/icons/twitter.png')}
                onPress={() => alert('twitter clicked')}
              />
            </View>
            <View style={styles.buttonContainer}>
              {!this.state.loggedIn && (
                <Text>You are currently logged out</Text>
              )}
              {this.state.loggedIn && (
                <Button
                  type={'primary'}
                  title={'Signout'}
                  onPress={() => this.signOut()}
                />
              )}
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
