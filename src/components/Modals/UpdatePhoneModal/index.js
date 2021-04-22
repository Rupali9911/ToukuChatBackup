// Library imports
import React, {Component} from 'react';
import {KeyboardAvoidingView, ScrollView, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';

// Local imports
import {Colors, Icons} from '../../../constants';
import {updateConfiguration} from '../../../redux/reducers/configurationReducer';
import {translate} from '../../../redux/reducers/languageReducer';
import {
  userSendOTP,
  userSendOTPAndNumber,
  userSendOTPUpdateNumber,
  userVerifyOTP,
  userVerifyOTPAndAddNumber,
  userVerifyOTPAndUpdateNumber,
} from '../../../redux/reducers/signupReducer';
import {getUserProfile} from '../../../redux/reducers/userReducer';
import {globalStyles} from '../../../styles';
import {wait} from '../../../utils';

// Component imports
import Button from '../../Button';
import ClickableImage from '../../ClickableImage';
import CountryPhoneInput from '../../CountryPhoneInput';
import Toast from '../../ToastModal';
import VerificationInputField from '../../VerificationInputField';

// StyleSheet import
import styles from './styles';

/**
 * Update phone modal component
 */
class UpdatePhoneModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      countryCode: '',
      verifycode: '',
    };
    this.inputs = {};
  }

  // Process phone number input along with country code
  onChangePhoneNumber(phone, code) {
    this.setState({phone, countryCode: code});
  }

  // Send an OTP for verification
  sendOTP() {
    const {phone} = this.state;

    if (!phone) {
      Toast.show({
        title: translate('common.sendSMS'),
        text: translate('pages.register.toastr.enterPhoneNumber'),
        type: 'primary',
      });
    } else if (phone.length > 0 && phone.length < 8) {
      Toast.show({
        title: translate('common.sendSMS'),
        text: translate('pages.register.toastr.phoneNumberIsInvalid'),
        type: 'primary',
      });
    } else {
      let signUpData = {
        phone: phone,
      };

      !this.props.editable
        ? this.props
            .userSendOTPAndNumber(signUpData)
            .then((res) => {
              if (res.status === true) {
                Toast.show({
                  title: translate('common.sendSMS'),
                  text: translate('pages.register.toastr.sentOTPtoMobile'),
                  type: 'positive',
                });
                this.inputs.verifycode.focus();
              } else if (res.status === false && res.data.phone !== '') {
                Toast.show({
                  title: translate('common.sendSMS'),
                  text: translate('backend.common.PhoneNumberAlreadRegistered'),
                  type: 'primary',
                });
              } else {
                Toast.show({
                  title: translate('common.sendSMS'),
                  text: translate('pages.register.toastr.phoneNumberIsInvalid'),
                  type: 'primary',
                });
              }
            })
            .catch((err) => {
              if (err.response) {
                if (err.response.request._response) {
                  console.log(err.response.request._response);
                  let errMessage = JSON.parse(err.response.request._response);
                  if (errMessage.message) {
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: errMessage.message,
                      type: 'primary',
                    });
                  } else if (errMessage.non_field_errors) {
                    let strRes = errMessage.non_field_errors;
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: translate(strRes.toString()),
                      type: 'primary',
                    });
                  } else if (errMessage.phone) {
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: translate(
                        'pages.register.toastr.phoneNumberIsInvalid',
                      ),
                      type: 'primary',
                    });
                  } else if (errMessage.detail) {
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: errMessage.detail.toString(),
                      type: 'primary',
                    });
                  }
                }
              }
            })
        : this.props
            .userSendOTPUpdateNumber(signUpData)
            .then((res) => {
              if (res.status === true) {
                Toast.show({
                  title: translate('common.sendSMS'),
                  text: translate('pages.register.toastr.sentOTPtoMobile'),
                  type: 'positive',
                });
                this.inputs.verifycode.focus();
              } else if (res.status === false && res.data.phone !== '') {
                Toast.show({
                  title: translate('common.sendSMS'),
                  text: translate('backend.common.PhoneNumberAlreadRegistered'),
                  type: 'primary',
                });
              } else {
                Toast.show({
                  title: translate('common.sendSMS'),
                  text: translate('pages.register.toastr.phoneNumberIsInvalid'),
                  type: 'primary',
                });
              }
            })
            .catch((err) => {
              if (err.response) {
                if (err.response.request._response) {
                  console.log(err.response.request._response);
                  let errMessage = JSON.parse(err.response.request._response);
                  if (errMessage.message) {
                    console.log('updating translation');
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: errMessage.message,
                      type: 'primary',
                    });
                  } else if (errMessage.non_field_errors) {
                    let strRes = errMessage.non_field_errors;
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: translate(strRes.toString()),
                      type: 'primary',
                    });
                  } else if (errMessage.phone) {
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: translate(
                        'pages.register.toastr.phoneNumberIsInvalid',
                      ),
                      type: 'primary',
                    });
                  } else if (errMessage.detail) {
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: errMessage.detail.toString(),
                      type: 'primary',
                    });
                  }
                }
              }
            });
    }
  }

  // Verify OTP received
  verifyOtpUpdateNumber = () => {
    const {phone, verifycode} = this.state;

    if (phone !== '' && verifycode !== '') {
      let verifyData = {
        code: verifycode,
        phone: phone,
      };

      this.props.editable
        ? this.props
            .userVerifyOTPAndUpdateNumber(verifyData)
            .then((res) => {
              console.log('userVerifyOTP response', res);
              if (res.status === true) {
                Toast.show({
                  title: translate('pages.xchat.toukuPoints'),
                  text: translate('pages.register.toastr.phoneNumberAdded'),
                  type: 'positive',
                });
                setTimeout(() => {
                  this.props.onRequestClose();
                }, 2000);
                this.props.getUserProfile();
                this.props.onVerificationComplete &&
                  this.props.onVerificationComplete();
              } else {
                Toast.show({
                  title: translate('common.register'),
                  text: translate('pages.register.toastr.enterCorrectOTP'),
                  type: 'primary',
                });
              }
            })
            .catch((err) => {
              console.log('err.response', err.response);
              if (err.response) {
                if (err.response.data) {
                  if (err.response.data.detail) {
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: err.response.data.detail.toString(),
                      type: 'primary',
                    });
                  } else if (err.response.data.message) {
                    Toast.show({
                      title: translate('common.sendSMS'),
                      text: err.response.data.message.toString(),
                      type: 'primary',
                    });
                  } else {
                    Toast.show({
                      title: translate('common.sendSMS'),
                      //text: err.response.data.,
                      text: translate(err.response.data.toString()),
                      type: 'primary',
                    });
                  }
                }
              }
            })
        : this.props.userVerifyOTPAndAddNumber(verifyData).then((res) => {
            console.log('userVerifyOTP response', res);
            if (res.status === true) {
              Toast.show({
                title: translate('pages.xchat.toukuPoints'),
                text: translate('pages.register.toastr.phoneNumberAdded'),
                type: 'positive',
              });
              setTimeout(() => {
                this.props.onRequestClose();
              }, 2000);
              this.props.getUserProfile();
            } else {
              Toast.show({
                title: translate('common.register'),
                text: translate('pages.register.toastr.enterCorrectOTP'),
                type: 'primary',
              });
            }
          });
    } else {
      if (phone === '') {
        Toast.show({
          title: translate('common.register'),
          text: translate('pages.register.toastr.enterPhoneNumber'),
          type: 'warning',
        });
      } else {
        Toast.show({
          title: translate('common.register'),
          text: translate('pages.register.toastr.pleaseSubmitOTPfirst'),
          type: 'warning',
        });
      }
    }
  };

  // When modal closes
  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      console.log('wait(800)');
      this.setState(this.initialState);
    });
  };

  render() {
    const {visible, editable} = this.props;
    return (
      <Modal
        isVisible={visible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
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
            <View style={styles.singleFlex}>
              <Text style={[globalStyles.normalLightText, styles.headerTitle]}>
                {editable
                  ? translate('pages.register.phoneNumberUpdate')
                  : translate('pages.register.phoneNumber')}
              </Text>
            </View>
            <ClickableImage
              size={14}
              source={Icons.icon_close}
              onPress={this.onRequestClose.bind(this)}
            />
          </LinearGradient>
          <ScrollView>
            <KeyboardAvoidingView
              style={styles.singleFlex}
              keyboardVerticalOffset={100}
              behavior={'position'}>
              <View style={styles.contentContainer}>
                <View style={styles.contentSubContainer}>
                  <CountryPhoneInput
                    rightBtnText={translate('common.sms')}
                    onClickSMS={() => this.sendOTP()}
                    onChangePhoneNumber={(phone, code) =>
                      this.onChangePhoneNumber(phone, code)
                    }
                    // value={this.state.phone}
                    loading={this.props.loadingSMS}
                    isUpdatePhone
                  />
                  <VerificationInputField
                    onRef={(ref) => {
                      this.inputs.verifycode = ref;
                    }}
                    value={this.state.verifycode}
                    placeholder={translate(
                      'pages.adWall.enterVerificationCode',
                    )}
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
                    loading={this.props.loading}
                    isRounded={false}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
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

/**
 * @Redux - Map following state to props
 * @param {object} state - current state in stored in redux
 * @returns object
 */
const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    userConfig: state.configurationReducer.userConfig,
    loading: state.signupReducer.loading,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {
  getUserProfile,
  updateConfiguration,
  userSendOTP,
  userVerifyOTP,
  userSendOTPAndNumber,
  userVerifyOTPAndAddNumber,
  userSendOTPUpdateNumber,
  userVerifyOTPAndUpdateNumber,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePhoneModal);
