import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import {Colors, Fonts, Images, Icons} from '../../constants';
import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import Button from '../Button';

export default class ChangeNameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {visible, onRequestClose} = this.props;
    return (
      <Modal
        isVisible={visible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={500}
        backdropOpacity={0.4}
        onBackButtonPress={onRequestClose}
        onBackdropPress={onRequestClose}
        style={styles.modalBackground}>
        <View style={styles.Wrapper}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.8, y: 0.3}}
            locations={[0.1, 0.5, 0.8]}
            colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
            style={styles.header}>
            <View style={{flex: 1}}>
              <Text style={[globalStyles.normalLightText, {textAlign: 'left'}]}>
                {'Change Name'}
              </Text>
            </View>
            <RoundedImage
              source={Icons.icon_close}
              color={Colors.white}
              size={14}
              isRounded={false}
              clickable={true}
              onClick={onRequestClose}
            />
          </LinearGradient>
          <View style={{padding: 15}}>
            <View style={styles.inputContainer}>
              <TextInput placeholder={'First Name'} />
            </View>
            <View style={styles.inputContainer}>
              <TextInput placeholder={'Last Name'} />
            </View>
            <Button isRounded={false} title={'Change Name'} />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    display: 'flex',
  },
  Wrapper: {
    width: '80%',
    backgroundColor: Colors.white,
    display: 'flex',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginVertical: 5,
  },
});
