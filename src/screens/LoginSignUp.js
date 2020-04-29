import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
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
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

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
});
