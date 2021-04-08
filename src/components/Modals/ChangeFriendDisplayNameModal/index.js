// Library imports
import React, {Component} from 'react';
import {Text, TextInput, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';

// Local imports
import {Colors, Icons} from '../../../constants';
import {updateFriendDisplayName} from '../../../redux/reducers/friendReducer';
import {translate} from '../../../redux/reducers/languageReducer';
import {getUserProfile} from '../../../redux/reducers/userReducer';
import {wait} from '../../../utils';
import {globalStyles} from '../../../styles';

// StyleSheet import
import styles from './styles';

// Component imports
import Button from '../../Button';
import ClickableImage from '../../ClickableImage';
import Toast from '../../ToastModal';

/**s
 * Change friend's display name modal component
 */
class ChangeFriendDisplayNameModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.isLoading = false;
  }

  // Get initial state
  get initialState() {
    return {
      displayName: this.props.currentFriend.display_name,
      displayNameErr: null,
    };
  }

  /**
   * Triggers when user presses the change
   * display name button
   */
  onChangePress = async () => {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
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
          if (res.status === true) {
            Toast.show({
              title: translate('pages.changeDisplayName'),
              text: translate('pages.setting.toastr.nameUpdatedSuccessfully'),
              type: 'positive',
            });
            setTimeout(() => {
              console.log('this.props.currentFriend', this.props.currentFriend);
              this.props.onRequestClose();
              this.isLoading = false;
            }, 1500);
            return;
          }
          this.props.onRequestClose();
        })
        .catch(() => {
          this.props.onRequestClose();
          Toast.show({
            title: translate('pages.changeDisplayName'),
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
          this.isLoading = false;
        });
    }
  };

  // Process the display name input field
  handleDisplayName(name) {
    this.setState({name});
    if (name.trim() === '') {
      this.setState({
        displayNameErr: 'pages.setting.toastr.enterValidDisplayName',
      });
    } else {
      this.setState({displayNameErr: null});
    }
  }

  // When the modal is closed
  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState(this.initialState);
    });
  };

  render() {
    const {visible} = this.props;
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
            <View style={styles.singleFlex}>
              <Text style={[globalStyles.normalLightText, styles.name]}>
                {translate('pages.changeDisplayName')}
              </Text>
            </View>
            <ClickableImage
              size={14}
              source={Icons.icon_close}
              onPress={this.onRequestClose.bind(this)}
            />
          </LinearGradient>

          <View style={styles.nameLengthContainer}>
            <Text style={styles.nameLength}>
              {displayName.length}/{32}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={translate('common.enterDisplayName')}
                value={displayName}
                onChangeText={(name) => this.handleDisplayName(name)}
                maxLength={32}
                autoCapitalize={'none'}
                onSubmitEditing={() => {}}
              />
            </View>
            {displayNameErr ? (
              <Text style={[globalStyles.smallLightText, styles.nameError]}>
                {translate(displayNameErr)}
              </Text>
            ) : null}
            <Button
              isRounded={false}
              title={translate('pages.changeDisplayName')}
              onPress={this.isLoading ? null : this.onChangePress.bind(this)}
              loading={this.isLoading}
            />
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

/**
 * @Redux - Map following state to props
 * @param {object} state - current state in storeed in redux
 * @returns object
 */
const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    loading: state.userReducer.loading,
    currentFriend: state.friendReducer.currentFriend,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {
  getUserProfile,
  updateFriendDisplayName,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangeFriendDisplayNameModal);
