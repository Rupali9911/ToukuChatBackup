// Library imports
import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';

// Local imports
import {Colors, Icons} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';
import {
  changePassword,
  getUserProfile,
} from '../../../redux/reducers/userReducer';
import {globalStyles} from '../../../styles';
import {wait} from '../../../utils';

// Component imports
import Button from '../../Button';
import ClickableImage from '../../ClickableImage';
import Toast from '../../ToastModal';

// StyleSheet import
import styles from './styles';

/**
 * Change pass modal component
 */
class ChangePassModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  // Get initial state
  get initialState() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      oldPasswordErr: null,
      newPasswordErr: null,
      confirmPasswordErr: null,
    };
  }

  // Focus on text input field based on given id
  focusNextField(id) {
    this.inputs[id].focus();
  }

  // When modal is closed
  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState(this.initialState);
    });
  };

  // Process old password input
  handleOldPassword(oldPassword) {
    this.setState({oldPassword});
    if (oldPassword.trim() === '') {
      this.setState({oldPasswordErr: 'messages.required'});
    } else {
      this.setState({oldPasswordErr: null});
    }
  }

  // Process new password input
  handleNewPassword(newPassword) {
    this.setState({newPassword});
    if (newPassword.trim() === '') {
      this.setState({newPasswordErr: 'messages.required'});
    } else {
      this.setState({newPasswordErr: null});
    }
  }

  // Process confirm password input
  handleConfirmPassword(confirmPassword) {
    this.setState({confirmPassword});
    if (confirmPassword.trim() === '') {
      this.setState({confirmPasswordErr: 'messages.required'});
    } else {
      this.setState({confirmPasswordErr: null});
    }
  }

  // When user presses the change password button
  onChangePasswordPress = () => {
    const {isSetPassword} = this.props;
    const {oldPassword, newPassword, confirmPassword} = this.state;

    let isValid = true;

    if (!isSetPassword && oldPassword.trim() === '') {
      isValid = false;
      this.setState({oldPasswordErr: 'messages.required'});
    }
    if (newPassword.trim() === '') {
      isValid = false;
      this.setState({newPasswordErr: 'messages.required'});
    }
    if (confirmPassword.trim() === '') {
      isValid = false;
      this.setState({confirmPasswordErr: 'messages.required'});
    }
    if (confirmPassword !== newPassword) {
      isValid = false;
      Toast.show({
        title: translate('pages.resetPassword.changePassword'),
        text: translate('toastr.confirmPasswordDoNotMatch'),
        type: 'primary',
      });
    }
    if (isValid) {
      this.setState({
        oldPasswordErr: null,
        newPasswordErr: null,
        confirmPasswordErr: null,
      });

      let changePassData = {
        old_password: oldPassword,
        password: confirmPassword,
      };

      this.props
        .changePassword(changePassData)
        .then((res) => {
          setTimeout(() => {
            this.props.onRequestClose();
          }, 2000);
          if (res.status === true) {
            Toast.show({
              title: translate('pages.resetPassword.changePassword'),
              text: translate('pages.resetPassword.toastr.passwordUpdated'),
              type: 'positive',
            });
          } else {
            Toast.show({
              title: translate('pages.resetPassword.changePassword'),
              text: 'Invalid current password',
              type: 'primary',
            });
          }
        })
        .catch((err) => {
          console.log('Error from Change Password API', err)
            if (err.response) {
                console.log('err.response',err.response);
                if (err.response && err.response.data && err.response.data.message) {
                        Toast.show({
                            title: translate('pages.resetPassword.changePassword'),
                            text: err.response.data.message.includes("backend") ? translate(err.response.data.message.toString()) : err.response.data.message.toString(),
                            type: 'primary',
                        });
                }else{
                        Toast.show({
                            title: translate('pages.resetPassword.changePassword'),
                            text: 'Invalid current password',
                            type: 'primary',
                        });
                }
            }
        });
    }
  };

  render() {
    const {visible, loading, isSetPassword} = this.props;
    const {
      oldPassword,
      newPassword,
      confirmPassword,
      oldPasswordErr,
      newPasswordErr,
      confirmPasswordErr,
    } = this.state;

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
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollViewContainer}
          contentContainerStyle={styles.scrollViewContentContainer}>
          <View style={styles.Wrapper}>
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.8, y: 0.3}}
              locations={[0.1, 0.5, 0.8]}
              colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
              style={styles.header}>
              <View style={styles.singleFlex}>
                <Text
                  style={[globalStyles.normalLightText, styles.changePassword]}>
                  {translate('pages.resetPassword.changePassword')}
                </Text>
              </View>
              <ClickableImage
                size={14}
                source={Icons.icon_close}
                onPress={this.onRequestClose.bind(this)}
              />
            </LinearGradient>

            <View style={styles.oldPassInputContainer}>
              {isSetPassword ? null : (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={translate('pages.setting.oldPassword')}
                    value={oldPassword}
                    onChangeText={(oldPass) => this.handleOldPassword(oldPass)}
                    onSubmitEditing={() => {
                      this.focusNextField('newpassword');
                    }}
                    autoCapitalize={'none'}
                    secureTextEntry={true}
                    returnKeyType={'next'}
                  />
                </View>
              )}
              {oldPasswordErr && (
                <Text style={[globalStyles.smallLightText, styles.errorText]}>
                  {translate(oldPasswordErr).replace(
                    '[missing {{field}} value]',
                    translate('pages.setting.oldPassword'),
                  )}
                </Text>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                    color={Colors.black}
                  ref={(ref) => {
                    this.inputs.newpassword = ref;
                  }}
                  placeholder={translate('pages.setting.newPassword')}
                    placeholderTextColor={'gray'}
                  value={newPassword}
                  onChangeText={(newPass) => this.handleNewPassword(newPass)}
                  onSubmitEditing={() => {
                    this.focusNextField('confirmpassword');
                  }}
                  autoCapitalize={'none'}
                  secureTextEntry={true}
                  returnKeyType={'next'}
                />
              </View>
              {newPasswordErr && (
                <Text style={[globalStyles.smallLightText, styles.errorText]}>
                  {translate(newPasswordErr).replace(
                    '[missing {{field}} value]',
                    translate('pages.setting.newPassword'),
                  )}
                </Text>
              )}

              <View style={styles.inputContainer}>
                <TextInput
                    color={Colors.black}
                  ref={(ref) => {
                    this.inputs.confirmpassword = ref;
                  }}
                  placeholder={translate('pages.setting.confirmPassword')}
                    placeholderTextColor={'gray'}
                  value={confirmPassword}
                  onChangeText={(confirmPass) =>
                    this.handleConfirmPassword(confirmPass)
                  }
                  autoCapitalize={'none'}
                  secureTextEntry={true}
                  returnKeyType={'done'}
                />
              </View>
              {confirmPasswordErr && (
                <Text style={[globalStyles.smallLightText, styles.errorText]}>
                  {translate(confirmPasswordErr).replace(
                    '[missing {{field}} value]',
                    translate('pages.setting.confirmPassword'),
                  )}
                </Text>
              )}

              <Button
                isRounded={false}
                title={translate('pages.resetPassword.changePasswordButton')}
                onPress={this.onChangePasswordPress.bind(this)}
                loading={loading}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
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
    loading: state.userReducer.loading,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {
  changePassword,
  getUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassModal);
