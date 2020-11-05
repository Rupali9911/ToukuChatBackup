import React from 'react';
import {Image, View, Text} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from '../screens/Home';
import ChatScreen from '../screens/Chat';
import CreateGroupChatScreen from '../screens/CreateGroupChat';
import CreateChannelScreen from '../screens/CreateChannel';
import TimelineScreen from '../screens/Timeline';
import ChannelScreen from '../screens/Channel';
import {Icons, Colors, Fonts} from '../constants';
import {globalStyles} from '../styles';
import {isIphoneX} from '../utils';
import MoreScreen from '../screens/More';
import {translate} from '../redux/reducers/languageReducer';
import AddFriend from '../screens/AddFriend';
import TabBarComp from '../components/TabBarComp';
import {BottomTabItem} from '../components/ListItems';

const HomeTab = createStackNavigator({
  HomeTab: HomeScreen,
  CreateGroupChat: CreateGroupChatScreen,
  CreateChannel: CreateChannelScreen,
  AddFriendScreen: AddFriend,
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
  CreateGroupChat: CreateGroupChatScreen,
  CreateChannel: CreateChannelScreen,
});

ChatTab.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const MoreTab = createStackNavigator({
  MoreTab: MoreScreen,
  AddFriend: AddFriend,
  CreateGroupChat: CreateGroupChatScreen,
  CreateChannel: CreateChannelScreen,
});

MoreTab.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const TimelineTab = createStackNavigator({
  TimelineTab: TimelineScreen,
});

TimelineTab.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const ChannelTab = createStackNavigator({
  ChannelTab: ChannelScreen,
});

ChannelTab.navigationOptions = ({navigation}) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const Tabs = createBottomTabNavigator(
  {
    Home: HomeTab,
    Chat: ChatTab,
    Timeline: TimelineTab,
    Channel: ChannelTab,
    More: MoreTab,
  },
  {
    initialRouteName: 'Chat',
    tabBarComponent: TabBarComp,
    tabBarOptions: {
      tabStyle: {
        backgroundColor: Colors.home_header,
      },
      style: {position: 'absolute'},
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
            <BottomTabItem
              source={Icons.icon_home}
              title={translate('pages.xchat.home')}
              titleColor={focused ? Colors.yellow : Colors.white}
              routeName={'Home'}
              focused={focused}
            />
          );
        } else if (routeName === 'Chat') {
          return (
            <BottomTabItem
              source={Icons.icon_chat}
              title={translate('pages.xchat.chat')}
              titleColor={focused ? Colors.yellow : Colors.white}
              routeName={'Chat'}
              focused={focused}
            />
          );
        } else if (routeName === 'More') {
          return (
            <BottomTabItem
              source={Icons.icon_more}
              title={translate('pages.xchat.more')}
              titleColor={focused ? Colors.yellow : Colors.white}
              routeName={'More'}
              focused={focused}
            />
          );
        } else if (routeName === 'Timeline') {
          return (
            <BottomTabItem
              source={Icons.icon_timeline}
              title={translate('pages.xchat.timeline')}
              titleColor={focused ? Colors.yellow : Colors.white}
              routeName={'Timeline'}
              focused={focused}
            />
          );
        } else if (routeName === 'Channel') {
          return (
            <BottomTabItem
              source={Icons.icon_channel_new}
              title={translate('pages.xchat.channel')}
              titleColor={focused ? Colors.yellow : Colors.white}
              routeName={'Channel'}
              focused={focused}
            />
          );
        }
      },
    }),
  },
);

// const TabItem = (props) => {
//   return (
//     <View>
//       <View style={{alignItems: 'center', justifyContent: 'center'}}>
//         <Image source={props.source} style={globalStyles.iconStyleTab} />
//         <Text
//           style={[
//             globalStyles.smallLightTextTab,
//             {color: props.titleColor || Colors.white, paddingTop: 2},
//           ]}>
//           {props.title}
//         </Text>
//         <Badge
//           visible={props.badgeCount > 0 ? true : false}
//           style={[
//             globalStyles.smallLightText,
//             {
//               backgroundColor: Colors.green,
//               color: Colors.white,
//               fontSize: 11,
//               position: 'absolute',
//               top: -5,
//               right: -6,
//             },
//           ]}>
//           {props.badgeCount}
//         </Badge>
//       </View>
//     </View>
//   );
// };

export default createAppContainer(Tabs);
