// Library imports
import React from 'react';
import {Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Local import
import {Colors} from '../../../../constants';
import {globalStyles} from '../../../../styles';

// Stylesheet import
import styles from '../styles';

/**
 * When image is not available for groups or channel,
 * this component will be used.
 * @prop {string} title - initials of passed title
 * @returns JSX
 */
const DefaultAvatar = ({title}) => {
  const name =
    title.indexOf(' ') === -1
      ? title.charAt(0).toUpperCase()
      : title.charAt(0).toUpperCase() +
        title.charAt(title.indexOf(' ') + 1).toUpperCase();

  return (
    <LinearGradient
      start={{x: 0.1, y: 0.7}}
      end={{x: 0.5, y: 0.2}}
      locations={[0.1, 0.6, 1]}
      colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
      style={styles.squareImage}>
      <Text numberOfLines={1} style={globalStyles.normalRegularText15}>
        {name}
      </Text>
    </LinearGradient>
  );
};

export default DefaultAvatar;
