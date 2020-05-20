import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import {Images, Icons} from '../../constants';
import BackHeader from '../../components/BackHeader';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {forgotStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';
import Toast from '../../components/Toast';
import {
  forgotPassword,
  forgotUserName,
} from '../../redux/reducers/forgotPassReducer';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      userName: '',
      authCode: '',
      password: '',
      newPassword: '',

      passwordStatus: 'normal',
      newPasswordConfirmStatus: 'normal',
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

  handlePassword = (password) => {
    this.setState({password});
    if (password.length < 6) {
      this.setState({passwordStatus: 'wrong'});
    } else {
      this.setState({passwordStatus: 'right'});
    }
  };

  handleConfirmPassword = (newPassword) => {
    this.setState({newPassword});
    if (this.state.password != newPassword) {
      this.setState({newPasswordConfirmStatus: 'wrong'});
    } else {
      this.setState({newPasswordConfirmStatus: 'right'});
    }
  };

  sendOTP() {
    const {userName} = this.state;
    if (userName !== '') {
      let userNameData = {
        username: userName,
      };
      this.props
        .forgotUserName(userNameData)
        .then((res) => {
          Toast.show({
            title: 'Send SMS',
            text: 'We have sent OTP code to your phone number',
            icon: Icons.icon_message,
            type: 'positive',
          });
        })
        .catch((err) => {
          Toast.show({
            title: 'Send SMS',
            text: 'Username Not Exist',
            icon: Icons.icon_message,
          });
        });
    } else {
      Toast.show({
        title: 'Enter Username',
        text: 'Please Enter User Name',
        icon: Icons.icon_message,
      });
    }
  }

  onSubmitPress() {
    const {userName, authCode, password, newPassword} = this.state;
    if (
      userName !== '' &&
      authCode !== '' &&
      password !== '' &&
      newPassword !== ''
    ) {
      let forgotData = {
        code: authCode,
        confirm_password: newPassword,
        password: password,
        username: userName,
      };
      this.props
        .forgotPassword(forgotData)
        .then((res) => {
          Toast.show({
            title: 'Successfull',
            text: 'Password has been changed successfully!',
            icon: Icons.icon_message,
            type: 'positive',
          });
        })
        .catch((err) => {
          Toast.show({
            title: 'Touku',
            text: 'Enter valid authentication code',
            icon: Icons.icon_message,
          });
        });
    } else {
      Toast.show({
        title: 'Enter Valid Details',
        text: 'Please Enter all valid details',
        icon: Icons.icon_message,
      });
    }
  }

  render() {
    const {orientation} = this.state;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <KeyboardAwareScrollView
            contentContainerStyle={{padding: 20}}
            showsVerticalScrollIndicator={false}>
            <BackHeader onBackPress={() => this.props.navigation.goBack()} />
            <View
              style={{
                flex: 1,
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
              }}>
              <Text
                style={[
                  globalStyles.bigSemiBoldText,
                  {
                    marginVertical: 50,
                    opacity: 0.8,
                  },
                ]}>
                {translate('pages.resetPassword.resetPassword')}
              </Text>
              <View>
                <Inputfield
                  isRightSideBtn={true}
                  rightBtnText={translate('common.sms')}
                  placeholder={translate('common.enterUsername')}
                  value={this.state.userName}
                  onChangeText={(userName) => this.setState({userName})}
                  onPressConfirm={() => this.sendOTP()}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    this.focusNextField('authCode');
                  }}
                  loading={this.props.loadingSMS}
                />
                <Inputfield
                  onRef={(ref) => {
                    this.inputs['authCode'] = ref;
                  }}
                  placeholder={translate('common.enterYourAuthenticationCode')}
                  value={this.state.authCode}
                  onChangeText={(authCode) => this.setState({authCode})}
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    this.focusNextField('password');
                  }}
                  keyboardType={'number-pad'}
                />
                <Inputfield
                  onRef={(ref) => {
                    this.inputs['password'] = ref;
                  }}
                  placeholder={translate('common.loginPassword')}
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={(password) => this.handlePassword(password)}
                  returnKeyType={'next'}
                  status={this.state.passwordStatus}
                  onSubmitEditing={() => {
                    this.focusNextField('newPassword');
                  }}
                />
                <Inputfield
                  onRef={(ref) => {
                    this.inputs['newPassword'] = ref;
                  }}
                  placeholder={translate(
                    'pages.resetPassword.newLogInPassword',
                  )}
                  value={this.state.newPassword}
                  secureTextEntry={true}
                  onChangeText={(newPassword) =>
                    this.handleConfirmPassword(newPassword)
                  }
                  status={this.state.newPasswordConfirmStatus}
                  returnKeyType={'done'}
                />
                <Button
                  type={'primary'}
                  title={translate('pages.resetPassword.resetPassword')}
                  onPress={() => this.onSubmitPress()}
                  loading={this.props.loading}
                />
              </View>
            </View>
            <LanguageSelector />
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    loading: state.forgotPassReducer.loading,
    loadingSMS: state.forgotPassReducer.loadingSMS,
  };
};

const mapDispatchToProps = {
  forgotPassword,
  forgotUserName,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
