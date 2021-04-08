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
 * Confirmation modal component
 */
export default class ConfirmationModal extends Component {
  render() {
    const {
      visible,
      onCancel,
      onConfirm,
      title,
      confirmText,
      cancelText,
      message,
      isLoading,
    } = this.props;
    return (
      <Modal isVisible={visible}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Image
              source={Icons.icon_info}
              style={styles.alertImage}
              resizeMode={'contain'}
            />

            <View style={styles.detailsAreaView}>
              <Text style={styles.alertTitleTextStyle}>{title}</Text>
              <Text style={styles.alertmessageTextStyel}>
                {message ? message : ''}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <View style={styles.singleFlex}>
                <Button
                  title={cancelText ? cancelText : translate('common.cancel')}
                  type={'secondary'}
                  onPress={onCancel}
                  isRounded={false}
                />
              </View>
              <View style={styles.sureButtoncContainer}>
                <Button
                  title={
                    confirmText
                      ? confirmText
                      : translate('pages.xchat.toastr.sure')
                  }
                  type={'primary'}
                  onPress={isLoading ? null : onConfirm}
                  isRounded={false}
                  loading={isLoading}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
