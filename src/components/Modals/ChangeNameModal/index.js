// Library imports
import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Platform} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

// Local imports
import {Colors, Icons} from '../../../constants';
import {globalStyles} from '../../../styles';
import {translate} from '../../../redux/reducers/languageReducer';
import {getUserProfile} from '../../../redux/reducers/userReducer';
import {updateConfiguration} from '../../../redux/reducers/configurationReducer';
import {wait} from '../../../utils';

// Component imports
import Button from '../../Button';
import Toast from '../../ToastModal';
import ClickableImage from '../../ClickableImage';

// StyleSheet import
import styles from './styles';

/**
 * Change name modal component
 */
class ChangeNameModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  // Get initial state
  get initialState() {
    return {
      displayName: this.props.userConfig.display_name,
      displayNameErr: null,
    };
  }

  /**
   * Triggers when user presses the change
   * display name button
   */
  onChangePress = () => {
    const {displayName} = this.state;
    if (displayName.trim() === '') {
      this.setState({
        displayNameErr: 'pages.setting.toastr.enterValidDisplayName',
      });
    } else {
      let configuration = {
        display_name: displayName,
      };
      this.props
        .updateConfiguration(configuration)
        .then((res) => {
          if (res.status === true) {
            Toast.show({
              title: translate('pages.changeDisplayName'),
              text: translate('pages.setting.toastr.nameUpdatedSuccessfully'),
              type: 'positive',
            });
            setTimeout(() => {
              this.props.onRequestClose();
            }, 2000);

            this.props.getUserProfile();
          }
        })
        .catch(() => {
          setTimeout(() => {
            this.props.onRequestClose();
          }, 2000);
          Toast.show({
            title: translate('pages.changeDisplayName'),
            text: translate('common.somethingWentWrong'),
            type: 'primary',
          });
        });
    }
  };

  // Process the display name input field
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

  // When the modal is closed
  onRequestClose = () => {
    this.props.onRequestClose();
    wait(800).then(() => {
      this.setState(this.initialState);
    });
  };

  render() {
    const {visible, loading} = this.props;
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
              onPress={this.onChangePress.bind(this)}
              loading={loading}
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
 * @param {object} state - current state in stored in redux
 * @returns object
 */
const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData,
    userConfig: state.configurationReducer.userConfig,
    loading: state.userReducer.loading,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {
  getUserProfile,
  updateConfiguration,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeNameModal);
