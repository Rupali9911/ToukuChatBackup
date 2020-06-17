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
import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import Button from '../Button';
import Toast from '../Toast';
import {translate} from '../../redux/reducers/languageReducer';
import {
  changeEmailSendOtp,
  changeEmail,
  getUserProfile,
} from '../../redux/reducers/userReducer';

class ChangeEmailModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  get initialState() {
    return {
      newEmail: '',
      oldEmailVerificationCode: '',
      newEmailVerificationCode: '',
      newEmailErr: null,
      oldEmailVerificationCodeErr: null,
      newEmailVerificationCodeErr: null,
    };
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  handleNewEmail(newEmail) {
    this.setState({newEmail});
    if (newEmail.trim() === '') {
      this.setState({newEmailErr: 'messages.required'});
    } else {
      this.setState({newEmailErr: null});
    }
  }

  handleOldCode(oldEmailVerificationCode) {
    this.setState({oldEmailVerificationCode});
    if (oldEmailVerificationCode.trim() === '') {
      this.setState({oldEmailVerificationCodeErr: 'messages.required'});
    } else {
      this.setState({oldEmailVerificationCodeErr: null});
    }
  }

  handleNewCode(newEmailVerificationCode) {
    this.setState({newEmailVerificationCode});
    if (newEmailVerificationCode.trim() === '') {
      this.setState({newEmailVerificationCodeErr: 'messages.required'});
    } else {
      this.setState({newEmailVerificationCodeErr: null});
    }
  }

  onRequestClose = () => {
    this.props.onRequestClose();
    this.setState(this.initialState);
  };

  onSendCodePress() {
    if (this.state.newEmail.trim() === '') {
      this.setState({newEmailErr: 'messages.required'});
    } else {
      this.setState({newEmailErr: null});
      let newEmailData = {
        email: this.state.newEmail,
      };
      this.props
        .changeEmailSendOtp(newEmailData)
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: translate('common.sendEmailOTP'),
              text: translate('pages.xchat.toastr.sentOTPToEmailText'),
              type: 'positive',
            });
          }
        })
        .catch((err) => {
          Toast.show({
            title: translate('common.sendEmailOTP'),
            text: 'Please try again.',
            type: 'primary',
          });
        });
    }
  }

  onSubmitData = () => {
    const {
      newEmail,
      oldEmailVerificationCode,
      newEmailVerificationCode,
    } = this.state;
    let isValid = true;

    if (newEmail.trim() === '') {
      isValid = false;
      this.setState({newEmailErr: 'messages.required'});
    }

    if (oldEmailVerificationCode.trim() === '') {
      isValid = false;
      this.setState({oldEmailVerificationCodeErr: 'messages.required'});
    }
    if (newEmailVerificationCode.trim() === '') {
      isValid = false;
      this.setState({newEmailVerificationCodeErr: 'messages.required'});
    }

    if (isValid) {
      let changeEmailData = {
        new_code: newEmailVerificationCode,
        new_email: newEmail,
        old_code: oldEmailVerificationCode,
      };
      this.props
        .changeEmail(changeEmailData)
        .then((res) => {
          Toast.show({
            title: translate('pages.xchat.changeEmail'),
            text: translate('pages.xchat.toastr.emailUpdatedSuccessfully'),
            type: 'positive',
          });
        })
        .catch((err) => {
          Toast.show({
            title: translate('pages.xchat.changeEmail'),
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    }
  };

  render() {
    const {visible} = this.props;
    const {
      newEmail,
      oldEmailVerificationCode,
      newEmailVerificationCode,
      newEmailErr,
      oldEmailVerificationCodeErr,
      newEmailVerificationCodeErr,
    } = this.state;
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
                {translate('pages.xchat.changeEmail')}
              </Text>
            </View>
            <RoundedImage
              source={Icons.icon_close}
              color={Colors.white}
              size={14}
              isRounded={false}
              clickable={true}
              onClick={this.onRequestClose.bind(this)}
            />
          </LinearGradient>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={{padding: 15}}>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={translate('pages.xchat.enterNewemail')}
                  value={newEmail}
                  onChangeText={(newEmail) => this.handleNewEmail(newEmail)}
                  onSubmitEditing={() => {}}
                  autoCapitalize={false}
                  returnKeyType={'done'}
                />
              </View>
              {newEmailErr !== null ? (
                <Text
                  style={[
                    globalStyles.smallLightText,
                    {
                      color: Colors.danger,
                      textAlign: 'left',
                      marginStart: 10,
                      marginBottom: 5,
                    },
                  ]}>
                  {translate(newEmailErr).replace(
                    '[missing {{field}} value]',
                    translate('common.email'),
                  )}
                </Text>
              ) : null}

              <Button
                isRounded={false}
                title={translate('common.sendCode')}
                onPress={() => this.onSendCodePress()}
              />

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={translate('common.oldEmailVerificationCode')}
                  value={oldEmailVerificationCode}
                  onChangeText={(code) => this.handleOldCode(code)}
                  onSubmitEditing={() => {
                    this.focusNextField('newcode');
                  }}
                  autoCapitalize={false}
                  returnKeyType={'next'}
                  keyboardType={'number-pad'}
                />
              </View>
              {oldEmailVerificationCodeErr !== null ? (
                <Text
                  style={[
                    globalStyles.smallLightText,
                    {
                      color: Colors.danger,
                      textAlign: 'left',
                      marginStart: 10,
                      marginBottom: 5,
                    },
                  ]}>
                  {translate(oldEmailVerificationCodeErr).replace(
                    '[missing {{field}} value]',
                    translate('common.oldEmailVerificationCode'),
                  )}
                </Text>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  ref={(ref) => {
                    this.inputs['newcode'] = ref;
                  }}
                  placeholder={translate('common.newEmailVerificationCode')}
                  value={newEmailVerificationCode}
                  onChangeText={(code) => this.handleNewCode(code)}
                  autoCapitalize={false}
                  returnKeyType={'done'}
                  keyboardType={'number-pad'}
                />
              </View>
              {newEmailVerificationCodeErr !== null ? (
                <Text
                  style={[
                    globalStyles.smallLightText,
                    {
                      color: Colors.danger,
                      textAlign: 'left',
                      marginStart: 10,
                      marginBottom: 5,
                    },
                  ]}>
                  {translate(newEmailVerificationCodeErr).replace(
                    '[missing {{field}} value]',
                    translate('common.newEmailVerificationCode'),
                  )}
                </Text>
              ) : null}

              <Button
                isRounded={false}
                title={translate('common.submit')}
                onPress={this.onSubmitData.bind(this)}
              />
              <Button
                isRounded={false}
                type={'secondary'}
                title={translate('common.cancel')}
                onPress={this.onRequestClose.bind(this)}
              />
            </View>
          </KeyboardAwareScrollView>
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
    padding: Platform.OS === 'ios' ? 10 : 0,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginVertical: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    loading: state.userReducer.loading,
  };
};

const mapDispatchToProps = {
  changeEmailSendOtp,
  changeEmail,
  getUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmailModal);
