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
import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import {Images} from '../../constants';
import Header from '../../components/Header';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {forgotStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';
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

  sendOTP() {
    const {userName} = this.state;
    let userNameData = {
      username: userName,
    };
    this.props.forgotUserName(userNameData).then((res) => {
      alert(JSON.stringify(res) + ' JSON DATA FROM API');
    });
  }

  onSubmitPress() {
    const {userName, authCode, password, newPassword} = this.state;

    let forgotData = {
      code: authCode,
      confirm_password: newPassword,
      password: password,
      username: userName,
    };
    this.props.forgotPassword(forgotData).then((res) => {
      alert(JSON.stringify(res) + ' JSON DATA FROM API');
    });
  }

  render() {
    const {orientation} = this.state;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <ScrollView
            contentContainerStyle={{padding: 20}}
            showsVerticalScrollIndicator={false}>
            <Header onBackPress={() => this.props.navigation.goBack()} />
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
                />
                <Inputfield
                  onRef={(ref) => {
                    this.inputs['password'] = ref;
                  }}
                  placeholder={translate('common.loginPassword')}
                  value={this.state.password}
                  onChangeText={(password) => this.setState({password})}
                  returnKeyType={'next'}
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
                  onChangeText={(newPassword) => this.setState({newPassword})}
                  returnKeyType={'done'}
                />
                <Button
                  type={'primary'}
                  title={translate('pages.resetPassword.resetPassword')}
                  onPress={() => this.onSubmitPress()}
                />
              </View>
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

const mapDispatchToProps = {
  forgotPassword,
  forgotUserName,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
