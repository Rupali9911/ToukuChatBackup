import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from '../screens/Home';
import ChatScreen from '../screens/Chat';
import {Image} from 'react-native';
import {Icons, Colors, Fonts} from '../constants';
import {globalStyles} from '../styles';
import {isIphoneX} from '../utils';
import MoreScreen from '../screens/More';

const HomeTab = createStackNavigator({
  HomeTab: HomeScreen,
});

const ChatTab = createStackNavigator({
  ChatTab: ChatScreen,
});

const MoreTab = createStackNavigator({
  MoreTab: MoreScreen,
});

const Tabs = createBottomTabNavigator(
  {
    Home: HomeTab,
    Chat: ChatTab,
    More: MoreTab,
  },
  {
    tabBarOptions: {
      tabStyle: {
        backgroundColor: Colors.gradient_2,
        // paddingTop: 10,
        // paddingBottom: 10,
        // height: 56,
      },
      activeTintColor: Colors.primary,
      inactiveTintColor: Colors.white,
      safeAreaInset: {right: 'never', left: 'never', bottom: 'never'},
      // labelStyle: {marginVertical: 5},
    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        if (routeName === 'Home') {
          return (
            <Image
              source={Icons.icon_home_active}
              style={[
                globalStyles.iconStyle,
                {tintColor: focused ? Colors.primary : Colors.white},
              ]}
            />
          );
        } else if (routeName === 'Chat') {
          return (
            <Image
              source={Icons.icon_chat}
              style={[
                globalStyles.iconStyle,
                {tintColor: focused ? Colors.primary : Colors.white},
              ]}
            />
          );
        } else if (routeName === 'More') {
          return (
            <Image
              source={Icons.icon_more}
              style={[
                globalStyles.iconStyle,
                {tintColor: focused ? Colors.primary : Colors.white},
              ]}
            />
          );
        }
      },
    }),
  },
);

export default createAppContainer(Tabs);
