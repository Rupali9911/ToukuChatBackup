// Library imports
import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import Modal from 'react-native-modal';

// Local imports
import {Colors, Fonts, Icons} from '../../../constants';
import {translate} from '../../../redux/reducers/languageReducer';
import {normalize} from '../../../utils';

// Component imports
import Button from '../../Button';

// StyleSheet import
import styles from './styles';

/**
 * Email confirmation modal component
 */
export default class EmailConfirmationModal extends Component {
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
                style={{
                  height: normalize(60),
                  width: normalize(60),
                  tintColor: Colors.orange_light,
                }}
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
                    title={translate('common.cancel')}
                    type={'secondary'}
                    onPress={onCancel}
                    isRounded={false}
                  />
                </View>
                <View style={styles.buttonSubContainer}>
                  <Button
                    title={translate('pages.xchat.toastr.setEmail')}
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
