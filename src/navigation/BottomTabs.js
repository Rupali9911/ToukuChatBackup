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

const HomeTab = createStackNavigator({
  HomeScreen: HomeScreen,
});

const ChatTab = createStackNavigator({
  ChatScreen: ChatScreen,
});

const MoreTab = createStackNavigator({
  ChatScreen: ChatScreen,
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
        paddingTop: 10,
        paddingBottom: 10,
        height: 56,
      },
      activeTintColor: Colors.primary,
      inactiveTintColor: Colors.white,
      safeAreaInset: {right: 'never', left: 'never', bottom: 'always'},
    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        if (routeName === 'Home') {
          return (
            <Image
              source={focused ? Icons.icon_home_active : Icons.icon_home_active}
              style={globalStyles.iconStyle}
            />
          );
        } else if (routeName === 'Chat') {
          return (
            <Image
              source={focused ? Icons.icon_chat : Icons.icon_chat}
              style={globalStyles.iconStyle}
            />
          );
        } else if (routeName === 'More') {
          return (
            <Image
              source={focused ? Icons.icon_more : Icons.icon_more}
              style={globalStyles.iconStyle}
            />
          );
        }
      },
    }),
  },
);

export default createAppContainer(Tabs);
