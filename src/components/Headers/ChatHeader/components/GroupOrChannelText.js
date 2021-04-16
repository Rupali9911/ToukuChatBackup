// Library imports
import React from 'react';
import {Text, View} from 'react-native';

// Local imports
import {globalStyles} from '../../../../styles';
import styles from '../styles';

/**
 * Text component of chat header of channels and groups
 * @prop {string} title - channel/group title
 * @prop {func} handleChannelOrGroupNav - function for handling navigation for channels/groups
 * @prop {boolean} showFollowers - weather to show followers or not
 * @prop {string} description - channel/group description
 * @returns JSX
 */
const GroupOrChannelText = ({
  title,
  handleChannelOrGroupNav,
  showFollowers,
  description,
}) => {
  return (
    <View style={styles.groupOrChannelText}>
      <Text
        numberOfLines={1}
        style={[globalStyles.normalRegularText15, styles.groupOrChannelTitle]}
        onPress={handleChannelOrGroupNav}>
        {title}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          globalStyles.smallRegularText,
          styles.groupOrChannelDescription,
        ]}>
        {showFollowers ? '' : description}
      </Text>
    </View>
  );
};

export default GroupOrChannelText;
