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
        backgroundColor: Colors.home_header,
        // paddingTop: 10,
        // paddingBottom: 10,
        // height: 56,
      },
      activeTintColor: Colors.indigo,
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
              source={focused ? Icons.icon_home_select : Icons.icon_home}
              style={globalStyles.iconStyle}
            />
          );
        } else if (routeName === 'Chat') {
          return (
            <Image
              source={focused ? Icons.icon_chat_select : Icons.icon_chat}
              style={globalStyles.iconStyle}
            />
          );
        } else if (routeName === 'More') {
          return (
            <Image
              source={focused ? Icons.icon_more_select : Icons.icon_more}
              style={globalStyles.iconStyle}
            />
          );
        }
      },
    }),
  },
);

export default createAppContainer(Tabs);
