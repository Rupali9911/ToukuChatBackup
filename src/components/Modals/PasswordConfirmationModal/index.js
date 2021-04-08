// Library imports
import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import Modal from 'react-native-modal';

// Local imports
import {Icons} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';

// Component imports
import Button from '../../Button';

// StyleSheet import
import styles from './styles';

/**
 * Password confirmation modal component
 */
export default class PasswordConfirmationModal extends Component {
  render() {
    const {
      visible,
      onCancel,
      onConfirm,
      title,
      message,
      isLoading,
    } = this.props;
    return (
      <Modal isVisible={visible}>
        <View>
          <View style={styles.container}>
            <View style={styles.infoIconContainer}>
              <Image
                source={Icons.icon_info}
                style={styles.iconInfo}
                resizeMode={'contain'}
              />
            </View>
            <View style={styles.subContainer}>
              <View style={styles.detailContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message ? message : ''}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.buttonSubContainer}>
                  <Button
                    title={translate('swal.cancel')}
                    type={'secondary'}
                    onPress={onCancel}
                    isRounded={false}
                  />
                </View>
                <View style={styles.buttonSubContainer}>
                  <Button
                    title={translate('common.setPassword')}
                    type={'primary'}
                    onPress={isLoading ? null : onConfirm}
                    isRounded={false}
                    loading={isLoading}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
