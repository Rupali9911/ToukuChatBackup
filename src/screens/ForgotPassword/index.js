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

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
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

  render() {
    const {orientation} = this.state;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={forgotStyles.container}>
        <SafeAreaView style={forgotStyles.container}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
