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
import {connect} from 'react-redux';
import Button from '../components/Button';
import Inputfield from '../components/InputField';
import CheckBox from '../components/CheckBox';
import {Colors, Images} from '../constants';
import * as RNLocalize from 'react-native-localize';
import {setI18nConfig, translate} from '../redux/reducers/languageReducer';
import Header from '../components/Header';

class Login extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguage);
    this.state = {
      isRememberChecked: false,
      isCheckLanguages: false,
      username: '',
      password: '',
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  componentDidMount() {
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig()
      .then(() => this.forceUpdate())
      .catch((error) => {
        console.error(error);
      });
  };

  focusNextField(id) {
    this.inputs[id].focus();
  }

  onLoginPress() {}

  onCheckRememberMe() {
    this.setState((prevState) => {
      return {
        isRememberChecked: !prevState.isRememberChecked,
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

  render() {
    const {isRememberChecked, isCheckLanguages} = this.state;
    return (
      <ImageBackground source={Images.image_touku_bg} style={styles.container}>
        <SafeAreaView style={styles.safeAreaView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Header
              onBackPress={() => this.props.navigation.goBack()}
              isChecked={isCheckLanguages}
              onLanguageSelectPress={() => this.onLanguageSelectPress()}
            />
            <View style={{marginTop: '40%'}}>
              <Inputfield
                value={this.state.username}
                placeholder={translate('common.username')}
                returnKeyType={'next'}
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
            </View>

            <View style={styles.rememberContainer}>
              <CheckBox
                onCheck={() => this.onCheckRememberMe()}
                isChecked={isRememberChecked}
              />
              <Text style={styles.text}>
                {translate('pages.login.rememberMe')}
              </Text>
            </View>
            <Button
              type={'primary'}
              title={translate('common.login')}
              onPress={() => this.onLoginPress()}
            />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: 15,
              }}>
              <Text style={styles.underlineTxt}>
                {translate('common.username')}
              </Text>
              <Text style={styles.text}>{'OR '}</Text>
              <Text
                style={styles.underlineTxt}
                onPress={() =>
                  this.props.navigation.navigate('ForgotPassword')
                }>
                {translate('common.password')}
              </Text>
              <Text style={styles.text}>
                {' ' + translate('common.forgot')}
              </Text>
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
    padding: 20,
  },
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    paddingVertical: 5,
    textAlign: 'center',
    color: Colors.white,
  },
  underlineTxt: {
    fontSize: 14,
    paddingVertical: 5,
    textAlign: 'center',
    color: Colors.white,
    textDecorationLine: 'underline',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    selectedLanguage: state.languageReducer.selectedLanguage,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
