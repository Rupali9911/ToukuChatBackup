import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

import Home from '../screens/Home';
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import BottomTabs from './BottomTabs';
import {Colors, Icons} from '../constants';
import {globalStyles} from '../styles';
import AsyncStorage from '@react-native-community/async-storage';

const DrawerNavigation = createDrawerNavigator(
  {
    Tabs: BottomTabs,
  },
  {
    initialRouteName: 'Tabs',
    // defaultNavigationOptions: {
    //   header: null,
    // },
    contentComponent: (props) => {
      return (
        <LinearGradient
          start={{x: 0.1, y: 0.7}}
          end={{x: 0.8, y: 0.3}}
          locations={[0.1, 0.6, 1]}
          colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={{padding: 20}}>
            <SafeAreaView
              style={{flex: 1}}
              forceInset={{top: 'always', horizontal: 'never'}}>
              <DrawerItem
                icon={Icons.icon_home_active}
                title={'Home'}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate('HomeScreen');
                }}
              />
              <DrawerItem
                icon={Icons.icon_chat}
                title={'Chat'}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate('ChatScreen');
                }}
              />
              <DrawerItem
                icon={Icons.icon_more}
                title={'More'}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate('ChatScreen');
                }}
              />
              <DrawerItem
                icon={Icons.icon_back}
                title={'Logout'}
                onPress={() => {
                  AsyncStorage.clear();
                  props.navigation.navigate('Auth');
                }}
              />
            </SafeAreaView>
          </ScrollView>
        </LinearGradient>
      );
    },
  },
);

const DrawerItem = (props) => {
  const {icon, title, onPress} = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
      <Image source={icon} style={globalStyles.iconStyle} />
      <Text style={[globalStyles.smallLightText, {marginStart: 10}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default createAppContainer(DrawerNavigation);
