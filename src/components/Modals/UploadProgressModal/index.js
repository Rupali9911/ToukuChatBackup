// Library imports
import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import { ProgressBar } from 'react-native-paper';

// Local imports
import {Icons, Colors} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';

// Component imports
import Button from '../../Button';

// StyleSheet import
import styles from './styles';

/**
 * Confirmation modal component
 */
export default class UploadProgressModal extends Component {
  render() {
    const {
      visible,
      title,
      progress
    } = this.props;
    return (
        <Modal isVisible={visible}>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Image
                        source={Icons.icon_upload}
                        style={styles.alertImage}
                        resizeMode={'contain'}
                    />

                    <View style={styles.detailsAreaView}>
                        <Text style={styles.alertmessageTextStyel}>{title}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <ProgressBar style={{width: 300}} progress={progress} color={Colors.primary} />
                    </View>
                </View>
            </View>
        </Modal>
    );
  }
}
