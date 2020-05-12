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
import BackHeader from '../../components/BackHeader';
import {translate, setI18nConfig} from '../../redux/reducers/languageReducer';
import {forgotUserNameStyles} from './styles';
import LanguageSelector from '../../components/LanguageSelector';
import {globalStyles} from '../../styles';
import {forgotUserName} from '../../redux/reducers/forgotPassReducer';

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

    let userNameData = {
      username: userName,
    };
    this.props.forgotUserName(userNameData).then((res) => {
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
                  placeholder={translate('common.email')}
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
