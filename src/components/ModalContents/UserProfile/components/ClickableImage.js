// Library imports
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';

/**
 * Image with click functionality component
 * @prop {number} size - size of the image
 * @prop {number} source - source of the image
 * @prop {func} onClick - function triggers when clicked on image
 * @returns JSX
 */
const ClickableImage = ({size, source, onClick}) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <Image
        source={source}
        style={{width: size, height: size}}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

export default ClickableImage;
