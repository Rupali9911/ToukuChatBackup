// Library imports
import React from 'react';
import {TouchableOpacity} from 'react-native';

// Component imports
import DefaultAvatar from './DefaultAvatar';
import GroupOrChannelAvatar from './GroupOrChannelAvatar';
import GroupOrChannelText from './GroupOrChannelText';

// Stylsheet import
import styles from '../styles';

/**
 * Chat header for channels and groups
 * @prop {string} image -  channel/group image
 * @prop {string} title -  channel/group title
 * @prop {boolean} followers - show/hide followers
 * @prop {string} description - channel/group description
 * @prop {func} handleChannelOrGroupNav - function for handling channel/group navigation
 * @returns JSX
 */
const ChannelHeader = ({
  image,
  title,
  followers,
  description,
  handleChannelOrGroupNav,
}) => {
  return (
    <TouchableOpacity
      style={styles.headerTypeContainer}
      activeOpacity={1}
      onPress={handleChannelOrGroupNav}>
      {!image ? (
        <DefaultAvatar title={title} />
      ) : (
        <GroupOrChannelAvatar image={image} />
      )}
      <GroupOrChannelText
        title={title}
        showFollowers={followers}
        handleChannelOrGroupNav={handleChannelOrGroupNav}
        description={description}
      />
    </TouchableOpacity>
  );
};

export default ChannelHeader;
