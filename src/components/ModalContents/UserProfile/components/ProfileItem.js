// Library imports
import React from 'react';
import {Text, View} from 'react-native';

// Local imports
import {Fonts, Icons} from '../../../../constants';
import {globalStyles} from '../../../../styles';
import RoundedImage from '../../../RoundedImage';

// StyleSheet import
import styles from '../styles';

/**
 * Profile item component
 * @prop {string} title - label of the item
 * @prop {string} value - value of the item
 * @prop {boolean} editable - whether the field is editable or not
 * @prop {func} onEditIconPress - function when edit icon is clicked
 * @returns JSX
 */
const ProfileItem = ({title, value, editable, onEditIconPress, isPassword}) => {
  return (
    <View style={styles.inputTextContainer}>
      <View style={styles.singleFlex}>
        <Text
          style={[
            globalStyles.smallRegularText,
            styles.textNormal,
            {fontFamily: Fonts.light},
          ]}>
          {title}
        </Text>
        <Text
          style={[
            globalStyles.smallRegularText,
            styles.textNormal,
            styles.itemLabel,
              isPassword ? {top: 8} : {top: 5},
          ]}>
          {value}
        </Text>
      </View>
      {editable ? (
        <RoundedImage
          source={Icons.icon_pencil}
          size={18}
          clickable={true}
          isRounded={false}
          onClick={onEditIconPress}
        />
      ) : null}
    </View>
  );
};

export default ProfileItem;
