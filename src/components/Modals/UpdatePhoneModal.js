import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {Colors, Fonts, Images, Icons} from '../../constants';
import {globalStyles} from '../../styles';
import Button from '../Button';
import {wait} from '../../utils';
import {translate} from '../../redux/reducers/languageReducer';
import {getUserProfile} from '../../redux/reducers/userReducer';
import {updateConfiguration} from '../../redux/reducers/configurationReducer';
import Toast from '../ToastModal';
import {ClickableImage} from '../ImageComponents';
import CountryPhoneInput from '../CountryPhoneInput';
import Inputfield from '../InputField';
import VerificationInputField from '../VerificationInputField';
import {
  userSendOTP,
  userSendOTPAndNumber,
  userVerifyOTP,
  userVerifyOTPAndAddNumber,
  userSendOTPUpdateNumber,
  userVerifyOTPAndUpdateNumber,
} from '../../redux/reducers/signupReducer';

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

  onChangePhoneNumber(phone, code) {
    this.setState({phone, countryCode: code});
  }

  sendOTP() {
    const {phone, countryCode} = this.state;

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
                this.inputs['verifycode'].focus();
              } else if (res.status === false && res.data.phone != '') {
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
                      text: translate(errMessage.message.toString()),
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
                this.inputs['verifycode'].focus();
              } else if (res.status === false && res.data.phone != '') {
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
                      text: translate(errMessage.message.toString()),
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

  verifyOtpUpdateNumber = () => {
    const {phone, verifycode} = this.state;

    if (phone !== '' && verifycode != '') {
      let verifyData = {
        code: verifycode,
        phone: phone,
      };

      this.props.editable
        ? this.props.userVerifyOTPAndUpdateNumber(verifyData).then((res) => {
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

  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState(this.initialState);
    });
  };

  render() {
    const {visible, loading, userConfig, editable} = this.props;
    const {displayName, displayNameErr} = this.state;
    console.log('editable', editable);
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
            <View style={{flex: 1}}>
              <Text style={[globalStyles.normalLightText, {textAlign: 'left'}]}>
                {translate('pages.register.phoneNumber')}
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
              <CountryPhoneInput
                rightBtnText={'SMS'}
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
                loading={this.props.loading}
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

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    userConfig: state.configurationReducer.userConfig,
    loading: state.signupReducer.loading,
  };
};

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
