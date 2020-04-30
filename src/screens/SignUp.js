import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import SplashScreen from 'react-native-splash-screen';
import Inputfield from '../components/InputField';
import Button from '../components/Button';
import CheckBox from '../components/CheckBox';
import {Icons, Colors, Images} from '../constants';
import LanguageSelector from '../components/LanguageSelector';

const customStyles = {
  stepIndicatorSize: 26,
  currentStepIndicatorSize: 26,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: 'transparent',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: Colors.primary,
  stepStrokeUnFinishedColor: 'transparent',
  separatorFinishedColor: Colors.primary,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: Colors.primary,
  stepIndicatorUnFinishedColor: Colors.white,
  stepIndicatorCurrentColor: Colors.primary,
  stepIndicatorLabelCurrentColor: Colors.white,
  stepIndicatorLabelFinishedColor: Colors.white,
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  currentStepLabelColor: Colors.primary,
};

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: 0,
      countryCode: '+91',
      isAgreeWithTerms: false,
      isCheckLanguages: false,

      //Page 1
      phone: '',
      verifycode: '',
      //Page 2
      email: '',
      emailconfirm: '',
      //Page 3
      username: '',
      password: '',
    };

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  focusNextField(id) {
    this.inputs[id].focus();
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

  onLanguageSelectPress() {
    this.setState((prevState) => {
      return {
        isCheckLanguages: !prevState.isCheckLanguages,
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
                onRef={(ref) => {
                  this.inputs['phone'] = ref;
                }}
                value={this.state.phone}
                isRightSideBtn={true}
                rightBtnText={'SMS'}
                isLeftSideBtn={true}
                placeholder={this.state.countryCode}
                returnKeyType={'next'}
                keyboardType={'number-pad'}
                onChangeText={(phone) => this.setState({phone})}
                onSubmitEditing={() => {
                  this.focusNextField('verifycode');
                }}
              />
              <Inputfield
                onRef={(ref) => {
                  this.inputs['verifycode'] = ref;
                }}
                value={this.state.verifycode}
                placeholder={'SMS verification code'}
                returnKeyType={'done'}
                keyboardType={'number-pad'}
                onChangeText={(verifycode) => this.setState({verifycode})}
                onSubmitEditing={() => {}}
              />
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
              <Inputfield
                onRef={(ref) => {
                  this.inputs['email'] = ref;
                }}
                value={this.state.email}
                placeholder={'Email (example@gmail.com)'}
                returnKeyType={'next'}
                keyboardType={'email-address'}
                onChangeText={(email) => this.setState({email})}
                onSubmitEditing={() => {
                  this.focusNextField('emailconfirm');
                }}
              />
              <Inputfield
                onRef={(ref) => {
                  this.inputs['emailconfirm'] = ref;
                }}
                value={this.state.emailconfirm}
                placeholder={'Email confirmation'}
                returnKeyType={'done'}
                keyboardType={'email-address'}
                onChangeText={(emailconfirm) => this.setState({emailconfirm})}
                onSubmitEditing={() => {}}
              />

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
              <Inputfield
                value={this.state.username}
                placeholder={'Username'}
                returnKeyType={'done'}
                onChangeText={(username) => this.setState({username})}
                onSubmitEditing={() => {
                  this.focusNextField('password');
                }}
              />
              <Inputfield
                onRef={(ref) => {
                  this.inputs['password'] = ref;
                }}
                value={this.state.password}
                placeholder={'Login Password'}
                returnKeyType={'done'}
                onChangeText={(password) => this.setState({password})}
                onSubmitEditing={() => {}}
              />
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
    const {currentPosition, isCheckLanguages} = this.state;
    return (
      <ImageBackground source={Images.image_touku_bg} style={styles.container}>
        <SafeAreaView style={{flex: 1, paddingVertical: 20}}>
          <ScrollView>
            <Header
              onBackPress={() => this.props.navigation.goBack()}
              isChecked={isCheckLanguages}
              onLanguageSelectPress={() => this.onLanguageSelectPress()}
            />
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

export const Header = (props) => {
  const {isChecked, onBackPress, onLanguageSelectPress} = props;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
      }}>
      <TouchableOpacity onPress={onBackPress}>
        <Image source={Icons.icon_back} style={styles.backIcon} />
      </TouchableOpacity>
      <LanguageSelector isChecked={isChecked} onPress={onLanguageSelectPress} />
    </View>
  );
};

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
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
