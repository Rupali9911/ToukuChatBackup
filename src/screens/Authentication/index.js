import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {SafeAreaView} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {connect} from 'react-redux';
import {store} from '../../redux/store';
import styles from './styles';

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
    this.state = {};
  }

  authenticateUser = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }

  render() {
    return (
      // <ImageBackground
      //   source={Images.image_touku_bg}
      //   style={globalStyles.container}>
      <SafeAreaView style={styles.container}>
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
