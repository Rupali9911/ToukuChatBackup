import {Dimensions} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

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
import FriendNotes from '../screens/FriendNotes';
import CreateFriendGroup from '../screens/CreateFriendGroup';
import ChannelInfo from '../screens/ChannelInfo';
import ChannelInvitation from '../screens/ChannelInvitation';
import GroupDetails from '../screens/GroupDetails';
import ChannelTimeline from '../screens/ChannelTimeline';
import GroupInvitation from '../screens/GroupInvitation';
import Drawer from './DrawerNavigation';
import BottomTabs from "./BottomTabs";
import { gestureResponseDistance } from '../constants';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const ChannelStack = createStackNavigator(
  {
    ChannelChatScreen: ChannelChats,
    ChannelInfo: ChannelInfo,
  },
  {
    initialRouteName: 'ChannelChatScreen',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const AppStack = createStackNavigator(
  {
      Tabs: BottomTabs,
   // Drawer: Drawer,
    GroupChats: GroupChats,
    FriendChats: FriendChats,
    CreateFriendGroup: CreateFriendGroup,
    ChannelChats: ChannelChats,
    ChannelInfo: ChannelInfo,
    ChannelInvitation: ChannelInvitation,
    ChannelTimeline: ChannelTimeline,
    GroupDetails: GroupDetails,
    FriendNotes: FriendNotes,
    GroupInvitation: GroupInvitation,
  },
  {
    //initialRouteName: 'Drawer',
    initialRouteName: 'Tabs',
    defaultNavigationOptions: {
      headerShown: false,
        disableGestures: true,
        gestureResponseDistance: {horizontal: gestureResponseDistance}
    }
  },
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
      headerShown: false,
    },
  },
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
    },
  ),
);
