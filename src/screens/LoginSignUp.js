import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Picker,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Button from '../components/Button';

const imagebg = require('../../assets/images/Splash.png');

export default class LoginSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSignUpPress() {
    this.props.navigation.navigate('SignUp');
  }

  onLoginPress() {
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <ImageBackground source={imagebg} style={styles.container}>
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
                onPress={() => alert('google plus clicked')}
              />
              <SocialLogin
                IconSrc={require('../../assets/icons/twitter.png')}
                onPress={() => alert('twitter clicked')}
              />
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
