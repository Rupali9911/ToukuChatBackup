import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Clipboard,
  StatusBar,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {globalStyles} from '../../styles';
import {
  Icons,
  Colors,
  Fonts,
  languageArray,
  registerUrl,
} from '../../constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Menu} from 'react-native-paper';
import {
  setAppLanguage,
  setI18nConfig,
  translate,
  userLanguage,
} from '../../redux/reducers/languageReducer';
import {
  setChannelMode,
  updateChannelMode,
  updateConfiguration,
} from '../../redux/reducers/configurationReducer';
import {connect} from 'react-redux';
import {showToast, normalize} from '../../utils';
import SwitchCustom from '../SwitchCustom';
import Toast from '../Toast';
import {version} from '../../../package';
import {getStatusBarHeight} from 'react-native-status-bar-height';

class SettingsItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLanguageSelected: false,
      selectedLanguage: 'English',
      arrLanguage: languageArray,
      channelMode: this.props.userConfig.channel_mode,
      referralCode: '',
    };
  }
  async componentDidMount() {
    const {selectedLanguageItem} = this.props;
    await Promise.all(
      languageArray.map((item) => {
        if (selectedLanguageItem.language_name === item.language_name) {
          this.setState({selectedLanguage: item.language_display});
        }
      }),
    );

    let tmpReferralCode = this.props.userData.referral_link;
    const arrLink = tmpReferralCode.split('/');
    if (arrLink.length > 0) {
      this.setState({referralCode: arrLink[arrLink.length - 1]});
    }
  }

  onPressLanguage() {
    this.props.scrollToBottom();
    const {arrLanguage, selectedLanguage} = this.state;
    let filteredArray = arrLanguage.filter(
      (item) => item.language_display !== selectedLanguage,
    );
    this.setState({isLanguageSelected: true, arrLanguage: filteredArray});
  }

  onPressSelLanguage(value) {
    const {arrLanguage, selectedLanguage} = this.state;
    let filteredArray = arrLanguage.filter(
      (item) => item.language_display === value,
    );
    this.setState({
      isLanguageSelected: false,
      selectedLanguage: value,
      arrLanguage: languageArray,
    });
    if (filteredArray.length > 0) {
      this.props.setAppLanguage(filteredArray[0]);
      setI18nConfig(filteredArray[0].language_name);
      let data = {
        language: filteredArray[0].language_name,
      };
      this.props.updateConfiguration(data);
    }
  }

  copyCode() {
    let invitationLink = registerUrl + this.state.referralCode;
    Clipboard.setString(invitationLink);
    showToast(
      translate('pages.setting.referralLink'),
      translate('pages.setting.toastr.linkCopiedSuccessfully'),
      'positive',
    );
  }

  showQR() {
    this.props.onPressQR();
  }

  updateChannelM(value) {
    const {updateChannelMode, setChannelMode, userConfig} = this.props;
    this.setState({channelMode: value});
    let updateChannelModeParam = {
      channel_mode: value,
    };
    updateChannelMode(updateChannelModeParam)
      .then((res) => {
        if (value === true) {
          showToast(
            translate('pages.xchat.channelModeText'),
            translate('pages.xchat.toastr.channelModeToastr'),
            'positive',
          );
        }
        setChannelMode(userConfig, value);
      })
      .catch((err) => {
        showToast(
          translate('pages.xchat.channelModeText'),
          translate('common.somethingWentWrong'),
          'primary',
        );
      });
  }

  render() {
    const {
      title,
      icon_name,
      onPress,
      isImage,
      isFontAwesome,
      isLanguage,
      isChannelMode,
      userData,
      isInvitation,
      isToukuPoints,
      isCustomerSupport,
      isVersion,
    } = this.props;
    const {
      isLanguageSelected,
      arrLanguage,
      selectedLanguage,
      channelMode,
      referralCode,
    } = this.state;

    const conditionalRender = () => {
      if (isImage) {
        return (
          <Image
            source={isImage}
            style={{
              width: Platform.isPad ? 25 : 20,
              height: Platform.isPad ? 25 : 20,
            }}
            resizeMode={'cover'}
          />
        );
      } else if (isFontAwesome) {
        return <FontAwesome name={icon_name} size={Platform.isPad ? 25 : 17} />;
      } else {
        return (
          <FontAwesome5 name={icon_name} size={Platform.isPad ? 25 : 17} />
        );
      }
    };

    let renderMenu = () => {
      return arrLanguage.map((item) => {
        return (
          <Menu.Item
            style={styles.txtDrpDwn}
            titleStyle={[styles.txtLanguage, {color: 'white'}]}
            title={item.language_display}
            onPress={() => {
              this.onPressSelLanguage(item.language_display);
            }}
          />
        );
      });
    };
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={onPress}>
        <View style={styles.row}>
          <View style={styles.row}>
            <View style={{width: 30}}>{conditionalRender()}</View>
            <Text
              style={[
                globalStyles.smallNunitoRegularFW300Text,
                {
                  color: Colors.black,
                  fontWeight: '300',
                  marginLeft: Platform.isPad && 25,
                },
              ]}>
              {title}
            </Text>
          </View>

          {isLanguage && (
            <Menu
              style={{
                marginTop:
                  Platform.OS === 'ios' ? 23 : getStatusBarHeight() + 23,
              }}
              contentStyle={{
                backgroundColor: 'transparent',
              }}
              visible={isLanguageSelected}
              onDismiss={() => this.setState({isLanguageSelected: false})}
              anchor={
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.onPressLanguage()}>
                  <View style={styles.vwRight}>
                    <Text style={[styles.txtLanguage, {width: 105}]}>
                      {selectedLanguage}
                    </Text>
                    <Image
                      style={styles.imgLang}
                      source={Icons.icon_drop_down}
                    />
                  </View>
                </TouchableOpacity>
              }>
              {renderMenu()}
            </Menu>
          )}
          {isChannelMode && (
            <SwitchCustom
              value={channelMode}
              onValueChange={(value) => this.updateChannelM(value)}
            />
          )}

          {isInvitation && (
            <View style={styles.vwRightInv}>
              <Text style={[styles.txtInvitation]}>{referralCode}</Text>
              <TouchableOpacity
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => this.copyCode()}>
                <Image
                  style={{
                    marginEnd: 10,
                    height: Platform.isPad ? 20 : 13,
                    width: Platform.isPad ? 20 : 13,
                  }}
                  source={Icons.icon_copy}
                />
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => this.showQR()}>
                <Image
                  style={{
                    height: Platform.isPad ? 20 : 13,
                    width: Platform.isPad ? 20 : 13,
                  }}
                  source={Icons.icon_download}
                />
              </TouchableOpacity>
            </View>
          )}
          {isToukuPoints && (
            <View style={styles.vwRightInv}>
              <Text style={[styles.txtInvitation, {color: Colors.light_gray}]}>
                {userData.total_tp + ' TP'}
              </Text>
            </View>
          )}
          {isCustomerSupport && (
            <View style={styles.vwRightInv}>
              <Text style={[styles.txtInvitation, {color: Colors.light_gray}]}>
                Chat
              </Text>
            </View>
          )}
          {isVersion && (
            <View style={styles.vwRightInv}>
              <Text style={[styles.txtInvitation, {color: Colors.light_gray}]}>
                {version}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vwRight: {
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.dark_orange,
    padding: 7,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
  txtLanguage: {
    fontFamily: Fonts.light,
    color: Colors.dark_orange,
    fontSize: 13,
    fontWeight: '500',
  },
  txtInvitation: {
    fontFamily: Fonts.regular,
    color: Colors.black,
    fontSize: Platform.isPad ? normalize(6.5) : 13,
    fontWeight: '300',
    marginEnd: 10,
  },
  imgLang: {
    height: 8,
    width: 8,
  },
  txtDrpDwn: {
    backgroundColor: Colors.dark_orange,
    height: 30,
  },
  vwRightInv: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

SettingsItem.propTypes = {
  title: PropTypes.string,
  icon_name: PropTypes.string,
  onPress: PropTypes.func,
  isImage: PropTypes.string,
  isFontAwesome: PropTypes.bool,
  isLanguage: PropTypes.bool,
  isChannelMode: PropTypes.bool,
  selectedLanguage: PropTypes.string,
  scrollToBottom: PropTypes.func,
  onPressQR: PropTypes.func,
  isInvitation: PropTypes.bool,
  isToukuPoints: PropTypes.bool,
  isCustomerSupport: PropTypes.bool,
};

SettingsItem.defaultProps = {
  icon: Icons.icon_more,
  title: 'Title',
  icon_name: 'user',
  onPress: null,
  isImage: null,
  isFontAwesome: false,
  isLanguage: false,
  isChannelMode: false,
  selectedLanguage: 'English',
  scrollToBottom: null,
  onPressQR: null,
  isInvitation: false,
  isToukuPoints: false,
  isCustomerSupport: false,
  isVersion: false,
};

const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    userConfig: state.configurationReducer.userConfig,
  };
};

const mapDispatchToProps = {
  setAppLanguage,
  userLanguage,
  updateChannelMode,
  setChannelMode,
  updateConfiguration,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsItem);
