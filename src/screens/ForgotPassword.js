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
import Inputfield from '../components/Inputfield';
import Button from '../components/Button';

const imagebg = require('../../assets/images/Splash.png');

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ImageBackground source={imagebg} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              paddingHorizontal: 20,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 30,
              }}>
              {'ForgotPassword'}
            </Text>
            <View>
              <Inputfield
                isRightSideBtn={true}
                placeholder={'Enter username'}
              />
              <Inputfield placeholder={'Enter your authentication code'} />
              <Inputfield placeholder={'Login Password'} />
              <Inputfield placeholder={'New log in Password'} />
              <Button title={'Reset Password'} />
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
  image: {
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 12,
    padding: 15,
    textAlign: 'center',
    color: 'white',
  },
});
