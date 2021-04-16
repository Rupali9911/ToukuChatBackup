// Library imports
import React, {Component} from 'react';

import Modal from 'react-native-modal';

// Component imports
import {UserProfile} from '../../ModalContents';

// StyleSheet import
import styles from './styles';

/**
 * Profile modal component
 */
export default class ProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  // Static instance of user profile
  static userProfleInstance;

  // Displays the modal performs initial processes
  static show({...config}) {
    this.userProfleInstance.start(config);
  }

  // Hides the modal
  static hide() {
    this.userProfleInstance.hideModal();
  }

  // Sets the modal visibility state to true
  start({...config}) {
    this.setState({
      visible: true,
    });
  }

  // Sets the modal visibility state to false
  hideModal() {
    this.setState({visible: false});
  }

  render() {
    const {visible} = this.state;
    return (
      <Modal
        coverScreen={false}
        isVisible={visible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        animationInTiming={500}
        animationOutTiming={600}
        backdropTransitionInTiming={500}
        backdropTransitionOutTiming={700}
        backdropOpacity={0.4}
        onBackButtonPress={() => this.hideModal()}
        onBackdropPress={() => this.hideModal()}
        style={styles.modalBackground}>
        <UserProfile onRequestClose={() => this.hideModal()} />
      </Modal>
    );
  }
}
