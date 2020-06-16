import React from 'react';
import {Image, View, Text} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from '../screens/Home';
import ChatScreen from '../screens/Chat';
import CreateGroupChatScreen from '../screens/CreateGroupChat';
import CreateChannelScreen from '../screens/CreateChannel';
import {Icons, Colors, Fonts} from '../constants';
import {globalStyles} from '../styles';
import {isIphoneX} from '../utils';
import MoreScreen from '../screens/More';
import {translate} from '../redux/reducers/languageReducer';

const HomeTab = createStackNavigator({
  HomeTab: HomeScreen,
  CreateGroupChat: CreateGroupChatScreen,
  CreateChannel: CreateChannelScreen,
});

HomeTab.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

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
        height: 56,
      },
      activeTintColor: Colors.indigo,
      inactiveTintColor: Colors.white,
      safeAreaInset: {right: 'never', left: 'never', bottom: 'always'},
      // labelStyle: {marginVertical: 5},
      showLabel: false,
    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        if (routeName === 'Home') {
          return (
            <TabItem
              source={focused ? Icons.icon_home_select : Icons.icon_home}
              title={translate('pages.xchat.home')}
              titleColor={focused ? Colors.indigo : Colors.white}
            />
          );
        } else if (routeName === 'Chat') {
          return (
            <TabItem
              source={focused ? Icons.icon_chat_select : Icons.icon_chat}
              title={translate('pages.xchat.chat')}
              titleColor={focused ? Colors.indigo : Colors.white}
            />
          );
        } else if (routeName === 'More') {
          return (
            <TabItem
              source={focused ? Icons.icon_more_select : Icons.icon_more}
              title={translate('pages.xchat.more')}
              titleColor={focused ? Colors.indigo : Colors.white}
            />
          );
        }
      },
    }),
  },
);

const TabItem = (props) => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={props.source}
        style={[globalStyles.iconStyle, {paddingTop: 10}]}
      />
      <Text
        style={[
          globalStyles.smallLightText,
          {color: props.titleColor || Colors.white},
        ]}>
        {props.title}
      </Text>
    </View>
  );
};

export default createAppContainer(Tabs);
