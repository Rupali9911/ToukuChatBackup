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
import Toast from '../ToastModal';
import {translate} from '../../redux/reducers/languageReducer';
import {
  changeEmailSendOtp,
  changeEmail,
  getUserProfile,
} from '../../redux/reducers/userReducer';
import {ClickableImage} from '../ImageComponents';

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
      repeatEmail: '',
      oldEmailVerificationCode: '',
      // newEmailVerificationCode: '',
      newEmailErr: null,
      oldEmailVerificationCodeErr: null,
      // newEmailVerificationCodeErr: null,

      emailStatus: true,
      repeatEmailStatus: true,
      sendCodeStatus: false,
    };
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  handleNewEmail(newEmail) {
    this.setState({newEmail});
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (newEmail.trim() === '') {
      this.setState({emailStatus: true});
    } else if (reg.test(newEmail) === false) {
      this.setState({emailStatus: false});
    } else {
      this.setState({emailStatus: true});
    }

    if (this.state.repeatEmail.trim() === '') {
      this.setState({repeatEmailStatus: false});
    } else if (this.state.repeatEmail !== this.state.newEmail) {
      this.setState({repeatEmailStatus: false});
    } else {
      this.setState({repeatEmailStatus: true});
    }
  }

  handleRepeatEmail(repeatEmail) {
    this.setState({repeatEmail});
    if (repeatEmail.trim() === '') {
      this.setState({repeatEmailStatus: true});
    } else if (repeatEmail !== this.state.newEmail) {
      this.setState({repeatEmailStatus: false});
    } else {
      this.setState({repeatEmailStatus: true});
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.newEmail.trim() === '') {
      this.setState({emailStatus: false});
    } else if (reg.test(this.state.newEmail) === false) {
      this.setState({emailStatus: false});
    } else {
      this.setState({emailStatus: true});
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

  // handleNewCode(newEmailVerificationCode) {
  //   this.setState({newEmailVerificationCode});
  //   if (newEmailVerificationCode.trim() === '') {
  //     this.setState({newEmailVerificationCodeErr: 'messages.required'});
  //   } else {
  //     this.setState({newEmailVerificationCodeErr: null});
  //   }
  // }

  onRequestClose = () => {
    this.props.onRequestClose();
    this.setState(this.initialState);
  };

  onSendCodePress() {
    // if (this.state.newEmail.trim() === '') {
    //   this.setState({newEmailErr: 'messages.required'});
    // } else {
    //  this.setState({newEmailErr: null});
    let userEmail = this.props.userData.email;
    let newEmailData = {
      //email: this.state.newEmail,
      email: userEmail,
    };
    console.log('newEmailData', newEmailData);
    this.props
      .changeEmailSendOtp(newEmailData)
      .then((res) => {
        if (res.status === true) {
          this.setState({sendCodeStatus: true});
          Toast.show({
            title: translate('common.sendEmailOTP'),
            text: translate('pages.xchat.toastr.sentOTPToEmailText'),
            type: 'positive',
          });
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data) {
            console.log('err.response.data', err.response.data);
            Toast.show({
              title: translate('common.sendEmailOTP'),
              text: translate(err.response.data.toString()),
              type: 'primary',
            });
          }
        }
        // Toast.show({
        //   title: translate('common.sendEmailOTP'),
        //   text: 'Please try again.',
        //   type: 'primary',
        // });
      });
    // }
  }

  onSubmitData = () => {
    const {
      newEmail,
      oldEmailVerificationCode,
      //newEmailVerificationCode,
      sendCodeStatus,
      repeatEmail,
    } = this.state;
    let isValid = true;

    if (oldEmailVerificationCode.trim() === '') {
      isValid = false;
      if (sendCodeStatus) {
        Toast.show({
          title: translate('pages.xchat.changeEmail'),
          text: translate('pages.xchat.toastr.enterOldEmailCode'),
          type: 'primary',
        });
      } else {
        Toast.show({
          title: translate('pages.xchat.changeEmail'),
          text: translate('pages.xchat.toastr.sendNotSubmitted'),
          type: 'primary',
        });
      }
      return;
      // this.setState({oldEmailVerificationCodeErr: 'messages.required'});
    }

    console.log('newEmail', newEmail.trim() === '');
    if (newEmail.trim() === '') {
      isValid = false;
      Toast.show({
        title: translate('pages.xchat.changeEmail'),
        text: translate('pages.xchat.toastr.enterEmailText'),
        type: 'primary',
      });
      return;
    }

    if (repeatEmail.trim() === '') {
      isValid = false;
      Toast.show({
        title: translate('pages.xchat.changeEmail'),
        text: translate('pages.xchat.reEnterNewEmailAddress'),
        type: 'primary',
      });
      return;
    }
    // if (newEmailVerificationCode.trim() === '') {
    //   isValid = false;
    //   this.setState({newEmailVerificationCodeErr: 'messages.required'});
    // }

    if (isValid) {
      let changeEmailData = {
        code: oldEmailVerificationCode,
        new_email: newEmail,
      };
      this.props
        .changeEmail(changeEmailData)
        .then((res) => {
          Toast.show({
            title: translate('pages.xchat.changeEmail'),
            text: translate('pages.xchat.toastr.emailUpdatedSuccessfully'),
            type: 'positive',
          });
          setTimeout(() => {
            this.props.onRequestClose();
          }, 2000);

          this.props.getUserProfile();
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.data) {
              console.log('err.response.data', err.response.data);
              Toast.show({
                title: translate('pages.xchat.changeEmail'),
                text: translate(err.response.data.message.toString()),
                type: 'primary',
              });
            }
          }
        });
    }
  };

  render() {
    const {visible, userData} = this.props;
    const {
      newEmail,
      oldEmailVerificationCode,
      // newEmailVerificationCode,
      newEmailErr,
      oldEmailVerificationCodeErr,
      newEmailVerificationCodeErr,
      repeatEmail,
      emailStatus,
      repeatEmailStatus,
      sendCodeStatus,
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
                {translate('pages.xchat.changeEmailAddress')}
              </Text>
            </View>
            <ClickableImage
              size={14}
              source={Icons.icon_close}
              onPress={this.onRequestClose.bind(this)}
            />
          </LinearGradient>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={{padding: 15}}>
              <View style={styles.inputContainer}>
                {/*<TextInput*/}
                {/*placeholder={translate('pages.xchat.enterNewemail')}*/}
                {/*value={newEmail}*/}
                {/*onChangeText={(newEmail) => this.handleNewEmail(newEmail)}*/}
                {/*onSubmitEditing={() => {}}*/}
                {/*autoCapitalize={'none'}*/}
                {/*returnKeyType={'done'}*/}
                {/*/>*/}
                <Text>{userData.email}</Text>
              </View>
              {/*{newEmailErr !== null ? (*/}
              {/*<Text*/}
              {/*style={[*/}
              {/*globalStyles.smallLightText,*/}
              {/*{*/}
              {/*color: Colors.danger,*/}
              {/*textAlign: 'left',*/}
              {/*marginStart: 10,*/}
              {/*marginBottom: 5,*/}
              {/*},*/}
              {/*]}>*/}
              {/*{translate(newEmailErr).replace(*/}
              {/*'[missing {{field}} value]',*/}
              {/*translate('common.email'),*/}
              {/*)}*/}
              {/*</Text>*/}
              {/*) : null}*/}

              <Button
                isRounded={false}
                title={
                  sendCodeStatus
                    ? translate('common.resend')
                    : translate('pages.xchat.sendConfirmationCode')
                }
                onPress={() => this.onSendCodePress()}
              />

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={translate('pages.xchat.enterConfirmationCode')}
                  placeholderTextColor={'gray'}
                  style={{color: '#000'}}
                  value={oldEmailVerificationCode}
                  onChangeText={(code) => this.handleOldCode(code)}
                  onSubmitEditing={() => {
                    this.focusNextField('newcode');
                  }}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  keyboardType={'number-pad'}
                />
              </View>
              {/*{oldEmailVerificationCodeErr !== null ? (*/}
              {/*<Text*/}
              {/*style={[*/}
              {/*globalStyles.smallLightText,*/}
              {/*{*/}
              {/*color: Colors.danger,*/}
              {/*textAlign: 'left',*/}
              {/*marginStart: 10,*/}
              {/*marginBottom: 5,*/}
              {/*},*/}
              {/*]}>*/}
              {/*{translate(oldEmailVerificationCodeErr).replace(*/}
              {/*'[missing {{field}} value]',*/}
              {/*translate('common.oldEmailVerificationCode'),*/}
              {/*)}*/}
              {/*</Text>*/}
              {/*) : null}*/}

              <View style={styles.inputContainer}>
                {/*<TextInput*/}
                {/*ref={(ref) => {*/}
                {/*this.inputs['newcode'] = ref;*/}
                {/*}}*/}
                {/*placeholder={translate('common.newEmailVerificationCode')}*/}
                {/*value={newEmailVerificationCode}*/}
                {/*onChangeText={(code) => this.handleNewCode(code)}*/}
                {/*autoCapitalize={'none'}*/}
                {/*returnKeyType={'done'}*/}
                {/*keyboardType={'number-pad'}*/}
                {/*/>*/}
                {/*</View>*/}
                {/*{newEmailVerificationCodeErr !== null ? (*/}
                {/*<Text*/}
                {/*style={[*/}
                {/*globalStyles.smallLightText,*/}
                {/*{*/}
                {/*color: Colors.danger,*/}
                {/*textAlign: 'left',*/}
                {/*marginStart: 10,*/}
                {/*marginBottom: 5,*/}
                {/*},*/}
                {/*]}>*/}
                {/*{translate(newEmailVerificationCodeErr).replace(*/}
                {/*'[missing {{field}} value]',*/}
                {/*translate('common.newEmailVerificationCode'),*/}
                {/*)}*/}
                {/*</Text>*/}
                {/*) : null}*/}

                <TextInput
                  placeholder={translate('pages.xchat.EnterEmailAfterChange')}
                  placeholderTextColor={'gray'}
                  style={{color: '#000'}}
                  value={newEmail}
                  onChangeText={(newEmail) => this.handleNewEmail(newEmail)}
                  onSubmitEditing={() => {}}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={translate('pages.xchat.reEnterEmailAfterChange')}
                  placeholderTextColor={'gray'}
                  style={{color: '#000'}}
                  value={repeatEmail}
                  onChangeText={(repeatEmail) =>
                    this.handleRepeatEmail(repeatEmail)
                  }
                  onSubmitEditing={() => {}}
                  autoCapitalize={'none'}
                  returnKeyType={'done'}
                />
              </View>
              <Button
                isRounded={false}
                title={translate('common.submit')}
                onPress={this.onSubmitData.bind(this)}
                disabled={(emailStatus && repeatEmailStatus) === false}
              />
              <Button
                isRounded={false}
                type={'secondary'}
                title={translate('swal.goBack')}
                onPress={this.onRequestClose.bind(this)}
              />
            </View>
          </KeyboardAwareScrollView>
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
