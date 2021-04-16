// Library imports
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';

// Local imports
import {Icons} from '../../../../constants';
import {globalStyles} from '../../../../styles';

// StyleSheet import
import styles from '../styles';

/**
 * More icon component for the chat header menu
 * @prop {func} handleMenuPress - function for handling press action
 * @returns JSX
 */
const MoreIcon = ({handleMenuPress}) => {
  return (
    <TouchableOpacity onPress={handleMenuPress} hitSlop={styles.touchArea}>
      <Image source={Icons.icon_dots} style={globalStyles.smallIcon} />
    </TouchableOpacity>
  );
};

export default MoreIcon;
