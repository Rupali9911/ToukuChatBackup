// Library imports
import React from 'react';
import {Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// Local imports
import {Colors} from '../../../../constants';
import {translate} from '../../../../redux/reducers/languageReducer';
import {globalStyles} from '../../../../styles';

/**
 * Menu icon item for dotted menu in chat header
 * @prop {object} item - contains the menu items
 * @prop {boolean} isPined - boolean describing weather chat is pined or not
 * @returns JXS
 */
const MenuIcons = ({item, isPined}) => {
  return item.title === translate('pages.changeDisplayName') ? (
    <Image source={item.icon} style={globalStyles.smallIcon} />
  ) : !item.isLocalIcon ? (
    item.pinUnpinItem ? (
      <MaterialCommunityIcon
        name={isPined ? 'pin-off' : 'pin'}
        size={18}
        color={Colors.black}
      />
    ) : item.icon === 'sticky-note' ||
      item.icon === 'id-card' ||
      item.icon === 'times-circle' ? (
      <FontAwesome name={item.icon} size={16} color={Colors.black} />
    ) : (
      <FontAwesome5 name={item.icon} size={16} color={Colors.black} />
    )
  ) : (
    <Image source={item.icon} style={globalStyles.smallIcon} />
  );
};

export default MenuIcons;
