// Library imports
import React, {Component} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';

// Local imports
import {Colors} from '../../../constants';
import {
  setI18nConfig,
  translate,
} from '../../../redux/reducers/languageReducer';

// StyleSheet imports
import styles from './styles';

/**
 * Upload select modal component
 */
class UploadSelectModal extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {};
  }

  // Send type from props to the parent component
  send = async (type) => {
    this.props.onSelect(type);
  };

  render() {
    const {visible, toggleSelectModal} = this.props;

    const container = {
      flex: this.state.orientation === 'LANDSCAPE' ? 0.9 : 0.95,
    };

    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={() => toggleSelectModal(false)}
        onBackdropPress={() => toggleSelectModal(false)}>
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={[container, styles.container]}>
            <LinearGradient
              start={{x: 0.1, y: 0.7}}
              end={{x: 0.5, y: 0.8}}
              locations={[0.1, 0.6, 1]}
              colors={[Colors.gradient_3, Colors.gradient_2, Colors.gradient_1]}
              style={styles.gradientContainer}>
              <Text style={styles.uploadTypeText}>
                {translate('pages.xchat.uploadType')}
              </Text>
            </LinearGradient>
            <View style={styles.mediaContainer}>
              <TouchableOpacity
                style={styles.mediaActionContainer}
                onPress={() => this.send('images')}>
                <Text style={styles.mediaLabelText}>
                  {translate('pages.xchat.image')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mediaActionContainer}
                onPress={() => this.send('video')}>
                <Text style={styles.mediaLabelText}>
                  {translate('pages.xchat.videoForUploadType')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
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
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UploadSelectModal);
