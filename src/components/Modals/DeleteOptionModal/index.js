// Library imports
import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import Modal from 'react-native-modal';

// Local imports
import {Icons} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';
import {normalize} from '../../../utils';
import Button from '../../Button';

// StyleSheet import
import styles from './styles';

/**
 * Delete option modal component
 */
export default class DeleteOptionModal extends Component {
  render() {
    const {
      visible,
      onCancel,
      onConfirm,
      title,
      confirmText,
      cancelText,
      message,
      isDeleteMeLoading,
      isDeleteEveryoneLoading,
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
              <Button
                title={
                  confirmText
                    ? confirmText
                    : translate('swal.deleteFromeveyOne')
                }
                type={'primary'}
                height={normalize(28)}
                onPress={
                  isDeleteMeLoading || isDeleteEveryoneLoading
                    ? null
                    : () => {
                        onConfirm('DELETE_FOR_EVERYONE');
                      }
                }
                isRounded={false}
                loading={isDeleteEveryoneLoading}
              />
              <Button
                title={translate('swal.deleteFromMe')}
                type={'primary'}
                height={normalize(28)}
                onPress={
                  isDeleteMeLoading || isDeleteEveryoneLoading
                    ? null
                    : () => {
                        onConfirm('DELETE_FOR_ME');
                      }
                }
                isRounded={false}
                loading={isDeleteMeLoading}
              />
              <Button
                title={cancelText ? cancelText : translate('common.cancel')}
                type={'secondary'}
                height={normalize(28)}
                onPress={onCancel}
                isRounded={false}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
