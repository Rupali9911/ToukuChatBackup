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
import Inputfield from '../components/Inputfield';
import Button from '../components/Button';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView>
        <Text
          style={{
            marginTop: '10%',
            textAlign: 'center',
            color: 'white',
            fontSize: 30,
          }}>
          {'ForgotPassword'}
        </Text>
        <View style={{marginTop: '30%'}}>
          <Inputfield
            isRightSideBtn={true}
            placeholder={'Enter username'}
            isLeftSideBtn={true}
          />
          <Inputfield placeholder={'Enter your authentication code'} />
          <Inputfield placeholder={'Login Password'} />
          <Inputfield placeholder={'New log in Password'} />
          <Button btnText={'Reset Password'} />
        </View>
      </ScrollView>
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
