import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';
import BottomTabs from './BottomTabs';
import DrawerContent from '../components/DrawerContent';

const DrawerNavigation = createDrawerNavigator(
  {
    Tabs: BottomTabs,
  },
  {
    initialRouteName: 'Tabs',
    contentComponent: DrawerContent,
    // contentComponent: (props) => {
    //   return <DrawerContent {...props} />;
    // },
  },
);

export default createAppContainer(DrawerNavigation);
