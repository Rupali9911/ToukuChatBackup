// Library imports
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Clipboard,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Menu} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';

// Local imports
import {version} from '../../../package';
import {
  Colors,
  Icons,
  languageArray,
  registerUrl,
  registerUrlStage,
} from '../../constants';
import {staging} from '../../helpers/api';
import {
  setChannelMode,
  updateChannelMode,
  updateConfiguration,
} from '../../redux/reducers/configurationReducer';
import {
  setAppLanguage,
  setI18nConfig,
  translate,
} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';
import {showToast} from '../../utils';

// Component imports
import SwitchCustom from '../SwitchCustom';

// StyleSheet imports
import styles from './styles';

/**
 * Settings item component
 */
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

  // Set selected language and referral code
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

  // Display the list of langauges
  onPressLanguage() {
    this.props.scrollToBottom();
    const {arrLanguage, selectedLanguage} = this.state;
    let filteredArray = arrLanguage.filter(
      (item) => item.language_display !== selectedLanguage,
    );
    this.setState({isLanguageSelected: true, arrLanguage: filteredArray});
  }

  // When a language is selected fgr
  onPressSelLanguage(value) {
    const {arrLanguage} = this.state;
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

  // Copy code to clipboard
  copyCode() {
    let invitationLink =
      (staging ? registerUrlStage : registerUrl) + this.state.referralCode;
    Clipboard.setString(invitationLink);
    showToast(
      translate('pages.setting.referralLink'),
      translate('pages.setting.toastr.linkCopiedSuccessfully'),
      'positive',
    );
  }

  // Displays QR Code
  showQR() {
    this.props.onPressQR();
  }

  // Updates channels IM
  updateChannelM(value) {
    this.setState({channelMode: value});
    let updateChannelModeParam = {
      channel_mode: value,
    };
    this.props
      .updateChannelMode(updateChannelModeParam)
      .then(() => {
        if (value === true) {
          showToast(
            translate('pages.xchat.channelModeText'),
            translate('pages.xchat.toastr.channelModeToastr'),
            'positive',
          );
        }
        this.props.setChannelMode(this.props.userConfig, value);
      })
      .catch(() => {
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
      isFAQ,
      isVersion,
    } = this.props;

    const {
      isLanguageSelected,
      arrLanguage,
      selectedLanguage,
      channelMode,
      referralCode,
    } = this.state;

    // Conditional render the image component
    const conditionalRender = () => {
      if (isImage) {
        return (
          <Image
            source={isImage}
            style={styles.conditionalImage}
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

    // Renders the menu
    const renderMenu = () => {
      return arrLanguage.map((item) => {
        return (
          <Menu.Item
            key={`${item.language_name}_${item.language_id}`}
            style={styles.txtDrpDwn}
            titleStyle={[styles.txtLanguage, styles.menuTitle]}
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
            <View style={styles.conditionalContainer}>
              {conditionalRender()}
            </View>
            <Text
              style={[globalStyles.smallNunitoRegularFW300Text, styles.title]}>
              {title}
            </Text>
          </View>

          {isLanguage && (
            <Menu
              style={styles.menuStyle}
              contentStyle={styles.menuContentStyle}
              visible={isLanguageSelected}
              onDismiss={() => this.setState({isLanguageSelected: false})}
              anchor={
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.onPressLanguage()}>
                  <View style={styles.vwRight}>
                    <Text style={[styles.txtLanguage, styles.selectedLanguage]}>
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
                <Image style={styles.copyIcon} source={Icons.icon_copy} />
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                onPress={() => this.showQR()}>
                <Image
                  style={styles.downloadIcon}
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
          {isFAQ && (
            <View style={styles.vwRightInv}>
              <Text style={[styles.txtInvitation, {color: Colors.light_gray}]}>
                {translate('common.open')}
              </Text>
            </View>
          )}
          {isCustomerSupport && (
            <View style={styles.vwRightInv}>
              <Text style={[styles.txtInvitation, {color: Colors.light_gray}]}>
                {translate('pages.xchat.chat')}
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

/**
 * Settings item component prop types
 */
SettingsItem.propTypes = {
  title: PropTypes.string,
  icon_name: PropTypes.string,
  onPress: PropTypes.func,
  isImage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isFontAwesome: PropTypes.bool,
  isLanguage: PropTypes.bool,
  isChannelMode: PropTypes.bool,
  selectedLanguage: PropTypes.string,
  scrollToBottom: PropTypes.func,
  onPressQR: PropTypes.func,
  isInvitation: PropTypes.bool,
  isToukuPoints: PropTypes.bool,
  isCustomerSupport: PropTypes.bool,
  isFAQ: PropTypes.bool,
};

/**
 * Settings item component default props
 */
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
  isFAQ: false,
  isVersion: false,
};

/**
 * @Redux - Map following state to props
 * @param {object} state - current state in stored in redux
 * @returns object
 */
const mapStateToProps = (state) => {
  return {
    selectedLanguageItem: state.languageReducer.selectedLanguageItem,
    userData: state.userReducer.userData,
    userConfig: state.configurationReducer.userConfig,
  };
};

// Actions to be dispatched from redux
const mapDispatchToProps = {
  setAppLanguage,
  updateChannelMode,
  setChannelMode,
  updateConfiguration,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsItem);
