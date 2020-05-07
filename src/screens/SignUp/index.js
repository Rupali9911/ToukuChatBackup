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
import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import {Icons, Colors, Images} from '../../constants';
import Header from '../../components/Header';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {signUpStyles, stepIndicatorStyle} from './styles';
import LanguageSelector from '../../components/LanguageSelector';

class SignUp extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      currentPosition: 0,
      countryCode: '+91',
      isAgreeWithTerms: false,

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

  renderPage(page) {
    switch (page) {
      case 0:
        return (
          <View>
            <Text style={signUpStyles.text}>
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
            <Text style={signUpStyles.text}>
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
            <Text style={signUpStyles.text}>
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
              <View style={signUpStyles.termsContainer}>
                <CheckBox
                  onCheck={() => this.onCheckRememberMe()}
                  isChecked={this.state.isAgreeWithTerms}
                />
                <Text style={signUpStyles.underlineTxt}>
                  {translate('pages.register.iAgreeToTheTerms&Conditions')}
                </Text>
              </View>
            </View>
          </View>
        );
    }
  }

  render() {
    const {currentPosition, orientation} = this.state;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={signUpStyles.container}>
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{padding: 20}}
            showsVerticalScrollIndicator={false}>
            <Header onBackPress={() => this.props.navigation.goBack()} />
            <View
              style={{
                paddingHorizontal: orientation != 'PORTRAIT' ? 200 : 100,
              }}>
              <StepIndicator
                stepCount={3}
                customStyles={stepIndicatorStyle}
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
            <LanguageSelector />
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
