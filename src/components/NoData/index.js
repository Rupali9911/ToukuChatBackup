// Library imports
import React from 'react';
import {Image, Text, View} from 'react-native';

// Local imports
import {globalStyles} from '../../styles';

// StyleSheet imports
import styles from './styles';

/**
 * No data functional component
 * When there is no data, this component is displayed
 * @prop {string} title - title to display for no data
 * @prop {boolean} imageAvailable - where an image is available or not
 * @prop {number} source - source of the image if available
 * @prop {string} imageColor - color (tint) of the image
 * @prop {object} style - style for the container
 * @prop {object} textStyle - style for title
 * @returns JSX
 */
const NoData = ({
  title,
  imageAvailable,
  source,
  imageColor,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {imageAvailable && (
        <Image
          source={source}
          style={[{tintColor: imageColor}, styles.image]}
        />
      )}
      <Text style={[globalStyles.smallRegularText, styles.text, textStyle]}>
        {title}
      </Text>
    </View>
  );
};

export default NoData;
