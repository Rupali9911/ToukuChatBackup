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
import {Header} from './SignUp';

const imagebg = require('../../assets/images/Splash.png');

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheckLanguages: false,
    };
  }

  onLanguageSelectPress() {
    this.setState((prevState) => {
      return {
        isCheckLanguages: !prevState.isCheckLanguages,
      };
    });
  }

  render() {
    const {isCheckLanguages} = this.state;
    return (
      <ImageBackground source={imagebg} style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <Header
              onBackPress={() => this.props.navigation.goBack()}
              isChecked={isCheckLanguages}
              onLanguageSelectPress={() => this.onLanguageSelectPress()}
            />
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 24,
                marginTop: '30%',
              }}>
              {'ForgotPassword'}
            </Text>
            <View>
              <Inputfield
                isRightSideBtn={true}
                rightBtnText={'SMS'}
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
    padding: 20,
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
