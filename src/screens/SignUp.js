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
import StepIndicator from 'react-native-step-indicator';
import Inputfield from '../components/Inputfield';
import Button from '../components/Button';
import SplashScreen from 'react-native-splash-screen';
import CheckBox from '../components/CheckBox';

const image = require('../../assets/images/Splash.png');

const customStyles = {
  stepIndicatorSize: 26,
  currentStepIndicatorSize: 26,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: 'transparent',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: '#f27478',
  stepStrokeUnFinishedColor: 'transparent',
  separatorFinishedColor: '#f27478',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#f27478',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#f27478',
  // stepIndicatorLabelFontSize: 13,
  // currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#ffffff',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  // labelColor: '#999999',
  // labelSize: 13,
  currentStepLabelColor: '#f27478',
};

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: 0,
      isAgreeWithTerms: false,
    };
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  onPageChange(position) {
    this.setState({
      currentPosition: position,
    });
  }

  onSignUpPress() {
    alert('completed');
  }

  onCheckRememberMe() {
    this.setState((prevState) => {
      return {
        isAgreeWithTerms: !prevState.isAgreeWithTerms,
      };
    });
  }

  renderPage(page) {
    switch (page) {
      case 0:
        return (
          <View>
            <Text style={styles.text}>
              {
                'Enter mobile number, click on SMS button and enter the verification code you received.'
              }
            </Text>
            <View style={{marginTop: '30%'}}>
              <Inputfield
                isRightSideBtn={true}
                rightBtnText={'SMS'}
                isLeftSideBtn={true}
              />
              <Inputfield placeholder={'SMS verification code'} />
              <Button
                type={'primary'}
                title={'Next'}
                onPress={() => this.onPageChange(1)}
              />
            </View>
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.text}>{'Enter your email address.'}</Text>
            <View style={{marginTop: '30%'}}>
              <Inputfield placeholder={'Email (example@gmail.com)'} />
              <Inputfield placeholder={'Email confirmation'} />
              <Button
                type={'primary'}
                title={'Next'}
                onPress={() => this.onPageChange(2)}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.text}>
              {
                'Enter your favorite username and password to complete registration'
              }
            </Text>
            <View style={{marginTop: '30%'}}>
              <Inputfield placeholder={'Username'} />
              <Inputfield placeholder={'Login Password'} />
              <Inputfield placeholder={'Re-enter log in password'} />
              <Button
                type={'primary'}
                title={'Signup'}
                onPress={() => this.onSignUpPress()}
              />
              <View style={styles.termsContainer}>
                <CheckBox
                  onCheck={() => this.onCheckRememberMe()}
                  isChecked={this.state.isAgreeWithTerms}
                />
                <Text style={styles.underlineTxt}>
                  {'I agree to the terms and conditions'}
                </Text>
              </View>
            </View>
          </View>
        );
    }
  }

  render() {
    const {currentPosition} = this.state;
    return (
      <ImageBackground source={image} style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView>
            <View style={{paddingHorizontal: 100}}>
              <StepIndicator
                stepCount={3}
                customStyles={customStyles}
                currentPosition={currentPosition}
              />
            </View>
            {this.renderPage(currentPosition)}
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
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  text: {
    fontSize: 12,
    padding: 15,
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
  termsContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
