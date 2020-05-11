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
import {Images} from '../../constants';
import Header from '../../components/Header';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {forgotUserNameStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';

class ForgotUserName extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      orientation: 'PORTRAIT',
      email: '',
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
    const {email} = this.state;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let isValid = true;

    if (email.length <= 0) {
      isValid = false;
      //   this.setState({userNameStatus: 'wrong'});
    } else if (reg.test(email) === false) {
      isValid = false;
      //   this.setState({userNameStatus: 'wrong'});
    } else {
      //   this.setState({userNameStatus: 'right'});
    }

    if (isValid) {
      let userEmailData = {
        email: email,
      };
      alert(JSON.stringify(userEmailData));
    } else {
      alert('Something went wrong!');
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

export default connect(mapStateToProps, mapDispatchToProps)(ForgotUserName);
