import React, {Component} from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, Icons} from '../constants';
import HamburgerIcon from './HamburgerIcon';
import RoundedImage from './RoundedImage';
import {globalStyles} from '../styles';
import DrawerItem from './DrawerItem';
import {setI18nConfig, translate} from '../redux/reducers/languageReducer';

class DrawerContent extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      drawerTabs: [
        {
          tab_id: 1,
          tab_name: translate('pages.xchat.home'),
          tab_icon: Icons.icon_home_active,
          selected: true,
          disabled: false,
        },
        {
          tab_id: 2,
          tab_name: translate('pages.xchat.chat'),
          tab_icon: Icons.icon_chat,
          selected: false,
          disabled: false,
        },

        {
          tab_id: 3,
          tab_name: translate('common.timeline'),
          tab_icon: Icons.icon_timeline,
          selected: false,
          disabled: true,
        },

        {
          tab_id: 4,
          tab_name: translate('pages.xchat.channel'),
          tab_icon: Icons.icon_channel,
          selected: false,
          disabled: true,
        },

        {
          tab_id: 5,
          tab_name: translate('pages.xchat.more'),
          tab_icon: Icons.icon_more,
          selected: false,
          disabled: false,
        },
      ],
    };
  }

  changeActiveTab = async (item, index) => {
    let tabs = this.state.drawerTabs;
    tabs.map((item) => {
      item.selected = false;
    });

    tabs[index].selected = true;

    this.props.navigation.closeDrawer();
    // this.props.navigation.navigate(item.tab_name);
    switch (item.tab_name) {
      case translate('pages.xchat.home'):
        this.props.navigation.navigate('Home');
        break;

      case translate('pages.xchat.chat'):
        this.props.navigation.navigate('Chat');
        break;

      case translate('pages.xchat.more'):
        this.props.navigation.navigate('More');
        break;

      default:
        break;
    }
  };

  render() {
    const {drawerTabs} = this.state;
    return (
      <LinearGradient
        start={{x: 0.1, y: 0.7}}
        end={{x: 0.8, y: 0.3}}
        locations={[0.1, 0.5, 0.8]}
        colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
        style={{flex: 1}}>
        <SafeAreaView
          style={{flex: 1}}
          forceInset={{top: 'always', horizontal: 'never'}}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
            <View>
              <HamburgerIcon />
            </View>
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                marginBottom: 30,
              }}>
              <RoundedImage />
              <Text style={[globalStyles.normalLightText, {marginTop: 10}]}>
                {'UserName'}
              </Text>
            </View>

            {drawerTabs.map((item, key) => (
              <DrawerItem
                item={item}
                onPress={() => this.changeActiveTab(item, key)}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
