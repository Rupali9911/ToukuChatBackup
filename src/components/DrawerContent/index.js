import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import React, {Component} from 'react';
import {Image, SafeAreaView, ScrollView, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {Colors, Icons} from '../../constants';
import {logout} from '../../redux/reducers/index';
import {setI18nConfig, translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import {getAvatar} from '../../utils';
import DrawerItem from '../DrawerItem';
import HamburgerIcon from '../HamburgerIcon';
import {ProfileModal} from '../Modals';
import RoundedImage from '../RoundedImage';
import styles from './styles';

class DrawerContent extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(this.props.selectedLanguageItem.language_name);
    this.state = {
      isAdminCollapsed: false,
      isGeneralCollapsed: true,
      list: [
        {
          title: 'Messages',
          icon: Icons.icon_message,
          data: [{name: 'Message List'}, {name: 'Compose Message'}],
        },
        {
          title: 'Scenario',
          icon: Icons.icon_scenario,
          data: [{name: 'Scenario List'}, {name: 'Compose Scenario'}],
        },
      ],
      drawerTabs: [
        {
          tab_id: 1,
          tab_name: 'pages.xchat.home',
          tab_icon_inactive: Icons.icon_home,
          tab_icon_active: Icons.icon_home_select,
          selected: true,
          disabled: false,
        },
        {
          tab_id: 2,
          tab_name: 'pages.xchat.chat',
          tab_icon_inactive: Icons.icon_chat,
          tab_icon_active: Icons.icon_chat_select,
          selected: false,
          disabled: false,
        },

        {
          tab_id: 3,
          tab_name: 'common.timeline',
          tab_icon_inactive: Icons.icon_timeline,
          tab_icon_active: Icons.icon_timeline_select,
          selected: false,
          disabled: false,
        },

        {
          tab_id: 4,
          tab_name: 'pages.xchat.channel',
          tab_icon_inactive: Icons.icon_channel,
          tab_icon_active: Icons.icon_channel_select,
          selected: false,
          disabled: false,
        },

        {
          tab_id: 5,
          tab_name: 'pages.xchat.more',
          tab_icon_inactive: Icons.icon_more,
          tab_icon_active: Icons.icon_more_select,
          selected: false,
          disabled: false,
        },
      ],
    };
  }

  _head(item) {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <Image
            source={item.icon}
            style={[globalStyles.iconStyle, styles.headerIcon]}
          />
          <Text style={globalStyles.smallLightText}>{item.title}</Text>
        </View>
        <Image source={Icons.icon_arrow_right} style={styles.headerRightIcon} />
      </View>
    );
  }

  _body(item) {
    return (
      <View style={styles.bodyContainer}>
        {item.data.map(({name}) => (
          <View>
            <Text style={[globalStyles.smallLightText, styles.bodyText]}>
              s{name}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  changeActiveTab = async (item, index) => {
    let tabs = this.state.drawerTabs;
    tabs.map(({selected}) => {
      selected = false;
    });

    tabs[index].selected = true;

    this.props.navigation.closeDrawer();
    // this.props.navigation.navigate(item.tab_name);
    switch (item.tab_name) {
      case 'pages.xchat.home':
        this.props.navigation.navigate('Home');
        break;

      case 'pages.xchat.chat':
        this.props.navigation.navigate('Chat');
        break;

      case 'common.timeline':
        this.props.navigation.navigate('Timeline');
        break;

      case 'pages.xchat.channel':
        this.props.navigation.navigate('Channel');
        break;

      case 'pages.xchat.more':
        this.props.navigation.navigate('More');
        break;

      default:
        break;
    }
  };

  onViewProfile() {
    ProfileModal.show();
  }

  render() {
    const {drawerTabs, isAdminCollapsed, isGeneralCollapsed} = this.state;
    const {userData, userConfig} = this.props;
    return (
      <LinearGradient
        start={{x: 0.1, y: 0.7}}
        end={{x: 0.8, y: 0.3}}
        locations={[0.1, 0.5, 0.8]}
        colors={[Colors.gradient_1, Colors.gradient_2, Colors.gradient_3]}
        style={styles.singleFlex}>
        <SafeAreaView
          style={styles.singleFlex}
          forceInset={{top: 'always', horizontal: 'never'}}>
          <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
            <View>
              <HamburgerIcon />
            </View>
            <View style={styles.usernameContainer}>
              <RoundedImage
                source={getAvatar(userData.avatar)}
                clickable={true}
                onClick={() => this.onViewProfile()}
              />
              <Text style={[globalStyles.normalLightText, styles.username]}>
                {userConfig.display_name}
              </Text>
            </View>
            {/*
            <Collapse
              onToggle={(isColl) =>
                this.setState({
                  isAdminCollapsed: isColl,
                  isGeneralCollapsed: !isGeneralCollapsed,
                })
              }
              isCollapsed={isAdminCollapsed}>
              <CollapseHeader>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderColor: Colors.white,
                  }}>
                  <Text style={globalStyles.smallLightText}>{'Admin'}</Text>
                  <Image
                    source={
                      isAdminCollapsed
                        ? Icons.icon_triangle_down
                        : Icons.icon_triangle_up
                    }
                    style={{width: 10, height: 10}}
                  />
                </View>
              </CollapseHeader>
              <CollapseBody>
                <AccordionList
                  list={this.state.list}
                  header={this._head}
                  body={this._body}
                />
              </CollapseBody>
            </Collapse> */}

            <Collapse
              onToggle={(isColl) =>
                this.setState({
                  isGeneralCollapsed: isColl,
                  isAdminCollapsed: !isAdminCollapsed,
                })
              }
              isCollapsed={isGeneralCollapsed}>
              <CollapseHeader>
                <View style={styles.collapseHeaderContainer}>
                  <Text style={globalStyles.smallLightText}>
                    {translate('pages.xchat.general')}
                  </Text>
                  <Image
                    source={
                      isGeneralCollapsed
                        ? Icons.icon_triangle_down
                        : Icons.icon_triangle_up
                    }
                    style={styles.collapseHeaderIcon}
                  />
                </View>
              </CollapseHeader>
              <CollapseBody>
                {drawerTabs.map((item, key) => (
                  <DrawerItem
                    key={key}
                    title={translate(item.tab_name)}
                    icon={
                      item.selected
                        ? item.tab_icon_active
                        : item.tab_icon_inactive
                    }
                    item={item}
                    onPress={() => this.changeActiveTab(item, key)}
                  />
                ))}
              </CollapseBody>
            </Collapse>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    userConfig: state.configurationReducer.userConfig,
  };
};

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
