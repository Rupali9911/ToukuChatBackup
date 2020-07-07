import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import { Colors, Fonts } from '../constants';
import { translate } from '../redux/reducers/languageReducer';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
const { width, height } = Dimensions.get('window');
import { isIphoneX } from '../utils';

const S = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: isIphoneX() ? 80 : 56,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: !isIphoneX ? 'center' : null,
    alignItems: 'center',
    marginTop:  8,
  },
});

const TabBarComp = (props) => {
    const dimen = Dimensions.get('window');
console.log('dimen.height', isIphoneX())
  const {
    renderIcon,
    getLabelText,
    activeTintColor,
    inactiveTintColor,
    onTabPress,
    onTabLongPress,
    getAccessibilityLabel,
    navigation,
  } = props;

  const { routes, index: activeRouteIndex } = navigation.state;

  return (
    <LinearGradient
      //   start={{ x: 0.1, y: 0.7 }}
      //   end={{ x: 0.5, y: 0.2 }}
      locations={[0, 1]}
      colors={[Colors.foorter_gradient_1, Colors.foorter_gradient_2]}
      useAngle={true}
      angle={192.48}
      angleCenter={{ x: 0.8, y: 0 }}
      style={[S.container]}
    >
      {routes.map((route, routeIndex) => {
        const isRouteActive = routeIndex === activeRouteIndex;
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;

        return (
          <TouchableOpacity
            key={routeIndex}
            style={[S.tabButton]}
            onPress={() => {
              onTabPress({ route });
            }}
            onLongPress={() => {
              onTabLongPress({ route });
            }}
            accessibilityLabel={getAccessibilityLabel({ route })}
          >
            {renderIcon({ route, focused: isRouteActive, tintColor })}
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
};

export default TabBarComp;
