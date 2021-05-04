import React from 'react';
import {Image, TouchableOpacity} from 'react-native';

import {Icons} from '../../../../constants';
import styles from '../styles';

const BackIcon = ({onBackPress}) => {
  return (
    <TouchableOpacity
      hitSlop={styles.touchArea}
      onPress={onBackPress}
      style={styles.backIconAction}>
      <Image
        source={Icons.icon_close}
        style={styles.backIcon}
        resizeMode={'center'}
      />
    </TouchableOpacity>
  );
};

export default BackIcon;
