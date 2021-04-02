// Library imports
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

// Local imports
import {globalStyles} from '../../../../styles';
import {getAvatar} from '../../../../utils';
import RoundedImage from '../../../RoundedImage';

// Stylesheet import
import styles from '../styles';

/**
 * Chat header when chatting with a single user
 * @prop {string} title - user title
 * @prop {string} image - user avatar
 * @prop {func} handleNavigation - function for handling navigation
 * @returns JSX
 */
const FriendHeader = ({title, image, handleNavigation}) => {
  return (
    <View style={styles.headerTypeContainer}>
      <View style={styles.headerTypeSubContainer}>
        <TouchableOpacity activeOpacity={1} onPress={handleNavigation}>
          <RoundedImage size={40} source={getAvatar(image)} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerTitleSubContainer}>
        <Text
          numberOfLines={1}
          onPress={handleNavigation}
          style={[globalStyles.normalRegularText15, styles.headerTitle]}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default FriendHeader;
