import React, {Component} from 'react';
import {View, Button, ImageBackground, SafeAreaView, Text} from 'react-native';
import Orientation from 'react-native-orientation';
import AsyncStorage from '@react-native-community/async-storage';

import {globalStyles} from '../../styles';
import {Images} from '../../constants';
import HamburgerIcon from '../../components/HamburgerIcon';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'PORTRAIT',
    };
  }

  static navigationOptions = () => {
    return {
      // headerLeft: <HamburgerIcon />,
      header: null,
    };
  };

  componentWillMount() {
    const initial = Orientation.getInitialOrientation();
    this.setState({orientation: initial});
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = (orientation) => {
    this.setState({orientation});
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    const {orientation} = this.state;
    return (
      <ImageBackground
        source={Images.image_touku_bg}
        style={globalStyles.container}>
        <SafeAreaView style={globalStyles.safeAreaView}>
          <View
            style={{
              flexDirection: 'row',
              padding: orientation != 'PORTRAIT' ? 20 : 10,
            }}>
            <View style={globalStyles.container}>
              <HamburgerIcon />
            </View>
            <View style={globalStyles.container}>
              <Text style={globalStyles.smallRegularText}>{'Chat'}</Text>
            </View>
            <View style={globalStyles.container} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}
