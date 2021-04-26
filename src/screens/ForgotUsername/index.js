import React, {Component} from 'react';
import {
  ImageBackground,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation';
import {connect} from 'react-redux';
import Button from '../../components/Button';
import {BackHeader} from '../../components/Headers';
import Inputfield from '../../components/InputField';
import LanguageSelector from '../../components/LanguageSelector';
import Toast from '../../components/Toast';
import {Images} from '../../constants';
import {
  forgotUserName,
  recoverUserName,
} from '../../redux/reducers/forgotPassReducer';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import styles from './styles';

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
            console.log(err.response);
            if (err.response.request._response) {
              console.log(err.response.request._response);
              let errMessage = JSON.parse(err.response.request._response);
              if (errMessage.message) {
                Toast.show({
                  title: translate('pages.xchat.reconfirmUserName'),
                  text: errMessage.message.toString().includes('backend.')
                    ? translate(errMessage.message.toString())
                    : errMessage.message.toString(),
                  type: 'primary',
                });
              } else if (errMessage.non_field_errors) {
                let strRes = errMessage.non_field_errors;
                Toast.show({
                  title: translate('pages.xchat.reconfirmUserName'),
                  text: translate(strRes.toString()),
                  type: 'primary',
                });
              } else if (errMessage.phone) {
                Toast.show({
                  title: translate('pages.xchat.reconfirmUserName'),
                  text: translate('pages.register.toastr.phoneNumberIsInvalid'),
                  type: 'primary',
                });
              } else if (errMessage.detail) {
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
        title: 'TOUKU',
        text: translate('pages.register.toastr.enterEmailAddress'),
        type: 'primary',
      });
    }
  }

  render() {
    const {orientation} = this.state;

    const containerPadding = orientation !== 'PORTRAIT' ? 50 : 0;
    const recoverUsernameFontSize =
      this.props.selectedLanguageItem.language_name === 'ja' ? 28 : 30;
    const contentContainerMargin = orientation !== 'PORTRAIT' ? 0 : -100;

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
            contentContainerStyle={styles.keyboardScrollContentContainer}
            showsVerticalScrollIndicator={false}>
            <BackHeader onBackPress={() => this.props.navigation.goBack()} />
            <View
              style={[
                {
                  paddingHorizontal: containerPadding,
                },
                styles.singleFlex,
              ]}>
              <Text
                style={[
                  globalStyles.bigSemiBoldText,
                  styles.recoverUsername,
                  {fontSize: recoverUsernameFontSize},
                ]}>
                {translate('pages.xchat.recoverUsername')}
              </Text>
              <View
                style={[
                  {marginTop: contentContainerMargin},
                  styles.contentContainer,
                ]}>
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
