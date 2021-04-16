// Library imports
import React from 'react';
import {Platform, View} from 'react-native';

// Local imports
import {getAvatar} from '../../../../utils';
import RoundedImage from '../../../RoundedImage';

// Stylesheet imports
import styles from '../styles';

/**
 * Renders if group or channel has an avatar
 * @prop {string} image - avatar of either group or channel
 * @returns JSX
 */
const GroupOrChannelAvatar = ({image}) => {
  return (
    <View style={styles.deafultAvatarSpacing}>
      <RoundedImage
        source={getAvatar(image)}
        isRounded={false}
        size={Platform.isPad ? 50 : 40}
      />
    </View>
  );
};

export default GroupOrChannelAvatar;
