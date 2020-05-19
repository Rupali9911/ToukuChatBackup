import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Authentication from '../screens/Authentication';
import LoginSignUp from '../screens/LoginSignUp';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';
import ForgotUsername from '../screens/ForgotUsername';
import NeedSupport from '../screens/NeedSupport';
import Drawer from './DrawerNavigation';

const AppStack = createStackNavigator(
  {
    Drawer: Drawer,
  },
  {
    initialRouteName: 'Drawer',
    defaultNavigationOptions: {
      header: null,
    },
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
      header: null,
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
