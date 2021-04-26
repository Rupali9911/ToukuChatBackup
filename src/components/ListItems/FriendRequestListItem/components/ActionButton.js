import React from 'react';
import {View, Platform} from 'react-native';
import styles from '../styles';
import Button from '../../../Button';

const ActionButton = ({title, onPress, type, loadingStatus}) => {
  return (
    <View style={styles.buttonContainer}>
      <Button
        title={title}
        onPress={onPress}
        isRounded={false}
        type={type}
        height={Platform.isPad ? 40 : 30}
        loading={loadingStatus}
      />
    </View>
  );
};

export default ActionButton;
