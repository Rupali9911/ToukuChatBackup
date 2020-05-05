import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import StepIndicator from 'react-native-step-indicator';
import Inputfield from '../components/InputField';
import Button from '../components/Button';
import CheckBox from '../components/CheckBox';
import {Icons, Colors, Images} from '../constants';
import Header from '../components/Header';
import {setI18nConfig, translate} from '../redux/reducers/languageReducer';

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

class SignUp extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguage);
    this.state = {
      orientation: 'PORTRAIT',
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

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

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
              {translate('common.registerStepOne')}
            </Text>
            <View style={{marginTop: 50}}>
              <Inputfield
                onRef={(ref) => {
                  this.inputs['phone'] = ref;
                }}
                value={this.state.phone}
                isRightSideBtn={true}
                rightBtnText={translate('common.sms')}
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
                placeholder={translate('common.smsVerificationCode')}
                returnKeyType={'done'}
                keyboardType={'number-pad'}
                onChangeText={(verifycode) => this.setState({verifycode})}
                onSubmitEditing={() => {}}
              />
              <Button
                type={'primary'}
                title={translate('common.next')}
                onPress={() => this.onPageChange(1)}
              />
            </View>
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.text}>
              {translate('common.registerStepTwo')}
            </Text>
            <View style={{marginTop: 50}}>
              <Inputfield
                onRef={(ref) => {
                  this.inputs['email'] = ref;
                }}
                value={this.state.email}
                placeholder={translate('common.email')}
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
                placeholder={translate('common.emailConfirmation')}
                returnKeyType={'done'}
                keyboardType={'email-address'}
                onChangeText={(emailconfirm) => this.setState({emailconfirm})}
                onSubmitEditing={() => {}}
              />

              <Button
                type={'primary'}
                title={translate('common.next')}
                onPress={() => this.onPageChange(2)}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.text}>
              {translate('common.registerStepThree')}
            </Text>
            <View style={{marginTop: 50}}>
              <Inputfield
                value={this.state.username}
                placeholder={translate('common.username')}
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
                placeholder={translate('pages.register.loginPassword')}
                returnKeyType={'done'}
                onChangeText={(password) => this.setState({password})}
                onSubmitEditing={() => {}}
              />
              <Inputfield
                placeholder={translate('pages.register.reEnterLoginPassword')}
              />
              <Button
                type={'primary'}
                title={translate('common.signUp')}
                onPress={() => this.onSignUpPress()}
              />
              <View style={styles.termsContainer}>
                <CheckBox
                  onCheck={() => this.onCheckRememberMe()}
                  isChecked={this.state.isAgreeWithTerms}
                />
                <Text style={styles.underlineTxt}>
                  {translate('pages.register.iAgreeToTheTerms&Conditions')}
                </Text>
              </View>
            </View>
          </View>
        );
    }
  }

  render() {
    const {currentPosition, isCheckLanguages, orientation} = this.state;
    return (
      <ImageBackground source={Images.image_touku_bg} style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{padding: 20}}
            showsVerticalScrollIndicator={false}>
            <Header
              onBackPress={() => this.props.navigation.goBack()}
              isChecked={isCheckLanguages}
              onLanguageSelectPress={() => this.onLanguageSelectPress()}
            />
            <View
              style={{
                paddingHorizontal: orientation != 'PORTRAIT' ? 200 : 100,
              }}>
              <StepIndicator
                stepCount={3}
                customStyles={customStyles}
                currentPosition={currentPosition}
              />
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
              }}>
              {this.renderPage(currentPosition)}
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
});

const mapStateToProps = (state) => {
  return {
    selectedLanguage: state.languageReducer.selectedLanguage,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
