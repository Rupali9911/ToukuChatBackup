// Library imports
import React, {Component} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

// Local imports
import {Colors, Icons} from '../../../constants';
import Button from '../../Button';

// StyleSheet import
import styles from './styles';

/**
 * Affilicate modal component
 */
export default class AffilicateModal extends Component {
  render() {
    const {
      visible,
      onCancel,
      onConfirm,
      title,
      orientation,
      url,
      buttonText,
    } = this.props;

    const containerStyle = [
      styles.container,
      {
        height: orientation === 'PORTRAIT' ? '25%' : '80%',
      },
    ];

    const colors = [Colors.gradient_3, Colors.gradient_2, Colors.gradient_1];

    return (
      <Modal isVisible={visible}>
        <View style={containerStyle}>
          <LinearGradient
            start={{x: 0.1, y: 0.7}}
            end={{x: 0.5, y: 0.8}}
            locations={[0.1, 0.6, 1]}
            colors={colors}
            style={styles.gradientStyle}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={onCancel}>
                <Image source={Icons.icon_close} style={styles.image} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <View style={styles.urlContainer}>
            <Text numberOfLines={1} style={styles.url}>
              {url}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              height={'75%'}
              title={buttonText}
              type={'primary'}
              onPress={() => onConfirm(url)}
              isRounded={false}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
