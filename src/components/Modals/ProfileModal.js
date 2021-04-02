import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import {Colors, Fonts, Images, Icons} from '../../constants';
import {UserProfile} from '../ModalContents';

export default class ProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  static userProfleInstance;

  static show({...config}) {
    this.userProfleInstance.start(config);
  }

  static hide() {
    this.userProfleInstance.hideModal();
  }

  start({...config}) {
    this.setState({
      visible: true,
    });
  }

  hideModal() {
    this.setState({visible: false});
  }

  render() {
    const {visible} = this.state;
    return (
      <Modal
        coverScreen={false}
        isVisible={visible}
        animationIn="fadeIn"
        animationOut="fadeOut"
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

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    display: 'flex',
    overflow: 'visible',
    zIndex: 0,
  },
  Wrapper: {
    width: '80%',
    backgroundColor: 'transparent',
    display: 'flex',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'visible',
    zIndex: 0,
  },
  firstView: {
    height: 150,
    borderBottomWidth: 1,
    alignItems: 'flex-end',
    padding: 10,
  },
  firstBottomView: {
    bottom: 0,
    position: 'absolute',
    padding: 10,
  },
  centerBottomView: {
    bottom: 0,
    right: 0,
    position: 'absolute',
  },
  iconClose: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  textNormal: {
    textAlign: 'left',
    color: Colors.black,
  },
  inputTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});
