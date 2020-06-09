import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Authentication from '../screens/Authentication';
import LoginSignUp from '../screens/LoginSignUp';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';
import ForgotUsername from '../screens/ForgotUsername';
import NeedSupport from '../screens/NeedSupport';
import ChannelChats from '../screens/ChannelChats';
import GroupChats from '../screens/GroupChats';
import FriendChats from '../screens/FriendChats';
import CreateFriendGroup from '../screens/CreateFriendGroup';
import ChannelInfo from '../screens/ChannelInfo';
import GroupDetails from '../screens/GroupDetails';
import Timeline from '../screens/Timeline';
import Drawer from './DrawerNavigation';

const ChannelStack = createStackNavigator(
  {
    ChannelChatScreen: ChannelChats,
    ChannelInfo: ChannelInfo,
  },
  {
    initialRouteName: 'ChannelChatScreen',
    defaultNavigationOptions: {
      header: null,
    },
  }
);
const AppStack = createStackNavigator(
  {
    Drawer: Drawer,
    GroupChats: GroupChats,
    FriendChats: FriendChats,
    CreateFriendGroup: CreateFriendGroup,
    ChannelChats: ChannelChats,
    ChannelInfo: ChannelInfo,
    Timeline: Timeline,
    GroupDetails: GroupDetails,
  },
  {
    initialRouteName: 'Drawer',
    defaultNavigationOptions: {
      header: null,
    },
  }
);

const AuthStack = createStackNavigator(
  {
    LoginSignUp: LoginSignUp,
    Login: Login,
    SignUp: SignUp,
    ForgotPassword: ForgotPassword,
    ForgotUsername: ForgotUsername,
    NeedSupport: NeedSupport,
  },
  {
    initialRouteName: 'LoginSignUp',
    defaultNavigationOptions: {
      header: null,
    },
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      Authentication: Authentication,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Authentication',
    }
  )
);
