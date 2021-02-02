import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Icons} from '../../constants';
import {globalStyles} from '../../styles';
import Button from '../Button';
import {wait} from '../../utils';
import {translate} from '../../redux/reducers/languageReducer';
import Toast from '../ToastModal';
import {ClickableImage} from '../ImageComponents';
import VerificationInputField from '../VerificationInputField';

class VerifyOtpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifycode: '',
      loading: false
    };
    this.inputs = {};
  }

  verifyOtpUpdateNumber = () => {
    const { verifycode } = this.state;

    if (verifycode != '') {
      this.props.onVerify(verifycode);
    } else {
      Toast.show({
        title: translate('pages.xchat.PleaseEnterOtp'),
        text: translate('pages.resetPassword.toastr.pleaseCheckOTPCodeandTryAgain'),
        type: 'warning',
      });
    }
  };

  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState(this.initialState);
    });
  };

  componentWillReceiveProps(nextProps){
    this.setState({loading: nextProps.loading});
  }

  render() {
    const {visible} = this.props;
    const {loading} = this.state;
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
        onBackButtonPress={this.onRequestClose.bind(this)}
        onBackdropPress={this.onRequestClose.bind(this)}
        style={styles.modalBackground}>
        <View style={styles.Wrapper}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.8, y: 0.3}}
            locations={[0.1, 0.5, 0.8]}
            colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
            style={styles.header}>
            <View style={{flex: 1,justifyContent:'center'}}>
              <Text style={[globalStyles.normalLightText, { marginTop:5, textAlign: 'left'}]}>
                {translate('pages.xchat.PleaseEnterOtp')}
              </Text>
            </View>
            <ClickableImage
              size={14}
              source={Icons.icon_close}
              onPress={this.onRequestClose.bind(this)}
            />
          </LinearGradient>

          <View style={{padding: 15}}>
            <View style={{marginTop: 20}}>
              <VerificationInputField
                onRef={(ref) => {
                  this.inputs['verifycode'] = ref;
                }}
                value={this.state.verifycode}
                placeholder={translate('pages.xchat.PleaseEnterOtp')}
                returnKeyType={'done'}
                keyboardType={'number-pad'}
                onChangeText={(verifycode) => this.setState({verifycode})}
                onSubmitEditing={() => {}}
                maxLength={6}
                isUpdatePhone
              />
              <Button
                type={'primary'}
                title={translate('common.verify')}
                onPress={() => this.verifyOtpUpdateNumber()}
                loading={loading}
                isRounded={false}
              />
            </View>
          </View>
        </View>
        <View style={{position: 'absolute', width: '100%', top: 0}}>
          <Toast
            ref={(c) => {
              if (c) Toast.toastInstance = c;
            }}
          />
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
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    padding: Platform.OS === 'ios' ? 10 : 0,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginVertical: 5,
  },
});

export default VerifyOtpModal;
