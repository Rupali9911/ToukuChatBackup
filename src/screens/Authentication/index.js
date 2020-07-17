import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import {authenticationStyles} from './styles';
import {Colors, Images} from '../../constants';
import {getAllLanguages, getAllLanguagesBackend} from '../../redux/reducers/languageReducer';
import {wait} from '../../utils';
import {globalStyles} from '../../styles';
import {store} from '../../redux/store';

export const translationGetters = {
  en: () => store.getState().languageReducer.en,
  ja: () => store.getState().languageReducer.ja,
  ko: () => store.getState().languageReducer.ko,
  ch: () => store.getState().languageReducer.ch,
  tw: () => store.getState().languageReducer.tw,
};

class Authentication extends Component {
  constructor() {
    super();
    this.authenticateUser();
  }

  authenticateUser = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // wait(1000).then(() => {
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
    // });
  };

  componentDidMount() {
    this.props.getAllLanguages();
    this.props.getAllLanguagesBackend();
    SplashScreen.hide();
  }

  render() {
    return (
      // <ImageBackground
      //   source={Images.image_touku_bg}
      //   style={globalStyles.container}>
      <SafeAreaView style={authenticationStyles.container}>
        {/* <ActivityIndicator color={Colors.primary} /> */}
        {/* <Image
          source={Images.image_loading}
          style={{width: 100, height: 100, resizeMode: 'contain'}}
        /> */}
      </SafeAreaView>
      // </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {
  getAllLanguages,
    getAllLanguagesBackend
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
