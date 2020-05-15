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
import Inputfield from '../../components/InputField';
import Button from '../../components/Button';
import {Images, Icons} from '../../constants';
import BackHeader from '../../components/BackHeader';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {forgotUserNameStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';
import {forgotUserName} from '../../redux/reducers/forgotPassReducer';
import Toast from '../../components/Toast';

class ForgotUserName extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      userName: '',
    };
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

  onSubmitPress() {
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
          });
        })
        .catch((err) => {
          Toast.show({
            title: 'Invalid Username',
            text: 'Something Went Wrong',
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

  render() {
    const {orientation} = this.state;

    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <ScrollView
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
                  value={this.state.userName}
                  placeholder={translate('common.username')}
                  returnKeyType={'done'}
                  onChangeText={(userName) => this.setState({userName})}
                  // onSubmitEditing={() => {
                  //   this.onSubmitPress();
                  // }}
                />

                <Button
                  type={'primary'}
                  title={translate('common.submit')}
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
  forgotUserName,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotUserName);
