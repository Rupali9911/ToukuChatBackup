// Library imports
import React from 'react';
import {
  Platform,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

// StyleSheet import
import styles from './styles';

// Define touchable component for Android devices
const Touchable =
  Platform.OS === 'android' && Platform.Version >= 21
    ? TouchableNativeFeedback
    : TouchableHighlight;

/**
 * Menu item component
 * @prop {JSX} children - children within the menu item
 * @prop {boolean} disabled - wheather the menu item is disabled or not
 * @prop {ColorValue} disabledTextColor - color when menu item is disabled
 * @prop {string} ellipsizeMode - how the end of a line should be ellipsized
 * @prop {func} onPress - function when a menu item is pressed
 * @prop {object | array} style - style of the menu item
 * @prop {object | array} textStyle - text style of the menu item text
 * @prop {JSX} customComponent - adding custom component to the menu item
 * @returns JSX
 */
const MenuItem = ({
  children,
  disabled,
  disabledTextColor,
  ellipsizeMode,
  onPress,
  style,
  textStyle,
  customComponent,
  ...props
}) => {
  const touchableProps =
    Platform.OS === 'android' && Platform.Version >= 21
      ? {background: TouchableNativeFeedback.SelectableBackground()}
      : {};

  return (
    <Touchable
      disabled={disabled}
      onPress={onPress}
      {...touchableProps}
      {...props}>
      {customComponent ? (
        customComponent
      ) : (
        <View style={[styles.container, style]}>
          <Text
            ellipsizeMode={ellipsizeMode}
            numberOfLines={1}
            style={[
              styles.title,
              disabled && {color: disabledTextColor},
              textStyle,
            ]}>
            {children}
          </Text>
        </View>
      )}
    </Touchable>
  );
};

/**
 * Menu item default props
 */
MenuItem.defaultProps = {
  disabled: false,
  disabledTextColor: '#bdbdbd',
  ellipsizeMode: Platform.OS === 'ios' ? 'clip' : 'tail',
  underlayColor: '#e0e0e0',
};

export default MenuItem;
