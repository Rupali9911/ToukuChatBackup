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
import Inputfield from '../components/Inputfield';
import CheckBox from '../components/CheckBox';

const imagebg = require('../../assets/images/Splash.png');

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRememberChecked: false,
    };
  }

  onLoginPress() {}

  onCheckRememberMe() {
    this.setState((prevState) => {
      return {
        isRememberChecked: !prevState.isRememberChecked,
      };
    });
  }

  render() {
    const {isRememberChecked} = this.state;
    return (
      <ImageBackground source={imagebg} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              paddingHorizontal: 20,
              justifyContent: 'center',
            }}>
            <Inputfield placeholder={'Username'} />
            <Inputfield placeholder={'Login Password'} />

            <View style={styles.rememberContainer}>
              <CheckBox
                onCheck={() => this.onCheckRememberMe()}
                isChecked={isRememberChecked}
              />
              <Text style={styles.text}>{'Remember me'}</Text>
            </View>
            <Button
              type={'primary'}
              title={'Login'}
              onPress={() => this.onLoginPress()}
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: 15,
              }}>
              <Text style={styles.underlineTxt}>{'Username '}</Text>
              <Text style={styles.text}>{'OR '}</Text>
              <Text style={styles.underlineTxt}>{'Password '}</Text>
              <Text style={styles.text}>{'Forgot ?'}</Text>
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
  underlineTxt: {
    fontSize: 14,
    paddingVertical: 5,
    textAlign: 'center',
    color: 'white',
    textDecorationLine: 'underline',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
