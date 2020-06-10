import React, {Component} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
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
    const {email} = this.state;
    if (email !== '') {
      let userNameData = {
        email: email,
      };
      this.props
        .recoverUserName(userNameData)
        .then((res) => {
          Toast.show({
            title: 'Send Email',
            text: 'We have sent an email to your registered email id',
            type: 'positive',
          });
        })
        .catch((err) => {
          Toast.show({
            title: 'Touku',
            text: 'Email Not Found',
            type: 'primary',
          });
        });
    } else {
      Toast.show({
        title: 'Touku',
        text: 'Enter valid email address',
        type: 'primary',
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
                    marginVertical: 50,
                    opacity: 0.8,
                  },
                ]}>
                {translate('pages.xchat.recoverUsername')}
              </Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  marginTop: orientation != 'PORTRAIT' ? 0 : -100,
                }}>
                <Inputfield
                  value={this.state.email}
                  placeholder={translate('common.email')}
                  returnKeyType={'done'}
                  onChangeText={(email) => this.setState({email})}
                  // onSubmitEditing={() => {
                  //   this.onSubmitPress();
                  // }}
                />

                <Button
                  type={'primary'}
                  title={translate('common.submit')}
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
