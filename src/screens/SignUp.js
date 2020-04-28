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
} from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import Inputfield from '../components/Inputfield';
import Button from '../components/Button';
import SplashScreen from 'react-native-splash-screen';

// import ForgotPassword from './src/screens/ForgotPassword';

const image = require('../../assets/images/Splash.png');
// const labels = ['Cart', 'Delivery Address', 'Order Summary'];
const customStyles = {
  stepIndicatorSize: 26,
  currentStepIndicatorSize: 26,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 2,
  stepStrokeCurrentColor: 'transparent',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: 'transparent',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#fe7013',
  // stepIndicatorLabelFontSize: 13,
  // currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#ffffff',
  // stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  // labelColor: '#999999',
  // labelSize: 13,
  currentStepLabelColor: '#fe7013',
};

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: 0,
    };
  }

  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
  }

  onPageChange(position) {
    this.setState({currentPosition: position});
  }

  render() {
    return (
      <ImageBackground source={image} style={styles.image}>
        <ScrollView>
          <View style={{paddingHorizontal: 120}}>
            <StepIndicator
              stepCount={3}
              customStyles={customStyles}
              currentPosition={this.state.currentPosition}
            />
          </View>
          <Text style={styles.text}>
            {
              'Enter mobile number, click on SMS button and enter the verification code you received.'
            }
          </Text>
          <View style={{marginTop: '40%'}}>
            <Inputfield
              isRightSideBtn={true}
              rightBtnText={'SMS'}
              isLeftSideBtn={true}
            />
            <Inputfield placeholder={'SMS verification code'} />
            <Button btnText={'Next'} />
          </View>
          {/* <ForgotPassword /> */}
        </ScrollView>
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
