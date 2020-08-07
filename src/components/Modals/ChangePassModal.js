import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Platform} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {Colors, Icons} from '../../constants';
import {globalStyles} from '../../styles';
import Button from '../Button';
import {wait} from '../../utils';
import {translate} from '../../redux/reducers/languageReducer';
import Toast from '../Toast';
import {changePassword, getUserProfile} from '../../redux/reducers/userReducer';
import {ClickableImage} from '../ImageComponents';

class ChangePassModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

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

  focusNextField(id) {
    this.inputs[id].focus();
  }

  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState(this.initialState);
    });
  };

  handleOldPassword(oldPassword) {
    this.setState({oldPassword});
    if (oldPassword.trim() === '') {
      this.setState({oldPasswordErr: 'messages.required'});
    } else {
      this.setState({oldPasswordErr: null});
    }
  }

  handleNewPassword(newPassword) {
    this.setState({newPassword});
    if (newPassword.trim() === '') {
      this.setState({newPasswordErr: 'messages.required'});
    } else {
      this.setState({newPasswordErr: null});
    }
  }

  handleConfirmPassword(confirmPassword) {
    this.setState({confirmPassword});
    if (confirmPassword.trim() === '') {
      this.setState({confirmPasswordErr: 'messages.required'});
    } else {
      this.setState({confirmPasswordErr: null});
    }
  }

  onChangePasswordPress = () => {
    const {
      oldPassword,
      newPassword,
      confirmPassword,
      oldPasswordErr,
      newPasswordErr,
      confirmPasswordErr,
    } = this.state;

    let isValid = true;

    if (oldPassword.trim() === '') {
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
    if (confirmPassword != newPassword) {
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
          this.props.onRequestClose();
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
          Toast.show({
            title: translate('pages.resetPassword.changePassword'),
            text: 'Invalid current password',
            type: 'primary',
          });
        });
    }
  };

  render() {
    const {visible, loading} = this.props;
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
                {translate('pages.resetPassword.changePassword')}
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
                <TextInput
                  placeholder={translate('pages.setting.oldPassword')}
                  value={oldPassword}
                  onChangeText={(oldPassword) =>
                    this.handleOldPassword(oldPassword)
                  }
                  onSubmitEditing={() => {
                    this.focusNextField('newpassword');
                  }}
                  autoCapitalize={'none'}
                  secureTextEntry={true}
                  returnKeyType={'next'}
                />
              </View>
              {oldPasswordErr !== null ? (
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
                  {translate(oldPasswordErr).replace(
                    '[missing {{field}} value]',
                    translate('pages.setting.oldPassword'),
                  )}
                </Text>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  ref={(ref) => {
                    this.inputs['newpassword'] = ref;
                  }}
                  placeholder={translate('pages.setting.newPassword')}
                  value={newPassword}
                  onChangeText={(newPassword) =>
                    this.handleNewPassword(newPassword)
                  }
                  onSubmitEditing={() => {
                    this.focusNextField('confirmpassword');
                  }}
                  autoCapitalize={'none'}
                  secureTextEntry={true}
                  returnKeyType={'next'}
                />
              </View>
              {newPasswordErr !== null ? (
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
                  {translate(newPasswordErr).replace(
                    '[missing {{field}} value]',
                    translate('pages.setting.newPassword'),
                  )}
                </Text>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  ref={(ref) => {
                    this.inputs['confirmpassword'] = ref;
                  }}
                  placeholder={translate('pages.setting.confirmPassword')}
                  value={confirmPassword}
                  onChangeText={(confirmPassword) =>
                    this.handleConfirmPassword(confirmPassword)
                  }
                  autoCapitalize={'none'}
                  secureTextEntry={true}
                  returnKeyType={'done'}
                />
              </View>
              {confirmPasswordErr !== null ? (
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
                  {translate(confirmPasswordErr).replace(
                    '[missing {{field}} value]',
                    translate('pages.setting.confirmPassword'),
                  )}
                </Text>
              ) : null}

              <Button
                isRounded={false}
                title={translate('pages.resetPassword.changePasswordButton')}
                onPress={this.onChangePasswordPress.bind(this)}
                loading={loading}
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
    loading: state.userReducer.loading,
  };
};

const mapDispatchToProps = {
  changePassword,
  getUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassModal);
