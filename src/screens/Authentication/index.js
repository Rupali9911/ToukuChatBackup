import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import {authenticationStyles} from './styles';
import {Colors} from '../../constants';
import {getAllLanguages} from '../../redux/reducers/languageReducer';

class Authentication extends Component {
  constructor() {
    super();
    this.authenticateUser();
  }

  authenticateUser = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  componentDidMount() {
    this.props.getAllLanguages();
    SplashScreen.hide();
  }

  render() {
    return (
      <View style={authenticationStyles.container}>
        <SafeAreaView>
          <ActivityIndicator color={Colors.primary} />
        </SafeAreaView>
      </View>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
