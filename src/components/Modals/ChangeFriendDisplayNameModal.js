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
import {updateFriendDisplayName} from '../../redux/reducers/friendReducer';
import {updateConfiguration} from '../../redux/reducers/configurationReducer';
import Toast from '../ToastModal';
import {ClickableImage} from '../ImageComponents';

class ChangeFriendDisplayNameModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      displayName: this.props.currentFriend.display_name,
      displayNameErr: null,
    };
  }

  onChangePress = () => {
    const {displayName} = this.state;
    if (displayName.trim() === '') {
      this.setState({
        displayNameErr: 'pages.setting.toastr.enterValidDisplayName',
      });
    } else {
      let payload = {
        display_name: displayName,
        friend_id: this.props.currentFriend.friend,
      };
      this.props
        .updateFriendDisplayName(payload)
        .then((res) => {
          this.props.onRequestClose();
          if (res.status === true) {
            Toast.show({
              title: translate('pages.changeDisplayName'),
              text: translate('pages.setting.toastr.nameUpdatedSuccessfully'),
              type: 'positive',
            });
            // setTimeout(() => {
            //   this.props.onRequestClose();
            // }, 2000);
          }
        })
        .catch((err) => {
          this.props.onRequestClose();
          // setTimeout(() => {
          // }, 2000);
          Toast.show({
            title: translate('pages.changeDisplayName'),
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    }
  };

  handleDisplayName(displayName) {
    this.setState({displayName});
    if (displayName.trim() === '') {
      this.setState({
        displayNameErr: 'pages.setting.toastr.enterValidDisplayName',
      });
    } else {
      this.setState({displayNameErr: null});
    }
  }

  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState(this.initialState);
    });
  };

  render() {
    const {visible, loading, currentFriend} = this.props;
    const {displayName, displayNameErr} = this.state;
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
                {translate('pages.changeDisplayName')}
              </Text>
            </View>
            <ClickableImage
              size={14}
              source={Icons.icon_close}
              onPress={this.onRequestClose.bind(this)}
            />
          </LinearGradient>

          <View style={{padding: 15}}>
            <Text
              style={{
                color: Colors.gray_dark,
                textAlign: 'right',
              }}>
              {displayName.length}/{32}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={translate('common.enterDisplayName')}
                value={displayName}
                onChangeText={(displayName) =>
                  this.handleDisplayName(displayName)
                }
                maxLength={32}
                autoCapitalize={'none'}
                onSubmitEditing={() => {}}
              />
            </View>
            {displayNameErr !== null ? (
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
                {translate(displayNameErr)}
              </Text>
            ) : null}
            <Button
              isRounded={false}
              title={translate('pages.changeDisplayName')}
              onPress={this.onChangePress.bind(this)}
              loading={loading}
            />
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
    loading: state.userReducer.loading,
    currentFriend: state.friendReducer.currentFriend,
  };
};

const mapDispatchToProps = {
  getUserProfile,
  updateFriendDisplayName,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeFriendDisplayNameModal);
