// Library imports
import React, {Component} from 'react';
import {Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

// Local imports
import {Colors, Icons} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';
import {globalStyles} from '../../../styles';
import {wait} from '../../../utils';

// Component imports
import Button from '../../Button';
import ClickableImage from '../../ClickableImage';
import Toast from '../../ToastModal';
import VerificationInputField from '../../VerificationInputField';

// StyleSheet imports
import styles from './styles';

/**
 * Verify OTP modal component
 */
class VerifyOtpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verifycode: '',
      loading: false,
    };
    this.inputs = {};
  }

  // Verify received OTP number
  verifyOtpUpdateNumber = () => {
    const {verifycode} = this.state;

    if (verifycode !== '') {
      this.props.onVerify(verifycode);
    } else {
      Toast.show({
        title: translate('pages.xchat.PleaseEnterOtp'),
        text: translate(
          'pages.resetPassword.toastr.pleaseCheckOTPCodeandTryAgain',
        ),
        type: 'warning',
      });
    }
  };

  // When modal closes
  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState(this.initialState);
    });
  };

  // Set state based on incoming props from component
  componentWillReceiveProps(nextProps) {
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
        style={styles.modalBackground}>
        <View style={styles.Wrapper}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.8, y: 0.3}}
            locations={[0.1, 0.5, 0.8]}
            colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
            style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text
                style={[globalStyles.normalLightText, styles.headerTitleText]}>
                {translate('pages.adWall.pleaseEnterOtp')}
              </Text>
            </View>
            <ClickableImage
              size={14}
              source={Icons.icon_close}
              onPress={this.onRequestClose.bind(this)}
            />
          </LinearGradient>

          <View style={styles.contentContainer}>
            <View style={styles.contentSubContainer}>
              <VerificationInputField
                onRef={(ref) => {
                  this.inputs.verifycode = ref;
                }}
                value={this.state.verifycode}
                placeholder={translate('pages.adWall.enterVerificationCode')}
                returnKeyType={'done'}
                keyboardType={'number-pad'}
                onChangeText={(verifycode) => this.setState({verifycode})}
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
        <View style={styles.toastContainer}>
          <Toast
            ref={(c) => {
              if (c) {
                Toast.toastInstance = c;
              }
            }}
          />
        </View>
      </Modal>
    );
  }
}

export default VerifyOtpModal;
