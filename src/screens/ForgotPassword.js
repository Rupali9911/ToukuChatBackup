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
import Orientation from 'react-native-orientation';
import Inputfield from '../components/InputField';
import Button from '../components/Button';
import {Images} from '../constants';
import Header from '../components/Header';
import {translate} from '../redux/reducers/languageReducer';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
      isCheckLanguages: false,
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

  onLanguageSelectPress() {
    this.setState((prevState) => {
      return {
        isCheckLanguages: !prevState.isCheckLanguages,
      };
    });
  }

  render() {
    const {isCheckLanguages, orientation} = this.state;
    return (
      <ImageBackground source={Images.image_touku_bg} style={styles.container}>
        <SafeAreaView style={styles.container}>
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
                flex: 1,
                paddingHorizontal: orientation != 'PORTRAIT' ? 50 : 0,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: 28,
                  marginVertical: 50,
                }}>
                {translate('pages.resetPassword.resetPassword')}
              </Text>
              <View>
                <Inputfield
                  isRightSideBtn={true}
                  rightBtnText={translate('common.sms')}
                  placeholder={translate('common.enterUsername')}
                />
                <Inputfield
                  placeholder={translate('common.enterYourAuthenticationCode')}
                />
                <Inputfield placeholder={translate('common.loginPassword')} />
                <Inputfield
                  placeholder={translate(
                    'pages.resetPassword.newLogInPassword',
                  )}
                />
                <Button
                  title={translate('pages.resetPassword.resetPassword')}
                />
              </View>
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
  },
  image: {
    flex: 1,
    padding: 10,
  },
  text: {
    fontSize: 12,
    padding: 15,
    textAlign: 'center',
    color: 'white',
  },
});
