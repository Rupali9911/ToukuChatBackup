import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import Orientation from 'react-native-orientation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import {Images, Icons} from '../../constants';
import {BackHeader} from '../../components/Headers';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {forgotUserNameStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';
import {
  forgotUserName,
  recoverUserName,
} from '../../redux/reducers/forgotPassReducer';
import Toast from '../../components/Toast';

class ForgotUserName extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      email: '',
    };
  }

  UNSAFE_componentWillMount() {
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

  onSubmitPress() {
    Keyboard.dismiss();
    const {email} = this.state;
    if (email !== '') {
      let userNameData = {
        email: email,
      };
      this.props
        .recoverUserName(userNameData)
        .then((res) => {
          Toast.show({
            title: translate('pages.xchat.recoverUsername'),
            text: translate('pages.xchat.toastr.recoverUsernameMessage'),
            type: 'positive',
          });
        })
        .catch((err) => {
          // if (err.response.request._response) {
          //   let errMessage = JSON.parse(err.response.request._response);
          //   Toast.show({
          //     title: translate('pages.xchat.reconfirmUserName'),
          //     text: translate(errMessage.message.toString()),
          //     type: 'primary',
          //   });
          // }
            if (err.response) {
                console.log(err.response)
                if (err.response.request._response) {
                    console.log(err.response.request._response)
                    let errMessage = JSON.parse(err.response.request._response)
                    if (errMessage.message) {
                        Toast.show({
                            title: translate('pages.xchat.reconfirmUserName'),
                            text: translate(errMessage.message.toString()),
                            type: 'primary',
                        });
                    }else if (errMessage.non_field_errors) {
                        let strRes = errMessage.non_field_errors
                        Toast.show({
                            title: translate('pages.xchat.reconfirmUserName'),
                            text: translate(strRes.toString()),
                            type: 'primary',
                        });
                    }else if (errMessage.phone) {
                        Toast.show({
                            title: translate('pages.xchat.reconfirmUserName'),
                            text: translate('pages.register.toastr.phoneNumberIsInvalid'),
                            type: 'primary',
                        });
                    }else if (errMessage.detail) {
                        Toast.show({
                            title: translate('pages.xchat.reconfirmUserName'),
                            text: errMessage.detail.toString(),
                            type: 'primary',
                        });
                    }
                }
            }
        });
    } else {
      Toast.show({
        title: 'Touku',
        text: translate('pages.register.toastr.enterEmailAddress'),
        type: 'primary',
      });
    }
  }

  render() {
    const {orientation} = this.state;

    return (
      <ImageBackground
        //source={Images.image_touku_bg}
        source={
          Platform.isPad ? Images.image_touku_bg : Images.image_touku_bg_phone
        }
        style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            behavior={'position'}
            contentContainerStyle={{
              flex: 1,
              padding: 20,
            }}
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
                    fontSize: 30,
                    marginVertical: 50,
                    opacity: 0.8,
                  },
                ]}>
                {translate('pages.xchat.recoverUsername')}
              </Text>
              <View
                style={{
                  flex: 1,
                  width: Platform.isPad ? '75%' : '100%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginTop: orientation != 'PORTRAIT' ? 0 : -100,
                }}>
                <Inputfield
                  value={this.state.email}
                  placeholder={translate('common.email')}
                  returnKeyType={'done'}
                  onChangeText={(email) => this.setState({email})}
                  onSubmitEditing={() => {
                    this.onSubmitPress();
                  }}
                />

                <Button
                  type={'primary'}
                  title={translate('common.recoverUsernameButton')}
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
  };
};

const mapDispatchToProps = {
  forgotUserName,
  recoverUserName,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotUserName);
