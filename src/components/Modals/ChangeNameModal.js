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

import {Colors, Fonts, Images, Icons} from '../../constants';
import RoundedImage from '../RoundedImage';
import {globalStyles} from '../../styles';
import Button from '../Button';
import {wait} from '../../utils';
import {translate} from '../../redux/reducers/languageReducer';
import {
  changeNameDetails,
  getUserProfile,
} from '../../redux/reducers/userReducer';
import Toast from '../Toast';

class ChangeNameModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      fisrtName: this.props.userData.first_name,
      lastName: this.props.userData.last_name,
      fisrtNameErr: null,
      lastNameErr: null,
    };
  }

  onChangePress = () => {
    const {fisrtName, lastName} = this.state;
    if (fisrtName.trim() === '') {
      this.setState({fisrtNameErr: 'messages.required'});
    } else if (lastName.trim() === '') {
      this.setState({lastNameErr: 'messages.required'});
    } else {
      let nameDetails = {
        first_name: fisrtName,
        last_name: lastName,
      };
      this.props
        .changeNameDetails(nameDetails)
        .then((res) => {
          if (res.status === true) {
            this.props.onRequestClose();
            Toast.show({
              title: translate('pages.setting.changeName'),
              text: translate('pages.setting.toastr.nameUpdatedSuccessfully'),
              type: 'positive',
            });
            this.props.getUserProfile();
          }
        })
        .catch((err) => {
          this.props.onRequestClose();
          Toast.show({
            title: translate('pages.setting.changeName'),
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    }
  };

  handleFirstName(fisrtName) {
    this.setState({fisrtName});
    if (fisrtName.trim() === '') {
      this.setState({fisrtNameErr: 'messages.required'});
    } else {
      this.setState({fisrtNameErr: null});
    }
  }

  handleLastName(lastName) {
    this.setState({lastName});
    if (lastName.trim() === '') {
      this.setState({lastNameErr: 'messages.required'});
    } else {
      this.setState({lastNameErr: null});
    }
  }

  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState(this.initialState);
    });
  };

  render() {
    const {visible, loading} = this.props;
    const {fisrtName, lastName, fisrtNameErr, lastNameErr} = this.state;
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
                {translate('pages.setting.changeName')}
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
          <View style={{padding: 15}}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={translate('common.firstName')}
                value={fisrtName}
                onChangeText={(fisrtName) => this.handleFirstName(fisrtName)}
              />
            </View>
            {fisrtNameErr !== null ? (
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
                {translate(fisrtNameErr).replace(
                  '[missing {{field}} value]',
                  translate('common.firstName'),
                )}
              </Text>
            ) : null}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={translate('common.lastName')}
                value={lastName}
                onChangeText={(lastName) => this.handleLastName(lastName)}
              />
            </View>
            {lastNameErr !== null ? (
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
                {translate(lastNameErr).replace(
                  '[missing {{field}} value]',
                  translate('common.lastName'),
                )}
              </Text>
            ) : null}
            <Button
              isRounded={false}
              title={translate('pages.setting.changeName')}
              onPress={this.onChangePress.bind(this)}
              loading={loading}
            />
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
  changeNameDetails,
  getUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeNameModal);
